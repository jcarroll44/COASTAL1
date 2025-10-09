// app/components/MapPanel30A.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";

type RawAccess = {
  name?: string;
  lat?: number | string;
  lng?: number | string;
  type?: string;
};
type Access = { name: string; lat: number; lng: number; type?: string };

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const SATELLITE_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

function coerceAccessList(raw: RawAccess[] | undefined): Access[] {
  if (!Array.isArray(raw)) return [];
  const cleaned: Access[] = [];
  raw.forEach((r, i) => {
    const name = (r?.name ?? "").toString().trim();
    const lat =
      typeof r?.lat === "string" ? parseFloat(r.lat) : (r?.lat as number);
    const lng =
      typeof r?.lng === "string" ? parseFloat(r.lng) : (r?.lng as number);
    if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      console.warn(`[CoastalAccess] Skipping invalid row ${i}:`, r);
      return;
    }
    cleaned.push({ name, lat, lng, type: r?.type });
  });
  return cleaned;
}

async function geocode(text: string, token: string) {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      text
    )}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");
  url.searchParams.set("proximity", "-86.14,30.32"); // bias to 30A
  url.searchParams.set("autocomplete", "true");
  const res = await fetch(url.toString());
  const json = await res.json();
  const f = json?.features?.[0];
  if (!f) return null;
  return {
    lng: f.center[0] as number,
    lat: f.center[1] as number,
    label: f.place_name as string,
  };
}

async function reverseGeocode(lng: number, lat: number, token: string) {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");
  const res = await fetch(url.toString());
  const json = await res.json();
  return (json?.features?.[0]?.place_name as string) || "";
}

async function directionsMatrixDriving(
  origin: { lng: number; lat: number },
  accesses: Access[],
  token: string
) {
  if (!accesses.length) return null;
  const coords = [
    [origin.lng, origin.lat],
    ...accesses.map((a) => [a.lng, a.lat]),
  ];
  const coordStr = coords.map(([L, A]) => `${L},${A}`).join(";");
  const url = new URL(
    `https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordStr}`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("sources", "0");
  url.searchParams.set("destinations", accesses.map((_, i) => i + 1).join(";"));
  url.searchParams.set("annotations", "duration,distance");

  const res = await fetch(url.toString());
  const json = await res.json();
  const durations: number[] | null = json?.durations?.[0] ?? null;
  if (!durations) return null;

  let bestIdx = -1;
  let bestVal = Number.POSITIVE_INFINITY;
  durations.forEach((d, i) => {
    if (typeof d === "number" && d < bestVal) {
      bestVal = d;
      bestIdx = i;
    }
  });
  return bestIdx >= 0 ? accesses[bestIdx] : null;
}

async function fetchRoute(
  from: { lng: number; lat: number },
  to: { lng: number; lat: number },
  token: string
) {
  const url = new URL(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${from.lng},${from.lat};${to.lng},${to.lat}`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("overview", "full");
  const res = await fetch(url.toString());
  const json = await res.json();
  return (json?.routes?.[0]?.geometry?.coordinates as [number, number][]) ?? [];
}

export default function MapPanel30A({
  style = "mapbox://styles/mapbox/light-v11",
  height = 520,
}: {
  style?: string;
  height?: number;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const [styleUrl, setStyleUrl] = useState(style);
  const [accesses, setAccesses] = useState<Access[]>([]);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [origin, setOrigin] = useState<{
    lng: number;
    lat: number;
    label: string;
  } | null>(null);
  const [nearest, setNearest] = useState<Access | null>(null);
  const [nearestAddress, setNearestAddress] = useState<string>("");

  // Load access list from /public (and sanitize)
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch("/CoastalAccess.json", { cache: "no-store" });
        const raw: RawAccess[] = await res.json();
        const clean = coerceAccessList(raw);
        if (live) setAccesses(clean);
      } catch (err) {
        console.error("Failed to load /CoastalAccess.json", err);
        if (live) setAccesses([]);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !token) return;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: [-86.14, 30.32],
      zoom: 11,
      cooperativeGestures: true,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.on("load", () => {
      map.resize();
      if (accesses.length) addAccessMarkers(map, accesses);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Re-style: re-add markers + route after style swap
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    const center = m.getCenter();
    const zoom = m.getZoom();
    const bearing = m.getBearing();
    const pitch = m.getPitch();

    m.setStyle(styleUrl);
    m.once("styledata", () => {
      if (accesses.length) addAccessMarkers(m, accesses);
      if (origin && nearest) drawRoute(m, origin, nearest, token);
      m.jumpTo({ center, zoom, bearing, pitch });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl]);

  // If accesses load after map ready, add markers
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !m.isStyleLoaded()) return;
    addAccessMarkers(m, accesses);
  }, [accesses]);

  function addAccessMarkers(map: Map, list: Access[]) {
    const valid = list.filter(
      (a) => Number.isFinite(a?.lat) && Number.isFinite(a?.lng)
    );
    if (!valid.length) return;
    valid.forEach((a) => {
      const el = document.createElement("div");
      el.className =
        "rounded-full ring-2 ring-white bg-emerald-500 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.2)]";
      new mapboxgl.Marker({ element: el })
        .setLngLat([a.lng, a.lat])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(a.name))
        .addTo(map);
    });
  }

  function clearRoute(map: Map) {
    ["route-casing", "route-line"].forEach(
      (id) => map.getLayer(id) && map.removeLayer(id)
    );
    map.getSource("route") && map.removeSource("route");
  }

  async function drawRoute(
    map: Map,
    from: { lng: number; lat: number; label: string },
    to: Access,
    tkn: string
  ) {
    clearRoute(map);
    const coords = await fetchRoute(from, { lng: to.lng, lat: to.lat }, tkn);
    if (!coords.length) return;

    map.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
        properties: {},
      },
    });
    map.addLayer({
      id: "route-casing",
      type: "line",
      source: "route",
      paint: { "line-color": "#0ea5e9", "line-width": 8, "line-opacity": 0.25 },
    });
    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      paint: { "line-color": "#0369a1", "line-width": 4, "line-opacity": 0.9 },
    });

    // Fit bounds
    const b = new mapboxgl.LngLatBounds();
    b.extend([from.lng, from.lat]);
    b.extend([to.lng, to.lat]);
    map.fitBounds(b, { padding: 90, duration: 700 });

    // Selection dots
    const drop = (lng: number, lat: number, cls: string) => {
      const el = document.createElement("div");
      el.className = cls;
      new mapboxgl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
    };
    drop(
      from.lng,
      from.lat,
      "rounded-full ring-2 ring-white bg-sky-600 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
    );
    drop(
      to.lng,
      to.lat,
      "rounded-full ring-2 ring-white bg-emerald-500 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mapRef.current || !mapboxgl.accessToken || !query.trim()) return;
    if (!accesses.length) {
      alert("Access points are still loading. Try again in a moment.");
      return;
    }
    setSearching(true);
    try {
      const geo = await geocode(query.trim(), mapboxgl.accessToken);
      if (!geo) return;
      setOrigin(geo);

      const nearestAccess = await directionsMatrixDriving(
        geo,
        accesses,
        mapboxgl.accessToken
      );
      setNearest(nearestAccess || null);

      if (nearestAccess) {
        const addr = await reverseGeocode(
          nearestAccess.lng,
          nearestAccess.lat,
          mapboxgl.accessToken
        );
        setNearestAddress(addr);
        await drawRoute(
          mapRef.current,
          geo,
          nearestAccess,
          mapboxgl.accessToken
        );
      }
    } finally {
      setSearching(false);
    }
  }

  const tokenMissing = useMemo(() => !mapboxgl.accessToken, []);

  return (
    <div className="rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)]">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
            Explore 30A Public Access
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-sky-900 md:text-2xl">
            Find the Closest Beach Access
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStyleUrl(style)}
            className={`rounded-full border px-3 py-1 text-sm ${
              styleUrl === style
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-sky-200 bg-white text-sky-700"
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setStyleUrl(SATELLITE_STYLE)}
            className={`rounded-full border px-3 py-1 text-sm ${
              styleUrl === SATELLITE_STYLE
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-sky-200 bg-white text-sky-700"
            }`}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="relative z-[300] mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-sky-200 bg-white/90 px-4 py-2 text-sm shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          placeholder="Type any address on/near 30A…"
        />
        <button
          type="submit"
          disabled={searching || tokenMissing}
          className="mt-2 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
        >
          {searching ? "Searching…" : "Find Closest Access"}
        </button>
        {tokenMissing && (
          <div className="mt-2 text-xs text-rose-600">
            Set <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> in <code>.env.local</code>{" "}
            and restart.
          </div>
        )}
      </form>

      {/* Map */}
      <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-slate-200">
        <div ref={containerRef} style={{ height }} className="w-full" />
        {origin && nearest && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-white/85 backdrop-blur px-3 py-2 text-[12px] text-slate-700 ring-1 ring-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-600 ring-2 ring-white" />
              <span className="font-medium">{origin.label}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              <span>
                Closest access: <b>{nearest.name}</b>
              </span>
            </div>
            {nearestAddress && (
              <div className="mt-1 text-[11px] text-slate-500">
                {nearestAddress}
              </div>
            )}
          </div>
        )}
      </div>

      {!accesses.length && (
        <p className="mt-3 text-xs text-sky-600/80">
          Loading public access points… (ensure{" "}
          <code>/public/CoastalAccess.json</code> exists and has
          <code> name, lat, lng</code>).
        </p>
      )}
    </div>
  );
}

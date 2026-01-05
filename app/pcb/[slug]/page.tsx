// app/components/ThirtyAHomeMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";

type RawAccess = {
  name?: string;
  lat?: number | string;
  lng?: number | string;
  type?: string;
};
type Access = { name: string; lat: number; lng: number; type?: string };

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

/* ----------------------------- helpers ----------------------------- */

function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371e3,
    toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat),
    lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
function cleanAccesses(raw: RawAccess[]): Access[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => ({
      name: (r?.name ?? "").toString().trim(),
      lat: typeof r?.lat === "string" ? parseFloat(r.lat) : (r?.lat as number),
      lng: typeof r?.lng === "string" ? parseFloat(r.lng) : (r?.lng as number),
      type: r?.type,
    }))
    .filter((a) => a.name && Number.isFinite(a.lat) && Number.isFinite(a.lng));
}
async function geocodeOne(text: string, token: string) {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      text
    )}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");
  // DON’T restrict with proximity — works for Iowa, etc.
  const r = await fetch(url.toString());
  const j = await r.json();
  const f = j?.features?.[0];
  if (!f) return null;
  return {
    lng: f.center[0] as number,
    lat: f.center[1] as number,
    label: f.place_name as string,
  };
}
async function geocodeSuggest(text: string, token: string) {
  if (!text.trim()) return [];
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      text
    )}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("autocomplete", "true");
  url.searchParams.set("limit", "5");
  const r = await fetch(url.toString());
  const j = await r.json();
  return (j?.features ?? []).map((f: any) => ({
    id: f.id as string,
    label: f.place_name as string,
    lng: f.center[0] as number,
    lat: f.center[1] as number,
  }));
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

/* ----------------------------- component ----------------------------- */

export default function ThirtyAHomeMap({
  style = "mapbox://styles/mapbox/satellite-streets-v12",
  height = 520,
}: {
  style?: string;
  height?: number;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const [accesses, setAccesses] = useState<Access[]>([]);
  const [markers, setMarkers] = useState<Marker[]>([]); // access pins
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    Array<{ id: string; label: string; lng: number; lat: number }>
  >([]);
  const [searching, setSearching] = useState(false);

  const [origin, setOrigin] = useState<{
    lng: number;
    lat: number;
    label: string;
  } | null>(null);
  const [nearest, setNearest] = useState<Access | null>(null);

  /* 1) Load access list from /public and show pins */
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch("/CoastalAccess.json", { cache: "no-store" });
        const clean = cleanAccesses(await res.json());
        if (!live) return;
        setAccesses(clean);

        // if map already loaded, drop markers now
        const m = mapRef.current;
        if (m && m.isStyleLoaded()) dropAccessMarkers(m, clean);
      } catch {
        if (live) setAccesses([]);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  /* 2) Init map once (no style swaps to avoid 'composite' errors) */
  useEffect(() => {
    if (!wrapRef.current || mapRef.current || !mapboxgl.accessToken) return;

    const map = new mapboxgl.Map({
      container: wrapRef.current,
      style,
      center: [-86.14, 30.32],
      zoom: 11,
      attributionControl: false,
      cooperativeGestures: true,
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
      // add access markers once style is ready
      if (accesses.length) dropAccessMarkers(map, accesses);
    });

    return () => {
      // cleanup markers and map
      markers.forEach((mk) => mk.remove());
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]);

  /* helper to render/refresh access markers */
  function dropAccessMarkers(map: Map, list: Access[]) {
    // clear old markers
    markers.forEach((mk) => mk.remove());
    const fresh: Marker[] = [];

    list.forEach((a) => {
      const el = document.createElement("div");
      el.className =
        "rounded-full ring-2 ring-white bg-sky-600 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.2)]";
      const mk = new mapboxgl.Marker({ element: el })
        .setLngLat([a.lng, a.lat])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(a.name))
        .addTo(map);
      fresh.push(mk);
    });
    setMarkers(fresh);
  }

  /* clear + draw route */
  function clearRoute() {
    const m = mapRef.current;
    if (!m) return;
    ["route-casing", "route-line"].forEach(
      (id) => m.getLayer(id) && m.removeLayer(id)
    );
    m.getSource("route") && m.removeSource("route");
  }
  async function drawRoute(
    from: { lng: number; lat: number; label: string },
    to: Access
  ) {
    const m = mapRef.current;
    if (!m) return;
    const coords = await fetchRoute(
      { lng: from.lng, lat: from.lat },
      { lng: to.lng, lat: to.lat },
      mapboxgl.accessToken!
    );
    if (!coords.length) return;

    m.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: { type: "LineString", coordinates: coords },
        properties: {},
      },
    });
    m.addLayer({
      id: "route-casing",
      type: "line",
      source: "route",
      paint: { "line-color": "#0ea5e9", "line-width": 8, "line-opacity": 0.28 },
    });
    m.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      paint: { "line-color": "#0284c7", "line-width": 4, "line-opacity": 0.9 },
    });

    const b = new mapboxgl.LngLatBounds();
    b.extend([from.lng, from.lat]);
    b.extend([to.lng, to.lat]);
    m.fitBounds(b, { padding: 90, duration: 700 });
  }

  /* 3) Autocomplete (worldwide) */
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const opts = await geocodeSuggest(query, mapboxgl.accessToken!);
        setSuggestions(opts);
      } catch {
        setSuggestions([]);
      }
    }, 200); // small debounce
    return () => clearTimeout(t);
  }, [query]);

  /* choose suggestion -> geocode (we already have coords), find nearest, draw route */
  async function chooseSuggestion(s: {
    label: string;
    lng: number;
    lat: number;
  }) {
    setSuggestions([]);
    setQuery(s.label);
    setSearching(true);
    try {
      setOrigin({ lng: s.lng, lat: s.lat, label: s.label });

      // nearest by straight-line distance (same as SuiteMap)
      let best: Access | null = null;
      let bestDist = Infinity;
      for (const a of accesses) {
        const d = haversineMeters(
          { lat: s.lat, lng: s.lng },
          { lat: a.lat, lng: a.lng }
        );
        if (d < bestDist) {
          best = a;
          bestDist = d;
        }
      }
      setNearest(best || null);
      clearRoute();
      if (best)
        await drawRoute({ lng: s.lng, lat: s.lat, label: s.label }, best);
    } finally {
      setSearching(false);
    }
  }

  /* manual submit (if user hits Enter without clicking a suggestion) */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const geo = await geocodeOne(query.trim(), mapboxgl.accessToken!);
      if (!geo) return;
      await chooseSuggestion(geo);
    } finally {
      setSearching(false);
    }
  }

  if (!mapboxgl.accessToken) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 text-sky-700">
        Missing <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>. Add it to{" "}
        <code>.env.local</code> and restart the server.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)]">
      <div className="mb-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
          Explore 30A Public Access
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-sky-900 md:text-2xl">
          Find the Closest Beach Access
        </h2>
      </div>

      {/* Search + autocomplete */}
      <form onSubmit={onSubmit} className="relative z-[300] mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-sky-200 bg-white/90 px-4 py-2 text-sm shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          placeholder="Type any address (Iowa, NYC, or 30A)…"
        />
        <button
          type="submit"
          disabled={searching}
          className="mt-2 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800 disabled:opacity-60"
        >
          {searching ? "Searching…" : "Find Closest Access"}
        </button>

        {/* suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-[350] mt-2 overflow-hidden rounded-xl border border-sky-200 bg-white shadow-lg">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => chooseSuggestion(s)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-sky-50"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Map */}
      <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-slate-200">
        <div ref={wrapRef} style={{ height }} className="w-full" />
        {origin && nearest && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-white/85 backdrop-blur px-3 py-2 text-[12px] text-slate-700 ring-1 ring-slate-200 shadow-sm">
            <div className="font-medium">{origin.label}</div>
            <div className="mt-1">
              Closest access: <b>{nearest.name}</b>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// app/components/ThirtyAHomeMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";
import { useRouter } from "next/navigation";

// Haversine for fallback only
function linearMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 3958.8; // miles
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(la1) * Math.cos(la2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

// Matrix API supports up to 25 coordinates per request
async function getDrivingMetricsForBatch(
  origin: { lat: number; lng: number },
  dests: { lat: number; lng: number }[],
  token: string
) {
  if (!dests.length) return [];
  const coords =
    `${origin.lng},${origin.lat};` +
    dests.map((d) => `${d.lng},${d.lat}`).join(";");

  const url = `https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic/${coords}?sources=0&annotations=duration,distance&access_token=${encodeURIComponent(
    token
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("matrix fetch failed");
  const data = await res.json();

  // durations[0][i+1] / distances[0][i+1]
  const durations: number[] = [];
  const distances: number[] = [];
  for (let i = 0; i < dests.length; i++) {
    const d = data.durations?.[0]?.[i + 1] ?? null;
    const s = data.distances?.[0]?.[i + 1] ?? null;
    durations.push(d as any); // seconds or null
    distances.push(s as any); // meters or null
  }
  return dests.map((_, i) => ({
    durationSec: durations[i] ?? null,
    distanceMi: distances[i] != null ? distances[i] / 1609.344 : null,
  }));
}

async function getDrivingMetricsAll(
  origin: { lat: number; lng: number },
  dests: { lat: number; lng: number }[],
  token: string
) {
  const BATCH = 24; // 1 origin + 24 dests = 25 cap
  const out: { durationSec: number | null; distanceMi: number | null }[] = [];
  for (let i = 0; i < dests.length; i += BATCH) {
    const slice = dests.slice(i, i + BATCH);
    const part = await getDrivingMetricsForBatch(origin, slice, token);
    out.push(...part);
  }
  return out;
}

type RawAccess = {
  name?: string;
  slug?: string;
  lat?: number | string;
  lng?: number | string;
  type?: string;
};
type Access = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  type?: string;
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

/* ---------------- helpers ---------------- */

function cleanAccesses(raw: RawAccess[]): Access[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((r) => {
      const name = (r?.name ?? "").toString().trim();
      const slug = (
        r?.slug ?? name.toLowerCase().replace(/\s+/g, "-")
      ).toString();
      const lat =
        typeof r?.lat === "string" ? parseFloat(r.lat) : (r?.lat as number);
      const lng =
        typeof r?.lng === "string" ? parseFloat(r.lng) : (r?.lng as number);
      return { name, slug, lat, lng, type: r?.type };
    })
    .filter((a) => a.name && Number.isFinite(a.lat) && Number.isFinite(a.lng));
}

async function geocode(text: string, token: string) {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      text
    )}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("limit", "1");
  url.searchParams.set("proximity", "-86.14,30.32");
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

async function fetchSuggestions(q: string, token: string) {
  const url = new URL(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      q
    )}.json`
  );
  url.searchParams.set("access_token", token);
  url.searchParams.set("autocomplete", "true");
  url.searchParams.set("limit", "5");
  url.searchParams.set("proximity", "-86.14,30.32");
  const res = await fetch(url.toString());
  const json = await res.json();
  return (
    (json?.features || []).map((f: any) => ({
      label: f.place_name as string,
      lng: f.center?.[0] as number,
      lat: f.center?.[1] as number,
    })) ?? []
  );
}

function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

/** OLD crow-flies helper retained for fallback */
function findNearest(
  origin: { lat: number; lng: number },
  accesses: Access[]
): { access: Access; meters: number } | null {
  if (!accesses.length) return null;
  let best: { access: Access; meters: number } | null = null;
  for (const a of accesses) {
    const m = haversineMeters(origin, { lat: a.lat, lng: a.lng });
    if (!best || m < best.meters) best = { access: a, meters: m };
  }
  return best;
}

/** UPDATED: Matrix by driving with BOTH duration and distance  */
async function drivingMatrix(
  origin: { lng: number; lat: number },
  accesses: Access[],
  token: string
): Promise<{ access: Access; seconds: number; meters: number } | null> {
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
  url.searchParams.set("annotations", "duration,distance"); // <-- include distance

  const res = await fetch(url.toString());
  const json = await res.json();

  const durations: (number | null)[] = json?.durations?.[0] ?? null;
  const distances: (number | null)[] = json?.distances?.[0] ?? null;
  if (!durations || !distances) return null;

  // pick FASTEST route (by duration)
  let bestIdx = -1;
  let bestDur = Infinity;
  durations.forEach((d, i) => {
    if (typeof d === "number" && d < bestDur) {
      bestDur = d;
      bestIdx = i;
    }
  });

  if (bestIdx < 0) return null;
  const bestMeters =
    typeof distances[bestIdx] === "number"
      ? (distances[bestIdx] as number)
      : NaN;

  return { access: accesses[bestIdx], seconds: bestDur, meters: bestMeters };
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

/* ---------------- component ---------------- */

export default function ThirtyAHomeMap({
  mapStyle = "mapbox://styles/mapbox/navigation-day-v1",
  satelliteStyle = "mapbox://styles/mapbox/satellite-streets-v12",
  height = 420,
  logoSrc = "/coastal-logo.png",
  bookingPath = "/30a/chairs",
}: {
  mapStyle?: string;
  satelliteStyle?: string;
  height?: number;
  logoSrc?: string;
  bookingPath?: string;
}) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const typeaheadRef = useRef<HTMLDivElement | null>(null);

  const [styleUrl, setStyleUrl] = useState(mapStyle);
  const [accesses, setAccesses] = useState<Access[]>([]);
  const [query, setQuery] = useState("");

  const [origin, setOrigin] = useState<{
    lng: number;
    lat: number;
    label: string;
  } | null>(null);
  const [nearest, setNearest] = useState<Access | null>(null);
  const [distanceMi, setDistanceMi] = useState<number | null>(null); // by road
  const [etaMin, setEtaMin] = useState<number | null>(null); // by road

  const [suggestions, setSuggestions] = useState<
    { label: string; lng: number; lat: number }[]
  >([]);
  const [typing, setTyping] = useState(false);

  // markers
  const accessMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const nearestMarkerRef = useRef<mapboxgl.Marker | null>(null);

  /* ---- load access data ---- */
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const res = await fetch("/CoastalAccess.json", { cache: "no-store" });
        const raw = (await res.json()) as RawAccess[];
        const clean = cleanAccesses(raw);
        if (live) setAccesses(clean);
      } catch {
        if (live) setAccesses([]);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  /* ---- outside click closes dropdown ---- */
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!typeaheadRef.current) return;
      if (!typeaheadRef.current.contains(e.target as Node)) setSuggestions([]);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  /* ---- init map ---- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !mapboxgl.accessToken)
      return;

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
      // blue dots immediately
      addAccessMarkers(map, accesses);
    });

    return () => {
      accessMarkersRef.current.forEach((m) => m.remove());
      originMarkerRef.current?.remove();
      nearestMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- re-add markers when data changes ---- */
  useEffect(() => {
    const m = mapRef.current;
    if (!m || !m.isStyleLoaded()) return;
    addAccessMarkers(m, accesses);
  }, [accesses]);

  /* ---- keep camera when switching styles ---- */
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    const center = m.getCenter();
    const zoom = m.getZoom();
    const bearing = m.getBearing();
    const pitch = m.getPitch();
    m.setStyle(styleUrl);
    m.once("styledata", () => {
      addAccessMarkers(m, accesses);
      if (origin && nearest) drawRoute(m, origin, nearest);
      m.jumpTo({ center, zoom, bearing, pitch });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl]);

  function addAccessMarkers(map: Map, list: Access[]) {
    accessMarkersRef.current.forEach((m) => m.remove());
    accessMarkersRef.current = [];
    list.forEach((a) => {
      const el = document.createElement("div");
      el.className =
        "rounded-full ring-2 ring-white bg-sky-600 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)]";
      const mk = new mapboxgl.Marker({ element: el })
        .setLngLat([a.lng, a.lat])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(a.name))
        .addTo(map);
      accessMarkersRef.current.push(mk);
    });
  }

  function clearRoute() {
    const m = mapRef.current;
    if (!m) return;
    ["route-casing", "route-line"].forEach(
      (id) => m.getLayer(id) && m.removeLayer(id)
    );
    m.getSource("route") && m.removeSource("route");
  }

  async function drawRoute(
    map: Map,
    from: { lng: number; lat: number; label: string },
    to: Access
  ) {
    clearRoute();
    const coords = await fetchRoute(
      from,
      { lng: to.lng, lat: to.lat },
      mapboxgl.accessToken!
    );
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
      paint: {
        "line-color": "#38bdf8",
        "line-width": 12,
        "line-opacity": 0.22,
      },
    });
    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      paint: { "line-color": "#0369a1", "line-width": 6, "line-opacity": 0.95 },
    });

    // green origin + stronger blue nearest pins
    originMarkerRef.current?.remove();
    const originEl = document.createElement("div");
    originEl.className =
      "rounded-full ring-2 ring-white bg-emerald-500 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)]";
    originMarkerRef.current = new mapboxgl.Marker({ element: originEl })
      .setLngLat([from.lng, from.lat])
      .addTo(map);

    nearestMarkerRef.current?.remove();
    const accEl = document.createElement("div");
    accEl.className =
      "rounded-full ring-2 ring-white bg-sky-700 w-4 h-4 shadow-[0_6px_18px_rgba(0,0,0,0.3)]";
    nearestMarkerRef.current = new mapboxgl.Marker({ element: accEl })
      .setLngLat([to.lng, to.lat])
      .addTo(map);

    // keep entire route in view (slightly more zoomed-in than before)
    const b = new mapboxgl.LngLatBounds();
    b.extend([from.lng, from.lat]);
    b.extend([to.lng, to.lat]);
    map.fitBounds(b, { padding: 110, duration: 650, maxZoom: 16 });
  }

  /* ---- debounced suggestions ---- */
  useEffect(() => {
    if (!typing) return;
    const id = setTimeout(async () => {
      const q = query.trim();
      if (q.length < 3) {
        setSuggestions([]);
        setTyping(false);
        return;
      }
      const out = await fetchSuggestions(q, mapboxgl.accessToken!);
      setSuggestions(out);
      setTyping(false);
    }, 240);
    return () => clearTimeout(id);
  }, [query, typing]);

  async function selectSuggestion(s: {
    label: string;
    lng: number;
    lat: number;
  }) {
    // lock the input to the chosen label
    setQuery(s.label);
    setSuggestions([]);

    const geo = { lng: s.lng, lat: s.lat, label: s.label };
    setOrigin(geo);

    if (!accesses.length || !mapboxgl.accessToken) return;

    // 🚗 DRIVING-FIRST selection (fastest by road)
    const byMatrix = await drivingMatrix(geo, accesses, mapboxgl.accessToken);

    const choice =
      byMatrix ??
      (function () {
        const nearest = findNearest({ lat: geo.lat, lng: geo.lng }, accesses);
        return nearest
          ? { access: nearest.access, seconds: NaN, meters: nearest.meters }
          : null;
      })();

    if (!choice) return;

    const best = choice.access;
    setNearest(best);

    // ✅ Distance by road (meters → miles) when available; fallback to crow-flies only if Matrix missing
    const milesByRoad = Number.isFinite(choice.meters)
      ? Math.max(0.1, +((choice.meters as number) / 1609.344).toFixed(1))
      : (() => {
          const meters = haversineMeters(
            { lat: geo.lat, lng: geo.lng },
            { lat: best.lat, lng: best.lng }
          );
          return Math.max(0.1, +(meters / 1609.344).toFixed(1));
        })();

    setDistanceMi(milesByRoad);

    // ✅ ETA by road when available
    setEtaMin(
      Number.isFinite(choice.seconds)
        ? Math.max(1, Math.round(choice.seconds / 60))
        : null
    );

    if (mapRef.current) await drawRoute(mapRef.current, geo, best);
  }

  async function onFind() {
    const q = query.trim();
    if (!q || !mapboxgl.accessToken) return;
    const geo = await geocode(q, mapboxgl.accessToken);
    if (!geo) return;
    await selectSuggestion({ label: geo.label, lng: geo.lng, lat: geo.lat });
  }

  function handleBook() {
    if (!nearest) return;
    const q = new URLSearchParams({
      access: nearest.slug,
      accessName: nearest.name,
      lat: String(nearest.lat),
      lng: String(nearest.lng),
    }).toString();
    router.push(`${bookingPath}?${q}`);
  }

  const googleMapsHref =
    origin && nearest
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${nearest.lat},${nearest.lng}`
      : "#";

  if (!mapboxgl.accessToken) {
    return (
      <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 text-sky-700">
        Missing <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>.
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-sky-100 bg-white/90 backdrop-blur-xl p-5 md:p-6 shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logoSrc} alt="Coastal" className="h-12 w-auto opacity-80" />
          <div className="translate-x-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
              Explore 30A Public Access
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-sky-900 md:text-2xl">
              Find the Closest Beach Access
            </h2>
          </div>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => setStyleUrl(mapStyle)}
            className={`rounded-full border px-3 py-1 text-sm ${
              styleUrl === mapStyle
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-sky-200 bg-white text-sky-700"
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setStyleUrl(satelliteStyle)}
            className={`rounded-full border px-3 py-1 text-sm ${
              styleUrl === satelliteStyle
                ? "border-sky-600 bg-sky-600 text-white"
                : "border-sky-200 bg-white text-sky-700"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={handleBook}
            disabled={!nearest}
            className="rounded-full border border-sky-300 bg-sky-600 px-3 py-1 text-sm font-semibold text-white disabled:opacity-50"
          >
            Book Chairs
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-3 flex flex-col gap-2 md:flex-row" ref={typeaheadRef}>
        <div className="relative flex-1">
          <input
            value={query}
            onFocus={() => setTyping(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setTyping(true);
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                await onFind();
              }
            }}
            className="w-full rounded-xl border border-sky-200 bg-white/95 px-4 py-2 text-sm shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            placeholder="Enter any address (Iowa, NYC, or 30A)…"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-[300] mt-1 w-full overflow-hidden rounded-xl border border-sky-200 bg-white shadow-lg">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault(); // select before input blur
                    selectSuggestion(s);
                  }}
                  className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-sky-50"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onFind}
          className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
        >
          Find Closest Access
        </button>
      </div>

      {/* Map */}
      <div className="relative w-full overflow-hidden rounded-2xl ring-1 ring-slate-200">
        <div ref={containerRef} style={{ height }} className="w-full" />

        {/* Bottom-left card (narrower & taller) */}
        {origin && nearest && (
          <div className="absolute bottom-3 left-3 w-[280px] md:w-[320px] max-w-[85vw] rounded-2xl bg-[rgba(255,255,255,0.97)] backdrop-blur px-4 py-3 ring-1 ring-slate-200 shadow-[0_10px_30px_rgba(2,132,199,0.18)] pointer-events-auto">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-600">
              Closest Public Access
            </div>
            <div className="mt-1 text-[16px] md:text-[18px] font-semibold text-sky-900 leading-snug">
              {nearest.name}
            </div>
            <div className="mt-0.5 text-[12px] text-slate-600">
              From: <span className="font-medium">{origin.label}</span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              {distanceMi != null && (
                <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-[2px] text-[12px] font-semibold text-sky-700 ring-1 ring-sky-200 leading-none whitespace-nowrap">
                  {`${distanceMi}\u00a0mi`}
                </span>
              )}
              {etaMin != null && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-[2px] text-[12px] font-semibold text-emerald-700 ring-1 ring-emerald-200 leading-none whitespace-nowrap">
                  {`${etaMin}\u00a0min`}
                </span>
              )}
            </div>

            {/* stacked to increase height + reduce width footprint */}
            <div className="mt-3 flex flex-col gap-2">
              {/* ✅ CHANGE: Book Chairs on top (blue primary button, same style as old Open in Maps) */}
              <button
                onClick={handleBook}
                className="inline-flex items-center justify-center rounded-lg bg-sky-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-sky-800"
              >
                Book Chairs
              </button>

              {/* ✅ CHANGE: Open in Maps + View Access below */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={googleMapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-sky-200 bg-white px-3.5 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-50"
                >
                  Open in Maps
                </a>
                <button
                  onClick={() =>
                    mapRef.current?.flyTo({
                      center: [nearest.lng, nearest.lat],
                      zoom: 14,
                      speed: 0.7,
                    })
                  }
                  className="rounded-lg border border-sky-200 bg-white px-3.5 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50"
                >
                  View Access
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

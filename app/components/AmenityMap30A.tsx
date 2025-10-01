// app/components/AmenityMap30A.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl, { Map } from "mapbox-gl";

// ---- Types ----
type Access = { name: string; slug: string; lat: number; lng: number };
type Home = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  slug?: string;
  seasonal?: string | null;
  pmCompany?: string | null;
};

// ---- Token ----
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
mapboxgl.accessToken = MAPBOX_TOKEN;

// ---- Helpers ----
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

async function fetchRoute(
  from: { lng: number; lat: number },
  to: { lng: number; lat: number }
) {
  const url = new URL(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${from.lng},${from.lat};${to.lng},${to.lat}`
  );
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("overview", "full");
  url.searchParams.set("access_token", MAPBOX_TOKEN);
  const res = await fetch(url.toString());
  const json = await res.json();
  return json?.routes?.[0]?.geometry?.coordinates ?? [];
}

export default function AmenityMap30A({
  home,
  accesses,
  style = "mapbox://styles/mapbox/satellite-streets-v12",
}: {
  home: Home | null;
  accesses: Access[];
  style?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);

  const nearest = useMemo(() => {
    if (!home || !accesses.length) return null;
    let best: { a: Access; d: number } | null = null;
    for (const a of accesses) {
      const d = haversineMeters(
        { lat: home.lat, lng: home.lng },
        { lat: a.lat, lng: a.lng }
      );
      if (!best || d < best.d) best = { a, d };
    }
    return best?.a ?? null;
  }, [home, accesses]);

  // init once
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPBOX_TOKEN) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style,
      center: [-86.137, 30.32],
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

    // ensure correct sizing if parent reflows
    const onResize = () => map.resize();
    window.addEventListener("resize", onResize);

    map.on("load", () => map.resize());

    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
    };
  }, [style]);

  // draw when home changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !home) return;

    // clear route layers/sources each change
    const clear = () => {
      ["route-line", "route-casing"].forEach(
        (id) => map.getLayer(id) && map.removeLayer(id)
      );
      map.getSource("route") && map.removeSource("route");
    };
    clear();

    // fit just to home if we don't yet have a nearest access
    const fit = (lngLatA: [number, number], lngLatB?: [number, number]) => {
      if (lngLatB) {
        const b = new mapboxgl.LngLatBounds();
        b.extend(lngLatA);
        b.extend(lngLatB);
        map.fitBounds(b, { padding: 80, duration: 600 });
      } else {
        map.flyTo({ center: lngLatA, zoom: 14, duration: 600 });
      }
    };

    const dropMarker = (lngLat: [number, number], cls: string) => {
      const el = document.createElement("div");
      el.className = cls;
      new mapboxgl.Marker({ element: el }).setLngLat(lngLat).addTo(map);
    };

    const homeLL: [number, number] = [home.lng, home.lat];

    if (!nearest) {
      fit(homeLL);
      dropMarker(
        homeLL,
        "rounded-full ring-2 ring-white bg-sky-600 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
      );
      return;
    }

    const accLL: [number, number] = [nearest.lng, nearest.lat];
    fit(homeLL, accLL);

    dropMarker(
      homeLL,
      "rounded-full ring-2 ring-white bg-sky-600 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
    );
    dropMarker(
      accLL,
      "rounded-full ring-2 ring-white bg-emerald-500 w-3.5 h-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
    );

    fetchRoute(
      { lng: home.lng, lat: home.lat },
      { lng: nearest.lng, lat: nearest.lat }
    ).then((coords) => {
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
          "line-color": "#0ea5e9",
          "line-width": 8,
          "line-opacity": 0.28,
        },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#0284c7",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });
    });
  }, [home, nearest]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-[380px] w-full grid place-items-center rounded-2xl ring-1 ring-slate-200 bg-white/70">
        <p className="text-sm text-sky-700 font-medium">
          Missing <code>NEXT_PUBLIC_MAPBOX_TOKEN</code>
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-[0_18px_50px_rgba(2,132,199,0.07)]">
      <div ref={containerRef} className="h-[380px] w-full" />
      {home && nearest && (
        <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-white/80 backdrop-blur px-3 py-2 text-[13px] text-slate-700 ring-1 ring-slate-200 shadow-sm">
          <div className="font-semibold text-slate-900">{home.name}</div>
          <div className="opacity-80">{home.address}</div>
          <div className="mt-1.5 text-[12px]">
            Closest access: <span className="font-medium">{nearest.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// app/components/MapPanel30A.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Home30A, Access30A } from "../lib/data";

const MAP_STYLE = "mapbox://styles/mapbox/satellite-v9";

function haversineMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.7613;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
}

export default function MapPanel30A({
  property,
  accesses,
}: {
  property: Home30A;
  accesses: Access30A[];
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const coordsOk =
    typeof property.lat === "number" &&
    typeof property.lng === "number" &&
    isFinite(property.lat!) &&
    isFinite(property.lng!);

  const nearest = useMemo(() => {
    if (!coordsOk || !accesses?.length) return null;
    let best: Access30A | null = null;
    let bestD = Infinity;
    for (const a of accesses) {
      const d = haversineMiles(
        { lat: property.lat!, lng: property.lng! },
        { lat: a.lat, lng: a.lng }
      );
      if (d < bestD) {
        bestD = d;
        best = a;
      }
    }
    return best;
  }, [coordsOk, property.lat, property.lng, accesses]);

  useEffect(() => {
    if (!coordsOk || !nearest || !token || !mapEl.current) return;

    mapboxgl.accessToken = token;

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([property.lng!, property.lat!]);
    bounds.extend([nearest.lng, nearest.lat]);

    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: MAP_STYLE,
      center: [property.lng!, property.lat!],
      zoom: 15,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", async () => {
      map.fitBounds(bounds, { padding: 60, duration: 0 });

      // markers
      new mapboxgl.Marker({ color: "#0EA5E9" })
        .setLngLat([property.lng!, property.lat!])
        .setPopup(new mapboxgl.Popup().setText(property.name))
        .addTo(map);

      new mapboxgl.Marker({ color: "#1D4ED8" })
        .setLngLat([nearest.lng, nearest.lat])
        .setPopup(new mapboxgl.Popup().setText(nearest.name))
        .addTo(map);

      // directions
      try {
        const url = new URL(
          `https://api.mapbox.com/directions/v5/mapbox/walking/${property.lng},${property.lat};${nearest.lng},${nearest.lat}`
        );
        url.searchParams.set("geometries", "geojson");
        url.searchParams.set("access_token", token);

        const res = await fetch(url.toString());
        const data = await res.json();
        const route = data?.routes?.[0]?.geometry ?? {
          type: "LineString",
          coordinates: [],
        };

        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", geometry: route, properties: {} },
        });

        map.addLayer({
          id: "route-outline",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#ffffff",
            "line-width": 8,
            "line-opacity": 0.85,
          },
          layout: { "line-join": "round", "line-cap": "round" },
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#0EA5E9",
            "line-width": 4,
            "line-opacity": 0.95,
          },
          layout: { "line-join": "round", "line-cap": "round" },
        });
      } catch {
        // ignore fetch errors
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [coordsOk, nearest, token, property.lat, property.lng, property.name]);

  return <div ref={mapEl} className="h-[260px] w-full" />;
}

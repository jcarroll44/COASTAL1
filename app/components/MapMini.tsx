// app/components/MapMini.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type Property = { name: string; address?: string; lat?: number; lng?: number };

const ACCESS_POINTS: { label: string; coords: [number, number] }[] = [
  { label: "Walton Dunes Beach Access", coords: [-86.0880946, 30.3040649] },
  { label: "Ed Walline Regional Access", coords: [-86.23933, 30.32946] },
  { label: "Blue Mountain Beach Access", coords: [-86.21474, 30.33112] },
  { label: "Gulfview Heights Access", coords: [-86.23994, 30.33825] },
  { label: "Seaside Access", coords: [-86.13758, 30.31978] },
];

function nearestAccessTo([lng, lat]: [number, number]) {
  let best = ACCESS_POINTS[0];
  let bestD = Infinity;
  for (const a of ACCESS_POINTS) {
    const dLng =
      (a.coords[0] - lng) *
      Math.cos(((lat + a.coords[1]) / 2) * (Math.PI / 180));
    const dLat = a.coords[1] - lat;
    const d2 = dLng * dLng + dLat * dLat;
    if (d2 < bestD) {
      bestD = d2;
      best = a;
    }
  }
  return best;
}

export default function MapMini({ property }: { property: Property | null }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const hasCoords =
    !!property &&
    typeof property.lat === "number" &&
    typeof property.lng === "number";

  const access = useMemo(() => {
    if (!hasCoords) return null;
    return nearestAccessTo([property!.lng!, property!.lat!]);
  }, [hasCoords, property?.lat, property?.lng]);

  useEffect(() => {
    if (!ref.current || !hasCoords || !token) return;

    mapboxgl.accessToken = token;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [property!.lng!, property!.lat!],
      zoom: 15,
      attributionControl: false,
      antialias: true,
    });
    mapRef.current = map;

    map.on("load", async () => {
      new mapboxgl.Marker({ color: "#0EA5E9" })
        .setLngLat([property!.lng!, property!.lat!])
        .setPopup(new mapboxgl.Popup({ offset: 18 }).setText(property!.name))
        .addTo(map);

      if (access) {
        new mapboxgl.Marker({ color: "#1D4ED8" })
          .setLngLat(access.coords)
          .setPopup(new mapboxgl.Popup({ offset: 18 }).setText(access.label))
          .addTo(map);

        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([property!.lng!, property!.lat!]).extend(access.coords);
        map.fitBounds(bounds, { padding: 60, maxZoom: 16 });

        try {
          const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${
            property!.lng
          },${property!.lat};${access.coords[0]},${
            access.coords[1]
          }?geometries=geojson&access_token=${mapboxgl.accessToken}`;
          const res = await fetch(url);
          const data = await res.json();
          const route =
            data?.routes?.[0]?.geometry ||
            ({ type: "LineString", coordinates: [] } as any);

          map.addSource("route", {
            type: "geojson",
            data: { type: "Feature", geometry: route },
          });

          map.addLayer({
            id: "route-casing",
            type: "line",
            source: "route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: {
              "line-color": "#ffffff",
              "line-width": 8,
              "line-opacity": 0.9,
            },
          });
          map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#0EA5E9", "line-width": 5 },
          });
        } catch {
          // ignore
        }
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [
    hasCoords,
    token,
    property?.lat,
    property?.lng,
    property?.name,
    access?.coords,
  ]);

  return (
    <div className="h-[380px]">
      {!token && (
        <div className="absolute inset-0 z-10 grid place-items-center text-sm text-red-700">
          Missing NEXT_PUBLIC_MAPBOX_TOKEN
        </div>
      )}
      {!hasCoords && (
        <div className="absolute inset-0 z-10 grid place-items-center text-sm text-sky-700">
          Pick a home with coordinates to show the map
        </div>
      )}
      <div ref={ref} className="h-full w-full" />
    </div>
  );
}

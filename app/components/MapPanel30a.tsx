// app/components/MapPanel30A.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type HomeLike = { name?: string; address?: string; lat?: number; lng?: number };
type Access = { name: string; lat: number; lng: number };

export const STYLE_ROAD = "mapbox://styles/mapbox/streets-v12";
export const STYLE_SAT = "mapbox://styles/mapbox/satellite-streets-v12";

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
  height = 380,
  styleUrl = STYLE_ROAD, // default: Map (streets)
  forceAccess, // optional: manually chosen access from dropdown
}: {
  property?: HomeLike | null;
  accesses?: Access[];
  height?: number;
  styleUrl?: string;
  forceAccess?: Access;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const lastStyleRef = useRef<string | undefined>(undefined);

  const homeMarkerRef = useRef<Marker | null>(null);
  const accessMarkerRef = useRef<Marker | null>(null);

  // --- Safe home coords + flags ---------------------------------------------

  const hasHomeCoords =
    typeof property?.lat === "number" &&
    Number.isFinite(property.lat) &&
    typeof property?.lng === "number" &&
    Number.isFinite(property.lng);

  // Default center if we don't have a home yet (rough 30A center)
  const homeLat = hasHomeCoords ? (property!.lat as number) : 30.32;
  const homeLng = hasHomeCoords ? (property!.lng as number) : -86.14;

  const accessList = useMemo(
    () =>
      (Array.isArray(accesses) ? accesses : []).filter(
        (a): a is Access =>
          !!a &&
          typeof a.name === "string" &&
          Number.isFinite(a.lat) &&
          Number.isFinite(a.lng)
      ),
    [accesses]
  );

  const nearest = useMemo(() => {
    if (!hasHomeCoords || accessList.length === 0) return null;

    let best: Access | null = null;
    let bestD = Infinity;

    for (const a of accessList) {
      const d = haversineMiles(
        { lat: homeLat, lng: homeLng },
        { lat: a.lat, lng: a.lng }
      );
      if (d < bestD) {
        bestD = d;
        best = a;
      }
    }
    return best;
  }, [hasHomeCoords, homeLat, homeLng, accessList]);

  const chosenAccess: Access | null = forceAccess ?? nearest;

  const distanceMiles =
    hasHomeCoords && chosenAccess
      ? Math.round(
          (haversineMiles(
            { lat: homeLat, lng: homeLng },
            { lat: chosenAccess.lat, lng: chosenAccess.lng }
          ) +
            Number.EPSILON) *
            10
        ) / 10
      : null;

  async function drawRoute(
    map: Map,
    from: { lng: number; lat: number },
    to: { lng: number; lat: number }
  ) {
    try {
      const url = new URL(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${from.lng},${from.lat};${to.lng},${to.lat}`
      );
      url.searchParams.set("geometries", "geojson");
      url.searchParams.set("overview", "full");
      url.searchParams.set("access_token", token);

      const res = await fetch(url.toString());
      const json = await res.json();
      const route = json?.routes?.[0]?.geometry ?? {
        type: "LineString",
        coordinates: [],
      };

      if (map.getSource("route")) {
        (map.getSource("route") as any).setData({
          type: "Feature",
          geometry: route,
          properties: {},
        });
      } else {
        map.addSource("route", {
          type: "geojson",
          data: { type: "Feature", geometry: route, properties: {} },
        });

        map.addLayer({
          id: "route-casing",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#0ea5e9",
            "line-width": 8,
            "line-opacity": 0.25,
          },
          layout: { "line-join": "round", "line-cap": "round" },
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#0369a1",
            "line-width": 4,
            "line-opacity": 0.9,
          },
          layout: { "line-join": "round", "line-cap": "round" },
        });
      }
    } catch {
      // ignore fetch errors
    }
  }

  function addMarkers(map: Map, access: Access | null) {
    // clear previous
    if (homeMarkerRef.current) {
      homeMarkerRef.current.remove();
      homeMarkerRef.current = null;
    }
    if (accessMarkerRef.current) {
      accessMarkerRef.current.remove();
      accessMarkerRef.current = null;
    }

    if (hasHomeCoords) {
      homeMarkerRef.current = new mapboxgl.Marker({ color: "#0EA5E9" })
        .setLngLat([homeLng, homeLat])
        .setPopup(
          new mapboxgl.Popup().setText(property?.name ?? "Selected home")
        )
        .addTo(map);
    }
    if (access) {
      accessMarkerRef.current = new mapboxgl.Marker({ color: "#1D4ED8" })
        .setLngLat([access.lng, access.lat])
        .setPopup(new mapboxgl.Popup().setText(access.name))
        .addTo(map);
    }
  }

  // init map (once)
  useEffect(() => {
    if (!token || !containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl, // initial style
      center: [homeLng, homeLat],
      zoom: 11,
      attributionControl: false,
      cooperativeGestures: true,
    });
    mapRef.current = map;
    lastStyleRef.current = styleUrl;

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "bottom-right"
    );
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.on("load", async () => {
      if (hasHomeCoords && chosenAccess) {
        const b = new mapboxgl.LngLatBounds();
        b.extend([homeLng, homeLat]);
        b.extend([chosenAccess.lng, chosenAccess.lat]);
        map.fitBounds(b, { padding: 90, duration: 0 });
        addMarkers(map, chosenAccess);
        await drawRoute(
          map,
          { lng: homeLng, lat: homeLat },
          { lng: chosenAccess.lng, lat: chosenAccess.lat }
        );
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      homeMarkerRef.current = null;
      accessMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // respond to style changes OR property/access changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const repaint = async () => {
      map.resize();

      if (hasHomeCoords && chosenAccess) {
        const b = new mapboxgl.LngLatBounds();
        b.extend([homeLng, homeLat]);
        b.extend([chosenAccess.lng, chosenAccess.lat]);
        map.fitBounds(b, { padding: 90, duration: 0 });

        addMarkers(map, chosenAccess);
        await drawRoute(
          map,
          { lng: homeLng, lat: homeLat },
          { lng: chosenAccess.lng, lat: chosenAccess.lat }
        );
      } else {
        // Clear route/markers if we no longer have data
        if (map.getLayer("route-line")) map.removeLayer("route-line");
        if (map.getLayer("route-casing")) map.removeLayer("route-casing");
        if (map.getSource("route")) map.removeSource("route");
        if (homeMarkerRef.current) {
          homeMarkerRef.current.remove();
          homeMarkerRef.current = null;
        }
        if (accessMarkerRef.current) {
          accessMarkerRef.current.remove();
          accessMarkerRef.current = null;
        }
      }
    };

    // If the requested style changed, swap style then repaint on style load.
    if (lastStyleRef.current !== styleUrl) {
      lastStyleRef.current = styleUrl;
      map.setStyle(styleUrl);
      map.once("styledata", repaint);
    } else {
      // Style didn't change → repaint immediately
      repaint();
    }
  }, [
    styleUrl,
    hasHomeCoords,
    homeLat,
    homeLng,
    chosenAccess?.lat,
    chosenAccess?.lng,
    chosenAccess?.name,
  ]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-slate-200">
      <div ref={containerRef} style={{ height }} className="w-full" />

      {hasHomeCoords && chosenAccess && (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-white/90 backdrop-blur px-3 py-2 text-[12px] text-slate-700 ring-1 ring-slate-200 shadow-sm">
          <div className="font-semibold text-sky-900">{chosenAccess.name}</div>
          {distanceMiles != null && (
            <div className="text-slate-600">{distanceMiles} mi from home</div>
          )}
        </div>
      )}
    </div>
  );
}

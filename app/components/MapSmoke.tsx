"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map } from "mapbox-gl";

// ⛑️ TEMP: paste your full token between the quotes:
mapboxgl.accessToken =
  "pk.eyJ1IjoiamNhcnJvbGw0NCIsImEiOiJjbThodXZkbWQwMHFwMmtvZXJzbDh1MWFmIn0.kR4D4dDPPFlYiFio7EH_-A";

export default function MapSmoke() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const [status, setStatus] = useState<string>("Initializing…");

  useEffect(() => {
    if (!ref.current) return;
    if (!mapboxgl.accessToken) {
      setStatus("❌ No Mapbox token detected.");
      return;
    }
    if (!mapboxgl.supported()) {
      setStatus("❌ WebGL not supported in this browser.");
      return;
    }
    if (mapRef.current) return;

    try {
      const map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [-86.137, 30.32], // 30A-ish
        zoom: 11,
        attributionControl: false,
        cooperativeGestures: true,
      });
      mapRef.current = map;

      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: false }),
        "bottom-right"
      );

      map.on("load", () => setStatus("✅ Map style loaded"));
      map.on("error", (e) => {
        // show the actual error on the page in red
        const msg =
          (e && (e as any).error && (e as any).error.message) ||
          "Unknown Mapbox error";
        setStatus("❌ " + msg);
        // also log the full event for deeper details
        console.error("Mapbox error event:", e);
      });

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (err: any) {
      setStatus("❌ Init error: " + (err?.message || String(err)));
      console.error("Init error:", err);
    }
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden ring-1 ring-slate-200 shadow-[0_18px_50px_rgba(2,132,199,0.07)]">
      <div ref={ref} className="h-[380px] w-full" />
      <div className="absolute left-3 top-3 rounded-md bg-white/85 backdrop-blur px-3 py-2 text-[13px] text-slate-800 ring-1 ring-slate-200 shadow-sm">
        {status}
      </div>
    </div>
  );
}

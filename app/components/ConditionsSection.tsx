"use client";

import { useEffect, useMemo, useState } from "react";
import CurrentConditionsCard from "@/components/CurrentConditionsCard";

type CurrentSlice = {
  tempF?: number | null;
  feelsF?: number | null;
  windMph?: number | null;
  windDeg?: number | null;
  uv?: number | null;
  rainChancePct?: number | null;
  sunrise?: string | null;
  sunset?: string | null;
};
type ConditionsPayload = {
  current30a?: CurrentSlice;
  currentPcb?: CurrentSlice;
  hourly30a?: any[];
  hourlyPcb?: any[];
  daily30a?: any[];
  dailyPcb?: any[];
  // ...other fields are fine; we only read current slices here
};

export default function ConditionsSection({
  defaultLocation = "30a",
  ForecastStrip, // optional: pass your component in
}: {
  defaultLocation?: "30a" | "pcb";
  ForecastStrip?: React.ComponentType<{
    data: ConditionsPayload | null;
    location: "30a" | "pcb";
  }>;
}) {
  const [location, setLocation] = useState<"30a" | "pcb">(defaultLocation);
  const [payload, setPayload] = useState<ConditionsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/conditions", { cache: "no-store" });
        const json = await res.json();
        if (!alive) return;
        setPayload(json);
      } catch (e) {
        console.error("conditions fetch failed", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const current: CurrentSlice | null = useMemo(() => {
    if (!payload) return null;
    return location === "pcb"
      ? payload.currentPcb ?? null
      : payload.current30a ?? null;
  }, [payload, location]);

  return (
    <div className="space-y-6">
      {/* Toggle row (keeps your pill look) */}
      <div className="flex items-center justify-end gap-2">
        <button
          className={
            "pill-coastal px-3 py-1 rounded-full border " +
            (location === "30a"
              ? "bg-sky-100 text-sky-700 border-sky-200"
              : "bg-white text-slate-700 border-[var(--coast-line)]")
          }
          onClick={() => setLocation("30a")}
        >
          South Walton (30A)
        </button>
        <button
          className={
            "pill-coastal px-3 py-1 rounded-full border " +
            (location === "pcb"
              ? "bg-sky-100 text-sky-700 border-sky-200"
              : "bg-white text-slate-700 border-[var(--coast-line)]")
          }
          onClick={() => setLocation("pcb")}
        >
          Panama City Beach
        </button>
      </div>

      {/* Card */}
      <CurrentConditionsCard
        data={current}
        locationLabel={
          location === "pcb" ? "Panama City Beach" : "South Walton (30A)"
        }
      />

      {/* Forecast (if you want it here; pass your existing component in) */}
      {ForecastStrip ? (
        <ForecastStrip data={payload} location={location} />
      ) : null}

      {/* tiny state hint */}
      {loading && (
        <div className="text-center text-xs text-slate-500">
          Loading latest conditions…
        </div>
      )}
    </div>
  );
}

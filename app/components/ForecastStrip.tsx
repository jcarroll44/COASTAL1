// app/components/ForecastStrip.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { WIcon } from "@/components/WIcon";

type Hourly = {
  time: string; // ISO
  tempF: number | null;
  windMph: number | null;
  precipPct: number | null;
  uv: number | null;
  weathercode: number | null;
  isDay: number | null; // 1=day, 0=night
};

type Daily = {
  date: string; // YYYY-MM-DD
  tempFHigh: number | null;
  tempFLow: number | null;
  windMph: number | null;
  precipPct: number | null;
  uv: number | null;
  weathercode: number | null;
};

type Payload = {
  hourly30a: Hourly[];
  hourlyPcb: Hourly[];
  daily30a: Daily[];
  dailyPcb: Daily[];
  lastUpdated?: string;
  error?: string;
};

type Mode = "hours" | "days";
type Loc = "30a" | "pcb";

// NEW: accept props with defaults so `mode` is always defined
type Props = {
  mode?: Mode;
  loc?: Loc;
  // ...any other props you may want to forward later
};

export default function ForecastStrip({
  mode = "hours",
  loc = "30a",
  ..._props
}: Props) {
  // Initialize internal state from props; component remains self-contained
  const [viewMode, setViewMode] = useState<Mode>(mode);
  const [location, setLocation] = useState<Loc>(loc);

  const [data, setData] = useState<Payload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try {
      const r = await fetch("/api/conditions", { cache: "no-store" });
      const j: Payload = await r.json();
      if ((j as any).error) throw new Error((j as any).error);
      setData(j);
    } catch (e: any) {
      setErr(e?.message ?? "Forecast temporarily unavailable.");
      setData(null);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const hourly: Hourly[] = useMemo(() => {
    if (!data) return [];
    const src = location === "30a" ? data.hourly30a : data.hourlyPcb;
    return src.slice(0, 7);
  }, [data, location]);

  const daily: Daily[] = useMemo(() => {
    if (!data) return [];
    const src = location === "30a" ? data.daily30a : data.dailyPcb;
    return src.slice(0, 7);
  }, [data, location]);

  const updatedLabel = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <section className="coastal-card p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="coastal-kicker">Forecast</div>
        <div className="flex flex-wrap gap-2">
          <button
            className={`coastal-pill ${
              viewMode === "hours" ? "" : "opacity-70"
            }`}
            onClick={() => setViewMode("hours")}
          >
            Next 7 hours
          </button>
          <button
            className={`coastal-pill ${
              viewMode === "days" ? "" : "opacity-70"
            }`}
            onClick={() => setViewMode("days")}
          >
            7-day
          </button>
          <span className="mx-1" />
          <button
            className={`coastal-pill ${location === "30a" ? "" : "opacity-70"}`}
            onClick={() => setLocation("30a")}
          >
            South Walton (30A)
          </button>
          <button
            className={`coastal-pill ${location === "pcb" ? "" : "opacity-70"}`}
            onClick={() => setLocation("pcb")}
          >
            Panama City Beach
          </button>
        </div>
      </div>

      {!data && !err && <div className="coastal-muted">Loading forecast…</div>}
      {err && (
        <div className="rounded-lg border border-[var(--coast-line)] bg-white/70 px-3 py-2 text-sm text-slate-700">
          {err}. Try again shortly.
        </div>
      )}

      {data && viewMode === "hours" && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {hourly.map((h) => {
            const label = new Date(h.time)
              .toLocaleTimeString([], { hour: "numeric" })
              .toLowerCase();
            return (
              <div key={h.time} className="coastal-tile">
                <div className="coastal-muted">{label}</div>
                <div className="coastal-icon">
                  <WIcon
                    code={h.weathercode ?? undefined}
                    night={h.isDay === 0}
                  />
                </div>
                <div className="coastal-temp">{fmt(h.tempF)}°</div>
                <div className="coastal-meta">
                  {fmt(h.windMph)} mph · {fmt(h.precipPct)}% rain · UV{" "}
                  {fmt(h.uv, 0)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data && viewMode === "days" && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {daily.map((d) => {
            const wd = new Date(`${d.date}T00:00:00`).toLocaleDateString([], {
              weekday: "short",
            });
            return (
              <div key={d.date} className="coastal-tile">
                <div className="coastal-muted">{wd}</div>
                <div className="coastal-icon">
                  <WIcon code={d.weathercode ?? undefined} night={false} />
                </div>
                <div className="coastal-temp">{fmt(d.tempFHigh)}°</div>
                <div className="coastal-meta">
                  {fmt(d.windMph)} mph · {fmt(d.precipPct)}% rain · UV{" "}
                  {fmt(d.uv, 0)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Low {fmt(d.tempFLow)}°
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 coastal-muted">
        Forecast from Open-Meteo • Updated {updatedLabel}
      </div>
    </section>
  );
}

function fmt(n?: number | null, digits = 0) {
  if (n == null || !Number.isFinite(n)) return (0).toFixed(digits);
  return Number(n).toFixed(digits);
}

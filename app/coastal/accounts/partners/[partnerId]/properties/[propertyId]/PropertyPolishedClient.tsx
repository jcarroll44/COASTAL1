"use client";

import React from "react";

/** ---- Types your page.tsx already returns ---- */
type Totals = { gross: number; eligible: number; commission: number };
type Breakdown = {
  chairs: number;
  bonfire: number;
  photography: number;
  other: number;
};
type PropertyData = {
  name: string; // e.g., "bella vita"
  totals: Totals;
  breakdown: Breakdown;
  partnerId?: string; // optional; only used to decide whether to show a partner logo
};

/** ---- Helpers ---- */
const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
const pct = (part: number, whole: number) =>
  whole > 0 ? `${Math.round((part / whole) * 1000) / 10}%` : "0%";
const titleCase = (s: string) => s.replace(/\b\w/g, (m) => m.toUpperCase());

/** ---- Tiny UI primitives (no import aliases needed) ---- */
function Card({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={
        "rounded-2xl border border-sky-100 bg-white shadow-[0_18px_60px_-40px_rgba(0,93,156,0.25)] " +
        className
      }
    >
      {children}
    </div>
  );
}
function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-sky-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </Card>
  );
}

/** ---- Donut (pure SVG, no external libs) ---- */
function Donut({
  values,
  total,
  labels,
}: {
  values: number[];
  total: number;
  labels: string[];
}) {
  const R = 70; // radius
  const C = 2 * Math.PI * R; // circumference
  let offset = 0;
  const segments = values.map((v, i) => {
    const frac = total > 0 ? v / total : 0;
    const length = frac * C;
    const seg = (
      <circle
        key={i}
        r={R}
        cx="90"
        cy="90"
        fill="transparent"
        stroke="currentColor"
        strokeWidth="16"
        strokeDasharray={`${length} ${C - length}`}
        strokeDashoffset={-offset}
        className={[
          // use utility colors without hardcoding: these map well to Tailwind defaults
          i === 0 && "text-sky-500",
          i === 1 && "text-emerald-500",
          i === 2 && "text-amber-500",
          i === 3 && "text-fuchsia-500",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
    offset += length;
    return seg;
  });

  return (
    <Card className="p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
        Revenue Mix
      </div>
      <div className="mt-4 flex items-center gap-6">
        <svg viewBox="0 0 180 180" className="h-44 w-44">
          <circle
            r="70"
            cx="90"
            cy="90"
            fill="transparent"
            stroke="#eaf2fb"
            strokeWidth="16"
          />
          {segments}
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="fill-sky-900 text-xl font-semibold"
          >
            {fmt(total)}
          </text>
        </svg>
        <ul className="space-y-2 text-sm">
          {values.map((v, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className={[
                  "inline-block h-2.5 w-2.5 rounded-full",
                  i === 0 && "bg-sky-500",
                  i === 1 && "bg-emerald-500",
                  i === 2 && "bg-amber-500",
                  i === 3 && "bg-fuchsia-500",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              <span className="text-sky-900/80">{labels[i]}</span>
              <span className="ml-2 font-medium text-sky-900">{fmt(v)}</span>
              <span className="ml-1 text-slate-500">({pct(v, total)})</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

/** ---- Main polished view ---- */
export default function PropertyPolishedClient({
  data,
}: {
  data: PropertyData;
}) {
  // Defensive defaults so the page never crashes on partial data
  const name = titleCase(data?.name || "Property");
  const totals: Totals = {
    gross: data?.totals?.gross ?? 0,
    eligible: data?.totals?.eligible ?? 0,
    commission: data?.totals?.commission ?? 0,
  };
  const breakdown: Breakdown = {
    chairs: data?.breakdown?.chairs ?? 0,
    bonfire: data?.breakdown?.bonfire ?? 0,
    photography: data?.breakdown?.photography ?? 0,
    other: data?.breakdown?.other ?? 0,
  };
  const values = [
    breakdown.chairs,
    breakdown.bonfire,
    breakdown.photography,
    breakdown.other,
  ];
  const labels = ["Chairs", "Bonfire", "Photography", "Other"];

  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
            Property
          </div>
          <h1 className="mt-1 text-3xl font-semibold text-sky-900">{name}</h1>
        </div>

        {/* Partner brand (right) */}
        <div className="flex items-center gap-3">
          {/* Swap image file if you need a different brand per partner */}
          <img
            src="/30a-escapes1.png"
            alt="30A Escapes"
            className="h-9 w-auto opacity-90"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Gross" value={fmt(totals.gross)} />
        <Stat
          label="Eligible"
          value={fmt(totals.eligible)}
          hint="Excludes chair rentals"
        />
        <Stat label="Commission" value={fmt(totals.commission)} />
      </div>

      {/* Mix + mini cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Donut values={values} labels={labels} total={totals.gross} />
        </div>
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
              Chairs
            </div>
            <div className="mt-1 text-xl font-semibold text-sky-900">
              {fmt(breakdown.chairs)}
            </div>
            <div className="text-xs text-slate-500">
              {pct(breakdown.chairs, totals.gross)}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
              Bonfire
            </div>
            <div className="mt-1 text-xl font-semibold text-sky-900">
              {fmt(breakdown.bonfire)}
            </div>
            <div className="text-xs text-slate-500">
              {pct(breakdown.bonfire, totals.gross)}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
              Photography
            </div>
            <div className="mt-1 text-xl font-semibold text-sky-900">
              {fmt(breakdown.photography)}
            </div>
            <div className="text-xs text-slate-500">
              {pct(breakdown.photography, totals.gross)}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
              Other
            </div>
            <div className="mt-1 text-xl font-semibold text-sky-900">
              {fmt(breakdown.other)}
            </div>
            <div className="text-xs text-slate-500">
              {pct(breakdown.other, totals.gross)}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

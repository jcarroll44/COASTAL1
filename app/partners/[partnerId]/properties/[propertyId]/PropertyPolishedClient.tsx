// app/partners/[partnerId]/properties/[propertyId]/PropertyPolishedClient.tsx
"use client";

import React from "react";

/** ---- Types the server page passes ---- */
type Totals = { gross: number; eligible: number; commission: number };
type Breakdown = {
  chairs: number;
  bonfire: number;
  photography: number;
  other: number;
};
type PropertyData = {
  name: string; // e.g., "Bella Vita (30A Escapes)"
  totals: Totals;
  breakdown: Breakdown;
  partnerId?: string;
};

/** ---- Helpers ---- */
const toMoney = (n: number) => `$${Math.round(n).toLocaleString()}`;
const pct = (part: number, whole: number) =>
  whole > 0 ? `${Math.round((part / whole) * 1000) / 10}%` : "0%";
const titleCase = (s: string) => s.replace(/\b\w/g, (m) => m.toUpperCase());

export default function PropertyPolishedClient({
  data,
}: {
  data: PropertyData;
}) {
  const name = titleCase(data?.name || "Property");
  const totals = data.totals || { gross: 0, eligible: 0, commission: 0 };
  const breakdown = data.breakdown || {
    chairs: 0,
    bonfire: 0,
    photography: 0,
    other: 0,
  };

  const logoSrc =
    data?.partnerId === "30a-escapes"
      ? "/30a-escapes1.png" // exact file you requested (public/30a-escapes1.png)
      : data?.partnerId
      ? `/logos/${data.partnerId}.png`
      : undefined;

  return (
    <>
      {/* Header: name left, BIG logo right (no secondary title/partner line) */}
      <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-sky-900">
          {name}
        </h1>

        {logoSrc && (
          <img
            src={logoSrc}
            alt={data.partnerId || "Partner"}
            className="h-16 md:h-20 lg:h-24 w-auto object-contain drop-shadow-sm"
          />
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat label="Gross" value={toMoney(totals.gross)} />
        <Stat
          label="Eligible"
          hint="Excludes chair rentals"
          value={toMoney(totals.eligible)}
        />
        <Stat label="Commission" value={toMoney(totals.commission)} />
      </div>

      {/* Breakdown */}
      <Card className="mt-6 p-5 md:p-6">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-5">
          {/* Simple donut: eligible vs the rest of gross */}
          <div className="md:col-span-2 flex items-center justify-center">
            <Donut value={totals.eligible} total={totals.gross} />
          </div>

          {/* Per-service tiles */}
          <div className="md:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MiniStat
              label="Chairs"
              value={toMoney(breakdown.chairs)}
              pct={pct(breakdown.chairs, totals.gross)}
            />
            <MiniStat
              label="Bonfire"
              value={toMoney(breakdown.bonfire)}
              pct={pct(breakdown.bonfire, totals.gross)}
            />
            <MiniStat
              label="Photography"
              value={toMoney(breakdown.photography)}
              pct={pct(breakdown.photography, totals.gross)}
            />
            <MiniStat
              label="Other"
              value={toMoney(breakdown.other)}
              pct={pct(breakdown.other, totals.gross)}
            />
          </div>
        </div>
      </Card>
    </>
  );
}

/* ---------- Tiny inline UI bits (no external imports) ---------- */

function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
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
      {hint && <div className="text-[11px] text-slate-500 mt-0.5">{hint}</div>}
      <div className="mt-1 text-2xl font-semibold text-sky-900">{value}</div>
    </Card>
  );
}

function MiniStat({
  label,
  value,
  pct,
}: {
  label: string;
  value: string;
  pct?: string;
}) {
  return (
    <Card className="p-5">
      <div className="text-[11px] uppercase tracking-[0.14em] text-sky-800/70">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-sky-900">{value}</div>
      {pct && <div className="text-xs text-slate-500">{pct}</div>}
    </Card>
  );
}

function Donut({ value, total }: { value: number; total: number }) {
  const size = 140;
  const thickness = 16;
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const a = Math.max(0, Math.min(1, total > 0 ? value / total : 0));
  const endAngle = -Math.PI / 2 + a * 2 * Math.PI;

  const arc = (start: number, end: number) => {
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-36 h-36 text-sky-300">
        <path
          d={arc(-Math.PI / 2, (3 * Math.PI) / 2)}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
        />
        <path
          d={arc(-Math.PI / 2, endAngle)}
          className="text-sky-700"
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
        />
        <circle cx={cx} cy={cy} r={r - thickness / 2} fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-xs text-slate-600 text-center">
          <div className="text-[11px] uppercase tracking-wider">Eligible</div>
          <div className="mt-0.5 text-lg font-semibold text-sky-900">
            {toMoney(value)}
          </div>
        </div>
      </div>
    </div>
  );
}
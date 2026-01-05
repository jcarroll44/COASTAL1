"use client";

import { useEffect, useMemo, useState } from "react";

type TimeKey = "today" | "last7" | "last30" | "ytd";

type Resp = {
  partnerId: string;
  propertyId: string;
  propertyName: string;
  totals: Record<TimeKey, number>;
  breakdown: Record<
    TimeKey,
    { chairs: number; bonfire: number; photography: number; other: number }
  >;
};

type PartnerSummary = {
  gross: number;
  eligible: number;
  rate: number; // e.g., 0.05
  commission: number;
};

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const pct = (num: number, den: number) =>
  den > 0 ? `${Math.round((100 * num) / den)}%` : "—";

const deltaPct = (newV: number, oldV: number) => {
  if (oldV <= 0 && newV <= 0) return { text: "0%", sign: 0 };
  if (oldV <= 0) return { text: "+∞", sign: 1 };
  const d = Math.round(((newV - oldV) / oldV) * 100);
  return { text: `${d > 0 ? "+" : ""}${d}%`, sign: Math.sign(d) };
};

function SegBar({
  data,
  total,
}: {
  data: { chairs: number; bonfire: number; photography: number; other: number };
  total: number;
}) {
  const w = (v: number) => (total > 0 ? `${(100 * v) / total}%` : "0%");
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-sky-100">
      <div className="h-full bg-sky-400/70" style={{ width: w(data.chairs) }} />
      <div
        className="h-full bg-amber-500/70"
        style={{ width: w(data.bonfire) }}
      />
      <div
        className="h-full bg-emerald-500/70"
        style={{ width: w(data.photography) }}
      />
      <div
        className="h-full bg-slate-500/60"
        style={{ width: w(data.other) }}
      />
    </div>
  );
}

function RowBreakdown({
  label,
  k,
  resp,
  showAvg = false,
}: {
  label: string;
  k: TimeKey;
  resp: Resp;
  showAvg?: boolean;
}) {
  const total = resp.totals[k];
  const segs = resp.breakdown[k];
  const days =
    k === "last7" ? 7 : k === "last30" ? 30 : k === "today" ? 1 : undefined;
  const items = [
    { key: "chairs", label: "Chairs", class: "bg-sky-400/70" },
    { key: "bonfire", label: "Bonfire", class: "bg-amber-500/70" },
    { key: "photography", label: "Photography", class: "bg-emerald-500/70" },
    { key: "other", label: "Other", class: "bg-slate-500/60" },
  ] as const;

  return (
    <div className="rounded-xl border border-sky-100 p-4">
      <div className="mb-2 flex items-end justify-between">
        <div className="text-[13px] font-semibold tracking-wide text-sky-700 uppercase">
          {label}
        </div>
        <div className="flex items-baseline gap-3">
          {showAvg && days ? (
            <span className="text-[12px] text-sky-600/80">
              Avg {fmtUSD(Math.round(total / days))}/day
            </span>
          ) : null}
          <div className="text-[15px] font-bold text-sky-900">
            {fmtUSD(total)}
          </div>
        </div>
      </div>
      <SegBar data={segs} total={total} />
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
        {items.map((it) => {
          const val = segs[it.key as keyof typeof segs] as number;
          return (
            <div key={it.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block h-2.5 w-2.5 rounded ${it.class}`}
                />
                <span className="text-sky-800/80">{it.label}</span>
                <span className="text-sky-500">· {pct(val, total)}</span>
              </div>
              <div className="font-medium text-sky-900">{fmtUSD(val)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Donut({
  values,
  colors,
  size = 120,
  stroke = 14,
  label,
  total,
}: {
  values: number[];
  colors: string[];
  size?: number;
  stroke?: number;
  label?: string;
  total: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="block"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e6f1fa"
        strokeWidth={stroke}
      />
      {values.map((v, i) => {
        const len = total > 0 ? (v / total) * c : 0;
        const dash = `${len} ${c - len}`;
        const el = (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={colors[i]}
            strokeWidth={stroke}
            strokeDasharray={dash}
            strokeDashoffset={-acc}
            strokeLinecap="butt"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        acc += len;
        return el;
      })}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-sky-900"
        style={{ fontWeight: 800, fontSize: 14 }}
      >
        {label ?? ""}
      </text>
    </svg>
  );
}

function ExportButton({ data }: { data: Resp }) {
  const onExport = () => {
    const rows: Array<Record<string, string | number>> = [];
    (["today", "last7", "last30", "ytd"] as TimeKey[]).forEach((k) => {
      rows.push({
        range: k,
        total: data.totals[k],
        chairs: data.breakdown[k].chairs,
        bonfire: data.breakdown[k].bonfire,
        photography: data.breakdown[k].photography,
        other: data.breakdown[k].other,
      });
    });
    const header = Object.keys(rows[0]).join(",");
    const csv = [header, ...rows.map((r) => Object.values(r).join(","))].join(
      "\n"
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.propertyId}-summary.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={onExport}
      className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-[13px] font-semibold text-sky-800 hover:bg-sky-50"
    >
      Export CSV
    </button>
  );
}

export default function PropertyClient({
  partnerId,
  propertyId,
}: {
  partnerId: string;
  propertyId: string;
}) {
  const [data, setData] = useState<Resp | null>(null);
  const [partner, setPartner] = useState<PartnerSummary | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetch(`/api/partners/${partnerId}/properties/${propertyId}`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(`/api/partners/${partnerId}/summary`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    ])
      .then(([propertyJson, partnerJson]) => {
        if (!cancelled) {
          setData(propertyJson);
          setPartner(partnerJson?.summary ?? null);
          setErr(null);
        }
      })
      .catch((e) => !cancelled && setErr(String(e?.message ?? e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [partnerId, propertyId]);

  const kpis = useMemo(() => {
    if (!data) return [];
    const items = [
      { label: "Today", v: data.totals.today },
      { label: "Last 7 Days", v: data.totals.last7 },
      { label: "Last 30 Days", v: data.totals.last30 },
      { label: "Year to Date", v: data.totals.ytd },
    ] as const;
    return items;
  }, [data]);

  // deltas for context (7 vs today, 30 vs 7)
  const deltas = useMemo(() => {
    if (!data) return null;
    return {
      d7: deltaPct(data.totals.last7, data.totals.today),
      d30: deltaPct(data.totals.last30, data.totals.last7),
    };
  }, [data]);

  const commissionYTD = useMemo(() => {
    if (!data || !partner) return null;
    const eligible =
      data.breakdown.ytd.bonfire +
      data.breakdown.ytd.photography +
      data.breakdown.ytd.other;
    return Math.round(eligible * partner.rate);
  }, [data, partner]);

  if (loading) {
    return (
      <div className="rounded-xl border border-sky-100 bg-white p-6 text-sky-700">
        Loading property…
      </div>
    );
  }
  if (err) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Error: {err}
      </div>
    );
  }
  if (!data) return null;

  const last30 = data.breakdown.last30;
  const last30Vals = [
    last30.chairs,
    last30.bonfire,
    last30.photography,
    last30.other,
  ];
  const last30Colors = ["#60a5fa", "#f59e0b", "#10b981", "#64748b"];

  return (
    <>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight text-sky-900">
            {data.propertyName}
          </h1>
          <div className="text-[13px] text-sky-700/80">
            Partner:{" "}
            <a
              href={`/partners/${data.partnerId}/dashboard`}
              className="font-semibold text-sky-700 hover:underline"
            >
              {data.partnerId}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {partner && commissionYTD !== null ? (
            <div className="rounded-xl border border-sky-100 bg-white px-4 py-3 text-right shadow-[0_14px_48px_-22px_rgba(2,132,199,0.18)]">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-sky-700/70">
                Commission YTD
              </div>
              <div className="text-[18px] font-extrabold text-sky-900">
                {fmtUSD(commissionYTD)}
              </div>
              <div className="text-[11px] text-sky-600/80">
                Rate {(partner.rate * 100).toFixed(0)}%
              </div>
            </div>
          ) : null}
          <ExportButton data={data} />
        </div>
      </header>

      {/* KPI cards */}
      <section className="mb-8 grid gap-4 md:grid-cols-4">
        {kpis.map((k, idx) => {
          const sub =
            idx === 1 && deltas
              ? deltas.d7
              : idx === 2 && deltas
              ? deltas.d30
              : null;
          const subCls =
            sub?.sign === 1
              ? "text-emerald-600"
              : sub?.sign === -1
              ? "text-rose-600"
              : "text-slate-500";
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-sky-100 bg-white p-4 shadow-[0_14px_48px_-22px_rgba(2,132,199,0.18)]"
            >
              <div className="text-[12px] font-semibold uppercase tracking-wide text-sky-700/80">
                {k.label}
              </div>
              <div className="mt-1 text-[22px] font-extrabold text-sky-900">
                {fmtUSD(k.v)}
              </div>
              {sub ? (
                <div className={`mt-1 text-[12px] ${subCls}`}>
                  {idx === 1 ? "vs Today " : "vs Last 7 "} {sub.text}
                </div>
              ) : null}
            </div>
          );
        })}
      </section>

      {/* Mix + Last30 donut */}
      <section className="mb-8 grid gap-4 md:grid-cols-[1fr_1fr]">
        <RowBreakdown label="Today" k="today" resp={data} />
        <RowBreakdown label="Last 7 Days" k="last7" resp={data} showAvg />
        <RowBreakdown label="Last 30 Days" k="last30" resp={data} showAvg />
        <RowBreakdown label="Year to Date" k="ytd" resp={data} />
      </section>

      <section className="mb-10 grid gap-6 md:grid-cols-[260px_1fr]">
        <div className="rounded-2xl border border-sky-100 bg-white p-5">
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-sky-700/80">
            Service Mix (Last 30 Days)
          </div>
          <div className="mx-auto w-[200px]">
            <Donut
              values={last30Vals}
              colors={last30Colors}
              total={data.totals.last30}
              size={200}
              stroke={22}
              label={fmtUSD(data.totals.last30)}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-white p-5">
          <div className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-sky-700/80">
            Breakdown (Last 30 Days)
          </div>
          <div className="grid grid-cols-2 gap-y-2 text-[14px]">
            {[
              { k: "chairs", label: "Chairs", color: "bg-sky-400/70" },
              { k: "bonfire", label: "Bonfire", color: "bg-amber-500/70" },
              {
                k: "photography",
                label: "Photography",
                color: "bg-emerald-500/70",
              },
              { k: "other", label: "Other", color: "bg-slate-500/60" },
            ].map((i) => (
              <div key={i.k} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded ${i.color}`}
                  />
                  <span className="text-sky-800/90">{i.label}</span>
                </div>
                <div className="text-sky-900 font-semibold">
                  {fmtUSD((last30 as any)[i.k])}{" "}
                  <span className="ml-2 text-sky-600/70">
                    {pct((last30 as any)[i.k], data.totals.last30)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
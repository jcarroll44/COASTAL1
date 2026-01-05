"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type PartnerSummary = {
  gross: number;
  eligible: number; // excludes chairs
  rate: number; // 0.05
  commission: number;
};

type PartnerRow = {
  property: string;
  period: string; // e.g. "2025-10"
  chairs?: number;
  bonfire?: number;
  photography?: number;
  other?: number;
  gross: number;
  eligible: number;
  commission: number;
};

type PartnerAggregate = {
  lastUpdated: string;
  summary: PartnerSummary;
  rows: PartnerRow[];
};

function money(n: number | undefined) {
  const v = typeof n === "number" ? n : 0;
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function DashboardClient({ partnerId }: { partnerId: string }) {
  const [data, setData] = useState<PartnerAggregate | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`/api/partners/${partnerId}/summary`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as PartnerAggregate;
        if (ok) setData(json);
      } catch (e: any) {
        if (ok) setErr(e?.message ?? "Failed to load");
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => {
      ok = false;
    };
  }, [partnerId]);

  const title = useMemo(() => {
    // nice title for the page heading
    return partnerId
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [partnerId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-sky-100 p-8 text-sky-700">
        Loading dashboard…
      </div>
    );
  }
  if (err || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        Couldn&apos;t load this partner. {err}
      </div>
    );
  }

  const s = data.summary;

  return (
    <>
      {/* Header (title left, large logo right) */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-sky-900">
            {title}
          </h1>
          <p className="text-sky-700 mt-1">Account Dashboard</p>
          <div className="text-sky-600 text-sm mt-1">
            Last updated {new Date(data.lastUpdated).toLocaleString()}
          </div>
        </div>

        <div className="relative w-40 h-16 md:w-56 md:h-20">
          <Image
            src={`/logos/${partnerId}.png`}
            alt={`${title} logo`}
            fill
            sizes="(min-width: 768px) 224px, 160px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* KPI cards */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-sky-100 bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
            Gross Revenue
          </div>
          <div className="mt-2 text-sky-900 text-2xl font-extrabold">
            {money(s.gross)}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
            Eligible (excl. chairs)
          </div>
          <div className="mt-2 text-sky-900 text-2xl font-extrabold">
            {money(s.eligible)}
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
            Commission Rate
          </div>
          <div className="mt-2 text-sky-900 text-2xl font-extrabold">
            {(s.rate * 100).toFixed(0)}%
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
            Commission Owed
          </div>
          <div className="mt-2 text-sky-900 text-2xl font-extrabold">
            {money(s.commission)}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mt-8">
        <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-sky-700">
          Recent Activity
        </div>
        <div className="overflow-hidden rounded-2xl border border-sky-100">
          <table className="w-full text-[14px]">
            <thead className="bg-sky-50 text-sky-900/80">
              <tr>
                <th className="px-4 py-3 text-left">Property</th>
                <th className="px-4 py-3 text-left">Period</th>
                <th className="px-4 py-3 text-right">Chairs</th>
                <th className="px-4 py-3 text-right">Bonfire</th>
                <th className="px-4 py-3 text-right">Photography</th>
                <th className="px-4 py-3 text-right">Other</th>
                <th className="px-4 py-3 text-right">Gross</th>
                <th className="px-4 py-3 text-right">Eligible</th>
                <th className="px-4 py-3 text-right">Commission</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => {
                const pid = slugify(r.property);
                return (
                  <tr
                    key={`${r.property}-${r.period}`}
                    className="border-t border-sky-100"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/partners/${partnerId}/properties/${pid}`}
                        className="text-sky-800 hover:underline"
                      >
                        {r.property}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{r.period}</td>
                    <td className="px-4 py-3 text-right">{money(r.chairs)}</td>
                    <td className="px-4 py-3 text-right">{money(r.bonfire)}</td>
                    <td className="px-4 py-3 text-right">
                      {money(r.photography)}
                    </td>
                    <td className="px-4 py-3 text-right">{money(r.other)}</td>
                    <td className="px-4 py-3 text-right">{money(r.gross)}</td>
                    <td className="px-4 py-3 text-right">
                      {money(r.eligible)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {money(r.commission)}
                    </td>
                  </tr>
                );
              })}
              {data.rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-sky-700" colSpan={9}>
                    No properties found for this partner yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-[12px] text-sky-700/80">
          By property &amp; period. Commission excludes “Chairs”.
        </div>
      </section>
    </>
  );
}
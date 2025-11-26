"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Row = {
  propertyId?: string;
  slug?: string;
  name?: string;
  type?: string;
  gross?: number;
};

function money(n = 0) {
  return `$${Math.round(Math.max(0, Number(n) || 0)).toLocaleString()}`;
}

function csvEscape(s: string) {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function toCSV(rows: Row[], commissionRate: number) {
  const header = ["Property", "Type", "Gross", `Commission ${commissionRate}%`];
  const lines = [header.join(",")];

  rows.forEach((r, idx) => {
    const name =
      (r.name?.trim() ||
        r.propertyId?.trim() ||
        r.slug?.trim() ||
        `Property ${idx + 1}`)!.replace(/\s*\(.*?\)\s*/g, "");
    const type = r.type || "Home";
    const gross = Number(r.gross) || 0;
    const commission = gross * (commissionRate / 100);

    lines.push(
      [
        csvEscape(name),
        csvEscape(type),
        gross.toFixed(0),
        commission.toFixed(0),
      ].join(",")
    );
  });

  return lines.join("\n");
}

export default function PartnersPropertiesClient({
  partnerId,
  commissionRate,
  rows,
}: {
  partnerId: string;
  commissionRate: number;
  rows: Row[];
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => {
      const hay =
        `${r.name ?? ""} ${r.propertyId ?? ""} ${r.slug ?? ""}`.toLowerCase();
      return hay.includes(term);
    });
  }, [q, rows]);

  const exportCSV = () => {
    const csv = toCSV(filtered, commissionRate);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${partnerId}-properties.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Controls row */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search properties…"
          className="w-full sm:w-80 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] outline-none focus:ring-2 focus:ring-sky-200"
        />
        <button
          onClick={exportCSV}
          className="inline-flex items-center justify-center rounded-xl bg-[#0D5374] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0b4864]"
        >
          Export CSV
        </button>
      </div>

      {/* Table body */}
      <div className="min-w-full">
        <div className="grid grid-cols-[1.6fr_.7fr_.7fr_.7fr_.6fr] items-center border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          <div>Property</div>
          <div>Type</div>
          <div>Gross</div>
          <div>Commission</div>
          <div className="text-right pr-1">Open</div>
        </div>

        {filtered.map((r, idx) => {
          const display =
            (r.name?.trim() ||
              r.propertyId?.trim() ||
              r.slug?.trim() ||
              `Property ${idx + 1}`)!;
          const clean = display.replace(/\s*\(.*?\)\s*/g, "");
          const safeId =
            r.propertyId?.trim() || r.slug?.trim() || clean.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const href = `/partners/${encodeURIComponent(
            partnerId
          )}/properties/${encodeURIComponent(safeId)}`;

          return (
            <div
              key={`${safeId}-${idx}`}
              className="grid grid-cols-[1.6fr_.7fr_.7fr_.7fr_.6fr] items-center border-b border-slate-100 px-6 py-4 text-[15px] hover:bg-slate-50/50 transition-colors"
            >
              <div className="font-medium text-sky-900">{clean}</div>
              <div className="text-slate-600 capitalize">{r.type || "Home"}</div>
              <div className="text-slate-900">{money(r.gross || 0)}</div>
              <div className="text-slate-900">
                {money((Number(r.gross) || 0) * (commissionRate / 100))}
              </div>
              <div className="text-right">
                <Link
                  href={href}
                  className="inline-flex items-center rounded-full bg-[#0D5374] px-3 py-1.5 text-white text-sm font-medium hover:bg-[#0b4864] shadow-sm transition"
                >
                  View
                </Link>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-6 py-10 text-sm text-slate-500 text-center">
            No matching properties.
          </div>
        )}
      </div>
    </>
  );
}
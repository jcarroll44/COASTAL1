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
function slugify(s = "") {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function prettify(s = "") {
  return s
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function TableWithSearch({
  rows,
  partnerId,
  commissionRate,
}: {
  rows: Row[];
  partnerId: string;
  commissionRate: number;
}) {
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);

  // Normalize rows once for consistent display/search/export
  const normalized = useMemo(() => {
    return (rows || []).map((r, idx) => {
      const rawName =
        (r.name && r.name.trim()) ||
        (r.propertyId ? prettify(r.propertyId) : "") ||
        `Property ${idx + 1}`;
      // strip trailing brand in parentheses: "(30A Escapes)"
      const display = rawName.replace(/\s*\(.*?\)\s*/g, "");
      const safeId =
        (r.propertyId && r.propertyId.trim()) ||
        (r.slug && r.slug.trim()) ||
        slugify(display);
      return {
        display,
        safeId,
        type: r.type || "Home",
        gross: Number(r.gross) || 0,
      };
    });
  }, [rows]);

  // Filter by query
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return normalized;
    return normalized.filter(
      (r) =>
        r.display.toLowerCase().includes(term) ||
        r.safeId.toLowerCase().includes(term)
    );
  }, [normalized, q]);

  // Suggestions (top 8)
  const suggestions = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.trim().toLowerCase();
    return normalized
      .filter((r) => r.display.toLowerCase().includes(term))
      .slice(0, 8);
  }, [normalized, q]);

  // CSV export of the filtered view
  function handleExport() {
    const cols = [
      "Property",
      "Type",
      "Gross",
      `Commission (${commissionRate}%)`,
    ];
    const lines = [cols.join(",")];

    filtered.forEach((r) => {
      const commission = Math.round(r.gross * (commissionRate / 100));
      const row = [
        `"${r.display.replace(/"/g, '""')}"`,
        `"${r.type}"`,
        Math.round(r.gross).toString(),
        commission.toString(),
      ];
      lines.push(row.join(","));
    });

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${partnerId}-properties.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Search + Export */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setTimeout(() => setFocus(false), 150)} // let clicks register
            placeholder="Search properties…"
            className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-2.5 text-[15px] outline-none ring-0 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-[0_10px_30px_-20px_rgba(0,93,156,0.35)]"
          />
          {focus && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              {suggestions.map((s) => (
                <button
                  key={s.safeId}
                  type="button"
                  onClick={() => setQ(s.display)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-[15px] hover:bg-slate-50"
                >
                  <span className="text-sky-900">{s.display}</span>
                  <span className="text-slate-400 text-xs">{s.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center justify-center rounded-2xl bg-[#0D5374] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#0b4864]"
        >
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-[0_25px_80px_-40px_rgba(0,93,156,0.25)] backdrop-blur-md">
        <div className="min-w-full">
          <div className="grid grid-cols-[1.6fr_.7fr_.7fr_.7fr_.6fr] items-center border-b border-slate-100 bg-slate-50/70 px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            <div>Property</div>
            <div>Type</div>
            <div>Gross</div>
            <div>Commission</div>
            <div className="text-right pr-1">Open</div>
          </div>

          {filtered.map((r) => {
            const commission = r.gross * (commissionRate / 100);
            const href = `/partners/${encodeURIComponent(
              partnerId
            )}/properties/${encodeURIComponent(r.safeId)}`;

            return (
              <div
                key={r.safeId}
                className="grid grid-cols-[1.6fr_.7fr_.7fr_.7fr_.6fr] items-center border-b border-slate-100 px-6 py-4 text-[15px] hover:bg-slate-50/50 transition-colors"
              >
                <div className="font-medium text-sky-900">{r.display}</div>
                <div className="text-slate-600 capitalize">{r.type}</div>
                <div className="text-slate-900">{money(r.gross)}</div>
                <div className="text-slate-900">{money(commission)}</div>
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
      </div>
    </>
  );
}
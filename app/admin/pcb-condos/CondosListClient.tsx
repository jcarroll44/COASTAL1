"use client";

import { useMemo, useState } from "react";

type Condo = {
  slug: string;
  name?: string;
  address?: string;
};

function toCSV(rows: Condo[]) {
  const header = ["name", "slug", "address"];
  const body = rows.map((r) => [
    JSON.stringify(r.name ?? ""),
    JSON.stringify(r.slug ?? ""),
    JSON.stringify(r.address ?? ""),
  ]);
  return [header, ...body].map((r) => r.join(",")).join("\n");
}

export default function CondosListClient({ condos }: { condos: Condo[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return condos;
    return condos.filter((c) => {
      const hay = `${c.name ?? ""} ${c.slug ?? ""} ${
        c.address ?? ""
      }`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, condos]);

  function handleExport() {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pcb_condos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="coastal-glass rounded-2xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search condos…"
          className="w-full md:max-w-sm rounded-xl border border-sky-200 px-3 py-2 h-[42px] focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
        <button
          onClick={handleExport}
          className="self-start md:self-auto inline-flex items-center justify-center h-[42px] rounded-xl bg-sky-700 px-4 text-white text-sm font-medium hover:bg-sky-800 transition"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-white/70 backdrop-blur border-b">
            <tr className="text-left text-sky-900">
              <th className="px-3 py-2 font-semibold">Condo</th>
              <th className="px-3 py-2 font-semibold">Slug</th>
              <th className="px-3 py-2 font-semibold">Address</th>
              <th className="px-3 py-2 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.slug}
                className="border-b last:border-0 hover:bg-sky-50/60 transition-colors"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`/logos/${c.slug}.png`}
                      alt={c.name ?? c.slug}
                      className="h-8 w-8 object-contain rounded-lg"
                    />
                    <div className="font-medium">{c.name ?? c.slug}</div>
                  </div>
                </td>
                <td className="px-3 py-3 text-gray-600">{c.slug}</td>
                <td className="px-3 py-3 text-gray-600">{c.address ?? "—"}</td>
                <td className="px-3 py-3">
                  <a
                    href={`/partners/${c.slug}/dashboard`}
                    className="inline-flex items-center rounded-lg bg-sky-100 px-3 py-1.5 text-sky-800 hover:bg-sky-200"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-8 text-center text-gray-500" colSpan={4}>
                  No condos match “{q}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

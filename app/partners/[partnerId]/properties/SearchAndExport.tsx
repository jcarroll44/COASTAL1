"use client";

import { useState } from "react";

type ApiPropertyRow = {
  propertyId?: string;
  slug?: string;
  name?: string;
  type?: string;
  gross?: number;
};

export default function SearchAndExport({
  rows,
  partnerName,
}: {
  rows: ApiPropertyRow[];
  partnerName: string;
}) {
  const [query, setQuery] = useState("");

  function handleExport() {
    const csv = [
      ["Property", "Type", "Gross"],
      ...rows.map((r) => [r.name, r.type, r.gross]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${partnerName.replace(/\s+/g, "_")}_properties.csv`;
    a.click();
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <input
        type="text"
        placeholder="Search properties..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:w-[320px] rounded-full border border-sky-100 bg-white px-5 py-2.5 text-[15px] shadow-sm focus:ring-2 focus:ring-sky-200 focus:outline-none"
      />
      <button
        onClick={handleExport}
        className="inline-flex items-center justify-center rounded-full bg-[#0D5374] px-5 py-2.5 text-white text-[15px] font-medium hover:bg-[#0b4864] shadow-sm transition"
      >
        Export CSV
      </button>
    </div>
  );
}
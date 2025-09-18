"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type PCBItem = { id: string; name: string; address?: string };

export default function PCBPropertyGrid({ items }: { items: PCBItem[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<null | string>(null); // null = All

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((x) =>
        !q
          ? true
          : x.name.toLowerCase().includes(q) ||
            (x.address ?? "").toLowerCase().includes(q)
      )
      .filter((x) => (letter ? x.name[0].toUpperCase() === letter : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, query, letter]);

  const letters = useMemo(() => {
    const set = new Set(items.map((x) => x.name[0].toUpperCase()));
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((L) => set.has(L));
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sky-900 font-semibold">
          {filtered.length} properties
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* A–Z filter */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setLetter(null)}
              className={
                "rounded-full px-3 py-1 text-sm border " +
                (letter === null
                  ? "bg-sky-900 text-white border-sky-900"
                  : "border-sky-200 text-sky-900 hover:bg-sky-50")
              }
            >
              All
            </button>
            {letters.map((L) => (
              <button
                key={L}
                onClick={() => setLetter(L)}
                className={
                  "rounded-full px-2.5 py-1 text-sm border " +
                  (letter === L
                    ? "bg-sky-900 text-white border-sky-900"
                    : "border-sky-200 text-sky-900 hover:bg-sky-50")
                }
              >
                {L}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by condo or address…"
              className="h-10 w-[280px] rounded-xl border border-sky-200 px-3 pr-9 text-[14px] outline-none focus:ring-2 focus:ring-sky-200"
            />
            <svg
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="m21 21-4.2-4.2M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/suite/pcb/${p.id}`}
            className="group rounded-2xl border border-sky-100 bg-white p-4 shadow-[0_10px_30px_-16px_rgba(9,30,66,0.25)] hover:shadow-[0_22px_60px_-24px_rgba(9,30,66,0.28)] transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-sky-900">{p.name}</div>
                {p.address && (
                  <div className="mt-0.5 text-[12px] text-sky-700/90">
                    {p.address}
                  </div>
                )}
              </div>
              <div className="mt-0.5 rounded-full border border-sky-200 p-2 text-sky-700 group-hover:bg-sky-900 group-hover:text-white transition-colors">
                {/* arrow */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h13m0 0-5-5m5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import properties from "@/data/properties.json";

/**
 * Lightweight search (no fuse.js) over your properties.json.
 * - Safe defaults: never slices undefined
 * - Filters by name / address / pm
 * - Navigates to /suite/:market/:id on pick
 */
export default function GuestAddressSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");

  // normalize data into a flat options array and guard with [] so slice() is always safe
  const options = useMemo(() => {
    const list = (properties as any[]) ?? [];
    return list.map((p) => ({
      id: String(p.id ?? "").toLowerCase(),
      market: String(p.market ?? "").toLowerCase(), // "30a" or "pcb"
      name: String(p.name ?? ""),
      address: String(p.address ?? ""),
      pm: String(p.pm ?? ""),
    }));
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.trim().toLowerCase();
    // very small/lite filter
    const filtered = options.filter((o) => {
      return (
        o.name.toLowerCase().includes(term) ||
        o.address.toLowerCase().includes(term) ||
        o.pm.toLowerCase().includes(term)
      );
    });
    return filtered.slice(0, 8); // <= always safe because filtered is an array
  }, [q, options]);

  const onPick = (opt: { market: string; id: string }) => {
    if (!opt.market || !opt.id) return;
    // Preserve any existing querystring (e.g., dates later) if you want:
    const qs = params?.toString();
    const suffix = qs ? `?${qs}` : "";
    router.push(`/suite/${opt.market}/${opt.id}${suffix}`);
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by home name, address, or manager..."
          className="h-10 w-full rounded-xl border border-sky-200 px-3 text-[14px] outline-none focus:ring-2 focus:ring-sky-200"
          aria-label="Search by home name, address, or manager"
        />
        <button
          type="button"
          onClick={() => router.push("/suite/30a")} // fallback “not with a manager” route; adjust if needed
          className="whitespace-nowrap rounded-xl border border-sky-200 px-3 text-[13px] font-semibold text-sky-900 hover:bg-sky-50"
        >
          I’m not with a manager
        </button>
      </div>

      {/* Results popover */}
      {q.trim() && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-sky-100 bg-white shadow-lg">
          <ul className="divide-y divide-sky-50">
            {results.map((r) => (
              <li key={`${r.market}-${r.id}`}>
                <button
                  type="button"
                  className="w-full cursor-pointer px-3 py-2 text-left hover:bg-sky-50"
                  onClick={() => onPick(r)}
                >
                  <div className="text-[14px] font-semibold text-sky-900">
                    {r.name}
                  </div>
                  <div className="text-[12px] text-sky-700/90">
                    {r.address} · {r.pm || (r.market === "30a" ? "30A" : "PCB")}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results state */}
      {q.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-sky-100 bg-white px-3 py-2 text-[13px] text-sky-700/90 shadow">
          No matching homes found.
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import properties from "@/data/properties.json";

type Home = {
  id: string;
  name: string;
  address?: string;
  market: "pcb" | "30a";
  pm?: string;
  coords?: [number, number];
  amenities?: Record<string, boolean>;
};

export default function HomePickerBar({ market }: { market: "pcb" | "30a" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");

  const homes = useMemo(
    () => (properties as any[]).filter((p) => p.market === market) as Home[],
    [market]
  );

  const fuse = useMemo(
    () =>
      new Fuse(homes, {
        keys: ["name", "address", "pm"],
        threshold: 0.3,
      }),
    [homes]
  );

  const results = q ? fuse.search(q).map((r) => r.item) : homes.slice(0, 10);

  function selectHome(h: Home) {
    // Route to the existing property suite route
    router.push(`/suite/${market}/${h.id}`);
  }

  function goGuest() {
    // Stay on this page but explicitly “guest”
    const url = `/suite/${market}?guest=1`;
    router.push(url);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-4">
      <div className="rounded-2xl border border-sky-200 bg-white/80 p-3 backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-semibold text-sky-900">
            Select your home (optional)
          </div>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by home name, address, or manager…"
              className="h-10 w-[320px] rounded-xl border border-sky-200 px-3 text-[13px] outline-none focus:ring-2 focus:ring-sky-200"
            />
            <button
              onClick={goGuest}
              className="h-10 rounded-xl border border-sky-200 px-3 text-[13px] font-semibold text-sky-900 hover:bg-sky-50"
            >
              I’m not with a manager
            </button>
          </div>
        </div>

        {q && (
          <div className="mt-3 grid gap-2">
            {results.slice(0, 8).map((h) => (
              <button
                key={h.id}
                onClick={() => selectHome(h)}
                className="flex items-center justify-between rounded-xl border border-sky-200 bg-white px-3 py-2 text-left hover:bg-sky-50"
              >
                <div>
                  <div className="text-[13px] font-semibold text-sky-900">
                    {h.name}
                  </div>
                  {h.address && (
                    <div className="text-[12px] text-sky-700/80">
                      {h.address}
                    </div>
                  )}
                </div>
                <div className="text-[12px] text-sky-700/70">{h.pm || ""}</div>
              </button>
            ))}
            {results.length === 0 && (
              <div className="rounded-xl border border-dashed border-sky-200 p-3 text-[13px] text-sky-700">
                No matches. Try the street name or condo/house name.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

export type PropertyItem = {
  name: string;
  address: string;
  pm: string;
};

type Props = {
  items: PropertyItem[];         // pass 30A or PCB list
  onSelect: (p: PropertyItem) => void;
  placeholder?: string;
};

export default function PropertySelector({ items, onSelect, placeholder }: Props) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return items.filter((p) =>
      `${p.name} ${p.address} ${p.pm}`.toLowerCase().includes(needle)
    ).slice(0, 12);
  }, [q, items]);

  return (
    <div className="relative w-full">
      <label className="block text-[13px] font-semibold text-sky-900 mb-2">
        Select your rental (home name, address, or manager)
      </label>

      <div className="flex">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder ?? "Start typing: 'Blue Crab', '30A Escapes', '395...'"}
          className="w-full rounded-l-xl border border-sky-200 bg-white/90 px-4 py-3 text-[14px] shadow-[0_6px_24px_-16px_rgba(2,132,199,0.25)] outline-none placeholder:text-sky-400 focus:border-sky-300"
        />
        <button
          type="button"
          className="rounded-r-xl border border-l-0 border-sky-200 bg-sky-50 px-4 text-[13px] font-semibold text-sky-700 hover:bg-sky-100"
          onClick={() =>
            onSelect({ name: "No manager", address: "N/A", pm: "Direct" })
          }
        >
          I’m not with a manager
        </button>
      </div>

      {q && filtered.length > 0 && (
        <ul className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-sky-100 bg-white/95 p-1 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.22)] backdrop-blur">
          {filtered.map((p, idx) => (
            <li
              key={`${p.name}-${idx}`}
              className="cursor-pointer rounded-lg px-3 py-2 text-[14px] hover:bg-sky-50"
              onClick={() => {
                onSelect(p);
                setQ("");
              }}
            >
              <div className="font-semibold text-sky-900">{p.name}</div>
              <div className="text-[12px] text-sky-600">
                {p.address} · <span className="font-medium">{p.pm}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {q && filtered.length === 0 && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-sky-100 bg-white/95 p-3 text-[13px] text-sky-600 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.22)] backdrop-blur">
          No matches yet — keep typing or choose “I’m not with a manager”.
        </div>
      )}
    </div>
  );
}

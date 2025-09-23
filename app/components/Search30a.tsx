// app/components/Search30a.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import propsData from "@/data/properties.json";

type Raw = {
  id?: string;
  name: string;
  address?: string;
  pm?: string;
  market?: string;
  lat?: number;
  lng?: number;
};

type OutProp = {
  name: string;
  address?: string;
  pm?: string;
  lat?: number;
  lng?: number;
  market?: "30a";
};

export default function Search30a({
  onSelect,
}: {
  onSelect: (p: OutProp) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const list = useMemo(() => {
    const raw = (propsData as Raw[]).filter(
      (r) => (r.market || "").toLowerCase() === "30a"
    );
    return raw.map((r) => ({
      id: (r.id || r.name).toLowerCase().replace(/\s+/g, "-"),
      name: r.name,
      address: r.address || "",
      pm: r.pm,
      lat: r.lat,
      lng: r.lng,
      key: `${(r.name || "").toLowerCase()} ${(r.address || "")
        .toLowerCase()
        .trim()}`,
    }));
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return list
      .map((r) => ({
        ...r,
        score: r.key.indexOf(s) < 0 ? 1e9 : r.key.indexOf(s),
      }))
      .filter((r) => r.score !== 1e9)
      .sort((a, b) => a.score - b.score)
      .slice(0, 25);
  }, [q, list]);

  const choose = (idx: number) => {
    const r = results[idx];
    if (!r) return;
    onSelect({
      name: r.name,
      address: r.address,
      pm: r.pm,
      lat: r.lat,
      lng: r.lng,
      market: "30a",
    });
    setOpen(false);
    setQ("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) setOpen(true);
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        placeholder="Enter your rental address or home name…"
        className="w-full rounded-xl border px-4 py-3 text-[15px]"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {open && q.trim() && (
        <div className="absolute z-50 mt-2 w-full max-h-80 overflow-auto rounded-xl border bg-white shadow-lg">
          {results.length === 0 && (
            <div className="px-4 py-3 text-neutral-500">No matches.</div>
          )}
          {results.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => choose(idx)}
              onMouseEnter={() => setActive(idx)}
              className={`w-full text-left px-4 py-2 hover:bg-neutral-50 ${
                idx === active ? "bg-neutral-50" : ""
              }`}
            >
              <div className="font-medium">{r.name}</div>
              <div className="text-sm text-neutral-600">{r.address}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

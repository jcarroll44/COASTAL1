"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import propsData from "@/data/properties.json";

type RawProp = {
  id?: string;
  name: string;
  address?: string;
  pm?: string;
  market?: string;
  lat?: number;
  lng?: number;
};

export type Search30AResult = {
  id: string;
  name: string;
  address?: string;
  pm?: string;
  lat?: number;
  lng?: number;
  market: "30a";
};

export default function Search30A({
  onSelect,
}: {
  onSelect?: (p: Search30AResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Normalize 30A homes
  const list = useMemo(() => {
    const rows = (propsData as RawProp[]).filter(
      (r) => (r.market || "").toLowerCase() === "30a"
    );
    return rows.map((r) => {
      const id =
        (r.id || r.name || "")
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "") || crypto.randomUUID();
      const name = r.name?.trim() || "(Unnamed)";
      const address = r.address?.trim() || "";
      return {
        id,
        name,
        address,
        pm: r.pm,
        lat: r.lat,
        lng: r.lng,
        key: `${name.toLowerCase()} ${address.toLowerCase()}`.trim(),
      };
    });
  }, []);

  // Filter + rank
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return list
      .map((r) => ({ ...r, score: r.key.indexOf(s) }))
      .filter((r) => r.score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 25);
  }, [q, list]);

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const pick = (idx: number) => {
    const r = results[idx];
    if (!r) return;
    onSelect?.({
      id: r.id,
      name: r.name,
      address: r.address,
      pm: r.pm,
      lat: r.lat,
      lng: r.lng,
      market: "30a",
    });
    setQ("");
    setOpen(false);
    setActive(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        placeholder="Enter your rental address or home name…"
        className="w-full rounded-xl border px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-sky-200"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        autoComplete="off"
      />

      {open && q.trim() && (
        <div
          ref={listRef}
          className="absolute z-50 mt-2 w-full max-h-80 overflow-auto rounded-xl border bg-white shadow-lg"
        >
          {results.length === 0 ? (
            <div className="px-4 py-3 text-neutral-500">No matches.</div>
          ) : (
            results.map((r, idx) => (
              <button
                key={r.id}
                type="button"
                onClick={() => pick(idx)}
                onMouseEnter={() => setActive(idx)}
                className={`w-full text-left px-4 py-2 hover:bg-neutral-50 ${
                  idx === active ? "bg-neutral-50" : ""
                }`}
              >
                <div className="font-medium">{r.name}</div>
                {r.address ? (
                  <div className="text-sm text-neutral-600">{r.address}</div>
                ) : null}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import cx from "@/lib/cx";
// IMPORTANT: adjust this import path if your file is elsewhere
import RAW_PROPS from "@/data/properties.json";

type Property = {
  name: string;
  address?: string;
  pm?: string;
  lat?: number;
  lng?: number;
};

type Search30aProps = {
  onSelect: (p: Property) => void;
  placeholder?: string;
  menuClassName?: string; // optional style override
};

export default function Search30a({
  onSelect,
  placeholder = "Enter your rental address or home name…",
  menuClassName,
}: Search30aProps) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Normalize your portfolio into { name, address, lat, lng, pm }
  // Assumes items look like:
  // { id, market: "30a", name, address, coords: [lng, lat], pm? }
  const homes: Property[] = useMemo(() => {
    const list = Array.isArray(RAW_PROPS) ? RAW_PROPS : [];
    const out: Property[] = [];
    for (const r of list as any[]) {
      if (!r || (r.market && r.market !== "30a")) continue;
      const name = String(r.name ?? "").trim();
      const address = r.address ? String(r.address) : undefined;
      let lat: number | undefined, lng: number | undefined;
      if (Array.isArray(r.coords) && r.coords.length === 2) {
        const [lngRaw, latRaw] = r.coords;
        lng = typeof lngRaw === "string" ? parseFloat(lngRaw) : lngRaw;
        lat = typeof latRaw === "string" ? parseFloat(latRaw) : latRaw;
      } else {
        lng = typeof r.lng === "string" ? parseFloat(r.lng) : r.lng;
        lat = typeof r.lat === "string" ? parseFloat(r.lat) : r.lat;
      }
      if (name && typeof lat === "number" && typeof lng === "number") {
        out.push({ name, address, pm: r.pm ?? "30A Escapes", lat, lng });
      }
    }
    return out;
  }, []);

  // Click-away to close menu
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Filter results as you type
  const results = useMemo(() => {
    const v = q.trim().toLowerCase();
    if (!v) return [];
    // prioritize starts-with, then contains
    const starts = homes.filter((h) => h.name.toLowerCase().startsWith(v));
    const contains = homes.filter(
      (h) => !starts.includes(h) && h.name.toLowerCase().includes(v)
    );
    return [...starts, ...contains].slice(0, 12);
  }, [q, homes]);

  return (
    <div ref={wrapRef} className="relative">
      <input
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => q && setOpen(true)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-sky-200 bg-white px-4 text-[15px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
      />

      {open && results.length > 0 && (
        <ul
          className={cx(
            "absolute left-0 right-0 mt-2 max-h-[320px] overflow-auto rounded-xl border border-sky-200 bg-white shadow-xl",
            "z-[300]", // above cards/map/itinerary; header stays higher at 400
            menuClassName
          )}
        >
          {results.map((p) => (
            <li
              key={`${p.name}-${p.lat}-${p.lng}`}
              className="cursor-pointer px-4 py-3 text-[14px] hover:bg-sky-50"
              onClick={() => {
                onSelect(p); // <-- gives {name, address, lat, lng, pm}
                setOpen(false);
                setQ(p.name);
              }}
            >
              <div className="font-semibold text-sky-900">{p.name}</div>
              {p.address && (
                <div className="text-xs text-slate-600">{p.address}</div>
              )}
              <div className="mt-0.5 text-[11px] text-sky-700/80">
                30A Escapes
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
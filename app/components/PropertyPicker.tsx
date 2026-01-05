"use client";

import { useEffect, useMemo, useRef, useState } from "react";
// If you ever want 30A support here, you can also import the 30A JSON.
// import homes30a from "@/data/30a-homes.json";
import condosPcb from "@/data/properties.json";

type Item = {
  name: string;
  address: string;
  slug: string;
};

export default function PropertyPicker({
  market,
  className,
  onSelect,
  placeholder = "Search your condo by name or address…",
}: {
  market: "30a" | "pcb";
  className?: string;
  onSelect: (slug: string) => void;
  placeholder?: string;
}) {
  // Use only the PCB dataset for this page (as requested)
  const dataset: Item[] = useMemo(() => {
    if (market === "pcb") return condosPcb as Item[];
    // In case someone reuses this elsewhere, return empty for now
    return [];
  }, [market]);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter only after typing (no dumping full list)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return dataset
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [dataset, query]);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlight(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const idx = highlight >= 0 ? highlight : 0;
      const item = filtered[idx];
      if (item) {
        setQuery(item.name);
        setOpen(false);
        setHighlight(-1);
        onSelect(item.slug);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative ${className || ""}`}
      // ensure dropdown sits above chairs + itinerary
      style={{ zIndex: 100 }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlight(-1);
        }}
        onFocus={() => {
          if (query.trim().length > 0) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-xl border border-sky-200 bg-white/80 px-4 py-2 text-sm shadow-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-200 focus:outline-none"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="propertypicker-listbox"
        role="combobox"
      />

      {open && query.trim() !== "" && (
        <ul
          ref={listRef}
          id="propertypicker-listbox"
          role="listbox"
          className="absolute left-0 right-0 z-[200] mt-2 max-h-72 overflow-y-auto rounded-xl border border-sky-100 bg-white shadow-lg"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-2 text-sky-600 text-sm">No results</li>
          ) : (
            filtered.map((p, idx) => (
              <li
                key={p.slug}
                role="option"
                aria-selected={highlight === idx}
                onMouseDown={(e) => {
                  // use onMouseDown so click works even if input blurs
                  e.preventDefault();
                  setQuery(p.name);
                  setOpen(false);
                  setHighlight(-1);
                  onSelect(p.slug);
                }}
                onMouseEnter={() => setHighlight(idx)}
                className={[
                  "cursor-pointer px-4 py-2",
                  highlight === idx ? "bg-sky-50" : "hover:bg-sky-50",
                ].join(" ")}
              >
                <div className="font-medium text-sky-900">{p.name}</div>
                <div className="text-xs text-sky-600">{p.address}</div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

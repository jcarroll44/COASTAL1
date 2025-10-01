// app/components/GuestAddressSearch.tsx
"use client";

import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import properties from "@/data/properties.json";

type Rect = { left: number; top: number; width: number; height: number };

export default function GuestAddressSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState("");

  // anchor rect from the input
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [anchorRect, setAnchorRect] = useState<Rect | null>(null);

  const computeRect = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setAnchorRect({
      left: r.left,
      top: r.top,
      width: r.width,
      height: r.height,
    });
  }, []);

  useEffect(() => {
    computeRect();
  }, [computeRect, q]);

  useEffect(() => {
    const onWin = () => computeRect();
    window.addEventListener("resize", onWin);
    // capture scroll so nested scrollers also trigger reposition
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [computeRect]);

  // normalize data
  const options = useMemo(() => {
    const list = (properties as any[]) ?? [];
    return list.map((p) => ({
      id: String(p.id ?? "").toLowerCase(),
      market: String(p.market ?? "").toLowerCase(), // "30a" | "pcb"
      name: String(p.name ?? ""),
      address: String(p.address ?? ""),
      pm: String(p.pm ?? ""),
    }));
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.trim().toLowerCase();
    const filtered = options.filter(
      (o) =>
        o.name.toLowerCase().includes(term) ||
        o.address.toLowerCase().includes(term) ||
        o.pm.toLowerCase().includes(term)
    );
    return filtered.slice(0, 8);
  }, [q, options]);

  const onPick = (opt: { market: string; id: string }) => {
    if (!opt.market || !opt.id) return;
    const qs = params?.toString();
    const suffix = qs ? `?${qs}` : "";
    router.push(`/suite/${opt.market}/${opt.id}${suffix}`);
    setQ(""); // close on select
  };

  // portal root (guard for SSR)
  const portalRoot = typeof window !== "undefined" ? document.body : null;

  // BACKDROP + DROPDOWN (always on top)
  const overlay =
    q.trim() && anchorRect && portalRoot
      ? createPortal(
          <>
            {/* Backdrop confirms we’re above every other stacking context */}
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 2147483646, // one below the dropdown itself
                // transparent hit-layer; click to close if desired:
                background: "transparent",
              }}
              onClick={() => setQ("")}
            />

            {/* Floating dropdown */}
            <div
              style={{
                position: "fixed",
                left: anchorRect.left,
                top: anchorRect.top + anchorRect.height + 8,
                width: anchorRect.width,
                zIndex: 2147483647, // top-most
              }}
            >
              {results.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-lg">
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
                            {r.address} ·{" "}
                            {r.pm || (r.market === "30a" ? "30A" : "PCB")}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="rounded-xl border border-sky-100 bg-white px-3 py-2 text-[13px] text-sky-700/90 shadow">
                  No matching homes found.
                </div>
              )}
            </div>
          </>,
          portalRoot
        )
      : null;

  return (
    <Fragment>
      {/* Input row */}
      <div className="relative z-[1]">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by home name, address, or manager..."
            className="h-11 w-full rounded-xl border border-sky-200 bg-white px-3 text-[14px] outline-none focus:ring-2 focus:ring-sky-200"
            aria-label="Search by home name, address, or manager"
          />
          <button
            type="button"
            onClick={() => router.push("/suite/30a")}
            className="whitespace-nowrap rounded-xl border border-sky-200 px-3 text-[13px] font-semibold text-sky-900 hover:bg-sky-50"
          >
            I’m not with a manager
          </button>
        </div>
      </div>

      {/* Portal content */}
      {overlay}
    </Fragment>
  );
}

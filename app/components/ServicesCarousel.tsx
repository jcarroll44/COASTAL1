// app/components/ServicesCarousel.tsx
"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";

type Item = {
  title: string;
  blurb: string;
  image: string;
  href: string;
  badge?: string;
};

export default function ServicesCarousel({ items }: { items: Item[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cardW, setCardW] = useState(300);
  const [index, setIndex] = useState(0);
  const GAP = 24; // matches gap-6

  // measure exactly 1/2/4-up
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      let cols = 1;
      if (w >= 1024) cols = 4;
      else if (w >= 768) cols = 2;

      const totalGap = GAP * (cols - 1);
      const cw = Math.max(260, Math.floor((w - totalGap) / cols));
      setCardW(cw);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cols = useMemo(() => {
    if (typeof window === "undefined") return 4;
    const w = containerRef.current?.clientWidth ?? 1200;
    if (w >= 1024) return 4;
    if (w >= 768) return 2;
    return 1;
  }, [cardW]);

  const maxIndex = Math.max(0, items.length - cols);
  const nudge = (dir: 1 | -1) =>
    setIndex((i) => Math.min(maxIndex, Math.max(0, i + dir)));

  return (
    <section className="relative py-10 md:py-12">
      {/* Header */}
      <div className="mb-6 md:mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-sky-600">
            Beach essentials by Coastal
          </p>
          <h2 className="mt-2 text-[22px] md:text-[28px] font-bold text-text-sky-600">
            Signature Services - All in One Place.
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            aria-label="Previous"
            onClick={() => nudge(-1)}
            className="rounded-full border border-sky-200 bg-white px-3 py-2 text-sky-800 hover:bg-sky-50 transition disabled:opacity-40"
            disabled={index === 0}
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => nudge(1)}
            className="rounded-full border border-sky-200 bg-white px-3 py-2 text-sky-800 hover:bg-sky-50 transition disabled:opacity-40"
            disabled={index === maxIndex}
          >
            ›
          </button>
        </div>
      </div>

      {/* Wrapper: hide X only; allow Y to show so shadows/hover aren’t clipped */}
      <div
        ref={containerRef}
        className="relative overflow-x-hidden overflow-y-visible"
      >
        {/* Small vertical padding avoids any optical clipping even without hover */}
        <div
          className="flex gap-6 py-1 transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)]"
          style={{ transform: `translate3d(${-index * (cardW + GAP)}px,0,0)` }}
        >
          {items.map((it) => (
            <Link
              href={it.href}
              key={it.title}
              className={[
                "group block shrink-0 rounded-2xl bg-white",
                "ring-1 ring-slate-100",
                "shadow-[0_8px_28px_rgba(2,132,199,0.12)]",
                "transition-transform duration-300 ease-[cubic-bezier(.2,.7,.3,1)]",
                "hover:-translate-y-[3px] hover:scale-[1.01]",
                "hover:shadow-[0_16px_38px_rgba(2,132,199,0.18)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300",
              ].join(" ")}
              style={{ width: `${cardW}px` }}
            >
              {/* Fixed aspect image keeps all cards equal height */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <div className="relative aspect-[16/10]">
                  <img
                    src={it.image}
                    alt={it.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                </div>

                {it.badge && (
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-slate-200 shadow-sm">
                    {it.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="text-[11px] tracking-[0.18em] text-slate-500 uppercase">
                  Service
                </div>
                <h3 className="mt-1 text-[18px] md:text-[19px] font-semibold text-[#0a2b47]">
                  {it.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-slate-700/90">
                  {it.blurb}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-sky-900">
                  View details
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    className="transition-transform group-hover:translate-x-0.5"
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile arrows */}
        <div className="md:hidden pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
          <button
            aria-label="Previous"
            onClick={() => nudge(-1)}
            className="pointer-events-auto rounded-full border border-sky-200 bg-white/95 px-3 py-2 text-sky-800 shadow-md disabled:opacity-40"
            disabled={index === 0}
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => nudge(1)}
            className="pointer-events-auto rounded-full border border-sky-200 bg-white/95 px-3 py-2 text-sky-800 shadow-md disabled:opacity-40"
            disabled={index === maxIndex}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

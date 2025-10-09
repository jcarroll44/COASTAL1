// components/ServicesCarousel.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useMemo, useRef } from "react";

type Item = {
  title: string;
  blurb: string;
  image: string;
  href: string;
  badge?: string; // <- can keep or remove, doesn’t matter if not used
};

export default function ServicesCarousel({
  items,
  kicker = "Beach Essentials by Coastal",
  title = "Signature Services – All in One Place.",
}: {
  items: Item[];
  kicker?: string;
  title?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);

  const GAP_PX = 20; // gap-5
  const stepPx = useMemo(() => {
    const el = firstCardRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.round(rect.width + GAP_PX);
  }, []);

  const scrollOne = useCallback(
    (dir: "prev" | "next") => {
      const el = scrollerRef.current;
      if (!el) return;
      const fallback = Math.round(el.clientWidth / 4);
      const amount = stepPx > 0 ? stepPx : fallback;
      el.scrollBy({
        left: dir === "next" ? amount : -amount,
        behavior: "smooth",
      });
    },
    [stepPx]
  );

  return (
    <div className="rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/80 via-white to-sky-50/70 p-6 md:p-8 shadow-[0_18px_60px_-35px_rgba(2,132,199,0.35)]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3 md:mb-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
            {kicker}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-sky-900 md:text-2xl">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            onClick={() => scrollOne("prev")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700 shadow-sm hover:bg-sky-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            aria-label="Next"
            onClick={() => scrollOne("next")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-700 shadow-sm hover:bg-sky-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Single-row carousel */}
      <div
        ref={scrollerRef}
        className="
          flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory
          [scrollbar-width:none] [-ms-overflow-style:none]
          pr-5
        "
        style={{ scrollPaddingLeft: 20, scrollPaddingRight: 20 }}
      >
        <style>{`div::-webkit-scrollbar{display:none}`}</style>

        {items.map((item, idx) => (
          <article
            key={idx}
            ref={idx === 0 ? firstCardRef : undefined}
            className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[48%] lg:w-[24%]"
          >
            <Link
              href={item.href}
              className="
                group block h-full overflow-hidden rounded-2xl border border-sky-100 bg-white 
                ring-1 ring-transparent transition hover:ring-sky-200
                shadow-[0_10px_30px_-20px_rgba(2,132,199,0.25)]
              "
            >
              <div className="relative h-40 w-full sm:h-44 md:h-44 lg:h-44">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                  priority={idx < 4}
                />
                {/* 🔴 Removed badge pill here */}
              </div>

              <div className="flex h-[170px] flex-col justify-between px-4 py-3">
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-500">
                    Service
                  </div>
                  <h3 className="line-clamp-1 text-base font-semibold text-sky-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-sky-700/90">
                    {item.blurb}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-sky-700">
                  <span>View details</span>
                  <svg
                    className="transition group-hover:translate-x-0.5"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

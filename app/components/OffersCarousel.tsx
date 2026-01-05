"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Card = {
  title: string;
  blurb: string;
  href: string;
  img: string;
  badge?: string;
};

const CARDS: Card[] = [
  {
    title: "Chairs & Umbrellas",
    blurb: "Daily setup & takedown—placed with care.",
    href: "/chairs",
    img: "/chairs-week.jpg",
    badge: "Signature Service",
  },
  {
    title: "Beach Bonfires",
    blurb: "Permits, fire, seating & s’mores handled.",
    href: "/bonfires",
    img: "/bonfire.jpg",
    badge: "Signature Service",
  },
  {
    title: "Jet Skis",
    blurb: "Thrill rides on the emerald water.",
    href: "/watersports/jetskis",
    img: "/hero-pcb.jpg",
  },
  {
    title: "Parasail",
    blurb: "Soar high with the safest crews on the coast.",
    href: "/watersports/parasail",
    img: "/hero-30a.jpg",
  },
  {
    title: "Beach Better Box",
    blurb: "Cooler, towels & beach day essentials—bundled.",
    href: "/box",
    img: "/box.jpg",
  },
  {
    title: "Boat Rentals",
    blurb: "Pontoon days made easy.",
    href: "/watersports/boats",
    img: "/hero-pcb.jpg",
  },
  {
    title: "Family Photography",
    blurb: "Golden-hour sessions, edited & delivered.",
    href: "/photography",
    img: "/photo.jpg",
  },
  {
    title: "Watersports (PCB)",
    blurb: "Parasail, jet skis, paddleboards & more.",
    href: "/pcb/watersports",
    img: "/hero-pcb.jpg",
  },
];

const PAGE_SIZE = 4; // show 4 cards per click on desktop

export default function OffersCarousel() {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(CARDS.length / PAGE_SIZE);
  const slice = useMemo(() => {
    const start = page * PAGE_SIZE;
    return CARDS.slice(start, start + PAGE_SIZE);
  }, [page]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 py-10">
      {/* Header & controls */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Signature Services
        </h2>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={!canPrev}
            className="h-9 w-9 rounded-full ring-1 ring-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={!canNext}
            className="h-9 w-9 rounded-full ring-1 ring-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center"
          >
            ›
          </button>
        </div>
      </div>

      {/* Cards (static grid; we just swap which 4 are shown) */}
      <div
        // small fade/translate when page swaps (no auto motion)
        className="transition-all duration-300"
        key={page} // re-triggers the small transition on page change
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {slice.map((c) => (
            <article
              key={c.title}
              className="
                rounded-2xl ring-1 ring-slate-200 bg-white/80 backdrop-blur
                shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)]
                overflow-hidden
              "
            >
              <div className="relative">
                {c.badge && (
                  <div className="absolute left-3 top-3 z-10 rounded-md bg-white/85 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700 ring-1 ring-sky-100">
                    {c.badge}
                  </div>
                )}
                <img
                  src={c.img}
                  alt={c.title}
                  className="h-48 md:h-52 w-full object-cover"
                />
              </div>

              <div className="p-4">
                <div className="text-[11px] tracking-[0.18em] text-slate-500 uppercase">
                  {c.badge ? c.badge : "Service"}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm text-slate-700">{c.blurb}</p>
                <Link
                  href={c.href}
                  className="mt-3 inline-flex items-center text-sm font-medium text-sky-700 hover:text-sky-800"
                >
                  View details +
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => setPage(i)}
            className={`h-2.5 w-2.5 rounded-full ${
              i === page ? "bg-sky-600" : "bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

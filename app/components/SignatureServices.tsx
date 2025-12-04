// app/components/SignatureServices.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

type Card = {
  href: string;
  image: string;
  label: string;
  title: string;
  blurb: string;
};

const CARDS: Card[] = [
  {
    href: "/30a/chairs",
    image: "/cards/chair-blue.jpg",
    label: "Signature Service",
    title: "Chairs & Umbrellas",
    blurb: "Premium canvas sets with daily setup & takedown—placed with care.",
  },
  {
    href: "/pcb/bonfires",
    image: "/cards/bonfire-family.jpg",
    label: "Signature Service",
    title: "Beach Bonfires",
    blurb:
      "Turn-key sunset gatherings. Permits, fire, seating & s’mores handled.",
  },
  {
    href: "/pcb/watersports?type=jet-skis",
    image: "/cards/jetski1.png", // add this image to /public/cards/
    label: "Watersports",
    title: "Jet Skis",
    blurb: "Ride the emerald water with hourly and half-day rentals.",
  },
  {
    href: "/pcb/watersports?type=parasail",
    image: "/cards/parasail.jpg", // add this image to /public/cards/
    label: "Watersports",
    title: "Parasail",
    blurb: "Soar above the shore—safe, scenic, and unforgettable.",
  },
  {
    href: "/30a/beach-better-box",
    image: "/cards/box.jpg",
    label: "Comforts",
    title: "Beach Better Box",
    blurb: "Curated add-ons: towels, games, speakers, sunscreen & more.",
  },
  {
    href: "/pcb/boat-rentals",
    image: "/cards/boat.jpg", // add this image to /public/cards/
    label: "On the Water",
    title: "Boat Rentals",
    blurb: "Pontoon & center console options—half or full day charters.",
  },
  {
    href: "/pcb/photography",
    image: "/cards/family-photo.jpg",
    label: "Signature Service",
    title: "Family Photography",
    blurb: "Golden-hour portraits with seasoned local pros.",
  },
];

export default function SignatureServices() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="coastal-container">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Signature Services
          </p>
          <h2 className="mt-2 text-[20px] md:text-[22px] font-semibold text-slate-900">
            Thoughtful details. Reliable crews. Easy to book.
          </h2>
        </div>

        {/* Stationary card grid (no motion) */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {CARDS.map((card) => (
            <li key={card.title}>
              <Link
                href={card.href}
                className="group block rounded-2xl bg-white ring-1 ring-slate-100 shadow-[0_6px_26px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_34px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    priority={false}
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]"
                  />
                  {/* soft top vignette */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent opacity-50" />
                </div>

                <div className="p-4 md:p-5">
                  <span className="block text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {card.label}
                  </span>
                  <h3 className="mt-1 text-[18px] md:text-[19px] font-semibold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] text-slate-700/90 leading-[1.7]">
                    {card.blurb}
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

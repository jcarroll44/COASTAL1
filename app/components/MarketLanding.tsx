"use client";

import Image from "next/image";
import Link from "next/link";

export default function MarketLanding() {
  return (
    <section className="coastal-container my-14">
      {/* Eyebrow + title */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700/80">
          Build Your Week
        </span>
        <h2 className="text-[26px] md:text-[30px] font-semibold tracking-tight text-sky-900">
          Choose your area to continue.
        </h2>
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* PCB */}
        <MarketCard
          href="/pcb"
          title="Panama City Beach"
          subtitle="Chairs, Water Sports, Bonfires & Photography"
          image="/hero-pcb.jpg"
          logoSrc="/coastal-logo.png" // optional logo badge (top-left)
          logoAlt="Coastal"
          imagePosition="center 65%" // nudges horizon down
        />

        {/* 30A */}
        <MarketCard
          href="/30a"
          title="30A"
          subtitle="Amenity Suite with home selection"
          image="/hero-30a.jpg"
          logoSrc="/coastal-logo.png"
          logoAlt="Coastal"
          imagePosition="center 60%"
        />
      </div>
    </section>
  );
}

type CardProps = {
  href: string;
  title: string;
  subtitle: string;
  image: string;
  logoSrc?: string;
  logoAlt?: string;
  imagePosition?: string; // e.g. "center 65%"
};

function MarketCard({
  href,
  title,
  subtitle,
  image,
  logoSrc,
  logoAlt,
  imagePosition,
}: CardProps) {
  return (
    <Link
      href={href}
      aria-label={`${title} — ${subtitle}`}
      className="
        group relative overflow-hidden rounded-2xl border border-sky-100 bg-white
        shadow-sm ring-0 transition-all
        hover:shadow-md hover:ring-1 hover:ring-sky-100
        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
      "
    >
      {/* Media */}
      <div className="relative aspect-[16/9]">
        <Image
          src={image}
          alt={title}
          fill
          priority={false}
          className="
            object-cover transition-transform duration-500
            group-hover:scale-[1.02]
          "
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
        />

        {/* Gradient for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

        {/* Optional logo badge */}
        {logoSrc ? (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 p-2 ring-1 ring-slate-200 backdrop-blur">
            <Image
              src={logoSrc}
              alt={logoAlt ?? "Logo"}
              width={28}
              height={28}
              className="h-7 w-7"
            />
          </div>
        ) : null}
      </div>

      {/* Copy */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div>
          <div className="text-sky-900 font-semibold leading-tight">
            {title}
          </div>
          <div className="text-sky-700/80 text-sm">{subtitle}</div>
        </div>

        {/* Arrow */}
        <span
          aria-hidden
          className="
            mt-1 inline-flex h-8 w-8 flex-none items-center justify-center
            rounded-full border border-sky-200 text-sky-700/80
            transition-colors group-hover:bg-sky-50
          "
        >
          {/* simple chevron */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

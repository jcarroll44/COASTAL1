// app/components/MarketLanding.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export default function MarketLanding() {
  return (
    <section className="coastal-container my-12">
      <h2 className="text-xl font-semibold text-sky-900">Build Your Week</h2>
      <p className="mt-1 text-sky-700/80">Choose your area to continue.</p>

      <div className="mt-5 grid gap-6 sm:grid-cols-2">
        {/* PCB card */}
        <MarketCard
          href="/pcb"
          title="Panama City Beach"
          subtitle="Chairs, Water Sports, Bonfires & Photography"
          image="/hero-pcb.jpg" // <— your new image
        />

        {/* 30A card */}
        <MarketCard
          href="/30a"
          title="30A"
          subtitle="Amenity Suite with home selection"
          image="/hero-30a.jpg" // change to whatever you prefer
        />
      </div>
    </section>
  );
}

function MarketCard({
  href,
  title,
  subtitle,
  image,
}: {
  href: string;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/9]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority={false}
        />
      </div>
      <div className="p-4">
        <div className="text-sky-900 font-semibold">{title}</div>
        <div className="text-sky-700/80 text-sm">{subtitle}</div>
      </div>
    </Link>
  );
}

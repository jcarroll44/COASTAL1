// app/suite/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

export default function SuiteLanding() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-sky-900">Build Your Week</h1>
        <p className="text-sky-600">Choose your area to continue.</p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* PCB card */}
        <Link
          href="/suite/pcb"
          className="group block overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_22px_70px_-30px_rgba(9,30,66,0.18)] hover:shadow-[0_30px_90px_-40px_rgba(9,30,66,0.22)] transition-shadow"
        >
          <div className="relative aspect-[16/9]">
            <Image
              src="/hero-pcb.jpg"
              alt="Panama City Beach"
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="p-4">
            <div className="text-sky-900 font-semibold">Panama City Beach</div>
            <div className="text-sm text-sky-600">
              Chairs, Water Sports, Bonfires & Photography
            </div>
          </div>
        </Link>

        {/* 30A card */}
        <Link
          href="/suite/30a"
          className="group block overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_22px_70px_-30px_rgba(9,30,66,0.18)] hover:shadow-[0_30px_90px_-40px_rgba(9,30,66,0.22)] transition-shadow"
        >
          <div className="relative aspect-[16/9]">
            <Image
              src="/hero-30a.jpg"
              alt="30A / South Walton"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="p-4">
            <div className="text-sky-900 font-semibold">30A</div>
            <div className="text-sm text-sky-600">
              Amenity Suite with home selection
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}

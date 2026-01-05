"use client";

import Image from "next/image";
import Link from "next/link";

export default function PcbExtras() {
  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 my-10">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        More for your week
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* --- BONFIRES --- */}
        <Link
          href="/pcb/bonfires"
          className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition"
        >
          <div className="relative h-52 w-full">
            <Image
              src="/beach-bonfires2.jpg"
              alt="PCB Beach Bonfires"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="font-semibold text-slate-800">Beach Bonfires</div>
            <div className="text-sm text-slate-600">
              Sunset bonfires — full setup & concierge service.
            </div>
          </div>
        </Link>

        {/* --- WATERSPORTS --- */}
        <Link
          href="/pcb/water-sports"
          className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition"
        >
          <div className="relative h-52 w-full">
            <Image
              src="/cards/watersports.jpg"
              alt="Watersports"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="font-semibold text-slate-800">Watersports</div>
            <div className="text-sm text-slate-600">
              Jet skis, parasailing & more — select towers only.
            </div>
          </div>
        </Link>

        {/* --- PONTOON RENTALS --- */}
        <Link
          href="/pcb/pontoons"
          className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition"
        >
          <div className="relative h-52 w-full">
            <Image
              src="/cards/pontoon.jpg"
              alt="Pontoon Boat Rentals"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="font-semibold text-slate-800">Pontoon Rentals</div>
            <div className="text-sm text-slate-600">
              Explore Shell Island — half day & full day options.
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

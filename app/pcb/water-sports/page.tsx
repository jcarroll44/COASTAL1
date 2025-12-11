// app/pcb/water-sports/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { PCB_CONDOS } from "@/data/pcbCondos";

const watersportOptions = [
  {
    value: "jet-skis",
    label: "Jet Skis",
    image: "/cards/jet-ski.jpg",
    href: "/pcb/water-sports/jet-skis",
  },
  {
    value: "parasail",
    label: "Parasail",
    image: "/cards/parasail.jpg",
    href: "/pcb/water-sports/parasail",
  },
  {
    value: "banana-boat",
    label: "Banana Boat",
    image: "/cards/banana.jpg",
    href: "/pcb/water-sports/banana-boat",
  },
  {
    value: "paddleboard",
    label: "Paddleboard",
    image: "/cards/paddleboard.jpg",
    href: "/pcb/water-sports/paddleboard",
  },
  {
    value: "boat-rentals",
    label: "Boat Rentals",
    image: "/cards/boat.jpg",
    href: "/pcb/water-sports/boat-rentals",
  },
];

export default function PCBWatersportsPage() {
  const [selectedCondo, setSelectedCondo] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("jet-skis");

  return (
    <main className="pb-32">
      {/* ─────────────────────────────────────────────
          HERO — INSET IMAGE WITH ELEGANT OVERLAY CARD
      ───────────────────────────────────────────── */}
      <section className="relative pt-10 md:pt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2">
              {/* IMAGE SIDE */}
              <div className="relative h-[260px] md:h-[360px]">
                <Image
                  src="/cards/watersports.jpg"
                  alt="Watersports"
                  fill
                  className="object-cover"
                />
              </div>

              {/* TEXT + CONTROLS */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
                  Plan Your Watersports Experience
                </h1>

                <p className="text-gray-600 mb-8 max-w-md">
                  Choose your resort and activity to view launch times, pricing,
                  and locations.
                </p>

                {/* LUXURY FORM CARD */}
                <div className="space-y-4">
                  <select
                    value={selectedCondo}
                    onChange={(e) => setSelectedCondo(e.target.value)}
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="">Select your condo</option>
                    {PCB_CONDOS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedActivity}
                    onChange={(e) => setSelectedActivity(e.target.value)}
                    className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-sky-400"
                  >
                    {watersportOptions.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.label}
                      </option>
                    ))}
                  </select>

                  <Link
                    href={`/pcb/water-sports/${selectedActivity}?condo=${selectedCondo}`}
                  >
                    <button className="mt-2 w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition">
                      Continue
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────
          GRID — ELEGANT PREMIUM SERVICE CARDS
      ───────────────────────────────────────────── */}
      <section className="mt-24 mx-auto max-w-7xl px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
          All PCB Watersports
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {watersportOptions.map((item) => (
            <Link
              key={item.value}
              href={item.href}
              className="group rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative h-52 w-full">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* TEXT */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Tap to view details
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

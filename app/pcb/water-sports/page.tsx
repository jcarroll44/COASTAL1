"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { PCB_CONDOS } from "@/data/pcbCondos";

const watersportOptions = [
  {
    value: "jet-skis",
    label: "Jet Skis",
    image: "/cards/watersports.jpg",
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
    image: "/cards/paddle1.jpg",
    href: "/pcb/water-sports/paddleboard",
  },
  {
    value: "boat-rentals",
    label: "Boat Rentals",
    image: "/cards/pontoon1.jpg",
    href: "/pcb/water-sports/boat-rentals",
  },
];

export default function PCBWatersportsPage() {
  const [selectedCondo, setSelectedCondo] = useState("placeholder");
  const [selectedActivity, setSelectedActivity] = useState("jet-skis");

  return (
    <main className="bg-white min-h-screen pb-32">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[42vh] md:h-[58vh] w-full overflow-hidden">
          <Image
            src="/cards/watersports-hero3.jpg"
            alt="Watersports Hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <div className="max-w-2xl">
            <div className="text-white/90 text-[11px] tracking-[0.18em] font-semibold uppercase">
              PCB Watersports
            </div>
            <h1 className="mt-2 text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Book Watersports with Coastal
            </h1>
            <p className="mt-3 text-white/85 text-[15px] leading-relaxed">
              Jet skis, parasailing, banana boat rides & more — your week,
              planned in minutes.
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING CARD */}
      <section className="relative -mt-16 md:-mt-20 z-[5]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="bg-white rounded-3xl shadow-xl ring-1 ring-slate-100 p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-3">
              Start Your Watersports Reservation
            </h2>
            <p className="text-sky-900/70 text-[15px] mb-6 max-w-lg">
              Select your condo and activity to view available times, launch
              points, and pricing.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Select Condo */}
              <select
                value={selectedCondo}
                onChange={(e) => setSelectedCondo(e.target.value)}
                className="
                  w-full rounded-xl 
                  bg-white/90 
                  border border-sky-200/60 
                  py-3 px-4 text-[15px] text-sky-900
                  shadow-sm
                  focus:border-sky-400 
                  focus:ring-2 focus:ring-sky-300/50
                  transition
                "
              >
                <option key="condo-placeholder" value="placeholder">
                  Select your condo
                </option>
                {PCB_CONDOS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Select Activity */}
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="
                  w-full rounded-xl 
                  bg-white/90 
                  border border-sky-200/60 
                  py-3 px-4 text-[15px] text-sky-900
                  shadow-sm
                  focus:border-sky-400 
                  focus:ring-2 focus:ring-sky-300/50
                  transition
                "
              >
                <option key="activity-placeholder" value="placeholder">
                  Select activity
                </option>
                {watersportOptions.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>

              {/* Continue Button */}
              <Link
                href={`/pcb/water-sports/${selectedActivity}?condo=${selectedCondo}`}
                className="block"
              >
                <button className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-3 rounded-xl transition shadow-sm">
                  Continue
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ALL WATERSPORTS */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <div className="text-center mb-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-900/70">
            Coastal Watersports
          </div>
          <h2 className="text-[32px] md:text-[40px] font-extrabold text-sky-900">
            All PCB Watersports
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {watersportOptions.map((item) => (
            <Link
              key={item.value}
              href={item.href}
              className="group rounded-3xl bg-white border border-sky-100 shadow-sm hover:shadow-xl transition overflow-hidden"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.05]"
                />
              </div>

              <div className="p-6">
                <div className="text-[14px] font-semibold text-sky-700 tracking-wide uppercase mb-1">
                  Watersport
                </div>
                <h3 className="text-xl font-bold text-sky-900">{item.label}</h3>
                <p className="text-[14px] text-slate-600 mt-1">
                  View availability & details →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

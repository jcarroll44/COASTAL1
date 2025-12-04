// app/pcb/page.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import ServicesCarousel from "@/components/ServicesCarousel";

/* ──────────────────────────────────────────────────────────
   DATA
─────────────────────────────────────────────────────────── */
const servicesItems = [
  {
    title: "Chairs & Umbrellas",
    blurb: "Daily setup & takedown—placed with care.",
    image: "/cards/pcb-chairs1.jpg",
    href: "/pcb/chairs",
  },
  {
    title: "Beach Bonfires",
    blurb: "Permits, fire, seating, & s’mores handled.",
    image: "/cards/bonfire.jpg",
    href: "/pcb/bonfires",
  },
  {
    title: "Jet Skis",
    blurb: "Thrill rides on the emerald water.",
    image: "/cards/jetski1.png",
    href: "/pcb/jetskis",
  },
  {
    title: "Parasail",
    blurb: "Soar high with the safest crews on the coast.",
    image: "/cards/parasail.jpg",
    href: "/pcb/parasail",
  },
];

const BEACH_CAMS = [
  {
    name: "Pineapple Willy's",
    href: "/beach-cams/pineapple-willys-pier",
    img: "/beach-cams/pineapple-cam.jpg",
  },
  {
    name: "Chateau Beachfront Hotel",
    href: "/beach-cams/chateau-hotel",
    img: "/beach-cams/chateau-cam.jpg.png",
  },
  {
    name: "Embassy Suites PCB",
    href: "/beach-cams/embassy-suites",
    img: "/beach-cams/embassy-cam.jpg",
  },
];

/* ──────────────────────────────────────────────────────────
   SMALL PRIMITIVE
─────────────────────────────────────────────────────────── */
function Dot() {
  return (
    <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[#005D9C] flex-none" />
  );
}

/* ──────────────────────────────────────────────────────────
   HERO — Right-side stacked selector with Coastal round logo
─────────────────────────────────────────────────────────── */
function PCBSelectorVertical() {
  const [service, setService] = useState("Chairs & Umbrellas");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [nearest, setNearest] = useState(true);

  return (
    <div
      className="rounded-2xl border border-sky-100 bg-white/75 backdrop-blur p-4 md:p-5 shadow-[0_14px_48px_-22px_rgba(2,132,199,0.35)]"
      style={{ width: "min(420px,92vw)" }}
    >
      {/* Coastal round logo */}
      <div className="mb-3 flex items-center gap-2">
        <Image
          src="/coastal-logo.png" // <- put your round Coastal logo here
          alt="Coastal"
          width={28}
          height={28}
          className="rounded-full ring-1 ring-sky-100"
          unoptimized
        />
        <div className="text-[18px] font-semibold tracking-wide text-sky-800/80">
          Coastal Beach Company
        </div>
      </div>

      <label className="mb-1 block text-[12px] font-semibold text-slate-600">
        Market
      </label>
      <select
        defaultValue="PCB"
        className="mb-3 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
      >
        <option>PCB</option>
        <option>30A</option>
        <option>Destin</option>
      </select>

      <label className="mb-1 block text-[12px] font-semibold text-slate-600">
        Service
      </label>
      <select
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="mb-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
      >
        <option>Chairs & Umbrellas</option>
        <option>Beach Bonfires</option>
        <option>Jet Skis</option>
        <option>Parasail</option>
        <option>Family Photography</option>
      </select>

      <label className="mb-3 flex items-center gap-2 text-[12px] text-sky-800/80">
        <input
          type="checkbox"
          checked={nearest}
          onChange={(e) => setNearest(e.target.checked)}
          className="rounded border-sky-300 text-sky-700 focus:ring-sky-300"
        />
        Nearest PCB beach access
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">
            Start
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">
            End
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      <button
        className="mt-4 h-11 w-full rounded-lg bg-[#005D9C] text-white text-[14px] font-semibold hover:opacity-95"
        onClick={() =>
          document
            .getElementById("signature-services")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      >
        Check Availability
      </button>

      <div className="mt-2 text-[11px] text-sky-700/70">
        Questions? Our concierge can help tailor your week.
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   PCB Amenity Suite — airy blue card (matches your 30A vibe)
─────────────────────────────────────────────────────────── */
function AmenitySuitePromo_PCB() {
  // extremely subtle/airy blue
  const AIRY = "bg-[#F5F9FF]";

  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 mt-20">
      <div
        className={`relative overflow-hidden rounded-3xl border border-sky-100 ${AIRY}`}
      >
        <div className="relative grid gap-8 p-6 md:grid-cols-[1.1fr_.9fr] md:p-10">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
              Amenity Planning
            </div>
            <h2 className="mt-1 text-[28px] md:text-[32px] font-semibold tracking-tight text-sky-900">
              PCB Amenity Suite
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-sky-900/90">
              All your PCB essentials—chairs, bonfires, photography, and
              more—organized in one polished place.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/suite/pcb"
                className="rounded-xl bg-sky-700 px-5 py-3 text-white font-semibold hover:bg-sky-800"
              >
                Open Amenity Suite
              </a>
              <a
                href="/pcb/condos"
                className="rounded-xl border border-sky-200 bg-white px-5 py-3 text-sky-800 font-semibold hover:bg-sky-50"
              >
                Find your property & reserve
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl ring-1 ring-sky-100">
              <Image
                src="/bonfire2.jpg"
                alt="PCB Amenity Suite preview"
                width={900}
                height={600}
                className="h-64 w-full object-cover md:h-[300px]"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   PAGE
─────────────────────────────────────────────────────────── */
export default function PCBHomePage() {
  return (
    <main className="mx-auto max-w-[120rem]">
      {/* HERO */}
      <section className="relative isolate">
        <div className="relative h-[75vh] min-h-[700px] w-full overflow-hidden">
          <Image
            src="/hero16.jpg"
            alt="Panama City Beach — Coastal"
            fill
            className="object-cover translate-y-[-32px]"
            priority
            unoptimized
          />

          {/* Removed ALL gradient overlays */}
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-end px-6 md:px-10">
            <div className="pointer-events-auto w-full md:w-1/3">
              <PCBSelectorVertical />
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSEL — white section */}
      <section
        id="signature-services"
        className="mx-auto max-w-7xl px-5 md:px-8 mt-14 md:mt-16"
      >
        {/* Tight, clean heading */}
        <ServicesCarousel items={servicesItems} />
      </section>

      {/* PANAMA CITY BEACH — light blue band with CBS logo */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 mt-20 md:mt-24">
        <div className="relative rounded-[28px] border border-[#cfe0ea] bg-[#F5F9FF] p-6 md:p-10">
          <div className="grid gap-10 md:grid-cols-[1.1fr_.9fr] md:items-center">
            {/* LEFT */}
            <div>
              {/* brand row with CBS round logo */}
              <div className="flex items-center gap-3">
                <Image
                  src="/coastal-logo.png" // <- your round CBS logo
                  alt="Coastal Beach Services"
                  width={36}
                  height={36}
                  className="rounded-full ring-1 ring-[#cfe0ea]"
                  unoptimized
                />
                <div className="text-[12px] font-semibold tracking-[0.14em] text-[#005D9C] uppercase">
                  Emerald Coast • Since 1985
                </div>
              </div>

              <h2 className="mt-3 max-w-[22ch] text-[34px] md:text-[44px] leading-tight font-semibold text-[#005D9C]">
                Panama City Beach
              </h2>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[12.5px] font-medium text-[#005D9C]">
                <span className="rounded-full bg-white/70 px-3 py-1 border border-[#cfe0ea]">
                  30+ resorts & condos
                </span>
                <span className="h-3 w-px bg-[#cfe0ea]" />
                <span className="rounded-full bg-white/70 px-3 py-1 border border-[#cfe0ea]">
                  9 AM daily setup
                </span>
                <span className="h-3 w-px bg-[#cfe0ea]" />
                <span className="rounded-full bg-white/70 px-3 py-1 border border-[#cfe0ea]">
                  Sunset hours now available
                </span>
              </div>

              <p className="mt-5 max-w-prose text-[15.5px] leading-7 text-sky-900/95">
                Premium chairs, bonfires, photography, and watersports—delivered
                with the same standard, every day. Clear plans, smart weather
                calls, and no surprises at checkout.
              </p>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {[
                  "Transparent, weekly-capped pricing",
                  "Permits & logistics handled",
                  "Weather-smart adjustments",
                  "Property-manager trusted",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-start gap-2 text-[15px] text-sky-900"
                  >
                    <Dot />
                    <span>{t}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/pcb/condos"
                  className="rounded-xl bg-[#005D9C] px-5 py-3 text-white font-medium hover:opacity-95"
                >
                  Find your property & reserve
                </a>
                <a
                  href="/suite/pcb"
                  className="rounded-xl border border-[#cfe0ea] bg-white px-5 py-3 text-[#005D9C] font-medium hover:bg-white/70"
                >
                  Open Amenity Suite
                </a>
              </div>
            </div>

            {/* RIGHT image */}
            <div className="relative">
              <div className="relative h-80 md:h-[26rem] w-full overflow-hidden rounded-3xl border border-[#cfe0ea] bg-white shadow-[0_22px_70px_-30px_rgba(0,93,156,0.25)]">
                <Image
                  src="/pcb-staff1.jpg"
                  alt="Panama City Beach crew"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/45 to-transparent p-4">
                  <p className="text-[12px] text-white/90">
                    Trusted by property managers • Panama City Beach
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PCB Amenity Suite — airy card */}
      <AmenitySuitePromo_PCB />

      {/* LIVE CAMS — white section with tidy heading & 3-up grid */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 mt-20 mb-28">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#005D9C]">
            What’s Happening Now
          </div>
        </div>
        <h3 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-[#005D9C] mb-3">
          Live Beach Cams
        </h3>

        <div className="grid gap-5 md:grid-cols-3">
          {BEACH_CAMS.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="group overflow-hidden rounded-2xl border border-[#cfe0ea] bg-white shadow-[0_18px_60px_-40px_rgba(0,93,156,0.25)]"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  className="object-cover transition group-hover:scale-[1.02]"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-[15px] font-medium text-[#005D9C]">
                  {c.name}
                </div>
                <span className="text-[#005D9C]">Watch →</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

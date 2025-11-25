"use client";

import Image from "next/image";
import Hero from "@/components/Hero";
import ServicesCarousel from "@/components/ServicesCarousel";
import Legacy from "@/components/Legacy";
import HomeBookingBar from "@/components/HomeBookingBar";

/* Amenity Suite card — matches market pages, adds quick context + 30A/PCB CTAs */
function AmenitySuiteCard() {
  const PILLARS = ["Chairs", "Bonfires", "Photography", "Beach Better Box"];
  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-12">
      <div className="relative grid gap-8 rounded-[28px] bg-[#EEF7FD] ring-1 ring-[#CFE5F6] p-6 md:p-10 md:grid-cols-[1.15fr_.85fr]">
        {/* Left: copy */}
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b4f86]">
            Amenity Planning
          </div>
          <h2 className="mt-1 text-[32px] md:text-[36px] font-extrabold tracking-tight text-[#0b4f86]">
            Coastal Amenity Suite
          </h2>
          <p className="mt-3 text-[15.5px] leading-7 text-[#184B6E]">
            One polished place to plan your week—reserve chairs, bonfires,
            photography, and essentials with the same standard every day.
          </p>

          {/* Pillars */}
          <div className="mt-4 flex flex-wrap gap-2">
            {PILLARS.map((p) => (
              <span
                key={p}
                className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-[#0b4f86] ring-1 ring-[#CFE5F6]"
              >
                {p}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/suite/pcb"
              className="rounded-xl bg-[#005D9C] px-5 py-3 text-white font-semibold hover:opacity-95"
            >
              Open PCB Suite
            </a>
            <a
              href="/suite/30a"
              className="rounded-xl border-2 border-[#BFE1F6] bg-white px-5 py-3 text-[#0b4f86] font-semibold hover:bg-[#E9F4F9]"
            >
              Open 30A Suite
            </a>
          </div>
        </div>

        {/* Right: image */}
        <div className="relative">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-[320px]">
            <Image
              src="/bonfire2.jpg"
              alt="Coastal Amenity Suite preview"
              fill
              className="object-cover [object-position:center_40%]"
              priority={false}
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-[#CFE5F6]" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Live Beach Cams — unified card */
function BeachCamsBrand() {
  const CAMS = [
    {
      name: "Pineapple Willy's",
      href: "/beach-cams/pineapple-willys-pier",
      img: "/beach-cams/pineapple-cam.jpg",
    },
    {
      name: "Chateau Beachfront Hotel",
      href: "/beach-cams/chateau-hotel",
      img: "/beach-cams/chateau-cam.png",
    },
    {
      name: "Embassy Suites PCB",
      href: "/beach-cams/embassy-suites",
      img: "/beach-cams/embassy-cam.jpg",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-12">
      {/* Unified container */}
      <div className="rounded-[28px] ring-1 ring-[#D5EAF8] bg-[#F3F9FE] p-5 md:p-7">
        {/* Header row (kicker + title + CTA) */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b4f86]/80">
              What’s Happening Today
            </div>
            <h3 className="mt-0.5 text-[26px] md:text-[30px] font-semibold tracking-tight text-[#0b4f86]">
              Live Beach Cams
            </h3>
          </div>
          <a
            href="/beach-cams"
            className="inline-flex items-center gap-1 self-start rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-[#0b4f86] ring-1 ring-[#D5EAF8] hover:bg-[#E9F4F9] transition"
          >
            View beach cams
            <span aria-hidden>→</span>
          </a>
        </div>

        {/* Grid lives inside the same card */}
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {CAMS.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition hover:ring-slate-300 shadow-[0_18px_60px_-40px_rgba(0,93,156,0.25)]"
            >
              {/* Top image */}
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  unoptimized
                />
                {/* Live badge */}
                <span className="absolute left-3 top-3 rounded-full bg-[#0584C7] px-2 py-1 text-[11px] font-semibold text-white/95 tracking-wide">
                  LIVE
                </span>
                {/* Play hover cue */}
                <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="h-12 w-12 rounded-full bg-black/35 backdrop-blur-sm ring-1 ring-white/20 grid place-items-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path d="M8 5v14l11-7-11-7z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-[15px] font-medium text-[#0b4f86]">
                  {c.name}
                </div>
                <span className="text-[#0b4f86] text-[13px]">Watch →</span>
              </div>
            </a>
          ))}
        </div>

        {/* Subtle footnote line */}
        <div className="mt-4 text-[12.5px] text-[#0b4f86]/70">
          PCB shoreline — more markets coming soon
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const services = [
    {
      title: "Chairs & Umbrellas",
      blurb: "Daily setup & takedown—placed with care.",
      badge: "Signature Service",
      image: "/cards/chairs-30a.jpg",
      href: "/pcb/chairs",
    },
    {
      title: "Beach Bonfires",
      blurb: "Permits, fire, seating, & s’mores handled.",
      badge: "Signature Service",
      image: "/cards/bonfire.jpg",
      href: "/pcb/bonfires",
    },
    {
      title: "Jet Skis",
      blurb: "Thrill rides on the emerald water.",
      image: "/cards/jetski.jpg",
      href: "/pcb/jetskis",
    },
    {
      title: "Parasail",
      blurb: "Soar high with the safest crews on the coast.",
      image: "/cards/parasail.jpg",
      href: "/pcb/parasail",
    },
    {
      title: "Beach Better Box",
      blurb: "Cooler, towels & beach-day essentials—bundled.",
      image: "/cards/box.jpg",
      href: "/30a/beach-better-box",
    },
    {
      title: "Boat Rentals",
      blurb: "Pontoon days made easy.",
      image: "/cards/pontoon.jpg",
      href: "/pcb/boat-rentals",
    },
    {
      title: "Family Photography",
      blurb: "Golden-hour sessions, edited & delivered.",
      image: "/cards/photography2.png",
      href: "/pcb/photography",
    },
    {
      title: "Watersports (PCB)",
      blurb: "Parasail, jet skis, banana boat & more.",
      image: "/cards/watersports.jpg",
      href: "/pcb/water-sports",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* HERO with concierge booking bar overlay */}
      <section className="relative">
        <Hero
          images={["/hero3.jpg", "/bonfire2.jpg", "/chairs30a.jpg"]}
          interval={6000}
          scale={0.98} // <— dial the "zoom" (1 = none, 0.95 = show more, 1.05 = tighter)
        >
          <HomeBookingBar />
        </Hero>
      </section>

      {/* Signature Services */}
      <section
        id="services"
        className="relative z-[1] mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-12"
        aria-labelledby="sig-services"
      >
        <h2 id="sig-services" className="sr-only">
          Signature Services
        </h2>
        <ServicesCarousel
          items={services}
          kicker="Beach Essentials by Coastal"
          title="Signature Services – All in One Place."
        />
      </section>

      {/* Legacy — kept tight */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-12">
        <Legacy />
      </section>

      {/* Proper Amenity Suite card */}
      <AmenitySuiteCard />

      {/* Branded Beach Cams */}
      <BeachCamsBrand />
    </main>
  );
}

"use client";

import Image from "next/image";
import Hero from "@/components/Hero";
import ServicesCarousel from "@/components/ServicesCarousel";
import Legacy from "@/components/Legacy";
import HomeBookingBar from "@/components/HomeBookingBar";

/* ============================================================
   NEW — Amenity Suite (Full Width Premium Section)
   ============================================================ */
function AmenitySuiteSection() {
  const PILLARS = ["Chairs", "Bonfires", "Photography", "Beach Better Box"];

  return (
    <section className="relative w-full bg-[#F5FAFE] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* LEFT — COPY */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-800/80">
            Coastal Amenity Suite
          </div>

          <h2 className="mt-1 text-[34px] md:text-[40px] font-extrabold leading-tight text-sky-900">
            Plan Every Part of Your Week, Seamlessly.
          </h2>

          <p className="mt-4 text-[16px] leading-7 text-sky-900/80 max-w-md">
            Your entire vacation, organized in one place. Reserve chairs,
            bonfires, photography, and premium add-ons with the same standard of
            service every day.
          </p>

          {/* PILLARS */}
          <div className="mt-5 flex flex-wrap gap-2">
            {PILLARS.map((p) => (
              <span
                key={p}
                className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-sky-900 ring-1 ring-sky-200"
              >
                {p}
              </span>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="mt-7 flex gap-4">
            <a
              href="/suite/pcb"
              className="rounded-xl bg-sky-700 px-6 py-3 text-white font-semibold shadow-sm hover:bg-sky-800"
            >
              Open PCB Suite
            </a>

            <a
              href="/suite/30a"
              className="rounded-xl border-2 border-sky-200 bg-white px-6 py-3 text-sky-800 font-semibold hover:bg-sky-50"
            >
              Open 30A Suite
            </a>
          </div>
        </div>

        {/* RIGHT — IMAGE */}
        <div className="relative w-full h-[330px] md:h-[420px] rounded-3xl overflow-hidden shadow-lg">
          <Image
            src="/bonfire2.jpg"
            alt="Amenity Suite"
            fill
            className="object-cover [object-position:center_35%]"
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   NEW — Beach Cams Section (Editorial Grid)
   ============================================================ */
function BeachCamsSection() {
  const CAMS = [
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

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-900/60">
              What’s Happening Today
            </div>
            <h3 className="mt-1 text-[32px] md:text-[38px] font-bold text-sky-900">
              Live Beach Cams
            </h3>
          </div>

          <a
            href="/beach-cams"
            className="rounded-full border border-sky-200 bg-white px-4 py-2 text-[14px] font-semibold text-sky-700 hover:bg-sky-50"
          >
            View all cams →
          </a>
        </div>

        {/* GRID */}
        <div className="grid gap-6 md:grid-cols-3">
          {CAMS.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="group rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <div className="px-3 py-3 flex items-center justify-between">
                <div className="text-[16px] font-medium text-sky-900">
                  {c.name}
                </div>
                <span className="text-sky-700 text-[14px]">Watch →</span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 text-[13px] text-sky-800/60">
          PCB shoreline — more markets coming soon
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   MAIN HOMEPAGE EXPORT
   ============================================================ */
export default function HomePage() {
  const services = [
    {
      title: "Chairs & Umbrellas",
      blurb: "Daily setup & takedown—placed with care.",
      badge: "Signature Service",
      image: "/cards/chairs-day.jpg",
      href: "/pcb/chairs",
    },
    {
      title: "Beach Bonfires",
      blurb: "Permits, fire, seating, & s’mores handled.",
      badge: "Signature Service",
      image: "/beach-bonfires2.jpg",
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
      {/* HERO */}
      <section className="relative">
        <Hero
          images={["/hero-pcb1.jpg", "/chairs30a.jpg", "/hero.jpg"]}
          interval={6000}
          scale={1}
        >
          <HomeBookingBar />
        </Hero>
      </section>

      {/* SIGNATURE SERVICES */}
      <section
        id="services"
        className="relative z-[1] mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-12"
      >
        <h2 className="sr-only">Signature Services</h2>
        <ServicesCarousel
          items={services}
          kicker="Beach Essentials by Coastal"
          title="Signature Services – All in One Place."
        />
      </section>

      {/* LEGACY */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-12">
        <Legacy />
      </section>

      {/* NEW AMENITY SUITE SECTION */}
      <AmenitySuiteSection />

      {/* NEW BEACH CAMS SECTION */}
      <BeachCamsSection />
    </main>
  );
}

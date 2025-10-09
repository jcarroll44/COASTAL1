"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * PCB Homepage — refined brand vibe:
 * - Taller hero with gentle brand gradient, slimmer pill selector
 * - Roomier vertical rhythm, clearer type scale
 * - Carded carousel section to visually “separate” from neighbors
 * - No changes to Amenity Suite behavior or routes
 */

type Condo = { name: string; slug: string };

const CONDOS: Condo[] = [
  { name: "Aqua Beach Resort", slug: "aqua-beach-resort" },
  { name: "Calypso Tower III", slug: "calypso-3" },
  { name: "Splash Resort", slug: "splash" },
  // add more as needed
];

const SERVICES = [
  {
    title: "Chairs & Umbrellas",
    img: "/pcb-chairs.jpg",
    href: "/chairs",
    blurb: "Daily setup • capped weekly pricing",
  },
  {
    title: "Beach Bonfires",
    img: "/cards/bonfire.jpg",
    href: "/bonfires",
    blurb: "Permits, seating & s’mores handled",
  },
  {
    title: "Family Photography",
    img: "/cards/photo.jpg",
    href: "/photography",
    blurb: "Golden-hour sessions on the sand",
  },
  {
    title: "Watersports",
    img: "/cards/parasail.jpg",
    href: "/watersports",
    blurb: "Jet Skis • Parasail • Banana Boat",
  },
];

export default function PCBHomePage() {
  const router = useRouter();
  const [condoSlug, setCondoSlug] = useState<string>("");

  const selectedName = useMemo(
    () => CONDOS.find((c) => c.slug === condoSlug)?.name ?? "",
    [condoSlug]
  );

  function openSuite() {
    router.push(condoSlug ? `/suite/pcb?condo=${condoSlug}` : "/suite/pcb");
  }

  // carousel
  const trackRef = useRef<HTMLDivElement | null>(null);
  const scrollBy = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const delta = dir === "next" ? el.clientWidth * 0.9 : -el.clientWidth * 0.9;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-[120rem]">
      {/* ───────── Hero (taller, calmer, slim selector) ───────── */}
      <section className="relative isolate">
        <div className="relative h-[66vh] min-h-[640px] w-full overflow-hidden">
          <Image
            src="/hero-pcb.jpg"
            alt="Panama City Beach — Coastal"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* brand wash for a luxe feel */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_15%_85%,rgba(56,189,248,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950/35 via-sky-900/0 to-transparent" />
        </div>

        {/* Slim pill docks above fold, left — not blocking the hero */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-start px-6 md:px-10 pb-10">
          <div className="pointer-events-auto w-full max-w-3xl">
            <div className="rounded-full bg-white/85 backdrop-blur-md ring-1 ring-sky-100 shadow-[0_18px_58px_-24px_rgba(2,132,199,0.35)] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="hidden md:inline rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-sky-800">
                  PCB
                </span>
                <div className="flex-1">
                  <select
                    value={condoSlug}
                    onChange={(e) => setCondoSlug(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-sky-900 outline-none"
                  >
                    <option value="">Select your condo…</option>
                    {CONDOS.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={openSuite}
                  className="rounded-full bg-sky-800 px-5 py-2 text-[14px] font-semibold text-white hover:bg-sky-900"
                >
                  Open
                </button>
              </div>
            </div>
            <p className="mt-2 px-2 text-xs text-white/90 drop-shadow">
              {selectedName
                ? `Selected: ${selectedName}`
                : "Tip: choose your condo, then Open."}
            </p>
          </div>
        </div>
      </section>

      {/* generous spacer */}
      <div className="h-16 md:h-20" />

      {/* ───────── Credibility / CTA (bigger type, more air) ───────── */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold text-sky-700">
              <span>Since 1985</span>
              <span className="opacity-30">•</span>
              <span>Emerald Coast</span>
            </div>
            <h2 className="mt-5 text-[36px] md:text-[46px] leading-[1.08] font-black tracking-tight text-sky-950">
              Proudly servicing <span className="text-sky-600">30+ PCB</span>{" "}
              resorts & homes
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-sky-800/90 max-w-prose">
              Daily setup by 9 AM, sunset takedown, concierge adjustments
              anytime. Premium chairs, bonfires, photography, and
              watersports—handled with care.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/pcb/condos")}
                className="rounded-xl bg-sky-700 px-5 py-3 text-white font-semibold shadow hover:bg-sky-800"
              >
                Find your property & reserve
              </button>
              <button
                onClick={() => router.push("/suite/pcb")}
                className="rounded-xl border border-sky-200 bg-white px-5 py-3 text-sky-900 font-semibold hover:bg-sky-50"
              >
                Open Amenity Suite
              </button>
            </div>
          </div>

          <div className="relative h-80 md:h-[24rem] w-full overflow-hidden rounded-3xl border border-sky-100 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
            <Image
              src="/cards/pcb-staff.jpg"
              alt="Coastal attendants montage"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/45 to-transparent p-4">
              <p className="text-[12px] text-white/90">
                Panama City Beach • Trusted by property managers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* bigger spacer */}
      <div className="h-20 md:h-24" />

      {/* ───────── Signature Services — carded carousel section ───────── */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-[28px] border border-sky-100 bg-white/95 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)] p-6 md:p-9">
          <div className="mb-6 md:mb-8 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-600">
                Beach Essentials by Coastal
              </div>
              <h3 className="mt-1 text-[30px] md:text-[36px] font-black tracking-tight text-sky-950">
                Signature Services — All in One Place.
              </h3>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                aria-label="Previous"
                onClick={() => scrollBy("prev")}
                className="rounded-full border border-sky-200 bg-white px-3 py-2 text-sky-800 hover:bg-sky-50"
              >
                ‹
              </button>
              <button
                aria-label="Next"
                onClick={() => scrollBy("next")}
                className="rounded-full border border-sky-200 bg-white px-3 py-2 text-sky-800 hover:bg-sky-50"
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={trackRef}
            className="flex gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none]"
            style={{ scrollbarWidth: "none" }}
          >
            {SERVICES.map((s) => (
              <a
                key={s.title}
                href={s.href}
                className="snap-start w-[330px] md:w-[380px] shrink-0 overflow-hidden rounded-2xl border border-sky-100 bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={s.img}
                    alt={s.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-5 md:p-6">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-600">
                    Service
                  </div>
                  <div className="mt-1 text-[19px] md:text-[20px] font-semibold text-sky-900">
                    {s.title}
                  </div>
                  <div className="mt-1 text-[14px] leading-relaxed text-sky-700">
                    {s.blurb}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-sky-700">
                    View details <span className="translate-y-[1px]">›</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* big spacer */}
      <div className="h-20 md:h-24" />

      {/* ───────── Build Your Week Promo (separate, simple) ───────── */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="rounded-2xl border border-sky-100 bg-gradient-to-r from-white to-sky-50 p-6 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h4 className="text-[18px] md:text-[20px] font-semibold text-sky-900">
                Build Your Week
              </h4>
              <p className="text-[14px] text-sky-700">
                Bundle chairs, bonfire, and photography — one plan, one
                checkout.
              </p>
            </div>
            <button
              onClick={() => router.push("/suite/pcb")}
              className="w-full md:w-auto rounded-xl bg-sky-700 px-5 py-3 text-white font-semibold shadow hover:bg-sky-800"
            >
              Start in Amenity Suite
            </button>
          </div>
        </div>
      </section>

      {/* bottom spacer */}
      <div className="h-20 md:h-24" />

      {/* ───────── Footer quick-open ───────── */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-24">
        <div className="rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="text-sky-900 font-semibold">
              Already booked a home?
            </div>
            <div className="flex w-full items-stretch overflow-hidden rounded-full border border-sky-200 bg-white shadow-sm md:max-w-2xl">
              <select
                value={condoSlug}
                onChange={(e) => setCondoSlug(e.target.value)}
                className="flex-1 rounded-none border-0 px-5 py-2.5 text-[15px] text-sky-900 outline-none"
              >
                <option value="">Select your condo…</option>
                {CONDOS.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                onClick={openSuite}
                className="bg-sky-800 px-5 text-[14px] font-semibold text-white hover:bg-sky-900"
              >
                Open Suite
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

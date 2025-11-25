"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { getPropertiesByMarket, type PropertyConfig } from "@/data/properties";
import PropertyQuickJump from "@/components/PropertyQuickJump";
import PcbExtras from "@/pcb/PcbExtras";

/** Pricing knobs (same values you used on PCB suite) */
const PRICES = {
  chairSetWeek: 300, // $/week per set
  bonfire: 500,
  photo: 300,
};

type Day = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
const days: Day[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PropertySuite({
  property,
}: {
  property: PropertyConfig;
}) {
  // Local booking state
  const [chairSets, setChairSets] = useState<number>(2);
  const [bonfireDay, setBonfireDay] = useState<Day | null>(null);
  const [photoDay, setPhotoDay] = useState<Day | null>(null);
  const [email, setEmail] = useState<string>("");

  const total = useMemo(() => {
    let t = chairSets * PRICES.chairSetWeek;
    if (bonfireDay) t += PRICES.bonfire;
    if (photoDay) t += PRICES.photo;
    return t;
  }, [chairSets, bonfireDay, photoDay]);

  // Build options for the property quick-jump
  const jumpOptions = getPropertiesByMarket(property.market).map((p) => ({
    id: p.slug,
    name: p.name,
  }));

  // Market-specific hero for Chairs card (fallbacks are safe)
  const chairHero =
    property.market === "pcb" ? "/cards/chairs-pcb.jpg" : "/hero-30a.jpg";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* Top bar: title + property quick jump */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold tracking-tight text-sky-900">
          Amenity Suite — <span className="text-sky-700">{property.name}</span>
        </h1>

        <PropertyQuickJump market={property.market} options={jumpOptions} />
      </div>

      {/* Two-column layout (content + itinerary) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT: Content */}
        <div className="space-y-6">
          {/* CHAIRS (if enabled) */}
          {property.hasChairs && (
            <section className="rounded-2xl border border-sky-100 bg-white/95 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
              <div className="flex items-start justify-between p-5">
                <div>
                  <div className="text-lg font-semibold text-sky-900">
                    Beach Chairs &amp; Umbrellas
                  </div>
                  <div className="text-xs text-sky-600">
                    $55/day · ${PRICES.chairSetWeek}/week per set
                  </div>
                  <div className="mt-1 text-[11px] text-sky-500">
                    1 set = 2 chairs + 1 umbrella · placed for you
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChairSets((c) => Math.max(1, c - 1))}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sky-200 text-sky-700 hover:bg-sky-50"
                    aria-label="Decrease sets"
                  >
                    −
                  </button>
                  <div className="text-lg font-semibold text-sky-900">
                    {chairSets}
                  </div>
                  <button
                    onClick={() => setChairSets((c) => c + 1)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-sky-200 text-sky-700 hover:bg-sky-50"
                    aria-label="Increase sets"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-b-2xl">
                <Image
                  src={chairHero}
                  alt="Beach chairs"
                  width={1600}
                  height={1000}
                  className="h-[320px] w-full object-cover sm:h-[380px]"
                  priority
                />
              </div>
            </section>
          )}

          {/* BONFIRE (if enabled) */}
          {property.hasBonfire && (
            <section className="rounded-2xl border border-sky-100 bg-white/95 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
              <Image
                src="/cards/bonfire.jpg"
                alt="Beach Bonfire"
                width={1200}
                height={800}
                className="h-52 w-full rounded-t-2xl object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-sky-900">
                    Beach Bonfire
                  </div>
                  <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                    Include
                  </span>
                </div>
                <div className="text-xs text-sky-600">
                  From ${PRICES.bonfire} • pick a night
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {days.map((d) => (
                    <button
                      key={d}
                      onClick={() => setBonfireDay(d)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        bonfireDay === d
                          ? "border-sky-600 bg-sky-600 text-white"
                          : "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PHOTOGRAPHY (if enabled) */}
          {property.hasPhotography && (
            <section className="rounded-2xl border border-sky-100 bg-white/95 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
              <Image
                src="/cards/photo.jpg"
                alt="Family Photography"
                width={1200}
                height={800}
                className="h-52 w-full rounded-t-2xl object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-sky-900">
                    Family Photography
                  </div>
                  <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
                    Include
                  </span>
                </div>
                <div className="text-xs text-sky-600">
                  ${PRICES.photo} • 45–60 min
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {days.map((d) => (
                    <button
                      key={d}
                      onClick={() => setPhotoDay(d)}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        photoDay === d
                          ? "border-sky-600 bg-sky-600 text-white"
                          : "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PCB WATERSPORTS (if enabled) */}
          {property.market === "pcb" && property.hasWatersports && (
            <section className="xl:col-span-3">
              <PcbExtras />
            </section>
          )}

          {/* Bundle strip */}
          <div className="rounded-xl border border-sky-100 bg-white/80 p-4 text-center text-sm text-sky-700">
            <span className="font-semibold">💡 Bundle Deal:</span> Chairs +
            Beach Box →{" "}
            <span className="font-semibold text-sky-900">$600/week</span>{" "}
            <span className="text-sky-500">(Save $75)</span>
          </div>
        </div>

        {/* RIGHT: Itinerary rail */}
        <aside className="sticky top-6 h-max rounded-2xl border border-sky-100 bg-white/95 p-4 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
          <div className="mb-2 text-sm font-semibold text-sky-900">
            Your itinerary
          </div>
          <div className="divide-y divide-sky-100 text-sm">
            {/* Chairs */}
            {property.hasChairs && (
              <div className="py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sky-700">Chair sets</span>
                  <span className="font-semibold text-sky-900">
                    ${(chairSets * PRICES.chairSetWeek).toLocaleString()}
                  </span>
                </div>
                <div className="text-[11px] text-sky-500">
                  You’re booking {chairSets} set{chairSets > 1 ? "s" : ""}.
                </div>
              </div>
            )}

            {/* Bonfire */}
            {property.hasBonfire && (
              <div className="py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sky-700">Beach Bonfire</span>
                  <span className="font-semibold text-sky-900">
                    {bonfireDay ? `$${PRICES.bonfire.toLocaleString()}` : "$0"}
                  </span>
                </div>
                <div className="text-[11px] text-sky-500">
                  {bonfireDay ? `Scheduled: ${bonfireDay}` : "Not scheduled"}
                </div>
              </div>
            )}

            {/* Photo */}
            {property.hasPhotography && (
              <div className="py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sky-700">Family Photography</span>
                  <span className="font-semibold text-sky-900">
                    {photoDay ? `$${PRICES.photo.toLocaleString()}` : "$0"}
                  </span>
                </div>
                <div className="text-[11px] text-sky-500">
                  {photoDay ? `Scheduled: ${photoDay}` : "Not scheduled"}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 border-t border-sky-100 pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sky-700">Total</span>
              <span className="text-lg font-semibold text-sky-900">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="mt-3 w-full rounded-lg border border-sky-200 px-3 py-2 text-sm outline-none focus:border-sky-400"
          />
          <button className="mt-2 w-full rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800">
            Save &amp; email
          </button>

          <p className="mt-2 text-[11px] text-sky-500">
            Powered by Coastal. Plans can be updated anytime before arrival.
          </p>
        </aside>
      </div>
    </div>
  );
}
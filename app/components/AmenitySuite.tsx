// app/components/AmenitySuite.tsx
"use client";

import { useMemo, useState } from "react";
import Search30a from "@/components/Search30a";
import AmenityMap30A from "@/components/AmenityMap30A";

// Access list comes straight from /public (no fetch needed)
import accesses from "@/../public/CoastalAccess.json";

type Property = {
  name: string;
  address?: string;
  pm?: string;
  lat?: number;
  lng?: number;
  market?: "30a" | "pcb";
};

type Access = { name: string; slug?: string; lat: number; lng: number };

export default function AmenitySuite() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [chairSets, setChairSets] = useState<number>(2);
  const [bonfireDay, setBonfireDay] = useState<string | null>(null);
  const [photoDay, setPhotoDay] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  const PRICES = {
    chairWeekly: 300,
    bonfireFlat: 500,
    photoFlat: 300,
    bundleSavings: 75,
  };
  const chairSubtotal = chairSets * PRICES.chairWeekly;
  const bonfireSubtotal = bonfireDay ? PRICES.bonfireFlat : 0;
  const photoSubtotal = photoDay ? PRICES.photoFlat : 0;
  const total = chairSubtotal + bonfireSubtotal + photoSubtotal;

  const dayPills = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const propertyLabel = useMemo(() => {
    if (!selectedProperty) return "Select your home to personalize your suite";
    const { name, address, pm } = selectedProperty;
    return `${name} — ${address ?? ""}${pm ? ` (${pm})` : ""}`;
  }, [selectedProperty]);

  const homeForMap =
    selectedProperty?.lat != null && selectedProperty?.lng != null
      ? {
          name: selectedProperty.name,
          address: selectedProperty.address ?? "",
          lat: selectedProperty.lat!,
          lng: selectedProperty.lng!,
          pmCompany: selectedProperty.pm,
        }
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100">
      <main className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
        <div className="rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)] mb-6">
          <div className="p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-sky-900">
              30A Amenity Suite
            </h2>
            <div className="text-sky-700 text-sm">{propertyLabel}</div>
          </div>
        </div>

        <div className="relative z-40 rounded-2xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-[0_10px_30px_-20px_rgba(2,132,199,0.2)] p-4 mb-8">
          <Search30a onSelect={setSelectedProperty} />
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
          <div className="lg:col-span-2 rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)] overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-sky-900">
                    Beach Chairs & Umbrellas
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 border border-sky-100">
                      1 set = 2 chairs + 1 umbrella
                    </span>
                    <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 border border-sky-100">
                      ${PRICES.chairWeekly}/week per set
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChairSets((c) => Math.max(1, c - 1))}
                    className="rounded-full border border-sky-300 px-3 py-1 text-sky-700"
                    aria-label="Decrease sets"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-sky-900">
                    {chairSets}
                  </span>
                  <button
                    onClick={() => setChairSets((c) => c + 1)}
                    className="rounded-full border border-sky-300 px-3 py-1 text-sky-700"
                    aria-label="Increase sets"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-sky-100">
              <div className="relative">
                <div className="absolute left-4 top-4 z-10 bg-white/85 backdrop-blur px-3 py-1 rounded-xl text-sky-700 text-sm font-medium shadow-sm">
                  Beach Chairs & Umbrellas
                </div>
                <img
                  src="/cards/chairs-30a.jpg"
                  alt="Beach Chairs & Umbrellas"
                  className="object-cover w-full h-[380px]"
                />
              </div>

              <div className="relative">
                <AmenityMap30A
                  home={homeForMap}
                  accesses={accesses as Access[]}
                />
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1 bg-white/80 backdrop-blur-xl border border-sky-200 rounded-2xl p-6 shadow-[0_10px_30px_-20px_rgba(2,132,199,0.2)] sticky top-6 self-start">
            <h4 className="font-semibold mb-3 text-sky-900">Your itinerary</h4>
            <ul className="text-sm space-y-3">
              <li className="flex items-start justify-between">
                <span className="text-sky-800">
                  Chair sets
                  <span className="block text-xs text-sky-600/80">
                    {chairSets} set{chairSets > 1 ? "s" : ""} · $
                    {PRICES.chairWeekly}/week
                  </span>
                </span>
                <strong className="text-sky-900">${chairSubtotal}</strong>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-sky-800">
                  Beach Bonfire
                  <span className="block text-xs text-sky-600/80">
                    {bonfireDay ? `Scheduled: ${bonfireDay}` : "Not scheduled"}
                  </span>
                </span>
                <strong className="text-sky-900">
                  {bonfireDay ? `$${PRICES.bonfireFlat}` : "$0"}
                </strong>
              </li>
              <li className="flex items-start justify-between">
                <span className="text-sky-800">
                  Family Photography
                  <span className="block text-xs text-sky-600/80">
                    {photoDay ? `Scheduled: ${photoDay}` : "Not scheduled"}
                  </span>
                </span>
                <strong className="text-sky-900">
                  {photoDay ? `$${PRICES.photoFlat}` : "$0"}
                </strong>
              </li>
            </ul>

            <div className="border-t mt-4 pt-4 text-lg font-semibold flex items-center justify-between">
              <span className="text-sky-900">Total</span>
              <span className="text-sky-900">${total}</span>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="mt-4 w-full border border-sky-200 bg-white/70 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
            <button className="w-full mt-3 bg-sky-900 hover:bg-sky-950 text-white px-4 py-3 rounded-xl shadow-lg">
              Save & email
            </button>
            <p className="text-xs text-sky-500 mt-2">
              Powered by Coastal. Plans can be updated anytime before arrival.
            </p>
          </aside>
        </section>

        {/* lower cards omitted for brevity */}
      </main>
    </div>
  );
}

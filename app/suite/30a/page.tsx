// app/suite/30a/page.tsx
"use client";

import { useMemo, useState } from "react";
import Search30A from "@/components/Search30a";
import AmenityMap30A from "@/components/AmenityMap30A";
import accessesJson from "@/data/CoastalAccess.json";

type Property = {
  name: string;
  address?: string;
  pm?: string; // partner company (e.g., 30A Escapes)
  lat?: number;
  lng?: number;
  market?: "30a" | "pcb";
};

type Access = { name: string; lat: number; lng: number; type?: string };

// Haversine in meters
function haversineMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}

export default function AmenitySuite30A() {
  // ── State ────────────────────────────────────────────────────────────────────
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [chairSets, setChairSets] = useState<number>(2);
  const [bonfireDay, setBonfireDay] = useState<string | null>(null);
  const [photoDay, setPhotoDay] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  // NEW: date range for Beach Chair Service
  const [startDate, setStartDate] = useState<string>(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState<string>("");

  const accesses = accessesJson as unknown as Access[];

  // ── Pricing ─────────────────────────────────────────────────────────────────
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

  // Map shape
  const homeForMap =
    selectedProperty?.lat != null && selectedProperty?.lng != null
      ? {
          name: selectedProperty.name,
          address: selectedProperty.address ?? "",
          lat: selectedProperty.lat!,
          lng: selectedProperty.lng!,
          pmCompany: selectedProperty.pm ?? null,
        }
      : null;

  // Nearest access
  const nearestAccess = useMemo(() => {
    if (!homeForMap) return null;
    let best: { access: Access; dist: number } | null = null;
    for (const a of accesses) {
      const d = haversineMeters(
        { lat: homeForMap.lat, lng: homeForMap.lng },
        { lat: a.lat, lng: a.lng }
      );
      if (!best || d < best.dist) best = { access: a, dist: d };
    }
    return best?.access ?? null;
  }, [homeForMap, accesses]);

  const hasHome = Boolean(selectedProperty);
  const endMin = startDate || undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100">
      {/* breathing room below site header */}
      <main className="max-w-7xl mx-auto px-5 md:px-8 pb-20 pt-6 md:pt-10">
        {/* ───────────────── Top: Search (before) OR Premium Header (after) ───────── */}
        {hasHome ? (
          <div className="rounded-3xl border border-sky-100 bg-white/85 backdrop-blur-xl shadow-[0_24px_60px_-28px_rgba(2,132,199,0.30)] mb-8">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                <div>
                  {/* brand line */}
                  <div className="text-[11px] tracking-[0.22em] uppercase text-sky-500/90">
                    Coastal&nbsp;Beach&nbsp;Company
                  </div>

                  {/* Home name */}
                  <h1 className="mt-2 font-sans font-semibold text-3xl md:text-4xl leading-[1.1] tracking-tight text-sky-950">
                    {selectedProperty!.name}
                  </h1>

                  {/* Address */}
                  {selectedProperty!.address && (
                    <p className="mt-1 text-sm md:text-base text-sky-700/95">
                      {selectedProperty!.address}
                    </p>
                  )}
                </div>

                {/* Chips and action */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {selectedProperty.pm && (
  <span className="mr-3 font-medium text-sky-800">
    {selectedProperty.pm}
  </span>
)}
                  {nearestAccess && (
                    <span className="inline-flex items-center rounded-full border border-sky-100 bg-white px-3 py-1.5 text-sm text-sky-900 shadow-[0_1px_0_0_rgba(2,132,199,0.06)]">
                      Closest access:
                      <span className="ml-1 font-medium">
                        {nearestAccess.name}
                      </span>
                    </span>
                  )}
                  <button
                    aria-label="Change home"
                    onClick={() => {
                      setSelectedProperty(null);
                      setStartDate("");
                      setEndDate("");
                    }}
                    className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50 px-3 py-1.5 text-sm text-sky-900 hover:bg-sky-100 transition"
                  >
                    Change home
                  </button>
                </div>
              </div>

              {/* subtle divider */}
              <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-sky-100 to-transparent" />

              {/* Beach Chair Service date range */}
              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3 md:items-end">
                <div className="md:col-span-1">
                  <p className="text-xs tracking-wide uppercase text-sky-600/80">
                    Beach Chair Service
                  </p>
                  <p className="text-sm text-sky-800/90">
                    Choose your start and end dates.
                  </p>
                </div>

                <label className="flex flex-col">
                  <span className="mb-1 text-xs font-medium text-sky-800/90">
                    Start date
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      const v = e.target.value;
                      setStartDate(v);
                      if (endDate && v && endDate < v) setEndDate("");
                    }}
                    className="h-11 rounded-xl border border-sky-200/80 bg-white/80 px-3 text-sky-900 shadow-[0_1px_0_0_rgba(2,132,199,0.05)] focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="mb-1 text-xs font-medium text-sky-800/90">
                    End date
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={endMin}
                    className="h-11 rounded-xl border border-sky-200/80 bg-white/80 px-3 text-sky-900 shadow-[0_1px_0_0_rgba(2,132,199,0.05)] focus:outline-none focus:ring-2 focus:ring-sky-300"
                  />
                </label>
              </div>
            </div>
          </div>
        ) : (
          // Search card (only before selection)
          // NOTE: z-index bump so the autocomplete menu always overlays cards below.
          <div className="relative z-[120] rounded-3xl border border-sky-100 bg-white/85 backdrop-blur-xl shadow-[0_24px_60px_-28px_rgba(2,132,199,0.30)] mb-8">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold text-sky-950">
                  30A Amenity Suite
                </h1>
                <div className="text-sm text-sky-700/75">
                  Select your home to personalize your suite.
                </div>
              </div>
              {/* wrapper must be positioned and above all other sections */}
              <div className="mt-4 relative z-[200]">
                <Search30A onSelect={setSelectedProperty} />
              </div>
            </div>
          </div>
        )}

        {/* ───────────────── Top row: Chairs & Map / Itinerary ─────────────────── */}
        {/* Put the next section at a lower z to respect the search dropdown overlay */}
        <section className="relative z-[0] grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
          {/* LEFT (span 2): Beach Chairs & Umbrellas + Map */}
          <div className="lg:col-span-2 rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_-30px_rgba(2,132,199,0.25)] overflow-hidden">
            {/* Header */}
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

                {/* Qty controls */}
                <div className="flex items-center gap-3">
                  <button
                    aria-label="Decrease sets"
                    onClick={() => setChairSets((c) => Math.max(1, c - 1))}
                    className="rounded-full border border-sky-300 px-3 py-1 text-sky-700"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-sky-900">
                    {chairSets}
                  </span>
                  <button
                    aria-label="Increase sets"
                    onClick={() => setChairSets((c) => c + 1)}
                    className="rounded-full border border-sky-300 px-3 py-1 text-sky-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Photo + Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-sky-100 p-4">
              {/* Photo */}
              <div className="relative rounded-xl overflow-hidden ring-1 ring-slate-200">
                <div className="absolute left-4 top-4 z-10 bg-white/85 backdrop-blur px-3 py-1 rounded-xl text-sky-700 text-sm font-medium shadow-sm">
                  Beach Chairs & Umbrellas
                </div>
                <img
                  src="/cards/chairs-30a.jpg"
                  alt="Beach Chairs & Umbrellas"
                  className="object-cover w-full h-[380px]"
                />
              </div>

              {/* Map (Mapbox) */}
              <div className="relative rounded-xl overflow-hidden ring-1 ring-slate-200">
                <AmenityMap30A home={homeForMap} accesses={accesses} />
              </div>
            </div>
          </div>

          {/* RIGHT: Itinerary */}
          <aside className="lg:col-span-1 bg-white/80 backdrop-blur-xl border border-sky-200 rounded-2xl p-6 shadow-[0_10px_30px_-20px_rgba(2,132,199,0.2)] sticky top-6 self-start">
            <h4 className="font-semibold mb-3 text-sky-900">Your itinerary</h4>
            <ul className="text-sm space-y-3">
              <li className="flex items-start justify-between">
                <span className="text-sky-800">
                  Chair sets
                  <span className="block text-xs text-sky-600/80">
                    {chairSets} set{chairSets > 1 ? "s" : ""} · $
                    {PRICES.chairWeekly}/week
                    {startDate && endDate ? ` · ${startDate}–${endDate}` : ""}
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

        {/* Lower cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Beach Better Box */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl hover:shadow-[0_20px_50px_-30px_rgba(2,132,199,0.3)] transition overflow-hidden">
            <div className="relative">
              <div className="absolute left-4 top-4 z-10 bg-white/85 backdrop-blur px-3 py-1 rounded-xl text-sky-700 text-sm font-medium shadow-sm">
                Beach Better Box
              </div>
              <img
                src="/cards/box.jpg"
                alt="Beach Better Box"
                className="object-cover w-full h-56"
              />
            </div>
            <div className="p-5">
              <p className="text-sky-600 text-sm">$75/day · $375/week</p>
              <div className="mt-4 flex items-center justify-between">
                <button className="rounded-xl border border-sky-300 text-sky-700 px-4 py-2">
                  Details
                </button>
                <button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2">
                  Include
                </button>
              </div>
            </div>
          </div>

          {/* Bonfire */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl hover:shadow-[0_20px_50px_-30px_rgba(2,132,199,0.3)] transition overflow-hidden">
            <div className="relative">
              <div className="absolute left-4 top-4 z-10 bg-white/85 backdrop-blur px-3 py-1 rounded-xl text-sky-700 text-sm font-medium shadow-sm">
                Bonfire Experience
              </div>
              <img
                src="/cards/bonfire.jpg"
                alt="Bonfire"
                className="object-cover w-full h-56"
              />
            </div>
            <div className="p-5">
              <p className="text-sky-600 text-sm">Packages available</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {dayPills.map((d) => (
                  <button
                    key={d}
                    onClick={() => setBonfireDay(d === bonfireDay ? null : d)}
                    className={[
                      "px-3 py-1 rounded-full text-sm border",
                      bonfireDay === d
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-gray-100 text-gray-700 border-gray-200",
                    ].join(" ")}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button className="rounded-xl border border-sky-300 text-sky-700 px-4 py-2">
                  View Packages
                </button>
                <button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2">
                  {bonfireDay ? "Included" : "Include"}
                </button>
              </div>
            </div>
          </div>

          {/* Photography */}
          <div className="rounded-3xl border border-sky-100 bg-white/80 backdrop-blur-xl hover:shadow-[0_20px_50px_-30px_rgba(2,132,199,0.3)] transition overflow-hidden">
            <div className="relative">
              <div className="absolute left-4 top-4 z-10 bg-white/85 backdrop-blur px-3 py-1 rounded-xl text-sky-700 text-sm font-medium shadow-sm">
                Family Photography
              </div>
              <img
                src="/cards/photo.jpg"
                alt="Family Photography"
                className="object-cover w-full h-56"
              />
            </div>
            <div className="p-5">
              <p className="text-sky-600 text-sm">
                ${PRICES.photoFlat} · 45–60 min
              </p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {dayPills.map((d) => (
                  <button
                    key={d}
                    onClick={() => setPhotoDay(d === photoDay ? null : d)}
                    className={[
                      "px-3 py-1 rounded-full text-sm border",
                      photoDay === d
                        ? "bg-sky-600 text-white border-sky-600"
                        : "bg-gray-100 text-gray-700 border-gray-200",
                    ].join(" ")}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button className="rounded-xl border border-sky-300 text-sky-700 px-4 py-2">
                  View Options
                </button>
                <button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-4 py-2">
                  {photoDay ? "Included" : "Include"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Bundle strip */}
        <section className="mt-10">
          <div className="bg-white/80 backdrop-blur-xl border border-sky-200 rounded-2xl p-6 text-center shadow-[0_10px_30px_-20px_rgba(2,132,199,0.2)]">
            <p className="text-sky-800 font-medium">
              💡 Bundle Deal: Chairs + Beach Box →{" "}
              <span className="font-semibold text-sky-700">$600/week</span>{" "}
              <span className="text-sky-600">
                (Save ${PRICES.bundleSavings})
              </span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

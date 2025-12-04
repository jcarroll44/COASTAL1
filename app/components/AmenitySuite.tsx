"use client";

import { useMemo, useState } from "react";
import Search30a from "@/components/Search30a";
import MapPanel30A from "@/components/MapPanel30A";
import AmenityPackages from "@/components/AmenityPackages"; // <- packages tab
import accesses from "@/../public/CoastalAccess.json";

/* PM company → logo file in /public/logos/* */
const PM_LOGOS: Record<string, { src: string; alt: string }> = {
  "30A Escapes": { src: "/logos/30a-escapes1.png", alt: "30A Escapes" },
};

/* ───────── types ───────── */
type Property = {
  name: string;
  address?: string;
  pm?: string;
  lat?: number;
  lng?: number;
  market?: "30a" | "pcb";
};
type Access = { name: string; slug?: string; lat: number; lng: number };

/* ───────── helpers ───────── */
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMES = [
  "5:00 pm",
  "5:30 pm",
  "6:00 pm",
  "6:30 pm",
  "7:00 pm",
  "7:30 pm",
];

function DayChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs ${
        active
          ? "border-sky-400 bg-sky-50 text-sky-900"
          : "border-sky-200 bg-white text-sky-700 hover:bg-sky-50"
      }`}
    >
      {label}
    </button>
  );
}
function toISODate(d: Date) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}
function haversineMiles(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.7613;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
}

/* ───────── main component ───────── */
export default function AmenitySuite() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  // tabs: "packages" | "individual"
  const [view, setView] = useState<"packages" | "individual">("packages");

  // chairs
  const [chairSets, setChairSets] = useState<number>(2);
  const todayISO = toISODate(new Date());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // add-ons
  const [bonfireDay, setBonfireDay] = useState<string | null>(null);
  const [bonfireTime, setBonfireTime] = useState<string | null>(null);
  const [photoDay, setPhotoDay] = useState<string | null>(null);
  const [photoTime, setPhotoTime] = useState<string | null>(null);

  // selected access in the dropdown
  const [selectedAccessSlug, setSelectedAccessSlug] = useState<string | null>(
    null
  );

  // map style toggle
  const MAP_STYLES = {
    road: "mapbox://styles/mapbox/streets-v12",
    sat: "mapbox://styles/mapbox/satellite-streets-v12",
  };
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.road);

  // pricing
  const PRICES = { chairWeekly: 300, bonfireFlat: 500, photoFlat: 300 };
  const chairSubtotal = chairSets * PRICES.chairWeekly;
  const bonfireSubtotal = bonfireDay ? PRICES.bonfireFlat : 0;
  const photoSubtotal = photoDay ? PRICES.photoFlat : 0;
  const total = chairSubtotal + bonfireSubtotal + photoSubtotal;

  function handleCheckout() {
    const payload = {
      market: "30a",
      home: selectedProperty?.name ?? null,
      address: selectedProperty?.address ?? null,
      pm: selectedProperty?.pm ?? null,
      chairSets,
      dates: startDate && endDate ? { start: startDate, end: endDate } : null,
      bonfire: bonfireDay
        ? {
            day: bonfireDay,
            time: bonfireTime ?? "TBD",
            price: PRICES.bonfireFlat,
          }
        : null,
      photography: photoDay
        ? { day: photoDay, time: photoTime ?? "TBD", price: PRICES.photoFlat }
        : null,
      total,
    };
    try {
      sessionStorage.setItem("coastal.checkout", JSON.stringify(payload));
    } catch {}
    window.location.href = "/checkout";
  }

  // property object for the map (only when we actually have coords)
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

  // compute nearest access (for the select's "auto" label)
  const nearestAccess = useMemo(() => {
    if (!homeForMap) return null;
    let best: Access | null = null,
      bestD = Infinity;
    for (const a of accesses as Access[]) {
      const d = haversineMiles(
        { lat: homeForMap.lat, lng: homeForMap.lng },
        { lat: a.lat, lng: a.lng }
      );
      if (d < bestD) {
        bestD = d;
        best = a;
      }
    }
    return best;
  }, [homeForMap]);

  const autoOptionLabel = nearestAccess
    ? `${nearestAccess.name}`
    : "Closest beach access (auto)";

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        {/* Top header card (unchanged) */}
        <section
          className={`mt-8 mb-4 rounded-3xl border border-sky-100 p-4 md:p-5 relative z-30 shadow-[0_20px_50px_-30px_rgba(2,132,199,0.18)] transition-colors
${selectedProperty ? "bg-sky-50/80" : "bg-white/95 backdrop-blur-xl"}`}
        >
          {!selectedProperty ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-[22px] md:text-[26px] font-extrabold tracking-tight text-sky-900">
                  Coastal Beach Company
                </h1>
              </div>
              <div className="relative mt-3 z-40">
                <Search30a
                  onSelect={setSelectedProperty}
                  placeholder="Enter your rental address or home name…"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {selectedProperty.pm && PM_LOGOS[selectedProperty.pm] ? (
                    <img
                      src={PM_LOGOS[selectedProperty.pm].src}
                      alt={PM_LOGOS[selectedProperty.pm].alt}
                      className="h-20 w-auto shrink-0"
                    />
                  ) : null}
                  <div className="truncate">
                    <div className="text-[22px] md:text-[26px] font-extrabold text-sky-900 leading-tight truncate">
                      {selectedProperty.name}
                    </div>
                    {selectedProperty.address && (
                      <div className="mt-0.5 text-sm text-sky-700 truncate">
                        {selectedProperty.address}
                      </div>
                    )}
                    {selectedProperty.pm && !PM_LOGOS[selectedProperty.pm] && (
                      <div className="mt-2 inline-flex items-center gap-2 text-xs">
                        <span className="rounded-full border border-sky-200 bg-white px-2 py-0.5 font-semibold text-sky-700">
                          PM: {selectedProperty.pm}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-800 hover:bg-sky-50 shrink-0"
                  onClick={() => {
                    setSelectedProperty(null);
                    setSelectedAccessSlug(null);
                  }}
                >
                  Change home
                </button>
              </div>
            </>
          )}
        </section>

        {/* Tiny two-tab switcher */}
        <div className="mb-3 flex items-center gap-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
            Amenity Planning
          </div>
          <div className="ml-auto inline-flex rounded-full bg-sky-50 p-1 ring-1 ring-sky-100">
            <button
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                view === "packages"
                  ? "bg-white text-sky-900 ring-1 ring-sky-200 shadow-sm"
                  : "text-sky-700"
              }`}
              onClick={() => setView("packages")}
            >
              Packages
            </button>
            <button
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                view === "individual"
                  ? "bg-white text-sky-900 ring-1 ring-sky-200 shadow-sm"
                  : "text-sky-700"
              }`}
              onClick={() => setView("individual")}
            >
              Build Individually
            </button>
          </div>
        </div>

        {/* View content */}
        {view === "packages" ? (
          <AmenityPackages market="30a" />
        ) : (
          <>
            {/* ORIGINAL INDIVIDUAL SUITE CONTENT */}
            <section className="relative z-[10] mb-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              {/* Left: Chairs + Photo + Map */}
              <div className="overflow-visible rounded-3xl border border-sky-100 bg-white/95 backdrop-blur-xl shadow-[0_18px_50px_-30px_rgba(2,132,199,0.18)] lg:col-span-2">
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

                    {/* quantity */}
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

                  {/* Dates + Access select */}
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <label className="flex flex-col">
                      <span className="text-xs font-semibold text-sky-900">
                        Start date
                      </span>
                      <input
                        type="date"
                        min={todayISO}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-sky-200 bg-white px-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                      />
                    </label>

                    <label className="flex flex-col">
                      <span className="text-xs font-semibold text-sky-900">
                        End date
                      </span>
                      <input
                        type="date"
                        min={startDate || todayISO}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-sky-200 bg-white px-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                      />
                    </label>

                    <label className="flex flex-col">
                      <span className="text-xs font-semibold text-sky-900">
                        Beach access
                      </span>
                      <div className="relative">
                        <select
                          value={selectedAccessSlug ?? ""}
                          onChange={(e) =>
                            setSelectedAccessSlug(
                              e.target.value ? e.target.value : null
                            )
                          }
                          className="mt-1 h-10 w-full appearance-none rounded-lg border border-sky-200 bg-white px-3 pr-9 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                        >
                          <option value="">{autoOptionLabel}</option>
                          {(accesses as Access[]).map((a) => (
                            <option
                              key={a.slug ?? a.name}
                              value={a.slug ?? a.name}
                            >
                              {a.name}
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                          ▾
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Photo + Map */}
                <div className="grid grid-cols-1 gap-2 border-t border-sky-100 p-2 md:grid-cols-2">
                  {/* photo */}
                  <div className="relative overflow-hidden rounded-xl ring-1 ring-slate-200">
                    <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-sky-800 shadow-[0_6px_20px_-12px_rgba(2,132,199,0.45)] ring-1 ring-sky-100 backdrop-blur">
                      <svg
                        className="h-4 w-4 opacity-80"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.828a2 2 0 00-.586-1.414l-3.828-3.828A2 2 0 0012.172 2H4zm8 0v4a2 2 0 002 2h4" />
                      </svg>
                      Beach Chairs & Umbrellas
                    </div>
                    <img
                      src="/cards/chairs-day.jpg"
                      alt="Beach Chairs & Umbrellas"
                      className="h-[380px] w-full object-cover"
                    />
                  </div>

                  {/* map + toggle */}
                  <div className="relative overflow-hidden rounded-xl ring-1 ring-slate-200">
                    <div className="absolute right-3 top-3 z-10 flex gap-2">
                      <button
                        onClick={() => setMapStyle(MAP_STYLES.road)}
                        className={`rounded-full border px-3 py-1 text-xs ${
                          mapStyle === MAP_STYLES.road
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-sky-200 bg-white text-sky-700"
                        }`}
                      >
                        Map
                      </button>
                      <button
                        onClick={() => setMapStyle(MAP_STYLES.sat)}
                        className={`rounded-full border px-3 py-1 text-xs ${
                          mapStyle === MAP_STYLES.sat
                            ? "border-sky-600 bg-sky-600 text-white"
                            : "border-sky-200 bg-white text-sky-700"
                        }`}
                      >
                        Satellite
                      </button>
                    </div>

                    <MapPanel30A
                      property={homeForMap ?? undefined}
                      accesses={accesses as Access[]}
                      styleUrl={mapStyle}
                      height={380}
                    />
                  </div>
                </div>
              </div>

              {/* Itinerary */}
              <aside className="sticky top-6 self-start rounded-2xl border border-sky-200 bg-white p-6 shadow-[0_10px_30px_-20px_rgba(2,132,199,0.16)]">
                <h4 className="mb-3 font-semibold text-sky-900">
                  Your itinerary
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start justify-between">
                    <span className="text-sky-800">
                      Chair sets
                      <span className="block text-xs text-sky-600/80">
                        {chairSets} set{chairSets > 1 ? "s" : ""} · $
                        {PRICES.chairWeekly}/week
                      </span>
                      {(startDate || endDate) && (
                        <span className="mt-0.5 block text-xs text-sky-600/80">
                          {startDate || "—"} → {endDate || "—"}
                        </span>
                      )}
                    </span>
                    <strong className="text-sky-900">${chairSubtotal}</strong>
                  </li>

                  <li className="flex items-start justify-between">
                    <span className="text-sky-800">
                      Beach Bonfire
                      <span className="block text-xs text-sky-600/80">
                        {bonfireDay
                          ? `${bonfireDay}${
                              bonfireTime ? ` • ${bonfireTime}` : ""
                            }`
                          : "Not scheduled"}
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
                        {photoDay
                          ? `${photoDay}${photoTime ? ` • ${photoTime}` : ""}`
                          : "Not scheduled"}
                      </span>
                    </span>
                    <strong className="text-sky-900">
                      {photoDay ? `$${PRICES.photoFlat}` : "$0"}
                    </strong>
                  </li>
                </ul>

                <div className="mt-4 border-t pt-4 text-lg font-semibold">
                  <div className="flex items-center justify-between">
                    <span className="text-sky-900">Total</span>
                    <span className="text-sky-900">${total}</span>
                  </div>
                </div>

                <button
                  className="mt-4 w-full rounded-xl bg-sky-900 px-5 py-3 font-semibold text-white hover:bg-sky-950"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
                <p className="mt-2 text-xs text-sky-500">
                  Powered by Coastal. Plans can be updated anytime before
                  arrival.
                </p>
              </aside>
            </section>

            {/* Concierge band */}
            <section className="mb-6">
              <div className="rounded-2xl border border-sky-100 bg-white px-4 py-4 md:flex md:items-center md:justify-between">
                <div className="text-sm text-sky-900">
                  <span className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                    Concierge
                  </span>
                  Top-notch service booking concierge. Questions, special
                  requests, or large groups? We’ll arrange it.
                </div>
                <div className="mt-2 flex gap-2 md:mt-0">
                  <a
                    href="tel:18503121551"
                    className="rounded-full border border-sky-200 bg-white px-3 py-1 text-sm text-sky-800"
                  >
                    850-312-1551
                  </a>
                  <a
                    href="/build"
                    className="rounded-full bg-sky-700 px-3 py-1 text-sm font-semibold text-white hover:bg-sky-800"
                  >
                    Build Your Week
                  </a>
                </div>
              </div>
            </section>

            {/* Add-on cards */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Beach Better Box */}
              <article className="overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-sm">
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src="/cards/box.jpg"
                    alt="Beach Better Box"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sky-900 font-semibold">
                    Beach Better Box
                  </h4>
                  <p className="text-sky-700 text-sm">
                    Custom • curated • cooler, toys, games, and beach-day
                    upgrades.
                  </p>
                  <div className="mt-3">
                    <a
                      href="/beach-better-box"
                      className="rounded-full border border-sky-200 bg-white px-3 py-1 text-sm text-sky-800 hover:bg-sky-50"
                    >
                      Details
                    </a>
                  </div>
                </div>
              </article>

              {/* Bonfire */}
              <article className="overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-sm">
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src="/bonfire2.jpg"
                    alt="Beach Bonfire"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sky-900 font-semibold">
                        Beach Bonfire
                      </h4>
                      <p className="text-sky-700 text-sm">
                        ${PRICES.bonfireFlat} • pick a night
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dayLabels.map((d) => (
                      <DayChip
                        key={d}
                        label={d}
                        active={bonfireDay === d}
                        onClick={() =>
                          setBonfireDay(bonfireDay === d ? null : d)
                        }
                      />
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-sky-900">
                      Preferred time
                    </label>
                    <select
                      value={bonfireTime ?? ""}
                      onChange={(e) => setBonfireTime(e.target.value || null)}
                      className="mt-1 h-9 w-full rounded-lg border border-sky-200 bg-white px-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                    >
                      <option value="">Select time…</option>
                      {TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>

              {/* Family Photography */}
              <article className="overflow-hidden rounded-2xl border border-sky-100 bg-white/95 shadow-sm">
                <div className="relative aspect-[16/10] w-full">
                  <img
                    src="/cards/photo-mini.jpg"
                    alt="Family Photography"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sky-900 font-semibold">
                        Family Photography
                      </h4>
                      <p className="text-sky-700 text-sm">
                        ${PRICES.photoFlat} • 45–60 min
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {dayLabels.map((d) => (
                      <DayChip
                        key={d}
                        label={d}
                        active={photoDay === d}
                        onClick={() => setPhotoDay(photoDay === d ? null : d)}
                      />
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="text-xs font-semibold text-sky-900">
                      Preferred time
                    </label>
                    <select
                      value={photoTime ?? ""}
                      onChange={(e) => setPhotoTime(e.target.value || null)}
                      className="mt-1 h-9 w-full rounded-lg border border-sky-200 bg-white px-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                    >
                      <option value="">Select time…</option>
                      {TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import condos from "../../data/condos.json"; // ✅ master list

/* ───────────────── TYPES ───────────────── */
type Condo = {
  name: string;
  address: string;
  slug: string;
  logo?: string;
  market?: string; // "pcb" | "30a"
};

/* ───────────────── PRICING ───────────────── */
const PRICES = {
  chairsDay: 55,
  chairsWeekCap: 300,
  bonfire: 500,
  photo: 300,
};

/* ───────────────── UTILITIES ───────────────── */
function toISODate(d: Date) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  return x.toISOString().slice(0, 10);
}
function diffDaysInclusive(start: string, end: string) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  s.setHours(12, 0, 0, 0);
  e.setHours(12, 0, 0, 0);
  const ms = e.getTime() - s.getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / 86400000) + 1;
}
function chairsPricePerSet(days: number) {
  if (days <= 0) return 0;
  return Math.min(days * PRICES.chairsDay, PRICES.chairsWeekCap);
}

/* ───────────────── PAGE ───────────────── */
export default function PCBAmenitySuitePage() {
  const searchParams = useSearchParams();
  const condoSlugParam = searchParams.get("condo") || "";

  // Only PCB condos for this page
  const PCB_CONDOS: Condo[] = useMemo(
    () =>
      (condos as Condo[])
        .filter((c) => (c.market ?? "pcb") === "pcb")
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  /* Condo selection */
  const [query, setQuery] = useState("");
  const [selectedCondo, setSelectedCondo] = useState<Condo | null>(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // 1) Preselect if condo=?slug in URL
  useEffect(() => {
    if (!condoSlugParam) return;
    const m = PCB_CONDOS.find((c) => c.slug === condoSlugParam);
    if (m) {
      setSelectedCondo(m);
      setQuery(m.name);
      setOpen(false);
    }
  }, [condoSlugParam, PCB_CONDOS]);

  // 2) Preselect if coming from the property finder (sessionStorage handoff)
  useEffect(() => {
    if (selectedCondo) return;
    try {
      const raw = sessionStorage.getItem("coastal.selectedCondo");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Condo;
      if (parsed?.slug) {
        const m = PCB_CONDOS.find((c) => c.slug === parsed.slug);
        if (m) {
          setSelectedCondo(m);
          setQuery(m.name);
          setOpen(false);
        }
      }
    } catch {}
  }, [selectedCondo, PCB_CONDOS]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PCB_CONDOS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, PCB_CONDOS]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* Booking state */
  const [chairSets, setChairSets] = useState(1); // start at 1
  const todayISO = toISODate(new Date());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bonfireDay, setBonfireDay] = useState<string | null>(null);
  const [photoDay, setPhotoDay] = useState<string | null>(null);

  const days = useMemo(
    () => diffDaysInclusive(startDate, endDate),
    [startDate, endDate]
  );
  const chairsSubtotal = useMemo(
    () => chairsPricePerSet(days) * Math.max(0, chairSets || 0),
    [days, chairSets]
  );
  const subtotal =
    chairsSubtotal +
    (bonfireDay ? PRICES.bonfire : 0) +
    (photoDay ? PRICES.photo : 0);

  function handleCheckout() {
    const payload = {
      condo: selectedCondo?.name ?? query,
      chairSets,
      startDate,
      endDate,
      bonfireDay,
      photoDay,
      total: subtotal,
    };
    sessionStorage.setItem("coastal.checkout", JSON.stringify(payload));
    window.location.href = "/checkout";
  }

  /* Day chip for add-ons */
  const DayChip = ({
    label,
    active,
    onClick,
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
  }) => (
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

  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 py-8">
      {/* ───────── Header ───────── */}
      {!selectedCondo ? (
        <div className="rounded-2xl border border-sky-100 bg-white/90 shadow-[0_14px_40px_-24px_rgba(2,132,199,0.25)] p-5">
          <h1 className="mb-3 text-2xl md:text-3xl font-bold text-sky-900 tracking-tight">
            Panama City Beach Amenity Suite
          </h1>
          <div ref={wrapperRef} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                const v = e.target.value.replace(/^\s+/, "");
                setQuery(v);
                setOpen(v.length >= 1);
              }}
              onFocus={() => query.length >= 1 && setOpen(true)}
              placeholder="Search your condo by name or address…"
              className="w-full rounded-lg border border-sky-200 bg-white/85 px-4 py-2 text-sm shadow-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
            {open && filtered.length > 0 && (
              <ul className="absolute left-0 right-0 mt-2 max-h-72 overflow-y-auto rounded-lg border border-sky-100 bg-white shadow-lg z-20">
                {filtered.map((c) => (
                  <li
                    key={c.slug}
                    className="cursor-pointer px-4 py-2 hover:bg-sky-50"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setSelectedCondo(c);
                      setQuery(c.name);
                      setOpen(false);
                    }}
                  >
                    <div className="font-medium text-sky-900">{c.name}</div>
                    <div className="text-xs text-sky-600">{c.address}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-sky-100 bg-white/90 shadow-[0_14px_40px_-24px_rgba(2,132,199,0.25)] p-4 md:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 flex items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-sky-900 leading-tight">
                  {selectedCondo.name}
                </h1>
                <p className="text-sm text-sky-700">{selectedCondo.address}</p>
              </div>
            </div>
            <div className="rounded-lg border border-sky-100 bg-white/95 p-2 shadow-sm flex items-center justify-center h-[140px] md:h-[160px]">
              <Image
                src={selectedCondo.logo ?? `/logos/${selectedCondo.slug}.png`}
                alt={`${selectedCondo.name} logo`}
                width={800}
                height={320}
                className="h-[120px] md:h-[140px] w-auto object-contain"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* ───────── Main row: Chairs card + Itinerary ───────── */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Chairs card */}
        <div className="rounded-2xl border border-sky-100 bg-white/95 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)] overflow-hidden">
          {/* Header inside card (premium) */}
          <div className="px-6 pt-6 pb-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[32px] md:text-[36px] font-black tracking-tight text-sky-950">
                Beach Chairs &amp; Umbrellas
              </h2>
              <span className="hidden md:inline-flex items-center rounded-full bg-sky-50/80 px-3 py-1 text-[11px] font-semibold text-sky-700 border border-sky-100">
                Flagship
              </span>
            </div>
            <div className="mt-2 h-[3px] w-20 rounded-full bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600" />
            <p className="mt-3 text-[14px] text-sky-700/95">
              ${PRICES.chairsDay}/day • cap ${PRICES.chairsWeekCap}/week{" "}
              <span className="text-sky-500">(per set)</span>
            </p>
          </div>

          {/* Split: image left — divider — form right */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
            {/* LEFT: photo (taller per request) */}
            <div className="relative h-64 md:h-72 lg:h-80">
              <Image
                src="/pcb-chairs.jpg"
                alt="Chairs & umbrellas on Panama City Beach"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-4 py-2 text-[12px] text-sky-700 border-t border-sky-100">
                1 set = 2 chairs + 1 umbrella
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block border-l border-sky-100" />

            {/* RIGHT: form */}
            <div className="p-5 md:p-7">
              {/* Quantity */}
              <label className="text-xs font-semibold text-sky-900 block">
                Quantity (sets)
              </label>
              <div className="mt-2 inline-flex items-center rounded-full border border-sky-200 bg-white/90 shadow-sm">
                <button
                  onClick={() => setChairSets(Math.max(1, chairSets - 1))}
                  className="px-3 py-2 text-sky-700 hover:bg-sky-50"
                >
                  −
                </button>
                <div className="px-4 text-base font-semibold text-sky-900">
                  {chairSets}
                </div>
                <button
                  onClick={() => setChairSets(chairSets + 1)}
                  className="px-3 py-2 text-sky-700 hover:bg-sky-50"
                >
                  +
                </button>
              </div>

              {/* Dates */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              </div>

              {/* Chairs total */}
              <div className="mt-6 rounded-2xl border border-sky-100 bg-white/90 p-4 shadow-[0_10px_30px_-20px_rgba(2,132,199,0.25)]">
                <div className="flex items-center justify-between text-sky-900">
                  <span className="text-[15px] font-semibold">
                    Chairs total
                  </span>
                  <span className="text-[18px] font-extrabold">
                    ${chairsSubtotal}
                  </span>
                </div>
                <p className="mt-1 text-xs text-sky-600">
                  ${PRICES.chairsDay}/day per set, capped at $
                  {PRICES.chairsWeekCap}/week.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary — separate card with Review & Checkout */}
        <aside className="sticky top-6 h-max self-start rounded-2xl border border-sky-100 bg-white/95 p-5 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
          <h3 className="text-lg font-semibold text-sky-900">Your itinerary</h3>
          <dl className="mt-3 space-y-2 text-sky-800 text-sm">
            <div className="flex justify-between">
              <dt>Chair sets</dt>
              <dd className="font-medium">{chairSets}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Dates</dt>
              <dd className="font-medium">
                {startDate ? new Date(startDate).toLocaleDateString() : "—"} →{" "}
                {endDate ? new Date(endDate).toLocaleDateString() : "—"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Bonfire</dt>
              <dd className="font-medium">{bonfireDay ?? "Not scheduled"}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Photography</dt>
              <dd className="font-medium">{photoDay ?? "Not scheduled"}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-sky-100 pt-4 space-y-1 text-sky-900">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">${subtotal}</span>
            </div>
          </div>
          <button
            className="mt-4 w-full rounded-xl bg-sky-700 px-5 py-3 text-white font-semibold shadow hover:bg-sky-800 disabled:opacity-60"
            onClick={handleCheckout}
            disabled={chairSets < 1 || !startDate || !endDate}
          >
            Review & Checkout
          </button>
        </aside>
      </section>

      {/* ───────── Add-ons ───────── */}
      <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Bonfire */}
        <article className="rounded-2xl border border-sky-100 bg-white/95 shadow-sm overflow-hidden">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src="/cards/bonfire.jpg"
              alt="Beach Bonfire"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sky-900 font-semibold">Beach Bonfire</h4>
                <p className="text-sky-700 text-sm">
                  From ${PRICES.bonfire} • pick a night
                </p>
              </div>
              <span className="text-[11px] rounded-full border border-sky-200 px-2 py-0.5 text-sky-700">
                Include
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <DayChip
                  key={d}
                  label={d}
                  active={bonfireDay === d}
                  onClick={() => setBonfireDay(bonfireDay === d ? null : d)}
                />
              ))}
            </div>
          </div>
        </article>

        {/* Paddleboard */}
        <article className="rounded-2xl border border-sky-100 bg-white/95 shadow-sm overflow-hidden">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src="/cards/paddleboard.jpg"
              alt="Paddleboard"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="p-4">
            <h4 className="text-sky-900 font-semibold">Paddleboard</h4>
            <p className="text-sky-700 text-sm">
              $35+ / hour • multiple launch spots daily
            </p>
          </div>
        </article>

        {/* Family Photography */}
        <article className="rounded-2xl border border-sky-100 bg-white/95 shadow-sm overflow-hidden">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src="/cards/photo.jpg"
              alt="Family Photography"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sky-900 font-semibold">
                  Family Photography
                </h4>
                <p className="text-sky-700 text-sm">
                  ${PRICES.photo} • 45–60 min
                </p>
              </div>
              <span className="text-[11px] rounded-full border border-sky-200 px-2 py-0.5 text-sky-700">
                Include
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <DayChip
                  key={d}
                  label={d}
                  active={photoDay === d}
                  onClick={() => setPhotoDay(photoDay === d ? null : d)}
                />
              ))}
            </div>
          </div>
        </article>
      </section>

      {/* ───────── Watersports ───────── */}
      <section className="mt-10">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-600">
          Featured
        </div>
        <h3 className="mb-4 text-lg font-semibold text-sky-900">Watersports</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Jet Ski Rentals",
              price: "$65+ / 30 min",
              img: "/cards/jetski.jpg",
              blurb: "Wave-runner thrills right off the beach.",
            },
            {
              title: "Parasail",
              price: "$75+ / person",
              img: "/cards/parasail.jpg",
              blurb: "Soaring gulf views with pro crews.",
            },
            {
              title: "Banana Boat",
              price: "$25+ / rider",
              img: "/cards/banana.jpg",
              blurb: "Group fun for all ages — hold on!",
            },
          ].map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-sky-100 bg-white/95 shadow-sm overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <h4 className="text-sky-900 font-semibold">{c.title}</h4>
                <p className="text-sky-700 text-sm">{c.price}</p>
                <p className="mt-1 text-[12px] text-sky-600">{c.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

// app/components/ServiceBookingPage.tsx
"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation"; // ⬅️ added useSearchParams
import { useItinerary } from "@/components/Itinerary";

type LocationOpt = { value: string; label: string };

export type PackageOption = {
  id: string;
  name: string;
  price: number;
  details?: string;
  badge?: string;
};

export type AddonOption = {
  id: string;
  name: string;
  price: number;
  perUnit?: boolean;
};

export type ServiceBookingConfig = {
  title: string;
  blurb?: string;
  hero: string;
  scope?: "pcb" | "30a";
  quantityLabel?: string;
  supportsDateRange?: boolean;
  askTime?: boolean;
  packages?: PackageOption[];
  pricePerUnit?: number;
  extras?: AddonOption[];
  locations?: LocationOpt[];
};

type Props =
  | { config: ServiceBookingConfig }
  | { service: ServiceBookingConfig };

export default function ServiceBookingPage(p: Props) {
  const cfg = "config" in p ? p.config : p.service;
  const pathname = usePathname();
  const searchParams = useSearchParams(); // ⬅️
  const isPCB = pathname?.startsWith("/pcb/");
  const market: "pcb" | "30a" = cfg.scope ?? (isPCB ? "pcb" : "30a");

  // ---------- Safe config with defaults ----------
  const packages =
    cfg.packages ??
    (cfg.pricePerUnit
      ? [{ id: "base", name: "Standard", price: cfg.pricePerUnit }]
      : [{ id: "base", name: "Standard", price: 0 }]);

  const extras = cfg.extras ?? [];
  const quantityLabel = cfg.quantityLabel ?? "sets";
  const blurb =
    cfg.blurb ?? "Refined, discreet, unforgettable beach experiences.";
  const askDate = true;
  const askTime = !!cfg.askTime;

  const locationOptions: LocationOpt[] = cfg.locations ?? [];

  // ---------- UI state ----------
  const uid = useId();
  const [pkgId, setPkgId] = useState<string>(packages[0].id);
  const [qty, setQty] = useState<number>(1);

  // ⬇️ EXACTLY THIS replaces your old `const [location, setLocation] = useState<string>("");`
  const prefillLocation = searchParams.get("accessName") || "";
  const [location, setLocation] = useState<string>(prefillLocation);

  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  const [time, setTime] = useState<string>("");
  const [addonIds, setAddonIds] = useState<Set<string>>(new Set());
  const toggleAddon = (id: string) =>
    setAddonIds((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const selectedPkg = useMemo(
    () => packages.find((p) => p.id === pkgId) ?? packages[0],
    [pkgId, packages]
  );

  const addonsTotal = useMemo(() => {
    if (!extras.length) return 0;
    return extras
      .filter((a) => addonIds.has(a.id))
      .reduce((sum, a) => sum + a.price * (a.perUnit ? qty : 1), 0);
  }, [addonIds, extras, qty]);

  // Simple multi-day calc: price × days (>=1)
  const days = useMemo(() => {
    if (!dateStart || !dateEnd) return 1;
    const s = new Date(dateStart);
    const e = new Date(dateEnd);
    const ms = Math.max(0, e.getTime() - s.getTime());
    const d = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, d);
  }, [dateStart, dateEnd]);

  const estimated = useMemo(
    () => selectedPkg.price * qty * days + addonsTotal,
    [selectedPkg.price, qty, days, addonsTotal]
  );

  // ---------- Itinerary wire-up ----------
  const { addItem, setOpen } = useItinerary();
  const addToItinerary = () => {
    const lineId = `${uid}-${selectedPkg.id}-${market}-${
      dateStart || "nodate"
    }`;
    addItem({
      id: lineId,
      title: `${cfg.title} • ${selectedPkg.name}${
        dateStart ? ` • ${dateStart}${dateEnd ? ` → ${dateEnd}` : ""}` : ""
      }`,
      market,
      qty,
      price:
        selectedPkg.price +
        extras
          .filter((a) => addonIds.has(a.id) && !a.perUnit)
          .reduce((s, a) => s + a.price, 0),
      // stash anything you want the cart/checkout to use:
      meta: {
        location,
        start: dateStart || null,
        end: dateEnd || null,
        addOns: extras.filter((a) => addonIds.has(a.id)),
        unitPrice: selectedPkg.price,
        days,
      },
    });
    setOpen(true);
  };

  return (
    <main className="bg-white">
      <section className="coastal-container pt-8 md:pt-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* MEDIA + INFO COLUMN */}
          <div className="space-y-4">
            {/* HERO IMAGE CARD */}
            <div className="overflow-hidden rounded-3xl border border-sky-100 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
              <Image
                src={cfg.hero}
                alt={cfg.title}
                width={1600}
                height={1000}
                className="h-[360px] w-full object-cover"
                priority
              />
            </div>

            {/* CHOOSE PACKAGE */}
            {!!packages.length && (
              <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
                <div className="text-[13px] font-medium text-sky-900">
                  Choose your package
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {packages.map((p) => {
                    const active = p.id === pkgId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPkgId(p.id)}
                        className={`flex items-center justify-between rounded-xl border p-4 text-left transition-shadow ${
                          active
                            ? "border-sky-300 bg-sky-50/60 shadow-sm"
                            : "border-sky-100 bg-white hover:shadow-sm"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-sky-900">
                              {p.name}
                            </div>
                            {p.badge && (
                              <span className="rounded-full bg-amber-100 px-2 py-[2px] text-[11px] font-semibold text-amber-800">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          {p.details && (
                            <div className="text-[12px] text-sky-700/80">
                              {p.details}
                            </div>
                          )}
                        </div>
                        <div className="text-sky-900">
                          ${p.price.toLocaleString()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* EXTRAS */}
            {!!extras.length && (
              <div className="rounded-2xl border border-sky-100 bg-white p-4 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
                <div className="text-[13px] font-medium text-sky-900">
                  Enhance it
                </div>
                <div className="mt-2 divide-y divide-sky-100">
                  {extras.map((a) => (
                    <label
                      key={a.id}
                      className="flex cursor-pointer items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-sky-300 text-sky-700 focus:ring-sky-300"
                          checked={addonIds.has(a.id)}
                          onChange={() => toggleAddon(a.id)}
                        />
                        <span className="text-[15px] text-sky-900">
                          {a.name}
                        </span>
                      </div>
                      <div className="text-sky-900">
                        ${a.price.toLocaleString()}
                        {a.perUnit ? (
                          <span className="text-[11px] text-sky-600">
                            {" "}
                            / {quantityLabel.slice(0, -1) || "unit"}
                          </span>
                        ) : null}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* BOOKING CARD */}
          <aside className="sticky top-6 h-max self-start rounded-3xl border border-sky-100 bg-white/95 p-6 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)] backdrop-blur">
            <h1 className="text-2xl md:text-[28px] font-extrabold tracking-tight text-sky-950">
              {cfg.title}
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-sky-700/90">
              Daily setup & takedown—placed with care by our beach crew.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="kicker">
                  Location ({market.toUpperCase()})
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="field"
                >
                  <option value="">
                    {market === "pcb"
                      ? "Select your PCB condo"
                      : "Select nearest beach access"}
                  </option>
                  {locationOptions.map((o) => (
                    <option key={o.value} value={o.label}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="kicker">Start date</label>
                  <input
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="field"
                  />
                </div>
                <div>
                  <label className="kicker">End date</label>
                  <input
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="field"
                  />
                </div>
              </div>

              <div>
                <label className="kicker">{quantityLabel}</label>
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Decrease"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 grid place-items-center rounded-xl border border-sky-200 bg-white text-sky-900 hover:bg-sky-50"
                  >
                    –
                  </button>
                  <div className="min-w-[46px] text-center text-[15px] font-semibold">
                    {qty}
                  </div>
                  <button
                    aria-label="Increase"
                    onClick={() => setQty((q) => q + 1)}
                    className="h-10 w-10 grid place-items-center rounded-xl border border-sky-200 bg-white text-sky-900 hover:bg-sky-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4">
                <div className="text-[13px] font-semibold text-sky-900">
                  Estimated total
                </div>
                <div className="mt-1 text-2xl font-extrabold text-sky-900">
                  ${estimated.toLocaleString()}
                </div>
                <div className="mt-2 text-[13px] text-sky-700/85">
                  {selectedPkg.name} — ${selectedPkg.price.toLocaleString()}
                  {qty > 1 ? ` × ${qty}` : ""}{" "}
                  {days > 1 ? ` × ${days} days` : ""}
                  <br />
                  {location ? `Location — ${location}` : "Location — TBD"}
                  <br />
                  {dateStart
                    ? `Dates — ${dateStart}${dateEnd ? ` → ${dateEnd}` : ""}`
                    : "Dates — TBD"}
                </div>

                <button
                  onClick={addToItinerary}
                  className="mt-4 w-full rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(2,132,199,0.28)] hover:bg-sky-800"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

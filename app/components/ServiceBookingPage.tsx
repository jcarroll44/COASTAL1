// app/components/ServiceBookingPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

/* ---------- Types ---------- */
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
  hero: string; // default/fallback image
  heroGallery?: string[]; // optional gallery (e.g., ["/bonfire1.jpg", ...])
  scope?: "pcb" | "30a";
  quantityLabel?: string; // e.g., "sets", "guests"
  askDate?: boolean; // enables start/end inputs
  packages?: PackageOption[];
  addons?: AddonOption[];
  locations?: { value: string; label: string }[];
};
export type Service = ServiceBookingConfig;

/* ---------- helpers (no UI impact) ---------- */
function buildLines({
  service,
  start,
  end,
  qty,
  selectedAddons,
}: {
  service: ServiceBookingConfig;
  start: string;
  end: string;
  qty: number;
  selectedAddons: string[];
}) {
  const lines: any[] = [];

  // Chairs flow (dates + qty)
  if (service.askDate && start && end && qty > 0) {
    lines.push({ kind: "chairs", chairSets: qty, startDate: start, endDate: end });
  }

  // Bonfire flow (heuristic: page title contains "bonfire")
  if (service.title?.toLowerCase().includes("bonfire")) {
    lines.push({ kind: "bonfire", day: start || "TBD" });
  }

  // Optional: map known addon ids to our checkout kinds
  if (selectedAddons.includes("photo") || selectedAddons.includes("photographer")) {
    lines.push({ kind: "photo", day: start || "TBD" });
  }

  return lines;
}

function summarizeLineItems(orderSummary: any) {
  const items: any[] = [];
  if (orderSummary?.chairSets > 0) {
    items.push({
      amenity: "chairs",
      qty: orderSummary.chairSets,
      unitPrice: 0,
      total: orderSummary.totals.subtotalChairs ?? orderSummary.totals.total,
      days: orderSummary.totals.days ?? undefined,
    });
  }
  if (orderSummary?.bonfireDay) {
    items.push({
      amenity: "bonfire",
      qty: 1,
      unitPrice: 0,
      total: orderSummary.totals.subtotalBonfire ?? 0,
    });
  }
  if (orderSummary?.photoDay) {
    items.push({
      amenity: "photography",
      qty: 1,
      unitPrice: 0,
      total: orderSummary.totals.subtotalPhoto ?? 0,
    });
  }
  return items;
}

/* ---------- Component ---------- */
export default function ServiceBookingPage({
  service,
}: {
  service?: ServiceBookingConfig;
}) {
  // Defensive: if parent didn't pass a valid service, render a gentle message.
  if (!service) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sky-900">
        <h2 className="mb-2 text-lg font-semibold">Service not found</h2>
        <p className="text-sky-700">
          The selected service isn’t available. Please choose one of our
          Signature Services from the list.
        </p>
      </div>
    );
  }

  const qtyLabel = service?.quantityLabel ?? "sets";
  const [location, setLocation] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedPkg, setSelectedPkg] = useState<string | null>(
    service.packages?.[0]?.id ?? null
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const pkg = useMemo(
    () => service.packages?.find((p) => p.id === selectedPkg) ?? null,
    [service.packages, selectedPkg]
  );

  const addonsTotal = useMemo(() => {
    if (!service.addons?.length) return 0;
    return selectedAddons.reduce((sum, id) => {
      const a = service.addons!.find((x) => x.id === id);
      if (!a) return sum;
      return sum + (a.perUnit ? a.price * qty : a.price);
    }, 0);
  }, [selectedAddons, service.addons, qty]);

  const pkgTotal = (pkg?.price ?? 0) * qty;
  const estTotal = pkgTotal + addonsTotal;

  const toggleAddon = (id: string) =>
    setSelectedAddons((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  /* ---------- Gallery (hero / heroGallery) ---------- */
  const gallery: string[] = (
    service.heroGallery && service.heroGallery.length > 0
      ? service.heroGallery
      : [service.hero]
  ).filter(Boolean);

  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => (i + 1) % gallery.length);
  const prev = () => setIdx((i) => (i - 1 + gallery.length) % gallery.length);

  // auto-advance only if there are multiple images
  useEffect(() => {
    if (gallery.length <= 1) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gallery.length]);

  /* ---------- Add to Cart (backend wiring, no UI changes) ---------- */
  async function onAddToCart() {
    try {
      // Map location → partner/property using your rules
      let partnerId = "";
      let propertyId = "";
      if (service.scope === "30a") {
        // 30A = public beach accesses
        partnerId = "coastal-public";
        propertyId = (location || "").trim() || "camellia";
      } else {
        // PCB = condo guests (partner == property == condo slug)
        const condo = (location || "").trim() || "aqua-resort";
        partnerId = condo;
        propertyId = condo;
      }

      // Build normalized checkout lines from UI state
      const lines = buildLines({ service, start, end, qty, selectedAddons });

      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condoSlug: propertyId,
          condoName: propertyId,
          // Email optional to avoid markup change
          email: undefined,
          lines,
        }),
      });
      if (!checkoutRes.ok) throw new Error("Checkout failed");
      const { orderSummary } = await checkoutRes.json();

      // Persist order
      const lineItems = summarizeLineItems(orderSummary);
      const createRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partnerId,
          propertyId,
          market: service.scope ?? "pcb",
          source: "site",
          email: null,
          orderSummary,
          lineItems,
          orderTotal: orderSummary.totals.total,
        }),
      });
      if (!createRes.ok) throw new Error("Order creation failed");
      const { id } = await createRes.json();

      alert(`Order placed! #${id}`);
      // Optionally: window.location.href = `/thank-you?order=${id}`;
    } catch (err: any) {
      alert(err?.message ?? "Failed to place order");
    }
  }

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      {/* LEFT — Combined card (image/gallery + packages + add-ons). Title intentionally omitted per your chairs layout. */}
      <section className="h-full overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
        {/* Gallery */}
        <div className="px-5 pt-5">
          <div className="relative overflow-hidden rounded-xl border border-sky-100">
            {/* Slides */}
            <div className="relative h-[380px] w-full md:h-[420px]">
              {gallery.map((src, i) => (
                <Image
                  key={src + i}
                  src={src}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className={`object-cover transition-opacity duration-400 ${
                    i === idx ? "opacity-100" : "opacity-0"
                  }`}
                  priority={i === 0}
                />
              ))}
            </div>

            {/* Arrows (show only if >1) */}
            {gallery.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 shadow ring-1 ring-slate-200 hover:bg-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 shadow ring-1 ring-slate-200 hover:bg-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots */}
            {gallery.length > 1 && (
              <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                {gallery.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full ring-1 ring-white/60 ${
                      i === idx ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Packages + Add-ons */}
        <div className="px-5 pb-5 pt-4">
          {/* Packages */}
          {!!service.packages?.length && (
            <>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Choose your package
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {service.packages.map((p) => {
                  const active = selectedPkg === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPkg(p.id)}
                      className={[
                        "rounded-xl border bg-white p-3 text-left transition",
                        active
                          ? "border-sky-400 ring-2 ring-sky-200"
                          : "border-slate-200 hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-[14px] font-semibold text-slate-900">
                            {p.name}
                          </div>
                          {p.details && (
                            <div className="mt-1 truncate text-[12px] text-slate-500">
                              {p.details}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 text-[13px] font-semibold text-slate-900">
                          ${p.price}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Add-ons */}
          {!!service.addons?.length && (
            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Add-ons
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {service.addons.map((a) => {
                  const checked = selectedAddons.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-[14px]"
                    >
                      <span className="flex items-center gap-2 text-slate-800">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddon(a.id)}
                          className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-200"
                        />
                        {a.name}
                      </span>
                      <span className="text-[13px] text-slate-900">
                        ${a.price}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RIGHT — Booking Controls (unchanged format; title/subhead colors) */}
      <aside className="h-full rounded-2xl border border-sky-100 bg-white p-5 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
        <div className="text-[22px] font-extrabold text-sky-900">
          {service.title}
        </div>
        {service.blurb && (
          <p className="mt-1 text-[13px] leading-snug text-sky-700">
            {service.blurb}
          </p>
        )}

        {/* Location */}
        <div className="mt-5">
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">
            Location ({service.scope?.toUpperCase() ?? "Area"})
          </label>
          <select
            id={service.scope === "30a" ? "accessSelect" : "condoSelect"}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          >
            <option value="">
              {service.scope === "30a"
                ? "Select nearest beach access"
                : "Select condo / resort"}
            </option>
            {(service.locations ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dates */}
        {service.askDate && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-slate-600">
                Start date
              </label>
              <input
                id="startDate"
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-slate-600">
                End date
              </label>
              <input
                id="endDate"
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>
        )}

        {/* Qty */}
        <div className="mt-4">
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">
            {qtyLabel}
          </label>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setQty((n) => Math.max(1, n - 1))}
              className="h-9 w-9 rounded-full border border-slate-300 text-slate-700"
              aria-label="Decrease"
            >
              −
            </button>
            <input
              id="qty"
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              className="h-9 w-14 rounded-lg border border-slate-300 text-center text-[15px] font-semibold"
            />
            <button
              onClick={() => setQty((n) => n + 1)}
              className="h-9 w-9 rounded-full border border-slate-300 text-slate-700"
              aria-label="Increase"
            >
              +
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="text-[12px] font-semibold text-slate-600">
            Estimated total
          </div>
          <div className="mt-1 text-3xl font-bold text-slate-900">
            ${estTotal}
          </div>
          <div className="mt-2 text-[12px] text-slate-600">
            {pkg ? `${pkg.name} — $${pkg.price}` : "Select a package"}
            <br />
            Location — {location ? location : "TBD"}
            <br />
            Dates — {start && end ? `${start} → ${end}` : "TBD"}
          </div>
        </div>

        <button
          id="confirmPay"
          className="mt-4 w-full rounded-xl bg-sky-800 py-3 text-[15px] font-semibold text-white hover:bg-sky-900"
          disabled={!pkg}
          onClick={onAddToCart}
        >
          Add to Cart
        </button>
      </aside>
    </div>
  );
}
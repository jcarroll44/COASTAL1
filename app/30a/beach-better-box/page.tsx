// app/30a/beach-better-box/page.tsx
"use client";

import { lazy, Suspense, useState } from "react";
import ServiceBookingPage, {
  ServiceBookingConfig as Service,
} from "@/components/ServiceBookingPage";

const ThirtyAHomeMap = lazy(() => import("@/components/ThirtyAHomeMap"));

const svc: Service = {
  title: "30A Beach Better Box",
  blurb:
    "Curated cooler, games, and beach-day upgrades delivered to your access or doorstep.",
  hero: "/cards/box.jpg",
  quantityLabel: "boxes",
  askDate: true,
  scope: "30a",
  packages: [
    {
      id: "classic",
      name: "Classic Box",
      price: 149,
      details:
        "Soft cooler • ice • waters • basic snacks • sand toys • small game",
    },
    {
      id: "premium",
      name: "Premium Box",
      price: 229,
      details:
        "Hard cooler • extra ice • waters & sports drinks • snack variety • games pack",
    },
    {
      id: "ultimate",
      name: "Ultimate Box",
      price: 349,
      details:
        "YETI-style cooler • premium snacks • fruit • large games kit • beach blanket",
    },
  ],
  addons: [
    { id: "extra-ice", name: "Extra Ice (20 lb)", price: 12, perUnit: true },
    { id: "water-case", name: "Case of Waters (24)", price: 15, perUnit: true },
    {
      id: "sports-drinks",
      name: "Sports Drinks (12)",
      price: 22,
      perUnit: true,
    },
    { id: "snack-pack", name: "Snack Variety Pack", price: 28 },
    { id: "kids-sand", name: "Kids Sand Set", price: 18 },
    { id: "games-pack", name: "Beach Games Pack", price: 35 },
    { id: "bluetooth", name: "Bluetooth Speaker Rental", price: 25 },
    { id: "shade-tent", name: "Shade Tent Setup", price: 95 },
  ],
  locations: [
    { value: "seaside", label: "Seaside Access" },
    { value: "ed-wallen", label: "Ed Walline Regional" },
    { value: "inlet", label: "Inlet Beach Regional" },
  ],
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-sky-800/90" aria-hidden>
      <path d={d} />
    </svg>
  );
}

type Item = { id: string; title: React.ReactNode; content: React.ReactNode };

/** Accordion with NO internal max-width — inherits page container width */
function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<string | null>("map");
  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-sky-100 bg-white shadow-[0_8px_30px_rgba(1,112,191,0.06)]">
        {items.map((it, i) => {
          const isOpen = open === it.id;
          return (
            <div key={it.id} className={i ? "border-t border-sky-100" : ""}>
              <button
                onClick={() => toggle(it.id)}
                className="flex w-full items-center justify-between px-4 py-4 md:px-6 hover:bg-sky-50/40"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3 text-[15px] font-semibold tracking-tight text-sky-900">
                  {it.title}
                </div>
                <span
                  className={`inline-grid h-6 w-6 place-items-center rounded-full ring-1 ring-sky-200 text-sky-800 transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>

              <div className={isOpen ? "block" : "hidden"}>
                <div className="px-4 pb-5 pt-1 md:px-6">{it.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  const items: Item[] = [
    {
      id: "map",
      title: (
        <span className="inline-flex items-center gap-3">
          <Icon d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5z" />
          <span>Find Your Closest Access (Map)</span>
        </span>
      ),
      content: (
        <div className="rounded-xl ring-1 ring-sky-100 bg-white">
          <div className="w-full rounded-xl min-h-[440px]">
            <Suspense
              fallback={
                <div className="flex h-[280px] items-center justify-center text-sm text-slate-500">
                  Loading Coastal Access map…
                </div>
              }
            >
              <ThirtyAHomeMap />
            </Suspense>
          </div>
        </div>
      ),
    },
    {
      id: "whats-inside",
      title: (
        <span className="inline-flex items-center gap-3">
          <Icon d="M4 6h16v12H4z M4 10h16" />
          <span>What’s Inside Each Box</span>
        </span>
      ),
      content: (
        <div className="grid gap-3 md:grid-cols-3">
          <ul className="rounded-xl border border-sky-100 bg-white p-3 text-sm">
            <div className="mb-1 text-[12px] font-semibold uppercase text-slate-500">
              Classic
            </div>
            <li>Soft cooler + ice</li>
            <li>Waters + basic snacks</li>
            <li>Sand toys (kids)</li>
            <li>1 small beach game</li>
          </ul>
          <ul className="rounded-xl border border-sky-100 bg-white p-3 text-sm">
            <div className="mb-1 text-[12px] font-semibold uppercase text-slate-500">
              Premium
            </div>
            <li>Hard cooler + extra ice</li>
            <li>Waters + sports drinks</li>
            <li>Snack variety</li>
            <li>Games pack</li>
          </ul>
          <ul className="rounded-xl border border-sky-100 bg-white p-3 text-sm">
            <div className="mb-1 text-[12px] font-semibold uppercase text-slate-500">
              Ultimate
            </div>
            <li>YETI-style cooler</li>
            <li>Premium snacks + fruit</li>
            <li>Large games kit</li>
            <li>Beach blanket</li>
          </ul>
        </div>
      ),
    },
    {
      id: "policies",
      title: (
        <span className="inline-flex items-center gap-3">
          <Icon d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 2.5L19.5 10H14V4.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2z" />
          <span>Delivery & Policies</span>
        </span>
      ),
      content: (
        <ul className="list-disc pl-5 text-[15px] text-slate-700 marker:text-sky-700/70">
          <li>
            Deliveries between 9:00 AM – 1:00 PM unless otherwise arranged.
          </li>
          <li>
            Please choose your nearest public access or provide rental address.
          </li>
          <li>
            Items subject to availability; suitable substitutions may occur.
          </li>
          <li>Weather/flag conditions may alter on-beach deliveries.</li>
        </ul>
      ),
    },
  ];

  return (
    <main className="bg-white">
      {/* Top cards row */}
      <section className="mx-auto max-w-7xl px-5 pt-4 md:px-8 md:pt-6">
        <ServiceBookingPage service={svc} summaryBg="#e9f4f9" />
      </section>

      {/* Accordion — EXACT same container as above */}
      <section className="mx-auto max-w-screen-2xl px-5 pt-4 md:px-8 md:pt-6">
        <Accordion items={items} />
      </section>

      <section className="bg-white" />
    </main>
  );
}

// app/30a/chairs/page.tsx
"use client";

import { lazy, Suspense, useState } from "react";
import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";

const ThirtyAHomeMap = lazy(() => import("@/components/ThirtyAHomeMap"));

const svc: Service = {
  title: "30A Chairs & Umbrellas",
  blurb: "Daily setup & takedown—placed with care by our beach crew.",
  hero: "/chairs-week.jpg",
  quantityLabel: "sets",
  askDate: true,
  packages: [
    {
      id: "day",
      name: "Reserve Per Day",
      price: 55,
      details: "Setup by 9am, takedown at 5:00 PM",
    },
    {
      id: "week",
      name: "Reserve Week",
      price: 300,
      details: "Setup by 9am, takedown at 5:00 PM",
    },
  ],
  addons: [
    { id: "extra-chair", name: "Extra Chair", price: 10 },
    { id: "extra-umbrella", name: "Extra Umbrella", price: 20 },
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

// ---------- Accordion (no height animation; full content always shown when open) ----------
function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<string | null>("map"); // open Map by default
  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id));

  return (
    <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
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

              {/* 👇 No max-height. We simply hide/show. This guarantees full content height. */}
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
          {/* 👇 Give the map a guaranteed canvas height; no overflow clipping anywhere. */}
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
      id: "policies",
      title: (
        <span className="inline-flex items-center gap-3">
          <Icon d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 2.5L19.5 10H14V4.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2z" />
          <span>Reservation Policies</span>
        </span>
      ),
      content: (
        <ul className="list-disc pl-5 text-[15px] text-slate-700 marker:text-sky-700/70">
          <li>
            Public-access pricing; private/HOA beaches may vary by contract.
          </li>
          <li>
            Daily setup by 9:00 AM; takedown at 5:00 PM (conditions may require
            earlier breakdown).
          </li>
          <li>
            Weather holds for lightning or unsafe surf; pro-rated adjustments
            when applicable.
          </li>
          <li>Walton County ghost-chair policy observed at public accesses.</li>
        </ul>
      ),
    },
    {
      id: "cams",
      title: (
        <span className="inline-flex items-center gap-3">
          <Icon d="M20 5h-2.6l-1.2-2.1A2 2 0 0 0 14.5 2h-5a2 2 0 0 0-1.7.9L6.6 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm-8 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          <span>Beach Cams</span>
        </span>
      ),
      content: (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            [
              "Seaside Cam",
              "https://www.youtube.com/results?search_query=seaside+beach+cam",
            ],
            [
              "Seagrove Cam",
              "https://www.youtube.com/results?search_query=seagrove+beach+cam",
            ],
            [
              "Rosemary Beach Cam",
              "https://www.youtube.com/results?search_query=rosemary+beach+cam",
            ],
          ].map(([label, href]) => (
            <a
              key={label}
              className="group block rounded-xl border border-sky-100 p-3 ring-1 ring-transparent transition hover:shadow-sm hover:ring-sky-200"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              <div className="relative h-36 w-full overflow-hidden rounded-lg bg-slate-100" />
              <div className="mt-2 text-sm font-medium text-sky-900">
                {label}
              </div>
              <div className="text-xs text-slate-500">Opens in a new tab</div>
            </a>
          ))}
        </div>
      ),
    },
  ];

  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-5 pt-4 md:px-8 md:pt-6">
        <ServiceBookingPage service={svc} />
      </section>

      <section className="mx-auto max-w-screen-2xl px-5 pt-4 md:px-8 md:pt-6">
        <Accordion items={items} />
      </section>

      <section className="bg-white" />
    </main>
  );
}

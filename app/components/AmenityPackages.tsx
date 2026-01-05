// app/components/AmenityPackages.tsx
"use client";

import { useState } from "react";

/* ---------------- Icons (solid, navy) ---------------- */
function Icon({
  name,
  className = "h-3.5 w-3.5 text-[#0b4e78]",
}: {
  name:
    | "chairs"
    | "bonfire"
    | "camera"
    | "box"
    | "clock"
    | "plus"
    | "bundle"
    | "jetski"
    | "parasail"
    | "banana"
    | "boat";
  className?: string;
}) {
  switch (name) {
    case "chairs":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 3C8 3 5 6 5 9h14c0-3-3-6-7-6Zm1 7h-2v7.5a1 1 0 1 0 2 0V10ZM4 17.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 .5.5 2.5 2.5 0 0 1-2.5 2.5H6.5A2.5 2.5 0 0 1 4 17.5Z" />
        </svg>
      );
    case "bonfire":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12.5 2.5s-2.5 2.2-2.5 5c0 1.2.5 2.2 1.2 2.9-2.1-.2-4.2 1.3-4.2 3.8 0 2.3 1.8 4.3 4.8 4.3 3.6 0 6.2-2.5 6.2-6 0-3.9-2.5-6.8-5.5-10ZM7 20.5l-3 .5a1 1 0 1 1-.3-2l3-.5a1 1 0 1 1 .3 2Zm13.3-.5-3-.5a1 1 0 0 0-.3 2l3 .5a1 1 0 0 0 .3-2Z" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M9 4a2 2 0 0 0-2 2H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2a2 2 0 0 0-2-2H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
        </svg>
      );
    case "box":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Zm0 3.2L12 15l9-4.3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7.3Z" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5h-2v6l5 3 .9-1.8-3.9-2.2V7Z" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
        </svg>
      );
    case "bundle":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm1 3v3h3V7H8Zm5 0v3h3V7h-3Zm-5 5v3h3v-3H8Zm5 0v3h3v-3h-3Z" />
        </svg>
      );
    case "jetski":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M4 16c2.5-2.3 6.2-3.6 10.5-3.6H18l2-3h-4.8L13 7H9.5l1.2 2.4C6.8 9.7 4.2 12 3 14.4L4 16Zm-2 2h20v2H2v-2Z" />
        </svg>
      );
    case "parasail":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M12 2a8 8 0 0 1 8 8h-3a5 5 0 1 0-10 0H4a8 8 0 0 1 8-8Zm-1 8v6l-4 4h2l3-3 3 3h2l-4-4v-6h-2Z" />
        </svg>
      );
    case "banana":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M20 5c-2.5 5.5-7.5 9-13.5 9H5C6 17 9 20 14 20c4.4 0 7.3-3 8-8-.9.5-1.9.8-3 .8-2.5 0-4.3-1.5-5-3.8 2-.2 3.8-1.3 6-4Z" />
        </svg>
      );
    case "boat":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M3 14l9-4 9 4-3 6H6l-3-6Zm9-9l6 5H6l6-5Z" />
        </svg>
      );
  }
}

/* -------------- Packages -------------- */
type Pkg = {
  id: string;
  title: string;
  save?: string;
  image: string;
  bullets: string[];
  chips: string[]; // amenity list
};

/* ---------- 30A (unchanged) ---------- */
const PACKAGES_30A: Pkg[] = [
  {
    id: "essentials-lite",
    title: "Essentials Lite",
    save: "Save $30",
    image: "/cards/box.jpg",
    bullets: ["Arrive to the essentials and enjoy three days with chairs."],
    chips: ["Beach Better Box", "Chairs & Umbrellas (3 days)"],
  },
  {
    id: "sun-sunset",
    title: "Sun + Sunset",
    save: "Save $75",
    image: "/bonfire2.jpg",
    bullets: [
      "Chair service all week plus a hosted bonfire night — permits handled.",
    ],
    chips: ["Chairs & Umbrellas (5 days)", "Beach Bonfire (1 night)"],
  },
  {
    id: "family-week",
    title: "Family Week",
    save: "Save $120",
    image: "/cards/photo-mini.jpg",
    bullets: [
      "Two chair sets, bonfire night, and a golden-hour photo session.",
    ],
    chips: [
      "2× Chair Sets (5 days)",
      "Beach Bonfire (1 night)",
      "Family Photography",
    ],
  },
];

/* ---------- PCB (expanded) ---------- */
const PACKAGES_PCB: Pkg[] = [
  {
    id: "pcb-essentials",
    title: "PCB Essentials",
    save: "Save $40",
    image: "/box.jpg",
    bullets: ["Beach-day basics plus three days of chair service."],
    chips: ["Beach Better Box", "Chairs & Umbrellas (3 days)"],
  },
  {
    id: "sunset-bonfire",
    title: "Sunset + Bonfire",
    save: "Save $80",
    image: "/bonfire2.jpg",
    bullets: ["Five days of chair service and a hosted bonfire night."],
    chips: ["Chairs & Umbrellas (5 days)", "Beach Bonfire (1 night)"],
  },
  {
    id: "family-week-pcb",
    title: "Family Week (PCB)",
    save: "Save $140",
    image: "/cards/photo-mini.jpg",
    bullets: [
      "Two chair sets, bonfire night, and a golden-hour photo session.",
    ],
    chips: [
      "2× Chair Sets (5 days)",
      "Beach Bonfire (1 night)",
      "Family Photography",
    ],
  },
  {
    id: "watersports-trio",
    title: "Watersports Trio",
    save: "Save $60",
    image: "/cards/watersports.jpg", // use a collage or jetski image
    bullets: ["PCB’s greatest hits: parasail, jet ski time, and banana boat."],
    chips: ["Parasail", "Jet Ski Session", "Banana Boat"],
  },
  {
    id: "action-day",
    title: "Action Day",
    save: "Save $45",
    image: "/cards/jetski1.png",
    bullets: ["High-energy day on the water plus a day of chairs."],
    chips: ["Jet Ski Session", "Banana Boat", "Chairs & Umbrellas (1 day)"],
  },
  {
    id: "captains-day",
    title: "Captain’s Day",
    save: "Save $75",
    image: "/cards/pontoon.jpg",
    bullets: ["Full-day pontoon adventure, cooler set-up and beach box."],
    chips: ["Pontoon (Full day)", "Family Photography"],
  },
];

/* map chip text → icon */
function chipIconFor(label: string): Parameters<typeof Icon>[0]["name"] {
  const L = label.toLowerCase();
  if (L.includes("bonfire")) return "bonfire";
  if (L.includes("photo")) return "camera";
  if (L.includes("box")) return "box";
  if (L.includes("chair")) return "chairs";
  if (L.includes("parasail")) return "parasail";
  if (L.includes("jet") || L.includes("ski")) return "jetski";
  if (L.includes("banana")) return "banana";
  if (L.includes("pontoon") || L.includes("boat")) return "boat";
  if (L.includes("day") || L.includes("night")) return "clock";
  return "bundle";
}

export default function AmenityPackages({
  market = "30a",
  className = "",
}: {
  market?: "30a" | "pcb";
  className?: string;
}) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const PKGS = market === "pcb" ? PACKAGES_PCB : PACKAGES_30A;

  return (
    <section className={`mx-auto max-w-7xl ${className}`}>
      {/* header band */}
      <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-4 md:p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
              Packages · Bundle & Save
            </div>
            <h2 className="mt-1 text-[22px] md:text-[26px] font-extrabold tracking-tight text-sky-900">
              Plan the week once — and save
            </h2>
            <p className="mt-1 text-sm text-sky-800/90">
              One place to reserve your chairs, bonfire, photography,
              watersports, and more — with straightforward savings.
            </p>
          </div>

          {/* dates */}
          <div className="hidden shrink-0 gap-2 md:flex">
            <label className="flex flex-col">
              <span className="text-[11px] font-semibold text-sky-800">
                Start
              </span>
              <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="mt-1 h-10 rounded-lg border border-sky-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-[11px] font-semibold text-sky-800">
                End
              </span>
              <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="mt-1 h-10 rounded-lg border border-sky-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </label>
          </div>
        </div>

        {/* cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {PKGS.map((p) => (
            <article
              key={p.id}
              className="group flex min-h-[430px] flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_18px_60px_-40px_rgba(2,132,199,0.22)]"
            >
              {/* media */}
              <div className="relative w-full overflow-hidden">
                <div className="w-full aspect-[16/9.2] md:aspect-[16/9.6]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                {p.save && (
                  <span className="absolute right-3 top-3 rounded-full bg-emerald-600/95 px-2 py-1 text-[11px] font-semibold text-white ring-1 ring-emerald-500/30">
                    {p.save}
                  </span>
                )}
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[15px] font-semibold text-sky-900">
                  {p.title}
                </h3>
                {p.bullets.map((b, i) => (
                  <p key={i} className="mt-1 text-sm leading-6 text-sky-800/90">
                    {b}
                  </p>
                ))}

                {/* chips with icons */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.chips.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] text-sky-900"
                    >
                      <Icon name={chipIconFor(c)} />
                      <span className="text-[#0b4e78]">{c}</span>
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-auto pt-3">
                  <button
                    className="h-10 w-full rounded-lg bg-sky-800 text-sm font-semibold text-white hover:bg-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    onClick={() => {
                      // Hook this into your suite state as needed:
                      console.log("Select package:", p.id, {
                        start,
                        end,
                        market,
                      });
                    }}
                  >
                    Select Package
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

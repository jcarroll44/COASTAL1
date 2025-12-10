"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ServicesCarousel from "@/components/ServicesCarousel";
import ThirtyAHomeMap from "@/components/ThirtyAHomeMap";

/* ──────────────────────────────────────────────────────────
   Public Beach Access list (from CoastalAccess.json)
────────────────────────────────────────────────────────── */
const COASTAL_ACCESSES: { name: string; slug: string }[] = [
  {
    name: "Blue Mountain Beach Regional Access",
    slug: "blue-mountain-beach",
  },
  {
    name: "Dogwood-Thyme Access",
    slug: "dogwood-thyme",
  },
  {
    name: "Dune Allen Regional Beach Access",
    slug: "dune-allen",
  },
  {
    name: "Ed Walline Regional Beach Access",
    slug: "ed-walline",
  },
  {
    name: "Fort Panic and West Allen Loop Beach Access",
    slug: "ft-panic",
  },
  {
    name: "Grayton Dunes Public Beach Access",
    slug: "grayton-dunes",
  },
  {
    name: "Greenwood Beach Access",
    slug: "greenwood-andalusia-dothan",
  },
  {
    name: "Andalusia Beach Access",
    slug: "andalusia",
  },
  {
    name: "Dothan Beach Access",
    slug: "dothan",
  },
  {
    name: "Headland Beach Access",
    slug: "headland",
  },
  {
    name: "Scenic Gulf Regional Beach Access",
    slug: "scenic-gulf",
  },
  {
    name: "Gulfview Heights Regional Beach Access",
    slug: "gulfview-heights",
  },
  {
    name: "Holly Beach Access",
    slug: "holly",
  },
  {
    name: "Azalea-Camelia Beach Access",
    slug: "azalea-camelia",
  },
  {
    name: "Gardenia Beach Access",
    slug: "gardenia",
  },
  {
    name: "Inlet Beach Regional Beach Access",
    slug: "inlet-beach",
  },
  {
    name: "One Seagrove Place",
    slug: "one-seagrove-place",
  },
  {
    name: "One Seagrove Public Access",
    slug: "one-seagrove-public",
  },
  {
    name: "Phillips Inlet and Walton Lakeshore Drive Beach Access",
    slug: "phillips-inlet-walton-lakeshore-drive",
  },
  {
    name: "Santa Clara Regional Access",
    slug: "santa-clara-regional",
  },
  {
    name: "Shell Seeker's Cove Beach Access",
    slug: "shell-seekers-cove",
  },
  {
    name: "Spooky Lane Beach Access",
    slug: "spooky-lane",
  },
  {
    name: "Wall Street Beach Access",
    slug: "wall-street",
  },
  {
    name: "Walton Dunes Beach Access",
    slug: "walton-dunes",
  },
  {
    name: "Highway 395 Beach Access",
    slug: "highway-395",
  },
  {
    name: "Nightcap Beach Access",
    slug: "nightcap",
  },
  {
    name: "Live Oak Beach Access",
    slug: "live-oak",
  },
  {
    name: "Hickory Beach Access",
    slug: "hickory",
  },
];

/* ──────────────────────────────────────────────────────────
   Tiny solid navy icon (used in the Amenity Suite teaser pills)
────────────────────────────────────────────────────────── */
function Icon({
  name,
  className = "h-3.5 w-3.5 text-[#0b4e78]",
}: {
  name: "chairs" | "bonfire" | "camera" | "box" | "wave" | "bundle";
  className?: string;
}) {
  switch (name) {
    case "chairs":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3c-4 0-7 3-7 6h14c0-3-3-6-7-6Zm1 7h-2v7.5a1 1 0 0 0 2 0V10ZM4 17.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 .5.5A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5Z" />
        </svg>
      );
    case "bonfire":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.5 2.5S10 4.7 10 7.5c0 1.2.5 2.2 1.2 2.9-2.1-.2-4.2 1.3-4.2 3.8 0 2.3 1.8 4.3 4.8 4.3 3.6 0 6.2-2.5 6.2-6 0-3.9-2.5-6.8-5.5-10ZM7 20.5l-3 .5a1 1 0 1 1-.3-2l3-.5a1 1 0 1 1 .3 2Zm13.3-.5-3-.5a1 1 0 0 0-.3 2l3 .5a1 1 0 0 0 .3-2Z" />
        </svg>
      );
    case "camera":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9 4a2 2 0 0 0-2 2H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2a2 2 0 0 0-2-2H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" />
        </svg>
      );
    case "box":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Zm0 3.2L12 15l9-4.3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7.3Z" />
        </svg>
      );
    case "wave":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3 14c2.5 0 3.8-2 6.3-2 2.6 0 2.7 2 5.4 2s3.1-2 6.3-2v3c-3.2 0-3.6 2-6.3 2s-3-2-5.4-2c-2.5 0-3.8 2-6.3 2V14Z" />
        </svg>
      );
    case "bundle":
      return (
        <svg
          viewBox="0 0 24 24"
          className={className}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm1 3v3h3V7H8Zm5 0v3h3V7h-3Zm-5 5v3h3v-3H8Zm5 0v3h3v-3h-3Z" />
        </svg>
      );
  }
  return null;
}

/* ──────────────────────────────────────────────────────────
   VERTICAL selection bar (with subtle CBS mark)
   - Beach Access dropdown (from COASTAL_ACCESSES)
   - Only 4 services
   - Routes to /30a/[service] with access/start/end
────────────────────────────────────────────────────────── */
function Search30A_Vertical({ showLogo = true }: { showLogo?: boolean }) {
  const router = useRouter();

  const [service, setService] = useState("Chairs & Umbrellas");
  const [accessSlug, setAccessSlug] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [nearest, setNearest] = useState(true); // keeping UI for now

  const handleCheckAvailability = () => {
    // Map service display name → 30A route
    const serviceToPath: Record<string, string> = {
      "Chairs & Umbrellas": "/30a/chairs",
      "Beach Bonfires": "/30a/bonfires",
      "Beach Better Box": "/30a/beach-better-box",
      "Beach Photography": "/30a/photography",
    };

    const basePath = serviceToPath[service];
    if (!basePath) return;

    const params = new URLSearchParams();

    if (accessSlug) {
      params.set("access", accessSlug);
    }
    if (start) {
      params.set("start", start);
    }
    if (end) {
      params.set("end", end);
    }

    const queryString = params.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;

    router.push(url);
  };

  return (
    <div
      className="
        rounded-2xl border border-sky-100 bg-white/75 backdrop-blur
        p-4 md:p-5 shadow-[0_14px_48px_-22px_rgba(2,132,199,0.35)]
      "
      style={{ width: "min(420px, 92vw)" }}
    >
      <div className="mb-2 flex items-center gap-2">
        {showLogo && (
          <img
            src="/coastal-logo.png"
            alt=""
            className="h-7 w-7 rounded-full ring-1 ring-sky-100"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}

        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700/80">
          Coastal Beach Company · 30A
        </div>
      </div>

      {/* Beach Access dropdown (replaces Market) */}
      <label className="mb-1 block text-[12px] font-semibold text-slate-600">
        Beach Access
      </label>
      <select
        value={accessSlug}
        onChange={(e) => setAccessSlug(e.target.value)}
        className="mb-3 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
      >
        <option value="">Select beach access</option>
        {COASTAL_ACCESSES.map((access) => (
          <option key={access.slug} value={access.slug}>
            {access.name}
          </option>
        ))}
      </select>

      <label className="mb-1 block text-[12px] font-semibold text-slate-600">
        Service
      </label>
      <select
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="mb-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
      >
        <option>Chairs & Umbrellas</option>
        <option>Beach Bonfires</option>
        <option>Beach Better Box</option>
        <option>Beach Photography</option>
      </select>

      <label className="mb-3 flex items-center gap-2 text-[12px] text-sky-800/80">
        <input
          type="checkbox"
          checked={nearest}
          onChange={(e) => setNearest(e.target.checked)}
          className="rounded border-sky-300 text-sky-700 focus:ring-sky-300"
        />
        Nearest 30A beach access
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">
            Start
          </label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-semibold text-slate-600">
            End
          </label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[14px] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      <button
        className="mt-4 h-11 w-full rounded-lg bg-sky-800 text-white text-[14px] font-semibold hover:bg-sky-900"
        onClick={handleCheckAvailability}
      >
        Check Availability
      </button>

      <div className="mt-2 text-[11px] text-sky-700/70">
        Questions? Our concierge can help tailor your week.
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Homepage-matched carousel items
────────────────────────────────────────────────────────── */
const servicesItems = [
  {
    title: "Chairs & Umbrellas",
    blurb: "Daily setup & takedown - sunset hours now available.",
    image: "/cards/chairs-day.jpg",
    href: "/30a/chairs",
  },
  {
    title: "Beach Better Box",
    blurb: "Arrive to the Essentials.",
    image: "/cards/box.jpg",
    href: "/30a/beach-better-box",
  },
  {
    title: "Beach Bonfires",
    blurb: "Permits, fire, seating, s’mores, and more!",
    image: "/beach-bonfires2.jpg",
    href: "/30a/bonfires",
  },
  {
    title: "Beach Photography",
    blurb: "Capture the best memeories, together on 30A.",
    image: "/cards/photo-mini.jpg",
    href: "/30a/photography",
  },
];

/* ──────────────────────────────────────────────────────────
   Light promo (now with a small “Packages” badge + icon pills)
────────────────────────────────────────────────────────── */
function AmenitySuitePromo_Light() {
  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 mb-16">
      <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white">
        <div
          className="absolute inset-0 bg-[radial-gradient(700px_300px_at_10%_30%,rgba(2,132,199,0.08),transparent_60%)]"
          aria-hidden
        />

        <div className="relative grid gap-6 p-6 md:grid-cols-[1.15fr_.85fr] md:p-10">
          {/* Text */}
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">
                Amenity Planning
              </div>
              <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-800">
                <Icon name="bundle" />{" "}
                <span className="ml-1">Packages available</span>
              </span>
            </div>

            <h2 className="mt-1 text-[28px] md:text-[32px] font-extrabold tracking-tight text-sky-900">
              30A Amenity Suite
            </h2>

            <p className="mt-3 text-[15px] leading-7 text-sky-900/90">
              All your 30A essentials—chairs, bonfires, photography, and
              more—organized in one polished place.
            </p>

            {/* Small icon pills (quiet, informative) */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] text-sky-900">
                <Icon name="chairs" /> Chairs
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] text-sky-900">
                <Icon name="bonfire" /> Bonfires
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] text-sky-900">
                <Icon name="camera" /> Photography
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] text-sky-900">
                <Icon name="box" /> Beach Better Box
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] text-sky-900">
                <Icon name="wave" /> Watersports
              </span>
            </div>

            <Link
              href="/suite/30a"
              className="mt-4 inline-flex items-center rounded-2xl bg-sky-800 px-5 py-3 font-semibold text-white hover:bg-sky-900"
            >
              Open 30A Suite
            </Link>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl ring-1 ring-sky-100">
              <Image
                src="/bonfire2.jpg"
                alt="30A Amenity Suite preview"
                width={900}
                height={600}
                className="h-64 w-full object-cover md:h-[300px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────
   Page
────────────────────────────────────────────────────────── */
export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO — panel centered on left third */}
      <section className="relative isolate">
  <div className="relative h-[75vh] min-h-[700px] w-full overflow-hidden">
    <Image
      src="/hero13.jpg"
      alt="30A / South Walton — Coastal"
      fill
      className="object-cover translate-y-[-32px]"
      priority
      unoptimized
    />
  </div>

  <div className="pointer-events-none absolute inset-0">
    <div className="mx-auto flex h-full max-w-7xl items-center px-5 md:px-8">
      <div className="pointer-events-auto w-full md:w-1/3">
        <Search30A_Vertical showLogo />
      </div>
    </div>
  </div>
</section>

      {/* HOMEPAGE-MATCHED CAROUSEL */}
      <section
        id="signature-services"
        className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-14"
      >
        <ServicesCarousel items={servicesItems} />
      </section>
      {/* MAP */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-8 md:pt-10 mb-8 md:mb-12">
        <ThirtyAHomeMap
          mapStyle="mapbox://styles/jcarroll44/cmg9m3ee8005n01qwa6im9637"
          satelliteStyle="mapbox://styles/mapbox/satellite-v9"
          preferDrivingDistance
          initialViewState={{ longitude: -86.1, latitude: 30.32, zoom: 10.8 }}
          height={520}
        />
      </section>
      {/* LIGHT PROMO CARD (enhanced) */}
      <AmenitySuitePromo_Light />
      {/* Live Beach Cams (30A) */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 mt-24 mb-28">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#005D9C]">
            What’s Happening Now
          </div>
          <h3 className="mt-1 text-[28px] md:text-[32px] font-semibold tracking-tight text-[#005D9C]">
            30A Live Beach Cams
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              name: "Inlet Beach Cam",
              href: "/beach-cams/inlet-beach",
              img: "/beach-cams/inlet-cam.jpg",
            },
            {
              name: "Seagrove Cam",
              href: "/beach-cams/seagrove",
              img: "/beach-cams/seagrove-cam.jpg",
            },
            {
              name: "Grayton Beach Cam",
              href: "/beach-cams/grayton-beach",
              img: "/beach-cams/grayton-cam.jpg",
            },
          ].map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="group overflow-hidden rounded-2xl border border-[#cfe0ea] bg-white shadow-[0_18px_60px_-40px_rgba(0,93,156,0.25)]"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  className="object-cover transition group-hover:scale-[1.02]"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <div className="text-[15px] font-medium text-[#005D9C]">
                  {c.name}
                </div>
                <span className="text-[#005D9C]">Watch →</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

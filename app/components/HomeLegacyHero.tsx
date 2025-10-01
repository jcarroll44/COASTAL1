// app/components/HomeLegacyHero.tsx
"use client";

import Image from "next/image";

export default function HomeLegacyHero() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        {/* LEFT — Text Content */}
        <div>
          <p className="text-sm uppercase tracking-wider text-sky-700 font-semibold">
            Since 1985 • Emerald Coast
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            A Legacy of Coastal Hospitality
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            <span className="font-semibold">
              It started at sunrise — a truck full of chairs and a promise to
              care for people on the sand.
            </span>{" "}
            Four decades later, we carry that same spirit forward — refined,
            discreet, and polished — across 30A and Panama City Beach.
          </p>

          {/* Bullets */}
          <ul className="mt-6 space-y-3 text-slate-700">
            <li className="flex gap-2">
              <span className="text-sky-600">✓</span>
              Local crew, daily setup & takedown — same faces, same standard.
            </li>
            <li className="flex gap-2">
              <span className="text-sky-600">✓</span>
              Transparent pricing with no surprises at checkout.
            </li>
            <li className="flex gap-2">
              <span className="text-sky-600">✓</span>
              Weather-smart plans so your week stays easy.
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4">
            <a
              href="/about"
              className="px-5 py-2 rounded-full bg-sky-700 text-white font-semibold hover:bg-sky-800"
            >
              About Coastal
            </a>
            <a
              href="/suite"
              className="px-5 py-2 rounded-full border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Build Your Week
            </a>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">40+ years</p>
              <p className="text-sm text-slate-500">Welcoming families</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">30A • PCB</p>
              <p className="text-sm text-slate-500">Two coasts, one standard</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">Trusted</p>
              <p className="text-sm text-slate-500">By property managers</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Framed Vintage Photo */}
        <div className="relative">
          <div className="rounded-2xl border-8 border-white shadow-xl">
            <Image
              src="/vintage-beach-service@2x.jpg"
              alt="Emerald Coast legacy, circa 1985"
              width={800}
              height={600}
              className="rounded-md"
            />
          </div>
          <p className="text-sm text-slate-500 mt-3 text-right">
            Panama City Beach • 1967
          </p>
        </div>
      </div>
    </section>
  );
}

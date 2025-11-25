"use client";

import Image from "next/image";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold text-sky-900 ring-1 ring-sky-100">
      {children}
    </span>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-sky-900/95">
      <path d={d} />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* ───────────────── HERO (unchanged) ───────────────── */}
      <section className="relative">
        <Image
          src="/vintage-beach-service@2x.jpg"
          alt="Coastal vintage beach service crew"
          width={2400}
          height={1200}
          priority
          className="h-[clamp(46vh,58vh,72vh)] w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0b3f63]/50 mix-blend-multiply" />
        <div className="absolute inset-0 grid place-items-center px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider text-white ring-1 ring-white/20">
              SINCE 1985 — EMERALD COAST
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              A Legacy of Coastal Hospitality
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/90">
              Quiet, exacting service that lets the day feel effortless.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── STORY + LIGHT CARDS ───────────────── */}
      <section className="relative">
        {/* soft wash behind content */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-50 via-white to-white" />
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_.95fr]">
            {/* Two concise paragraphs */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-sky-900 ring-1 ring-sky-100">
                <Icon d="M12 2l9 4-9 4-9-4 9-4z" />
                Our Story
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
                Beach days, finished with care.
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
                Coastal began with a truck, a promise, and a handful of chairs.
                Four decades later, we still greet at 9:00 AM, place every set
                with intention, and keep a tidy footprint—so families can sink
                straight into the moment. Our crews are local. Our standard never
                drifts. And the experience feels quietly polished, never performative.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-700">
                We serve Panama City Beach and 30A with one approach: consistent
                craft. Permits handled. Weather watched. Transparent pricing.
                Service that blends into the day—yet you feel it in every detail.
              </p>

              {/* subtle proof pills */}
              <div className="mt-5 flex flex-wrap gap-2">
                <Pill>Local crews only</Pill>
                <Pill>Transparent pricing</Pill>
                <Pill>Permits handled</Pill>
                <Pill>Weather-smart plans</Pill>
              </div>
            </div>

            {/* Premium, airy cards (very light blues) */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* tone A */}
              <div className="rounded-2xl bg-sky-50/70 p-5 ring-1 ring-sky-100">
                <div className="flex items-center gap-2">
                  <Icon d="M5 12l5 5L20 7l-2-2-8 8-3-3-2 2z" />
                  <div className="text-sm font-semibold text-sky-950">
                    39 Years, One Standard
                  </div>
                </div>
                <p className="mt-2 text-[13px] text-slate-700">
                  Four decades of the same expectation: if it bears our logo,
                  it’s right.
                </p>
              </div>

              {/* tone B */}
              <div className="rounded-2xl bg-sky-50/50 p-5 ring-1 ring-sky-100">
                <div className="flex items-center gap-2">
                  <Icon d="M3 11h18v2H3zM3 5h18v2H3zM3 17h18v2H3z" />
                  <div className="text-sm font-semibold text-sky-950">
                    Setup by 9:00 AM
                  </div>
                </div>
                <p className="mt-2 text-[13px] text-slate-700">
                  Clean lines, aligned edges, and a friendly hello—always on time.
                </p>
              </div>

              {/* tone C */}
              <div className="rounded-2xl bg-white p-5 ring-1 ring-sky-100">
                <div className="flex items-center gap-2">
                  <Icon d="M12 21s-6-4.35-9-7.5A5.5 5.5 0 1112 6a5.5 5.5 0 019 7.5C18 16.65 12 21 12 21z" />
                  <div className="text-sm font-semibold text-sky-950">
                    Polite, Present, Helpful
                  </div>
                </div>
                <p className="mt-2 text-[13px] text-slate-700">
                  The kind of service that fades into the background—yet elevates
                  the whole day.
                </p>
              </div>

              {/* tone D */}
              <div className="rounded-2xl bg-sky-50/60 p-5 ring-1 ring-sky-100">
                <div className="flex items-center gap-2">
                  <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v6l4 2-1 1-5-3V7h2z" />
                  <div className="text-sm font-semibold text-sky-950">
                    Weather-Smart Plans
                  </div>
                </div>
                <p className="mt-2 text-[13px] text-slate-700">
                  We monitor, adjust, and communicate—so your week stays easy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── WHY COASTAL (1 image + bullets) ───────────────── */}
      <section className="mx-auto max-w-7xl px-5 pb-6 md:px-8 md:pb-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
            <Image
              src="/cards/chairs-30a.jpg"
              alt="Chairs placed with care"
              width={1600}
              height={1000}
              className="h-80 w-full object-cover md:h-96"
            />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              What you notice—without noticing.
            </h3>
            <ul className="mt-4 space-y-2 text-[15px] text-slate-700">
              <li className="flex gap-3">
                <Icon d="M9 12l2 2 4-4 2 2-6 6-4-4 2-2z" />
                Exact placement at your preferred access or condo.
              </li>
              <li className="flex gap-3">
                <Icon d="M5 4h14v2H5zM5 10h14v2H5zM5 16h14v2H5z" />
                Consistent setups across 30A and Panama City Beach.
              </li>
              <li className="flex gap-3">
                <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                A single standard—from the first hello to 5:00 PM takedown.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────── BUILD YOUR WEEK (clear 3-step rail) ───────────────── */}
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white to-sky-50/80" />
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
          <div className="mb-6 text-center">
            <div className="text-sm font-semibold text-sky-900">Plan in minutes</div>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight">
              Build your week on the Emerald Coast
            </h3>
            <p className="mt-2 text-[15px] text-slate-700">
              Choose your market, pick dates, add the essentials. We handle the rest.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Step 1 */}
            <a
              href="/build?step=market"
              className="group rounded-2xl bg-white p-6 ring-1 ring-sky-100 transition hover:shadow-[0_12px_30px_rgba(2,132,199,0.12)]"
            >
              <div className="flex items-center gap-3">
                <Icon d="M12 2l9 4-9 4-9-4 9-4z" />
                <div className="text-sm font-semibold text-sky-950">
                  Step 1 — Pick your market
                </div>
              </div>
              <p className="mt-2 text-[13px] text-slate-700">
                30A / South Walton or Panama City Beach.
              </p>
            </a>

            {/* Step 2 */}
            <a
              href="/build?step=dates"
              className="group rounded-2xl bg-white p-6 ring-1 ring-sky-100 transition hover:shadow-[0_12px_30px_rgba(2,132,199,0.12)]"
            >
              <div className="flex items-center gap-3">
                <Icon d="M5 4h14v2H5zM5 10h14v2H5zM5 16h14v2H5z" />
                <div className="text-sm font-semibold text-sky-950">
                  Step 2 — Select dates
                </div>
              </div>
              <p className="mt-2 text-[13px] text-slate-700">
                We monitor weather and keep you posted.
              </p>
            </a>

            {/* Step 3 */}
            <a
              href="/build?step=services"
              className="group rounded-2xl bg-white p-6 ring-1 ring-sky-100 transition hover:shadow-[0_12px_30px_rgba(2,132,199,0.12)]"
            >
              <div className="flex items-center gap-3">
                <Icon d="M12 21s-6-4.35-9-7.5A5.5 5.5 0 1112 6a5.5 5.5 0 019 7.5C18 16.65 12 21 12 21z" />
                <div className="text-sm font-semibold text-sky-950">
                  Step 3 — Add essentials
                </div>
              </div>
              <p className="mt-2 text-[13px] text-slate-700">
                Chairs & umbrellas, bonfires, photography, and more.
              </p>
            </a>
          </div>

          <div className="mt-6 flex justify-center">
            <a
              href="/build"
              className="rounded-xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(2,132,199,0.30)] hover:bg-sky-800"
            >
              Start Building
            </a>
          </div>
        </div>
      </section>

      {/* ───────────────── CONCIERGE ───────────────── */}
      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="rounded-2xl bg-sky-50/70 p-6 shadow-sm ring-1 ring-sky-100 md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <div className="text-sm font-semibold text-sky-900">Concierge</div>
              <p className="mt-1 text-[15px] text-slate-700">
                Questions, special requests, or large groups? We’ll arrange it.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="tel:8503121551"
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-sky-900 ring-1 ring-sky-200"
              >
                850-312-1551
              </a>
              <a
                href="/build"
                className="inline-flex items-center justify-center rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(2,132,199,0.28)] hover:bg-sky-800"
              >
                Build Your Week
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
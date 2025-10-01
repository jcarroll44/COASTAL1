// app/components/EditorialBand.tsx
"use client";

export default function EditorialBand() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-18">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Text */}
        <div>
          <div className="text-[12px] tracking-[0.18em] font-semibold text-sky-700 uppercase">
            Since 1985 • Emerald Coast
          </div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            A Legacy of Coastal
            <br /> Hospitality
          </h2>

          <p className="mt-5 text-slate-700 leading-7">
            It started at sunrise — a truck full of chairs and a promise to care
            for people on the sand. Four decades later, we carry that same
            spirit forward — refined, discreet, and polished — across 30A and
            Panama City Beach.
          </p>

          <ul className="mt-6 space-y-2 text-slate-700">
            <li>
              ✓ Local crew, daily setup & takedown — same faces, same standard.
            </li>
            <li>✓ Transparent pricing with no surprises at checkout.</li>
            <li>✓ Weather-smart plans so your week stays easy.</li>
          </ul>

          <div className="mt-6 flex items-center gap-3">
            <a
              href="/about"
              className="rounded-xl border border-sky-200 bg-white/80 px-4 py-2 text-sky-800 hover:bg-white"
            >
              About Coastal
            </a>
            {/* 🚫 Removed “Build Your Week” button here */}
          </div>
        </div>

        {/* Image with caption overlay */}
        <div className="relative rounded-2xl overflow-hidden shadow-[0_25px_60px_-30px_rgba(2,132,199,0.25)] ring-1 ring-slate-200">
          <img
            src="/hero.jpg"
            alt="Coastal crew on the beach"
            className="w-full h-[420px] object-cover"
          />
          <div className="pointer-events-none absolute bottom-2 right-3 select-none">
            <div className="bg-white/80 backdrop-blur rounded-md px-3 py-1 text-[13px] italic text-slate-700 ring-1 ring-slate-200 shadow-sm">
              Panama City Beach — 1967
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

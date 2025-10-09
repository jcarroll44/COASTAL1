// app/components/Legacy.tsx
export default function Legacy() {
  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-20">
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        {/* Left: Copy */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-sky-500">
            Since 1985 • Emerald Coast
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-sky-900 leading-tight">
            A Legacy of Coastal Hospitality
          </h2>
          <p className="mt-6 text-sky-800">
            It started at sunrise — a truck full of chairs and a promise to care
            for people on the sand. Four decades later, we carry that same
            spirit forward — refined, discreet, and polished — across 30A and
            Panama City Beach.
          </p>
          <ul className="mt-6 space-y-3 text-sky-800">
            <li>
              ✓ Local crew, daily setup & takedown — same faces, same standard.
            </li>
            <li>✓ Transparent pricing with no surprises at checkout.</li>
            <li>✓ Weather-smart plans so your week stays easy.</li>
          </ul>

          {/* Only one CTA here — Build Your Week removed from this section */}
          <div className="mt-8 flex gap-3">
            <a
              href="/about"
              className="inline-flex items-center rounded-full border border-sky-300 bg-white px-4 py-2 text-sky-800 hover:bg-sky-50"
            >
              About Coastal
            </a>
          </div>
        </div>

        {/* Right: Photo with caption bottom-right in cursive */}
        <figure className="relative">
          <img
            src="/vintage-beach-service@2x.jpg"
            alt="Coastal crew on the beach"
            className="w-full rounded-2xl border border-sky-100 shadow-[0_20px_60px_-30px_rgba(2,132,199,0.25)]"
          />
          <figcaption className="pointer-events-none absolute bottom-4 right-4 rounded-md bg-white/85 px-3 py-1 text-sm italic text-sky-700 shadow">
            Panama City Beach • 1967
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

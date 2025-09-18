"use client";

type Bullet = { icon?: React.ReactNode; text: string };

export default function ProductLanding({
  title,
  subtitle,
  hero,
  priceNote,
  bullets = [],
  ctaText = "Reserve Now",
  gallery = [],
  children, // for custom sections (map, extra copy, etc.)
}: {
  title: string;
  subtitle?: string;
  hero: string; // /public path
  priceNote?: string;
  bullets?: Bullet[];
  ctaText?: string;
  gallery?: string[]; // image paths
  children?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/40 to-white">
      {/* Hero */}
      <section className="coastal-container pt-6">
        <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <img
                src={hero}
                alt={title}
                className="h-[440px] w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between p-6 lg:col-span-5">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-sky-900">
                  {title}
                </h1>
                {subtitle && <p className="mt-1 text-sky-700/80">{subtitle}</p>}

                {priceNote && (
                  <div className="mt-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[13px] font-semibold text-sky-800">
                    {priceNote}
                  </div>
                )}

                {!!bullets.length && (
                  <ul className="mt-5 space-y-2 text-sky-800">
                    {bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[15px]"
                      >
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                        {b.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6">
                <button className="w-full rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-800">
                  {ctaText}
                </button>
                <p className="mt-2 text-center text-[12px] text-sky-500">
                  Powered by Coastal. Plans can be updated anytime before
                  arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="coastal-container mt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {gallery.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-28 w-full rounded-xl object-cover md:h-36"
              />
            ))}
          </div>
        </section>
      )}

      {/* Content slot (map, copy, etc.) */}
      <section className="coastal-container my-10">
        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-[0_22px_70px_-30px_rgba(9,30,66,0.12)]">
          {children}
        </div>
      </section>
    </main>
  );
}

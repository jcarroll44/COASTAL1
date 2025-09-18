"use client";

type Item = {
  id: string;
  name: string;
  price?: string;
  image?: string; // /public path e.g. "/cards/chairs.jpg"
  blurb?: string;
  href?: string;
};

export default function OfferingPage({
  title,
  subtitle,
  heroImage,
  items,
}: {
  title: string;
  subtitle?: string;
  heroImage?: string;
  items: Item[];
}) {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative">
        <div className="coastal-container">
          <div className="relative overflow-hidden rounded-2xl border border-sky-100 bg-sky-100/30">
            <div className="aspect-[16/7] w-full">
              {heroImage ? (
                <img
                  src={heroImage}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-sky-700">
                  Upload a hero image for this page
                </div>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-6 sm:p-8">
              <h1 className="text-white text-3xl font-extrabold drop-shadow">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-white/90 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="coastal-container mt-8 mb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.href || "#"}
              className="group block overflow-hidden rounded-xl border border-sky-100 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                {it.image ? (
                  <img
                    src={it.image}
                    alt={it.name}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sky-700/70">
                    Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sky-900 font-semibold">{it.name}</h3>
                  {it.price && (
                    <span className="text-[13px] font-semibold text-sky-800">
                      {it.price}
                    </span>
                  )}
                </div>
                {it.blurb && (
                  <p className="mt-1 text-[13px] text-sky-700/80">{it.blurb}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

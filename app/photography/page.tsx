// app/photography/page.tsx
import Link from "next/link";

export default function PhotographyDirector() {
  return (
    <main className="coastal-container py-10">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Family Photography
      </h1>

      <p className="text-slate-600 mb-8">
        Choose your area to view golden-hour packages with seasoned local pros.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <AreaCard
          title="30A / South Walton"
          href="/30a/photography"
          image="/cards/photo.jpg"
          blurb="Multiple group sizes. Sunset recommended."
        />
        <AreaCard
          title="Panama City Beach"
          href="/pcb/photography"
          image="/cards/photo-full.jpg"
          blurb="Beach portraits in PCB — easy online booking."
        />
      </div>
    </main>
  );
}

function AreaCard({
  title,
  href,
  image,
  blurb,
}: {
  title: string;
  href: string;
  image: string;
  blurb?: string;
}) {
  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm transition hover:shadow-md"
    >
      <img
        src={image}
        alt={title}
        className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
      <div className="p-4">
        <div className="text-lg font-medium text-slate-900">{title}</div>
        {blurb && <div className="mt-1 text-sm text-slate-600">{blurb}</div>}
        <div className="mt-3 text-sm font-medium text-sky-700">
          View details →
        </div>
      </div>
    </Link>
  );
}

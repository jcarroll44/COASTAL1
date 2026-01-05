import Image from "next/image";

export default function PropertyOverviewPanel({
  partnerId,
  propertyName,
}: {
  partnerId: string;
  propertyName: string;
}) {
  // partner logo path (same convention you're using elsewhere)
  const logoSrc =
    partnerId === "30a-escapes"
      ? "/logos/30a-escapes1.png"
      : `/logos/${partnerId}.png`;

  return (
    <section className="mb-8 rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-sky-500 mb-1">
            Property
          </p>
          <h2 className="text-2xl font-semibold text-sky-900">
            {propertyName}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Partner: <span className="font-medium">{partnerId}</span>
          </p>
        </div>

        <div className="h-12 w-auto opacity-90">
          <Image
            src={logoSrc}
            alt="Partner logo"
            width={160}
            height={48}
            className="object-contain"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
          <p className="text-xs uppercase tracking-widest text-sky-600">
            Status
          </p>
          <p className="mt-1 text-sky-900">Active</p>
        </div>
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
          <p className="text-xs uppercase tracking-widest text-sky-600">
            Market
          </p>
          <p className="mt-1 text-sky-900">30A / South Walton</p>
        </div>
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4">
          <p className="text-xs uppercase tracking-widest text-sky-600">
            Commission Rate
          </p>
          <p className="mt-1 text-sky-900">5%</p>
        </div>
      </div>
    </section>
  );
}
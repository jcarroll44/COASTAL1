"use client";

type Home = {
  name: string;
  address?: string;
  pm?: string;
  lat: number;
  lng: number;
};

export default function SelectedHomeHeader({
  home,
  accessName,
  onClear,
}: {
  home: Home;
  accessName?: string;
  onClear: () => void;
}) {
  return (
    <div className="relative mx-auto mt-2 mb-6 w-full rounded-2xl border border-sky-100/70 bg-white/80 p-5 md:p-6 shadow-sm backdrop-blur">
      {/* Top row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl leading-tight text-sky-900 tracking-tight">
            {home.name}
          </h1>
          {home.address && (
            <p className="mt-1 text-sm md:text-base text-sky-700">
              {home.address}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {home.pm && (
            <span className="inline-flex items-center rounded-full border border-sky-100 bg-white px-3 py-1 text-sm text-sky-800 shadow-[0_1px_0_0_rgba(2,132,199,0.05)]">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-sky-400"></span>
              PM: {home.pm}
            </span>
          )}
          {accessName && (
            <span className="inline-flex items-center rounded-full border border-sky-100 bg-white px-3 py-1 text-sm text-sky-800 shadow-[0_1px_0_0_rgba(2,132,199,0.05)]">
              Closest access: <span className="ml-1 font-medium">{accessName}</span>
            </span>
          )}

          <button
            aria-label="Change home"
            onClick={onClear}
            className="ml-1 inline-flex items-center rounded-full border border-sky-200/70 bg-sky-50 px-3 py-1 text-sm text-sky-800 hover:bg-sky-100 transition"
          >
            Change home
          </button>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-sky-100 to-transparent" />
    </div>
  );
}

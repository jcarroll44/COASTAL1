import Image from "next/image";

type Breakdown = {
  chairs: number;
  bonfire: number;
  photography: number;
  other: number; // used for Beach Better Box if present
};

export default function ServicesGrid({ breakdown }: { breakdown: Breakdown }) {
  const items = [
    {
      key: "chairs",
      title: "Chairs & Umbrellas",
      amount: breakdown.chairs || 0,
      icon: "/cards/chairs.png",
    },
    {
      key: "bonfire",
      title: "Beach Bonfires",
      amount: breakdown.bonfire || 0,
      icon: "/cards/bonfire.png",
    },
    {
      key: "photography",
      title: "Family Photography",
      amount: breakdown.photography || 0,
      icon: "/cards/photo.png",
    },
    {
      key: "beach-better-box",
      title: "Beach Better Box",
      amount: breakdown.other || 0,
      icon: "/cards/box.png",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2">
      {items.map((it) => (
        <div
          key={it.key}
          className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-sky-50/70 flex items-center justify-center overflow-hidden">
              <Image
                src={it.icon}
                alt=""
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-sky-600">{it.title}</p>
              <p className="text-2xl font-semibold text-sky-900 mt-0.5">
                ${Math.max(0, Math.round(it.amount)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
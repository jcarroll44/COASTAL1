import Image from "next/image";

type Card = {
  title: string;
  image: string;
  price: string;
  blurb: string;
  href?: string;
};

const items: Card[] = [
  {
    title: "Beach Chairs & Umbrellas",
    image: "/chairs.jpg",
    price: "$65/day · $300/week",
    blurb: "Premium setups at Coastal public accesses.",
  },
  {
    title: "Beach Better Box",
    image: "/box.jpg",
    price: "$375/week",
    blurb: "Most Loved · Towels, cooler, water & speaker.",
  },
  {
    title: "Beach Bonfires",
    image: "/bonfire.jpg",
    price: "From $300",
    blurb: "Permits + setup + cleanup handled end-to-end.",
  },
  {
    title: "Family Photography",
    image: "/photo.jpg",
    price: "$300 · 45–60 min",
    blurb: "Sunset sessions with trusted local photographers.",
  },
];

export default function OfferCards() {
  return (
    <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((it) => (
        <a
          key={it.title}
          href={it.href ?? "#"}
          className="group rounded-xl border border-sky-100 bg-white/90 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl">
            <Image
              src={it.image}
              alt={it.title}
              width={800}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              priority={false}
            />
          </div>

          <div className="p-3">
            <div className="font-semibold">{it.title}</div>
            <div className="text-[12px] text-sky-700">{it.price}</div>
            <div className="mt-1 text-[12px] text-sky-700/80">{it.blurb}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

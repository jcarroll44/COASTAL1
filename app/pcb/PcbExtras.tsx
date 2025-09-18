"use client";

type CardProps = {
  title: string;
  blurb?: string;
  price?: string;
  image: string;
  href?: string;
};

function Card({ title, blurb, price, image, href }: CardProps) {
  const Wrapper: any = href ? "a" : "div";
  return (
    <Wrapper
      href={href}
      className="block rounded-2xl border border-sky-100 bg-white/95 shadow overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="p-4">
        <div className="text-[15px] font-semibold text-sky-900">{title}</div>
        {price && <div className="mt-1 text-[13px] font-semibold">{price}</div>}
        {blurb && <div className="text-[12px] text-sky-700/90">{blurb}</div>}
      </div>
    </Wrapper>
  );
}

export default function PcbExtras() {
  return (
    <section className="mx-auto max-w-7xl">
      <h2 className="mb-3 text-lg font-bold text-sky-900">
        More for your week
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Jet Skis"
          blurb="On-the-beach rentals at select towers."
          price="$99+ / 30–60 min"
          image="/cards/watersports.jpg"
          href="/pcb/water-sports#jetski"
        />
        <Card
          title="Parasail"
          blurb="Soar above the Gulf with pro crews."
          price="$75+"
          image="/cards/parasail.jpg"
          href="/pcb/water-sports#parasail"
        />
        <Card
          title="Banana Boat"
          blurb="Family fun rides — multiple departures daily."
          price="$25+"
          image="/cards/banana.jpg"
          href="/pcb/water-sports#banana"
        />
      </div>
    </section>
  );
}

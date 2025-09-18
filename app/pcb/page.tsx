import Link from "next/link";
import ProductLanding from "@/components/ProductLanding";

export default function PCBWatersportsPage() {
  return (
    <ProductLanding
      title="PCB Watersports"
      subtitle="On-the-beach rentals with pro crews and multiple daily departures."
      hero="/cards/watersports.jpg"
      priceNote="Jet Skis • Parasailing • Banana Boat • Paddleboard"
      bullets={[
        { text: "Pro operators at select towers" },
        { text: "Same-day and next-day departures" },
        { text: "Family-friendly options" },
      ]}
      ctaText="See Locations & Times"
      // 🚨 removed gallery prop to get rid of duplicate strip
    >
      {/* Clickable cards that route to the individual pages */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card
          href="/pcb/water-sports/jetski"
          title="Jet Skis"
          img="/cards/jetski.jpg"
        />
        <Card
          href="/pcb/water-sports/parasail"
          title="Parasailing"
          img="/cards/parasail.jpg"
        />
        <Card
          href="/pcb/water-sports/banana"
          title="Banana Boat"
          img="/cards/banana.jpg"
        />
        <Card
          href="/pcb/water-sports/paddleboard"
          title="Paddleboard"
          img="/cards/paddleboard.jpg"
        />
      </div>

      {/* Quick info list */}
      <div className="mt-8 rounded-xl border border-sky-100 bg-sky-50/40 p-5 text-sky-800">
        <h3 className="mb-2 text-lg font-semibold text-sky-900">
          Choose Your Adventure
        </h3>
        <ul className="space-y-1 text-[15px]">
          <li>• Jet Skis – $99+ / 30–60 min</li>
          <li>• Parasailing – $75+ per rider</li>
          <li>• Banana Boat – $25+ per rider</li>
          <li>• Paddleboard – $35+ / hour</li>
        </ul>
      </div>
    </ProductLanding>
  );
}

function Card({
  href,
  title,
  img,
}: {
  href: string;
  title: string;
  img: string;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-3">
        <div className="text-sky-900 font-semibold">{title}</div>
        <div className="text-[13px] text-sky-700/80">Tap to view details</div>
      </div>
    </Link>
  );
}

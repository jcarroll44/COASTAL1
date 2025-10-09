// app/pcb/water-sports/page.tsx
import Link from "next/link";
import ProductLanding from "@/components/ProductLanding";

export default function PCBWatersportsPage() {
  return (
    <ProductLanding
      title="PCB Watersports"
      subtitle="On-the-beach rentals with pro crews and multiple daily departures."
      hero="/cards/watersports.jpg"
      priceNote="Jet Skis • Parasail • Banana Boat • Paddleboard • Boat Rentals"
      bullets={[
        { text: "Pro operators at select towers" },
        { text: "Same-day and next-day departures" },
        { text: "Family-friendly options" },
      ]}
      ctaText="See Locations & Times"
      // ⛔️ Remove `gallery` to hide the thumbnail row
    >
      {/* Compact, clean grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card href="/pcb/jetskis" title="Jet Skis" img="/cards/jetski.jpg" />
        <Card href="/pcb/parasail" title="Parasail" img="/cards/parasail.jpg" />
        <Card
          href="/pcb/banana-boat"
          title="Banana Boat"
          img="/cards/banana.jpg"
        />
        <Card
          href="/pcb/paddleboard"
          title="Paddleboard"
          img="/cards/paddleboard.jpg"
        />
        <Card
          href="/pcb/boat-rentals"
          title="Boat Rentals"
          img="/cards/pontoon.jpg"
        />
      </div>

      {/* Quick info list */}
      <div className="mt-8 rounded-xl border border-sky-100 bg-sky-50/40 p-5 text-sky-800">
        <h3 className="mb-2 text-lg font-semibold text-sky-900">
          Choose Your Adventure
        </h3>
        <ul className="space-y-1 text-[15px]">
          <li>• Jet Skis – $125 / hour</li>
          <li>• Parasail – $95 per rider</li>
          <li>• Banana Boat – $35 per rider</li>
          <li>• Paddleboard – $65 / hour</li>
          <li>• Boat Rentals – $120 / hour (pontoon)</li>
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
      className="group block overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Smaller visual; consistent aspect */}
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="px-3 py-2">
        <div className="text-[14px] font-semibold text-sky-900">{title}</div>
        <div className="text-[12px] text-sky-700/80">Tap to view details</div>
      </div>
    </Link>
  );
}

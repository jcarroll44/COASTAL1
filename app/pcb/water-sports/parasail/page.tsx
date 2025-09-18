import ProductLanding from "@/components/ProductLanding";

export default function PCBParasailPage() {
  return (
    <ProductLanding
      title="Parasailing – Panama City Beach"
      subtitle="Fly above the emerald coast with licensed crews and photo options."
      hero="/cards/parasail.jpg"
      priceNote="$75+ per rider"
      bullets={[
        { text: "Departures from select towers" },
        { text: "Solo, tandem, or triple (weather/weight dependent)" },
        { text: "Observers welcome (space-available)" },
      ]}
      ctaText="See Locations & Times"
      gallery={["/cards/parasail.jpg", "/hero-pcb.jpg"]}
    >
      <p className="text-sky-800">
        Check in at your chosen tower, meet your crew, and enjoy a smooth boat
        ride before your flight. Safety briefings and gear are included.
      </p>
    </ProductLanding>
  );
}

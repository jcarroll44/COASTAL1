import ProductLanding from "@/components/ProductLanding";

const HERO = "/cards/pontoon.jpg";

export default function Page() {
  return (
    <ProductLanding
      title="PCB Boat Rentals"
      subtitle="Pontoon days made easy."
      hero={HERO}
      priceNote="From $300"
      bullets={[
        { text: "Half-day and full-day packages" },
        { text: "Easy dockside pickup" },
        { text: "Coolers and safety gear included" },
      ]}
      ctaText="View Boat Rentals"
    />
  );
}

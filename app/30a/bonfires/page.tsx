import ProductLanding from "@/components/ProductLanding";

const HERO = "/cards/bonfire.jpg";

export default function Page() {
  return (
    <ProductLanding
      title="30A Beach Bonfires"
      subtitle="Permits, setup, seating, and s’mores — handled by our crew."
      hero={HERO}
      priceNote="Starting at $500"
      bullets={[
        { text: "Permit included" },
        { text: "Setup and takedown by Coastal crew" },
        { text: "Seating, firepit, and cleanup included" },
      ]}
      ctaText="Reserve Bonfire"
    />
  );
}

import ProductLanding from "@/components/ProductLanding";

const HERO = "/cards/box.jpg";

export default function Page() {
  return (
    <ProductLanding
      title="30A Beach Better Box"
      subtitle="Cooler, towels, and beach-day essentials — bundled and ready."
      hero={HERO}
      priceNote="$375 / week"
      bullets={[
        { text: "Unlimited towels (refreshed daily)" },
        { text: "Stocked cooler with ice + water" },
        { text: "Bluetooth speaker included" },
        { text: "Daily cleanup + recycling" },
      ]}
      ctaText="Reserve Box"
    />
  );
}

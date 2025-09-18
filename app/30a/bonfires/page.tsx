import ProductLanding from "@/components/ProductLanding";

export default function A30BonfiresPage() {
  return (
    <ProductLanding
      title="30A Beach Bonfires"
      subtitle="Permitted setup with seating, s’mores, and cleanup."
      hero="/cards/bonfire.jpg"
      priceNote="From $500 — pick a night"
      bullets={[
        { text: "Permit, pit, and crew included" },
        { text: "Family-friendly packages" },
        { text: "Golden-hour start times available" },
      ]}
      ctaText="View Packages"
      gallery={["/cards/bonfire.jpg"]}
    />
  );
}

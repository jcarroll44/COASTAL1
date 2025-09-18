import ProductLanding from "@/components/ProductLanding";

export default function A30ChairsPage() {
  return (
    <ProductLanding
      title="30A Chairs & Umbrellas"
      subtitle="1 set = 2 chairs + 1 umbrella — placed for you daily."
      hero="/hero-30a.jpg"
      priceNote="$55/day • $300/week per set"
      bullets={[
        { text: "Premium canvas chairs & shade" },
        { text: "Daily setup & takedown by our team" },
        { text: "Closest public access to your rental" },
      ]}
      ctaText="Check Access & Dates"
      gallery={["/hero-30a.jpg"]}
    />
  );
}

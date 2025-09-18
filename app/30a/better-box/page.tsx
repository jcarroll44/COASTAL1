import ProductLanding from "@/components/ProductLanding";

export default function A30BetterBoxPage() {
  return (
    <ProductLanding
      title="Beach Better Box"
      subtitle="Bundle savings on towels, cooler, water, and speaker."
      hero="/cards/box.jpg"
      priceNote="$375/week"
      bullets={[
        { text: "Everything you forget to pack" },
        { text: "Delivered with your chairs" },
        { text: "Weekly pricing, easy add-on" },
      ]}
      ctaText="See Details"
      gallery={["/cards/box.jpg"]}
    />
  );
}

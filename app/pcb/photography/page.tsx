import ProductLanding from "@/components/ProductLanding";

export default function PCBPhotographyPage() {
  return (
    <ProductLanding
      title="PCB Family Photography"
      subtitle="Golden-hour portraits on the beach."
      hero="/cards/photo.jpg"
      priceNote="$300 • 45–60 min"
      bullets={[
        { text: "Sunset sessions recommended" },
        { text: "Online gallery delivery" },
        { text: "Multiple group sizes" },
      ]}
      ctaText="View Options"
      gallery={["/cards/photo.jpg"]}
    />
  );
}

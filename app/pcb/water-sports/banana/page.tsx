import ProductLanding from "@/components/ProductLanding";

export default function PCBBananaBoatPage() {
  return (
    <ProductLanding
      title="Banana Boat – Panama City Beach"
      subtitle="Family-friendly rides with multiple departures daily."
      hero="/cards/banana.jpg"
      priceNote="$25+ per rider"
      bullets={[
        { text: "Great for groups and families" },
        { text: "Pro captains and safety gear included" },
        { text: "Quick rides with lots of laughs" },
      ]}
      ctaText="See Locations & Times"
      gallery={["/cards/banana.jpg", "/cards/jetski.jpg"]}
    >
      <p className="text-sky-800">
        Meet at your tower, gear up with the crew, and head out for a fun,
        splashy ride. Riders should be comfortable in the water; life jackets
        provided.
      </p>
    </ProductLanding>
  );
}

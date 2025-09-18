import ProductLanding from "@/components/ProductLanding";

export default function PCBPaddleboardPage() {
  return (
    <ProductLanding
      title="Paddleboard – Panama City Beach"
      subtitle="Calm-water cruising with multiple launch spots daily."
      hero="/cards/paddleboard.jpg"
      priceNote="$35+ / hour"
      bullets={[
        { text: "Beginner-friendly boards and tips" },
        { text: "Calm-water launches when conditions allow" },
        { text: "Hourly rates; multi-hour options" },
      ]}
      ctaText="See Locations & Times"
      gallery={["/cards/paddleboard.jpg", "/hero-pcb.jpg"]}
    >
      <p className="text-sky-800">
        Ideal for mellow conditions. Your beach staff will help with basic
        pointers and safe launch areas. Weather and surf may affect
        availability.
      </p>
    </ProductLanding>
  );
}

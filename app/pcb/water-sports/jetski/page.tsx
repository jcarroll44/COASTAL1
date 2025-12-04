import ProductLanding from "@/components/ProductLanding";

export default function JetSkiPage() {
  return (
    <ProductLanding
      title="Jet Ski Rentals"
      subtitle="Ride the Gulf with family or friends."
      hero="/cards/jetski1.png"
      priceNote="$99+ / 30–60 min"
      bullets={[
        { text: "Available at select towers" },
        { text: "Hourly and daily rentals" },
        { text: "Safety gear included" },
      ]}
      ctaText="See Locations & Book"
      gallery={["/cards/jetski1.png", "/cards/watersports.jpg"]}
    >
      <p className="text-sky-800">
        Experience the thrill of jet skiing on the Gulf of Mexico. Same-day and
        next-day bookings are available. Perfect for riders of all levels.
      </p>
    </ProductLanding>
  );
}

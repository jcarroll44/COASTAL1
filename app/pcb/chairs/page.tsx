import ProductLanding from "@/components/ProductLanding";

export default function PCBChairsPage() {
  return (
    <ProductLanding
      title="PCB Chairs & Umbrellas"
      subtitle="1 set = 2 chairs + 1 umbrella — placed for you daily."
      hero="/cards/chairs-pcb.jpg"
      priceNote="$55/day • $300/week per set"
      bullets={[
        { text: "Premium canvas chairs & shade" },
        { text: "Daily setup & takedown by our team" },
        { text: "Closest public access to your rental" },
      ]}
      ctaText="Check Access & Dates"
      gallery={["/cards/chairs-pcb.jpg", "/hero-pcb.jpg"]}
    >
      <p className="text-sky-800">
        Pick your beach access, choose dates, and we’ll do the rest. Need
        multiple sets or special placement? Add it in the notes.
      </p>
    </ProductLanding>
  );
}

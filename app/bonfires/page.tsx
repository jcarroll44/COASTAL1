// app/bonfires/page.tsx
"use client";

import { ItineraryProvider } from "@/components/Itinerary";
import AlaCarteTemplate from "@/components/AlaCarteTemplate";

// Accept market via ?m=30a or ?m=pcb (default 30a)
export default function BonfiresPage({
  searchParams,
}: {
  searchParams: { m?: string };
}) {
  const market = (searchParams?.m === "pcb" ? "pcb" : "30a") as "30a" | "pcb";

  return (
    <ItineraryProvider>
      <AlaCarteTemplate
        title="Beach Bonfires"
        tagline="Permits, setup, seating & s’mores—handled by our crew."
        heroImage="/hero/bonfire-hero.jpg"
        defaultMarket={market}
        options={[
          {
            id: "standard",
            title: "Standard Bonfire (up to 10)",
            image: "/cards/bonfire.jpg",
            price: 500,
            note: "2 hours • sunset",
          },
          {
            id: "signature",
            title: "Signature Bonfire (up to 20)",
            image: "/cards/bonfire-signature.jpg",
            price: 800,
            note: "Lounge seating • lanterns",
          },
        ]}
        addons={[
          { id: "smores", title: "S’mores Kit", price: 40 },
          { id: "acoustic", title: "Acoustic Guitarist", price: 250 },
        ]}
      />
    </ItineraryProvider>
  );
}

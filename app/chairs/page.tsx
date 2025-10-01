// app/chairs/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { ItineraryProvider } from "@/components/Itinerary";
import AlaCarteTemplate from "@/components/AlaCarteTemplate";

export default function ChairsPage() {
  const params = useSearchParams();

  // read ?m= from the URL safely in a client component
  const m = (params.get("m") || "").toLowerCase();
  const market = (m === "pcb" ? "pcb" : "30a") as "30a" | "pcb";

  return (
    <ItineraryProvider>
      <AlaCarteTemplate
        title="Chairs & Umbrellas"
        tagline="Premium wooden sets, placed for you daily."
        heroImage="/hero/chairs-hero.jpg"
        defaultMarket={market}
        options={[
          {
            id: "chair-set",
            title: "Chair Set (2 chairs + 1 umbrella)",
            image: "/cards/chairs-week.jpg",
            price: 300,
            note: "$55/day • $300/week",
          },
          {
            id: "front-row",
            title: "Front-Row Upgrade",
            image: "/cards/front-row.jpg",
            price: 360,
            note: "Select locations • subject to access",
          },
        ]}
        addons={[
          { id: "extra-chair", title: "Extra Chair", price: 25 },
          { id: "cooler-ice", title: "Cooler with Ice", price: 20 },
        ]}
      />
    </ItineraryProvider>
  );
}

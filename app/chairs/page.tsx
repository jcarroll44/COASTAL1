"use client";

import { useSearchParams } from "next/navigation";
import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
import dynamic from "next/dynamic";
const OrderBridge = dynamic(() => import("@/components/OrderBridge"), {
  ssr: false,
});

export default function ChairsPage() {
  const params = useSearchParams();
  const m = (params.get("m") || "").toLowerCase();
  const market = (m === "pcb" ? "pcb" : "30a") as "30a" | "pcb"; // :contentReference[oaicite:2]{index=2}

  const svc: Service = {
    title:
      market === "pcb" ? "PCB Chairs & Umbrellas" : "30A Chairs & Umbrellas",
    blurb: "Premium wooden sets, placed for you daily.",
    hero: "/hero/chairs-hero.jpg",
    scope: market,
    askDate: true,
    quantityLabel: "sets",
    packages: [
      {
        id: "chair-set",
        name: "Chair Set (2 chairs + 1 umbrella)",
        price: 300,
        details: "$55/day • $300/week",
      },
      {
        id: "front-row",
        name: "Front-Row Upgrade",
        price: 360,
        details: "Select locations • subject to access",
      },
    ],
    addons: [
      { id: "extra-chair", name: "Extra Chair", price: 25, perUnit: true },
      { id: "cooler-ice", name: "Cooler with Ice", price: 20 },
    ],
    locations:
      market === "pcb"
        ? [
            { value: "aqua-resort", label: "Aqua Resort" },
            { value: "calypso", label: "Calypso" },
          ]
        : [
            { value: "camellia", label: "Camellia Access" },
            { value: "holly", label: "Holly Access" },
          ],
  };

  return (
    <main className="mx-auto max-w-7xl px-5 md:px-8 py-8">
      <section>
        <ServiceBookingPage service={svc} />
      </section>

      <OrderBridge
        buttonSelector="#confirmPay"
        selectors={{
          start: "#startDate",
          end: "#endDate",
          qty: "#qty",
          location: market === "pcb" ? "#condoSelect" : "#accessSelect",
        }}
        market={market}
        resolveRoute={({ market, locationValue }) => {
          if (market === "30a") {
            return {
              partnerId: "coastal-public",
              propertyId: (locationValue || "camellia").trim(),
            };
          }
          const slug = (locationValue || "aqua-resort").trim();
          return { partnerId: slug, propertyId: slug };
        }}
      />
    </main>
  );
}

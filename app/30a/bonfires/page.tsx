"use client";

import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
import { Accordion30A } from "@/components/BookingAccordion";
import dynamic from "next/dynamic";
const OrderBridge = dynamic(() => import("@/components/OrderBridge"), {
  ssr: false,
});

const svc: Service = {
  title: "30A Beach Bonfires",
  blurb: "Permits, setup, seating, and s’mores — handled by our crew.",
  hero: "/cards/bonfire.jpg",
  heroGallery: [
    "/bonfire1.jpg",
    "/bonfire2.jpg",
    "/bonfire3.jpg",
    "/bonfire4.jpg",
  ],
  scope: "30a",
  quantityLabel: "guests",
  askDate: true,
  packages: [
    {
      id: "std",
      name: "Standard Bonfire (up to 10)",
      price: 500,
      details: "2 hours • sunset",
    },
    {
      id: "sig",
      name: "Signature Bonfire (up to 20)",
      price: 800,
      details: "Lounge seating • lanterns",
    },
  ],
  addons: [
    { id: "smores", name: "S’mores Kit", price: 40 },
    { id: "extra-seating", name: "Extra Seating", price: 15, perUnit: true },
    { id: "photo", name: "Photographer (30 min)", price: 175 },
  ],
  locations: [
    { value: "camellia", label: "Camellia Access" },
    { value: "holly", label: "Holly Access" },
    { value: "azalea", label: "Azalea Access" },
  ],
};

export default function Page() {
  return (
    <main className="bg-white">
      {/* Top cards row */}
      <section className="mx-auto max-w-7xl px-5 pt-4 md:px-8 md:pt-6">
        <ServiceBookingPage service={svc} />
      </section>

      {/* Accordion — EXACT same container as above */}
      <section className="mx-auto max-w-screen-2xl px-5 pt-4 md:px-8 md:pt-6">
        <Accordion30A />
      </section>

      {/* Bridge: no visual output, wires your existing controls */}
      <OrderBridge
        buttonSelector="#confirmPay"
        selectors={{
          start: "#startDate",
          end: "#endDate",
          qty: "#qty",
          location: "#accessSelect",
        }}
        market="30a"
        resolveRoute={({ market, locationValue }) => ({
          partnerId: "coastal-public",
          propertyId: (locationValue || "camellia").trim(),
        })}
      />
    </main>
  );
}

"use client";

import ServiceBookingPage, {
  ServiceBookingConfig as Service,
} from "@/components/ServiceBookingPage";
import PcbExtras from "../PcbExtras";

const svc: Service = {
  title: "PCB Beach Bonfires",
  blurb: "Permits, setup, seating, and s’mores — handled by our crew.",
  hero: "/beach-bonfires2.jpg",
  scope: "pcb",
  quantityLabel: "bonfire(s)",
  askDate: true,
  packages: [
    {
      id: "classic",
      name: "Classic Bonfire",
      price: 500,
      details: "Permit • setup • seating • cleanup",
    },
    {
      id: "sunset",
      name: "Sunset Package",
      price: 650,
      details: "Classic + s’mores + lanterns",
    },
    {
      id: "premium",
      name: "Premium Experience",
      price: 850,
      details: "Sunset + extra seating + décor",
    },
  ],
  addons: [
    { id: "smores", name: "S’mores Kit (serves 8)", price: 35, perUnit: true },
    {
      id: "extra-seating",
      name: "Extra Seating (per chair)",
      price: 15,
      perUnit: true,
    },
    { id: "music", name: "Bluetooth Speaker", price: 25 },
    { id: "blankets", name: "Beach Blankets", price: 30 },
    { id: "photographer", name: "Photographer (30 min)", price: 175 },
    { id: "string-lights", name: "String Lights", price: 85 },
    { id: "table", name: "Cocktail Table", price: 40, perUnit: true },
    { id: "cooler-ice", name: "Cooler + Ice", price: 25 },
  ],
};

export default function Page() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-5 pt-4 md:px-8 md:pt-6">
        <ServiceBookingPage service={svc} summaryBg="#e9f4f9" />
      </section>
      <PcbExtras />
    </main>
  );
}

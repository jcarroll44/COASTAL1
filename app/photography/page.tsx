"use client";

import ServiceBookingPage, {
  ServiceBookingConfig as Service,
} from "@/components/ServiceBookingPage";
import PcbExtras from "../PcbExtras";

const svc: Service = {
  title: "PCB Beach Photography",
  blurb: "Golden-hour family sessions with pro local photographers.",
  hero: "/cards/photo-full.jpg",
  scope: "pcb",
  quantityLabel: "session(s)",
  askDate: true,
  packages: [
    {
      id: "mini",
      name: "Mini (30 min)",
      price: 300,
      details: "Single location • select edits",
    },
    {
      id: "standard",
      name: "Standard (45–60 min)",
      price: 450,
      details: "Multiple poses • curated gallery",
    },
    {
      id: "extended",
      name: "Extended (90 min)",
      price: 700,
      details: "Large groups • outfit change",
    },
  ],
  addons: [
    { id: "extra-prints", name: "Print Credit", price: 50, perUnit: true },
    { id: "rush", name: "Rush Delivery (48h)", price: 95 },
    { id: "drone", name: "Drone Add-on (where permitted)", price: 120 },
    {
      id: "retouch",
      name: "Extra Retouch (per image)",
      price: 15,
      perUnit: true,
    },
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

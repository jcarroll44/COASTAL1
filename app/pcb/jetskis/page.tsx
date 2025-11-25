"use client";

import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
import { Accordion30A as Accordion } from "@/components/BookingAccordion";

const svc: Service = {
  title: "PCB Jet Skis",
  blurb: "On-the-beach departures with pro operators.",
  hero: "/cards/jetski.jpg",
  scope: "pcb",
  quantityLabel: "skis",
  askDate: true,
  packages: [
    { id: "30", name: "30 minutes", price: 65, details: "Per ski" },
    { id: "60", name: "60 minutes", price: 120, details: "Per ski" },
  ],
  addons: [
    { id: "photo", name: "Photo Package", price: 35 },
    { id: "gopro", name: "GoPro Mount", price: 10 },
  ],
};

export default function Page() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-5 pt-4 md:px-8 md:pt-6">
        <ServiceBookingPage service={svc} />
      </section>
      <section className="mx-auto max-w-7xl px-5 pt-6 pb-16 md:px-8">
        <Accordion />
      </section>
    </main>
  );
}

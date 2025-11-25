"use client";

import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
import { Accordion30A as Accordion } from "@/components/BookingAccordion";

const svc: Service = {
  title: "PCB Parasail",
  blurb: "Soaring gulf views with professional crews.",
  hero: "/cards/parasail.jpg",
  scope: "pcb",
  quantityLabel: "riders",
  askDate: true,
  packages: [
    { id: "single", name: "Single Rider", price: 95 },
    { id: "tandem", name: "Tandem", price: 180, details: "Two riders" },
  ],
  addons: [
    { id: "photo", name: "Photo Package", price: 30 },
    { id: "dip", name: "Water Dip", price: 10 },
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

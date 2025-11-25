"use client";

import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
import { Accordion30A as Accordion } from "@/components/BookingAccordion";

const svc: Service = {
  title: "PCB Paddleboard",
  blurb: "Calm-water launches daily; beginner friendly.",
  hero: "/cards/paddleboard.jpg",
  scope: "pcb",
  quantityLabel: "boards",
  askDate: true,
  packages: [
    { id: "hour1", name: "1 hour", price: 35 },
    { id: "hour2", name: "2 hours", price: 60 },
  ],
  addons: [
    { id: "lifejacket", name: "Extra Life Jacket", price: 5, perUnit: true },
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

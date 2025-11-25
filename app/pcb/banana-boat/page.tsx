"use client";

import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
import { Accordion30A as Accordion } from "@/components/BookingAccordion";

const svc: Service = {
  title: "PCB Banana Boat",
  blurb: "Group fun for all ages — hold on!",
  hero: "/cards/banana.jpg",
  scope: "pcb",
  quantityLabel: "riders",
  askDate: true,
  packages: [
    { id: "ride", name: "Standard Ride", price: 25, details: "Per rider" },
  ],
  addons: [{ id: "photo", name: "Photo Package", price: 25 }],
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

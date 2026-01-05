"use client";

import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
import { Accordion30A as Accordion } from "@/components/BookingAccordion";

const svc: Service = {
  title: "PCB Boat Rentals",
  blurb: "Pontoon & deck boat rentals with flexible durations.",
  hero: "/cards/boat.jpg",
  scope: "pcb",
  quantityLabel: "boats",
  askDate: true,
  packages: [
    { id: "half", name: "Half Day (4 hrs)", price: 299 },
    { id: "full", name: "Full Day (8 hrs)", price: 520 },
  ],
  addons: [
    { id: "tube", name: "Tow Tube", price: 35 },
    { id: "cooler", name: "Iced Cooler", price: 25 },
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

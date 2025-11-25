"use client";

import ServiceBookingPage, {
  ServiceBookingConfig as Service,
} from "@/components/ServiceBookingPage";
import PcbExtras from "../PcbExtras";

const svc: Service = {
  title: "PCB Chairs & Umbrellas",
  blurb: "Daily setup & takedown—placed with care by our beach crew.",
  hero: "/cards/chairs-day.jpg",
  scope: "pcb",
  quantityLabel: "sets",
  askDate: true,
  packages: [
    {
      id: "day",
      name: "Reserve Per Day",
      price: 55,
      details: "Setup by 9am, takedown at 5:00 PM",
    },
    {
      id: "week",
      name: "Reserve Week",
      price: 300,
      details: "Setup by 9am, takedown at 5:00 PM",
    },
  ],
  addons: [
    { id: "extra-chair", name: "Extra Chair", price: 10 },
    { id: "extra-umbrella", name: "Extra Umbrella", price: 20 },
  ],
};

export default function Page() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-5 pt-4 md:px-8 md:pt-6">
        <ServiceBookingPage service={svc} />
      </section>
      <PcbExtras />
    </main>
  );
}

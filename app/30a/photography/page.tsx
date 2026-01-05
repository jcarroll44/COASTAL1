"use client";

import ServiceBookingPage, { Service } from "@/components/ServiceBookingPage";
import { Accordion30A } from "@/components/BookingAccordion";

const svc: Service = {
  title: "30A Beach Photography",
  blurb: "Sunset sessions with top local photographers.",
  hero: "/cards/photo.jpg",
  scope: "30a",
  quantityLabel: "families",
  askDate: true,
  packages: [
    {
      id: "mini",
      name: "Mini Session (20–30 min)",
      price: 300,
      details: "Best for couples & small families",
    },
    {
      id: "classic",
      name: "Classic Session (45–60 min)",
      price: 450,
      details: "Up to 6 people · 1 location",
    },
    {
      id: "extended",
      name: "Extended (75–90 min)",
      price: 650,
      details: "Larger groups or outfit changes",
    },
  ],
  addons: [
    { id: "rush", name: "Rush Editing (48h)", price: 120 },
    { id: "album", name: "Keepsake Album", price: 180 },
    { id: "canvas", name: "Canvas Print Credit", price: 150 },
    { id: "drone", name: "Drone Add-on", price: 95 },
  ],
};

export default function Page() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-7xl px-5 pt-4 md:px-8 md:pt-6">
        <ServiceBookingPage service={svc} summaryBg="#e9f4f9" />
      </section>

      <section className="mx-auto max-w-7xl px-5 pt-6 pb-16 md:px-8">
        <Accordion30A />
      </section>
    </main>
  );
}

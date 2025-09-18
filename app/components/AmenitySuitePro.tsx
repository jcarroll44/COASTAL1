"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const MapMini = dynamic(() => import("./MapMini"), { ssr: false });

type AmenitySuiteProps = {
  market: "pcb" | "30a";
  property: {
    name: string;
    address?: string;
    homeIncludedSets?: number;
    coords?: [number, number]; // [lng, lat]
    access?: { label: string; coords: [number, number] }; // nearest access
    amenities?: Record<string, boolean>;
  };
};

type Card = {
  id: string;
  name: string;
  price?: string;
  image: string;
  href: string;
  blurb?: string;
};

export default function AmenitySuitePro({
  market,
  property,
}: AmenitySuiteProps) {
  const cards: Card[] = useMemo(() => {
    if (market === "pcb") {
      return [
        {
          id: "chairs",
          name: "Beach Chairs & Umbrellas",
          price: "$65/day · $300/week",
          image: "/cards/chairs-pcb.jpg",
          href: "/pcb/chairs",
          blurb: "Premium setups at Coastal public accesses.",
        },
        {
          id: "watersports",
          name: "Water Sports",
          price: "$30+",
          image: "/cards/watersports.jpg",
          href: "/pcb/watersports",
          blurb: "Jet skis, parasail, banana boat, paddleboards.",
        },
        {
          id: "bonfires",
          name: "Beach Bonfires",
          price: "From $300",
          image: "/cards/bonfire.jpg",
          href: "/pcb/bonfires",
          blurb: "Permits, setup, cleanup handled.",
        },
        {
          id: "photo",
          name: "Family Photography",
          price: "$300 · 45–60 min",
          image: "/cards/photo.jpg",
          href: "/pcb/photography",
          blurb: "Trusted local photographers.",
        },
      ];
    }
    // 30A
    return [
      {
        id: "chairs",
        name: "Beach Chairs & Umbrellas",
        price: "$65/day · $300/week",
        image: "/cards/chairs-30a.jpg",
        href: "/30a/chairs",
        blurb: "Weekly or daily sets.",
      },
      {
        id: "box",
        name: "Beach Better Box",
        price: "$375/week",
        image: "/cards/box.jpg",
        href: "/30a/better-box",
        blurb: "Towels, cooler, water & speaker.",
      },
      {
        id: "bonfires",
        name: "Beach Bonfires",
        price: "From $300",
        image: "/cards/bonfire.jpg",
        href: "/30a/bonfires",
        blurb: "Permitted set-ups with seating.",
      },
      {
        id: "photo",
        name: "Family Photography",
        price: "$300 · 45–60 min",
        image: "/cards/photo.jpg",
        href: "/30a/photography",
        blurb: "Golden-hour portraits.",
      },
    ];
  }, [market]);

  return (
    <section>
      {/* Header row */}
      <div className="rounded-2xl border border-sky-100 bg-white p-4 md:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-sky-700 font-bold">
              {market === "pcb" ? "Panama City Beach" : "30A / South Walton"}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-sky-900">
              {property.name}
            </h2>
            {property.address && (
              <p className="text-sm text-sky-700/90">{property.address}</p>
            )}
          </div>
          <Link
            href="/suite"
            className="self-start md:self-auto rounded-full bg-sky-800 text-white px-4 py-2 text-sm font-semibold hover:brightness-95"
          >
            Build Your Week
          </Link>
        </div>

        {/* 30A mini map */}
        {property.coords && property.access && (
          <div className="mt-4">
            <MapMini
              home={{ label: property.name, coords: property.coords }}
              access={property.access}
            />
            <div className="mt-2 text-[13px] text-sky-700">
              Nearest access:{" "}
              <span className="font-semibold text-sky-900">
                {property.access.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {cards.map((c) => (
          <Link
            key={c.id}
            href={c.href}
            className="group rounded-2xl border border-sky-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div className="aspect-[4/3] bg-sky-100/40">
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-3">
              <div className="font-semibold text-sky-900">{c.name}</div>
              {c.price && (
                <div className="text-[13px] text-sky-900/90">{c.price}</div>
              )}
              {c.blurb && (
                <div className="text-[12px] text-sky-700/80">{c.blurb}</div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

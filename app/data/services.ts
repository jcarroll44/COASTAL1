// app/data/services.ts
// Central list that every service page uses.

export type Package = { name: string; price: number; details?: string };
export type AddOn = { name: string; price: number };
export type ServiceDef = {
  slug: string;
  title: string;
  description: string;
  image: string;
  packages: Package[];
  addOns?: AddOn[];
};

// ---- Services (keep images you already have in /public/cards) ----
export const SERVICES: ServiceDef[] = [
  {
    slug: "chairs",
    title: "Beach Chairs & Umbrellas",
    description:
      "Daily setup & takedown — one set includes 2 chairs + 1 umbrella. Placed for you.",
    image: "/cards/chairs-30a.jpg",
    packages: [
      { name: "1 Set • Per Day", price: 55, details: "2 chairs + 1 umbrella" },
      { name: "1 Set • Per Week", price: 300, details: "Best value" },
    ],
  },
  {
    slug: "bonfires",
    title: "Beach Bonfires",
    description: "Permits, setup, seating, and s’mores — handled by our crew.",
    image: "/cards/bonfire.jpg",
    packages: [
      {
        name: "Standard Bonfire (up to 10)",
        price: 500,
        details: "2 hours • sunset",
      },
      {
        name: "Signature Bonfire (up to 20)",
        price: 800,
        details: "Lounge seating • lanterns",
      },
    ],
    addOns: [
      { name: "S’mores Kit", price: 40 },
      { name: "Acoustic Guitarist", price: 250 },
    ],
  },
  {
    slug: "photography",
    title: "Family Photography",
    description: "Golden-hour sessions on the beach. Online gallery delivery.",
    image: "/cards/photo.jpg",
    packages: [
      {
        name: "Standard Session (45–60 min)",
        price: 300,
        details: "One location • golden hour",
      },
      {
        name: "Extended Session (75–90 min)",
        price: 450,
        details: "Multiple groupings",
      },
    ],
  },
  {
    slug: "jetskis",
    title: "Jet Skis",
    description: "Thrill rides on the emerald water.",
    image: "/cards/jetski1.png",
    packages: [
      { name: "30 minutes", price: 65 },
      { name: "1 hour", price: 120 },
    ],
    addOns: [{ name: "Photo package", price: 40 }],
  },
  {
    slug: "parasail",
    title: "Parasail",
    description: "Soar high with the safest crews on the coast.",
    image: "/cards/parasail.jpg",
    packages: [
      { name: "Single Rider", price: 75 },
      { name: "Tandem (2 riders)", price: 130 },
    ],
    addOns: [{ name: "Photo package", price: 30 }],
  },
  {
    slug: "box",
    title: "Beach Better Box",
    description:
      "Cooler, towels, and beach-day essentials — bundled and ready.",
    image: "/cards/box.jpg",
    packages: [
      { name: "Weekly Rental", price: 375, details: "Delivered to your setup" },
    ],
  },
  {
    slug: "boats",
    title: "Boat Rentals",
    description: "Pontoon days made easy.",
    image: "/cards/pontoon.jpg",
    packages: [
      { name: "Half Day", price: 300 },
      { name: "Full Day", price: 450 },
    ],
  },
  {
    slug: "watersports",
    title: "Watersports (PCB)",
    description: "Parasail, jet skis, paddleboards & more.",
    image: "/cards/watersports.jpg",
    packages: [
      {
        name: "Build Your Watersports Day",
        price: 0,
        details: "Pick activities on the next step",
      },
    ],
  },
];

// Helpful map for lookups by slug
export const SERVICES_MAP: Record<string, ServiceDef> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s])
);

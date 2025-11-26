// app/config/services.ts
// Service configs used by /services/[service] -> ServiceBookingPage

export type LocationOpt = { value: string; label: string };

export type PackageOption = {
  id: string;
  name: string;
  price: number;
  details?: string;
  badge?: string;
};

export type AddonOption = {
  id: string;
  name: string;
  price: number;
  /** set true if the add-on multiplies by qty (and days), default false (per order) */
  perUnit?: boolean;
};

export type ServiceBookingConfig = {
  title: string;
  blurb?: string;
  hero: string; // points into /public
  scope?: "pcb" | "30a";
  quantityLabel?: string;
  supportsDateRange?: boolean;
  askTime?: boolean;
  packages?: PackageOption[];
  pricePerUnit?: number;
  extras?: AddonOption[];
  locations?: LocationOpt[];
};

export const SERVICES: Record<string, ServiceBookingConfig> = {
  chairs: {
    title: "Chairs & Umbrellas",
    blurb: "Daily setup & takedown—placed with care by our beach crew.",
    hero: "/chairs-week.jpg", // ⬅️ Your requested image in /public
    scope: "30a",
    quantityLabel: "sets",
    supportsDateRange: true, // ⬅️ enable Start + End date
    packages: [
      {
        id: "day",
        name: "Reserve Per Day",
        price: 55,
        details: "9am setup • sunset takedown",
      },
      {
        id: "week",
        name: "Reserve Week (Mon–Fri)",
        price: 300,
        details: "9am setup • sunset takedown",
        badge: "Best Value",
      },
    ],
    extras: [
      { id: "extra-chair", name: "Add Extra Chair", price: 20, perUnit: false },
      {
        id: "extra-umbrella",
        name: "Add Extra Umbrella",
        price: 20,
        perUnit: false,
      },
    ],
    locations: [],
  },

  bonfires: {
    title: "Beach Bonfires",
    hero: "/bonfire-hero.jpg",
    scope: "30a",
    packages: [{ id: "base", name: "Standard Bonfire (up to 10)", price: 500 }],
    extras: [],
    locations: [],
  },

  photos: {
    title: "Family Photography",
    hero: "/photos-hero.jpg",
    scope: "30a",
    packages: [{ id: "base", name: "Sunset Session", price: 350 }],
    extras: [],
    locations: [],
  },

  "beach-box": {
    title: "Beach Better Box",
    hero: "/box-hero.jpg",
    scope: "30a",
    packages: [{ id: "base", name: "Standard", price: 95 }],
    extras: [],
    locations: [],
  },
};
// app/lib/services.ts
import accesses30a from "@/../public/CoastalAccess.json";

// Types shared with ServiceBookingPage
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
  perUnit?: boolean;
};
export type ServiceBookingConfig = {
  title: string;
  blurb?: string;
  hero: string; // /public path
  scope?: "pcb" | "30a";
  quantityLabel?: string; // e.g., "sets"
  askDate?: boolean; // shows start/end inputs
  packages?: PackageOption[];
  addons?: AddonOption[];
  locations?: { value: string; label: string }[];
};

// ---- helpers ----
type Access = {
  name?: string;
  slug?: string;
  lat?: number;
  lng?: number;
  market?: string;
};

// Build "nearest access" dropdown from your 30A access list
function build30ALocations(): { value: string; label: string }[] {
  const list = (accesses30a as Access[])
    .filter((a) => a?.name)
    .map((a) => ({ value: a!.slug || a!.name!, label: a!.name! }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return list;
}

// If you have a PCB access file, import it like above.
// For now, mirror 30A list so the template is identical.
function buildPCBLocations(): { value: string; label: string }[] {
  return build30ALocations();
}

// Shared package presets
const CHAIRS_PACKAGES: PackageOption[] = [
  {
    id: "std",
    name: "Standard Set",
    price: 300,
    details: "2 chairs + 1 umbrella / week",
    badge: "Popular",
  },
  {
    id: "plus",
    name: "Plus Set",
    price: 400,
    details: "Front row when available",
  },
];

const BONFIRE_PACKAGES: PackageOption[] = [
  {
    id: "classic",
    name: "Classic Bonfire",
    price: 500,
    details: "Wood, setup, permits",
  },
  {
    id: "premium",
    name: "Premium Bonfire",
    price: 700,
    details: "Chairs, s’mores, speaker",
  },
];

const PHOTO_PACKAGES: PackageOption[] = [
  {
    id: "mini",
    name: "Mini Session",
    price: 300,
    details: "45 min • 20+ edits",
  },
  {
    id: "full",
    name: "Full Session",
    price: 500,
    details: "60–75 min • 40+ edits",
  },
];

// Simple add-ons examples (toggleable)
const COMMON_ADDONS: AddonOption[] = [
  { id: "cooler", name: "Cooler w/ ice", price: 25 },
  { id: "speaker", name: "Bluetooth speaker", price: 20 },
  { id: "towels", name: "Extra towels (set)", price: 15, perUnit: true },
];

// ---- the config map ----
export function getServiceConfig(
  market: "30a" | "pcb",
  service: "chairs" | "bonfires" | "photography" | "beach-better-box"
): ServiceBookingConfig | null {
  const is30A = market === "30a";
  const MARKET = is30A ? "30A" : "PCB";
  const locations = is30A ? build30ALocations() : buildPCBLocations();

  switch (service) {
    case "chairs":
      return {
        title: `${MARKET} Chairs & Umbrellas`,
        blurb: "1 set = 2 chairs + 1 umbrella",
        hero: is30A ? "/cards/chairs-30a.jpg" : "/pcb-chairs.jpg",
        scope: market,
        quantityLabel: "sets",
        askDate: true,
        packages: CHAIRS_PACKAGES,
        addons: COMMON_ADDONS,
        locations,
      };

    case "bonfires":
      return {
        title: `${MARKET} Beach Bonfires`,
        blurb: "Permit, setup, and cleanup handled by us.",
        hero: "/cards/bonfire.jpg",
        scope: market,
        quantityLabel: "events",
        askDate: false, // your /30a/chairs has dates; bonfires can keep the same layout or set true if you want dates too
        packages: BONFIRE_PACKAGES,
        addons: COMMON_ADDONS,
        locations,
      };

    case "photography":
      return {
        title: `${MARKET} Family Photography`,
        blurb: "Golden hour sessions on the beach.",
        hero: "/cards/photo.jpg",
        scope: market,
        quantityLabel: "sessions",
        askDate: false,
        packages: PHOTO_PACKAGES,
        addons: COMMON_ADDONS,
        locations,
      };

    case "beach-better-box":
      return {
        title: `${MARKET} Beach Better Box`,
        blurb: "Curated cooler, toys, games, and beach-day upgrades.",
        hero: "/cards/box.jpg",
        scope: market,
        quantityLabel: "boxes",
        askDate: false,
        packages: [
          {
            id: "standard",
            name: "Standard Box",
            price: 95,
            details: "Core essentials",
          },
          {
            id: "deluxe",
            name: "Deluxe Box",
            price: 145,
            details: "Extras & treats",
          },
        ],
        addons: COMMON_ADDONS,
        locations,
      };

    default:
      return null;
  }
}

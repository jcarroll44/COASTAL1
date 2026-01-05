// app/lib/flags.ts

/** Allowed colors we surface */
export type FlagColor =
  | "double-red"
  | "red"
  | "yellow"
  | "green"
  | "purple"
  | "unknown";

/** Normalized payload your UI can use */
export type FlagResult = {
  county: "South Walton (30A)" | "Panama City Beach (Bay County)";
  /** Primary / most severe color (for icon) */
  color: FlagColor;
  /** All colors found, in severity order (e.g., ["yellow","purple"]) */
  colors: FlagColor[];
  source: string;
  updatedAt: string;
  /** Optional note from parser */
  note?: string;
};

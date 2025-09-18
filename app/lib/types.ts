export type Market = 'pcb' | '30a';

export type PropertyKind = 'condo' | 'home';

export interface Property {
  id: string;              // 'aqua'
  slug: string;            // 'aqua-beach-resort-2105'
  name: string;
  market: Market;
  kind: PropertyKind;      // condo vs home
  isGulfFront: boolean;
  addressLine1: string;
  city: string;
  state: 'FL';
  zip: string;
  lat?: number;
  lng?: number;
  // presentation/partner
  brand?: { logoUrl?: string; primary?: string; accent?: string };
  // inventory toggles
  amenities: {
    base: string[];        // chairs, bonfire, photo
    pcbOnly?: string[];    // jet_ski, banana_boat, etc.
    blocked?: string[];    // hide specific SKUs for this property
  };
}

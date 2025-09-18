import { Property } from './types';
import data from '@/data/properties.json';

export const PROPERTIES: Property[] = (data as any) as Property[];

export function findBySlug(market: string, slug: string) {
  const m = market.toLowerCase();
  return PROPERTIES.find(p => p.market === m && p.slug === slug) || null;
}

export function matchByAddress(market: string, address: string) {
  // simple, replace with Fuse later
  const a = address.toLowerCase().trim();
  const m = market.toLowerCase();
  return (
    PROPERTIES.find(
      p =>
        p.market === m &&
        (p.addressLine1.toLowerCase().includes(a) || p.name.toLowerCase().includes(a))
    ) || null
  );
}

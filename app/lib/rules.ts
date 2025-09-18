import { Property, Market } from './types';

export function showMapFor(property: Property | null, market: Market) {
  if (!property) return market === '30a';          // generic 30A → show map
  if (property.kind === 'condo') return false;     // condo → no map
  if (property.isGulfFront) return false;          // gulf-front → no map
  return market === '30a';                         // inland 30A → show map
}

export function allowedItems(property: Property | null, market: Market) {
  const base = ['chairs', 'bonfire', 'photo', 'box']; // your universal SKUs
  const set = new Set(base);
  if (market === 'pcb') set.add('jetski');           // market default
  if (property) {
    property.amenities.base?.forEach(i => set.add(i));
    property.amenities.pcbOnly?.forEach(i => set.add(i));
    property.amenities.blocked?.forEach(i => set.delete(i));
  }
  // example: disallow box for non-gulf-front condos if you want:
  // if (property?.kind === 'condo' && !property.isGulfFront) set.delete('box');
  return Array.from(set);
}

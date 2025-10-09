export const PRICES = {
  chairs: 55, // $55 per day per set
  chairsWeekCap: 300, // cap per set
  bonfire: 500,
  photo: 300,
};

export function diffDaysInclusive(startISO: string, endISO: string) {
  const a = new Date(startISO);
  const b = new Date(endISO);
  a.setHours(12, 0, 0, 0);
  b.setHours(12, 0, 0, 0);
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
}

export function chairsPricePerSet(days: number) {
  const raw = PRICES.chairs * days;
  return Math.min(raw, PRICES.chairsWeekCap);
}

export function computeTotals(input: {
  chairSets: number;
  startDate: string;
  endDate: string;
  bonfireDay?: string | null;
  photoDay?: string | null;
}) {
  const days = diffDaysInclusive(input.startDate, input.endDate);
  const chairsSubtotal =
    chairsPricePerSet(days) * Math.max(0, input.chairSets || 0);
  const bonfireSubtotal = input.bonfireDay ? PRICES.bonfire : 0;
  const photoSubtotal = input.photoDay ? PRICES.photo : 0;
  const subtotal = chairsSubtotal + bonfireSubtotal + photoSubtotal;
  const tax = 0;
  const total = subtotal + tax;
  return {
    days,
    chairsSubtotal,
    bonfireSubtotal,
    photoSubtotal,
    subtotal,
    tax,
    total,
  };
}

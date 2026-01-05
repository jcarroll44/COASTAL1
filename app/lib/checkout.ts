import { computeTotals } from "../lib/pricing";

export type CartLine =
  | { kind: "chairs"; chairSets: number; startDate: string; endDate: string }
  | { kind: "bonfire"; day: string }
  | { kind: "photo"; day: string };

export type CheckoutRequest = {
  condoSlug: string;
  condoName?: string;
  email?: string;
  lines: CartLine[];
};

export type CheckoutResponse = {
  checkoutId: string;
  orderSummary: {
    condoSlug: string;
    condoName?: string;
    email?: string;
    chairSets: number;
    startDate: string;
    endDate: string;
    bonfireDay?: string | null;
    photoDay?: string | null;
    totals: ReturnType<typeof computeTotals>;
  };
};

export function mergeCartLines(lines: CartLine[]) {
  let chairSets = 0;
  let startDate: string | null = null;
  let endDate: string | null = null;
  let bonfireDay: string | null = null;
  let photoDay: string | null = null;

  for (const l of lines) {
    if (l.kind === "chairs") {
      chairSets += l.chairSets;
      if (!startDate || new Date(l.startDate) < new Date(startDate))
        startDate = l.startDate;
      if (!endDate || new Date(l.endDate) > new Date(endDate))
        endDate = l.endDate;
    } else if (l.kind === "bonfire") bonfireDay = l.day;
    else if (l.kind === "photo") photoDay = l.day;
  }

  if (!startDate || !endDate) throw new Error("Missing chair dates");

  return { chairSets, startDate, endDate, bonfireDay, photoDay };
}

export function buildCheckoutPayload(req: CheckoutRequest): CheckoutResponse {
  const { chairSets, startDate, endDate, bonfireDay, photoDay } =
    mergeCartLines(req.lines);
  const totals = computeTotals({
    chairSets,
    startDate,
    endDate,
    bonfireDay,
    photoDay,
  });

  return {
    checkoutId: Math.random().toString(36).slice(2),
    orderSummary: {
      condoSlug: req.condoSlug,
      condoName: req.condoName,
      email: req.email,
      chairSets,
      startDate,
      endDate,
      bonfireDay: bonfireDay ?? null,
      photoDay: photoDay ?? null,
      totals,
    },
  };
}
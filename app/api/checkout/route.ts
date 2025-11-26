// app/api/checkout/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

// Normalizes cart payload coming from client UI (dates, qty, items)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // Expect: { market, partnerId, propertyId, startDate, endDate, items:[{id,qty,price}] }
  const { market, partnerId, propertyId, startDate, endDate, items } =
    body || {};
  if (!market || !partnerId || !propertyId || !Array.isArray(items)) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }
  const gross = items.reduce(
    (s: number, it: any) => s + (Number(it.price) || 0) * (Number(it.qty) || 1),
    0
  );
  return NextResponse.json({
    ok: true,
    market,
    partnerId,
    propertyId,
    startDate,
    endDate,
    items,
    gross,
  });
}
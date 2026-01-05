// app/api/partners/[partnerId]/summary/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { aggregateForPartner } from "../../../../lib/commission";

type Ctx = { params: { partnerId: string } };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const data = await aggregateForPartner(params.partnerId);
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to aggregate" },
      { status: 500 }
    );
  }
}
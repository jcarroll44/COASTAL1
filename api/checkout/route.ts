import { NextResponse } from "next/server";
import { buildCheckoutPayload, CheckoutRequest } from "../../lib/checkout";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutRequest;

    if (!body?.condoSlug || !Array.isArray(body?.lines)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const payload = buildCheckoutPayload(body);

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

// app/api/flags/pcb/route.ts
import { NextResponse } from "next/server";
import { htmlToText, normalizePrimary, toStatus } from "../_util";

export const dynamic = "force-dynamic";
export const revalidate = 300;

const SOURCE_URL =
  "https://www.visitpanamacitybeach.com/plan-your-trip/stay-pcb-current/";
const SOURCE_NAME = "Visit Panama City Beach / Bay County";

type FlagResp = {
  status?: string;
  notes?: string;
  sourceName?: string;
  sourceUrl?: string;
};

export async function GET() {
  try {
    const res = await fetch(SOURCE_URL, { next: { revalidate } });
    const html = await res.text();
    const text = htmlToText(html);

    // The site shows: "Current Beach Conditions: Red Flag" (or Double Red / Yellow / Green)
    const m = /Current\s+Beach\s+Conditions:\s*([A-Za-z ]{3,30})/i.exec(text);
    const phrase = (m?.[1] ?? "").trim(); // e.g., "Red Flag" or "Double Red Flag"
    const color = normalizePrimary(phrase);
    const status = toStatus(color);

    const payload: FlagResp = {
      status,
      sourceName: SOURCE_NAME,
      sourceUrl: SOURCE_URL,
    };
    return NextResponse.json(payload);
  } catch {
    const fallback: FlagResp = {
      status: "Unavailable",
      sourceName: SOURCE_NAME,
      sourceUrl: SOURCE_URL,
    };
    return NextResponse.json(fallback, { status: 200 });
  }
}
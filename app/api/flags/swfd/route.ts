/ app/api/flags/swfd/route.ts
import { NextResponse } from "next/server";
import { htmlToText, normalizePrimary, toStatus } from "../_util";

export const dynamic = "force-dynamic";
export const revalidate = 300;

const SOURCE_URL = "https://30a.com/beachflag/";
const SOURCE_NAME = "South Walton Fire District";

// Response shape expected by your page.tsx
type FlagResp = {
  status?: string; // "RED – High Hazard"
  notes?: string; // "PURPLE – Marine Pests"
  sourceName?: string;
  sourceUrl?: string;
};

export async function GET() {
  try {
    const res = await fetch(SOURCE_URL, { next: { revalidate } });
    const html = await res.text();
    const text = htmlToText(html);

    // Example text patterns on the page:
    // "RED: HIGH HAZARD" / "DOUBLE RED: WATER CLOSED..." / "YELLOW: MEDIUM..." / "GREEN: LOW..."
    const m = /(DOUBLE\s*RED|RED|YELLOW|GREEN)\s*:\s*[A-Z ]+/i.exec(text);
    const primaryWord = m?.[1] ?? "";
    const primary = normalizePrimary(primaryWord);
    const status = toStatus(primary);

    // Purple note appears when marine pests are present
    const hasPurple = /PURPLE\s*:\s*Marine\s*Pests/i.test(text);
    const notes = hasPurple ? "PURPLE – Marine Pests" : undefined;

    const payload: FlagResp = {
      status,
      notes,
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
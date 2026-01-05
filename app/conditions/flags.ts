// /lib/flags.ts
import * as cheerio from "cheerio";

export type FlagResponse = {
  ok: boolean;
  source: string;
  fetchedAt: string; // ISO string
  flagText: string | null;
  colors: Array<"double red" | "red" | "yellow" | "green" | "purple">;
  severity?: "closed" | "high" | "medium" | "low";
  note?: string;
};

export const FLAG_WORDS = [
  "double red",
  "red",
  "yellow",
  "green",
  "purple",
] as const;

export function extractFlagWords(input: string): FlagResponse["colors"] {
  const s = input.toLowerCase();
  const found: FlagResponse["colors"] = [];

  // “double red” must be checked before “red”
  if (/\b(double\s*red)\b/i.test(s)) found.push("double red");
  if (/\b(red)\b/i.test(s) && !found.includes("double red")) found.push("red");
  if (/\b(yellow)\b/i.test(s)) found.push("yellow");
  if (/\b(green)\b/i.test(s)) found.push("green");
  if (/\b(purple)\b/i.test(s)) found.push("purple");

  return found;
}

export function colorsToSeverity(
  colors: FlagResponse["colors"]
): FlagResponse["severity"] {
  if (colors.includes("double red")) return "closed";
  if (colors.includes("red")) return "high";
  if (colors.includes("yellow")) return "medium";
  if (colors.includes("green")) return "low";
  return undefined;
}

/**
 * Generic HTML scraper:
 * - Loads HTML with cheerio
 * - Looks for likely text containers and tries to extract a “flag text”
 * - Falls back to scanning the whole page
 */
export function scrapeFlagFromHtml(html: string): { text: string | null } {
  const $ = cheerio.load(html);

  // Check common places where the “flag text” usually appears
  const candidates: string[] = [];

  // Headings / badges / buttons that often hold “YELLOW / PURPLE”, “RED”, etc.
  $("h1,h2,h3,h4,button,span,div,em,strong,b").each((_, el) => {
    const t = $(el).text().trim();
    if (t && /red|yellow|green|purple/i.test(t)) candidates.push(t);
  });

  // Return the shortest plausible candidate (usually the clean “YELLOW / PURPLE”)
  const clean = candidates
    .map((t) => t.replace(/\s+/g, " "))
    .filter((t) => /red|yellow|green|purple/i.test(t))
    .sort((a, b) => a.length - b.length)[0];

  if (clean) return { text: clean };

  // Fallback: scan body text
  const body = $("body").text().replace(/\s+/g, " ");
  const m = body.match(
    /(double\s*red|red|yellow(?:\s*\/\s*purple)?|green|purple)/i
  );
  return { text: m ? m[0] : null };
}

/** Helper to build a standard response */
export function buildFlagResponse(params: {
  source: string;
  flagText: string | null;
  note?: string;
}): FlagResponse {
  const colors = params.flagText ? extractFlagWords(params.flagText) : [];
  return {
    ok: !!params.flagText,
    source: params.source,
    fetchedAt: new Date().toISOString(),
    flagText: params.flagText,
    colors,
    severity: colorsToSeverity(colors),
    note: params.note,
  };
}

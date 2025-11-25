// app/api/flags/_util.ts
export type PrimaryColor =
  | "double-red"
  | "red"
  | "yellow"
  | "green"
  | "unknown";

export function toStatus(color: PrimaryColor): string {
  switch (color) {
    case "double-red":
      return "DOUBLE RED – Water Closed to Public Use";
    case "red":
      return "RED – High Hazard";
    case "yellow":
      return "YELLOW – Medium Hazard";
    case "green":
      return "GREEN – Low Hazard";
    default:
      return "Unavailable";
  }
}

export function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePrimary(s: string): PrimaryColor {
  const t = s.toLowerCase();
  if (t.includes("double red")) return "double-red";
  if (t.includes("red")) return "red";
  if (t.includes("yellow")) return "yellow";
  if (t.includes("green")) return "green";
  return "unknown";
}
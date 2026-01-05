// lib/cx.ts
type Arg = string | null | false | undefined | Record<string, boolean>;

export default function cx(...args: Arg[]): string {
  const out: string[] = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string") {
      out.push(a);
    } else {
      for (const k in a) if (a[k]) out.push(k);
    }
  }
  return out.join(" ");
}

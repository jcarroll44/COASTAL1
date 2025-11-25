// app/api/debug/cookies/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const c = cookies();
  const names = ["coastal_session", "coastal_admin", "coastal_logged_in"];
  const out = names.map((n) => ({ name: n, value: c.get(n)?.value ?? null }));
  return NextResponse.json({ cookies: out });
}
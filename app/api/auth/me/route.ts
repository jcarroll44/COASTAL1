// app/api/auth/me/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { verifySession } from "@/app/lib/auth";

export async function GET(req: Request) {
  const cookie = (req as any).headers.get("cookie") || "";
  const token =
    cookie
      .split(";")
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith("session="))
      ?.split("=")[1] || "";

  const session = token ? verifySession(token) : null;
  if (!session)
    return NextResponse.json({ authenticated: false }, { status: 200 });

  return NextResponse.json({ authenticated: true, session }, { status: 200 });
}

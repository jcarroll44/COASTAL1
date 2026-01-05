// app/api/auth/dev-admin/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.redirect(
    new URL("/coastal/accounts", "http://localhost")
  );
  // Codesandbox/Next will rewrite the host at runtime
  res.cookies.set("coastal_admin", "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 4,
  });
  res.cookies.set("coastal_logged_in", "1", {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: true,
    maxAge: 60 * 60 * 24,
  });
  return res;
}
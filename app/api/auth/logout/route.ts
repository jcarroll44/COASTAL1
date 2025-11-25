// app/api/auth/logout/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { COOKIE_NAME } from "../../../lib/auth";

/**
 * Clears auth cookies and sends the user to the partner login page.
 * (Admin users land here too—safe common exit.)
 */
export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/partners/login", req.url));

  // Clear signed session cookie
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  // Clear convenience cookies
  res.cookies.set("cb_role", "", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("cb_partner", "", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}

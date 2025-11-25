// app/api/auth/register/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import {
  getUsersDB,
  saveUsersDB,
  hashPassword,
  makeSalt,
} from "@/app/lib/auth";

/**
 * POST /api/auth/register
 * {
 *   email: string,
 *   password: string,
 *   role?: "partner" | "attendant" | "admin",
 *   partnerId?: string | null
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role = "partner", partnerId = null } = body;

    if (!email || !password)
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );

    const db = getUsersDB();
    if (db.users[email])
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );

    const salt = makeSalt();
    const hash = hashPassword(salt, password);

    const id = `u_${Math.random()
      .toString(36)
      .slice(2, 10)}${Date.now().toString(36)}`;
    db.users[email] = {
      id,
      email,
      role,
      partnerId,
      salt,
      hash,
      createdAt: new Date().toISOString(),
      active: true,
    };

    saveUsersDB(db);

    return NextResponse.json(
      { ok: true, id, email, role, partnerId },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Failed to register" },
      { status: 500 }
    );
  }
}

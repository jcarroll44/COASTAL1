// app/api/auth/partner/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PCB_CONDOS } from "../../../lib/pcbCondos"; // ✅ correct relative path

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));
  const { partnerId, password } = body || {};

  const okPassword = process.env.PWD_CONDO ?? "coastal2025"; // ✅ same default
  const id = (partnerId || "").toLowerCase().trim();
  const condo = PCB_CONDOS.find((c) => c.slug === id);

  if (!condo)
    return NextResponse.json(
      { ok: false, error: "Unknown condo." },
      { status: 400 }
    );
  if (password !== okPassword)
    return NextResponse.json(
      { ok: false, error: "Invalid password." },
      { status: 401 }
    );

  cookies().set("cb_role", "partner", { path: "/", httpOnly: false });
  cookies().set("cb_partnerId", id, { path: "/", httpOnly: false });

  return NextResponse.json({
    ok: true,
    redirect: `/partners/${id}/dashboard`,
  });
}

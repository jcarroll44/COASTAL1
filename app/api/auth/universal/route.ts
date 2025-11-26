// app/api/auth/universal/route.ts
import { NextResponse } from "next/server";
import { PCB_CONDOS, getCondo } from "@/lib/pcbCondos";

type Session =
  | { sub: string; role: "superadmin" }
  | { sub: string; role: "partneradmin"; partnerId: string }
  | { sub: string; role: "condoadmin"; condoSlug: string };

const OK_PASSWORD = process.env.PWD_ALL ?? "coastal2025";

function normalizeId(s: string) {
  return (s || "").toLowerCase().trim().replace(/\s+/g, "-");
}

export async function POST(req: Request) {
  const { identifier, password } = await req.json().catch(() => ({}));

  if (!identifier || !password) {
    return NextResponse.json(
      { ok: false, error: "Missing credentials" },
      { status: 400 }
    );
  }

  if (password !== OK_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const id = normalizeId(identifier);

  // 1) SuperAdmin
  if (id === "admin") {
    const payload: Session = { sub: "admin", role: "superadmin" };
    const res = NextResponse.json({
      ok: true,
      role: "superadmin",
      redirect: "/admin",
    });
    res.cookies.set("coastal_session", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  // 2) Partner Admin (30A Escapes)
  if (id === "30a-escapes" || id === "30aescapes") {
    const payload: Session = {
      sub: "partner-30a",
      role: "partneradmin",
      partnerId: "30a-escapes",
    };
    const res = NextResponse.json({
      ok: true,
      role: "partneradmin",
      partnerId: "30a-escapes",
      redirect: "/partners/30a-escapes/properties",
    });
    res.cookies.set("coastal_session", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  // 3) Condo Admin (PCB condos)
  const condo = getCondo(id);
  if (condo) {
    const payload: Session = {
      sub: `condo-${id}`,
      role: "condoadmin",
      condoSlug: id,
    };
    const res = NextResponse.json({
      ok: true,
      role: "condoadmin",
      condoSlug: id,
      redirect: `/partners/${id}`,
    });
    res.cookies.set("coastal_session", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  // Unknown
  return NextResponse.json(
    {
      ok: false,
      error:
        "Unknown account. Use 'admin', '30a-escapes', or a condo slug (e.g. 'aqua-beach-resort').",
    },
    { status: 404 }
  );
}

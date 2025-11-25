import { NextResponse } from "next/server";
import condos from "../../../../data/condos.json";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const { email, password } = await req.json().catch(() => ({}));

  const hit = (condos as any[]).find((c) => c?.slug === slug);
  if (!hit) {
    return NextResponse.json(
      { ok: false, error: "Unknown condo" },
      { status: 404 }
    );
  }

  if (password === "coastal2025") {
    const payload = {
      sub: email || `condo-${slug}`,
      role: "condoadmin",
      condoSlug: slug,
    };

    const res = NextResponse.json({ ok: true });
    res.cookies.set("coastal_session", JSON.stringify(payload), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  return NextResponse.json(
    { ok: false, error: "Invalid credentials" },
    { status: 401 }
  );
}
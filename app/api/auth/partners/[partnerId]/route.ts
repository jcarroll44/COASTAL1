import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { partnerId: string } }
) {
  const { partnerId } = params;
  const { email, password } = await req.json().catch(() => ({}));

  // Simple credential check for 30A Escapes partner side
  if (partnerId === "30a-escapes" && password === "coastal2025") {
    const payload = {
      sub: email || "partner-30a",
      role: "partneradmin",
      partnerId: "30a-escapes",
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
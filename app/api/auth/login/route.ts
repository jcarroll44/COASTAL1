import { NextResponse } from "next/server";
import condos from "../../../data/condos.json"; // ✅ fixed relative path

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const lower = (email || "").toLowerCase();

  const ADMIN_EMAIL = "coastal@coastal";
  const ADMIN_PASS = "coastal2025";
  const PM_EMAIL = "pm@30a-escapes";
  const PM_PASS = "escapes2025";
  const CONDO_PASS = "coastal";

  const respond = (to: string, role: string, partner?: string) => {
    const res = NextResponse.json({ ok: true, redirect: to });
    res.cookies.set("cb_role", role, { path: "/" });
    res.cookies.set("cb_partner", partner || "", { path: "/" });
    res.cookies.set("coastal_logged_in", "1", { path: "/" });
    return res;
  };

  // --- Admin ---
  if (lower === ADMIN_EMAIL && password === ADMIN_PASS) {
    return respond("/admin", "admin", "coastal");
  }

  // --- 30A Partner ---
  if (lower === PM_EMAIL && password === PM_PASS) {
    return respond(
      "/partners/30a-escapes/properties",
      "partner",
      "30a-escapes"
    );
  }

  // --- PCB Condo ---
  const condo = condos.find((c: any) => c.Slug?.toLowerCase() === lower);
  if (condo && password === CONDO_PASS) {
    return respond(`/partners/${condo.Slug}/dashboard`, "condo", condo.Slug);
  }

  return NextResponse.json(
    { ok: false, error: "Invalid credentials" },
    { status: 401 }
  );
}

export async function GET(req: Request) {
  return POST(req);
}

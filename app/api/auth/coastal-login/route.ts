// after you compute `user` and create `token`...
const res = NextResponse.json({ ok: true });

// Signed session (unchanged)
res.cookies.set(COOKIE_NAME, token, {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  path: "/",
  maxAge: 60 * 60 * 8,
});

// ✅ Add these 2 cookies so existing pages recognize the role
res.cookies.set("cb_role", user.role, {
  httpOnly: false,
  sameSite: "none",
  secure: true,
  path: "/",
  maxAge: 60 * 60 * 8,
});
res.cookies.set("cb_partner", user.partnerId ?? "", {
  httpOnly: false,
  sameSite: "none",
  secure: true,
  path: "/",
  maxAge: 60 * 60 * 8,
});

// (If you keep the legacy flags, that’s fine too)
res.cookies.set("coastal_admin", user.role === "admin" ? "yes" : "no", {
  httpOnly: false,
  sameSite: "none",
  secure: true,
  path: "/",
  maxAge: 60 * 60 * 8,
});
res.cookies.set("coastal_logged_in", "1", {
  httpOnly: false,
  sameSite: "none",
  secure: true,
  path: "/",
  maxAge: 60 * 60 * 8,
});

return res;
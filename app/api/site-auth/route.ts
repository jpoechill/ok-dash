import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSiteAuthConfig } from "@/lib/site-auth-config";

export async function GET() {
  const auth = getSiteAuthConfig();
  if (!auth) {
    return NextResponse.json({ authEnabled: false, authenticated: false });
  }
  const cookieStore = await cookies();
  const cookie = cookieStore.get("site_access")?.value;
  const authenticated = cookie === auth.token;
  return NextResponse.json({ authEnabled: true, authenticated });
}

function safeEqualString(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function POST(request: Request) {
  const auth = getSiteAuthConfig();
  if (!auth) {
    return NextResponse.json({ ok: true, authDisabled: true });
  }
  const { password: expected, token } = auth;

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!safeEqualString(password, expected)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("site_access", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("site_access", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

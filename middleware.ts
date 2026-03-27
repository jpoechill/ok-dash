import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/login" || pathname.startsWith("/login/")) return true;
  if (pathname.startsWith("/api/site-auth")) return true;
  if (pathname.startsWith("/api/auth/")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico") return true;
  if (/\.(svg|png|jpg|jpeg|gif|ico|webp|woff2?)$/i.test(pathname)) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  const sessionToken = process.env.SITE_AUTH_TOKEN;

  if (!password?.length || !sessionToken?.length) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("site_access")?.value;
  const authed = cookie === sessionToken;

  if (pathname === "/login" || pathname.startsWith("/login/")) {
    if (authed) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (authed) {
    return NextResponse.next();
  }

  const login = new URL("/login", request.url);
  const back = pathname + (request.nextUrl.search || "");
  login.searchParams.set("from", back);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

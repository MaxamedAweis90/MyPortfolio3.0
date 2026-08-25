import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // 1. If requesting any /ugaas route (except /ugaas/login) and no session cookie is present
  if (pathname.startsWith("/ugaas") && pathname !== "/ugaas/login" && !sessionCookie) {
    const loginUrl = new URL("/ugaas/login", request.url);
    if (pathname !== "/ugaas") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. If requesting /ugaas/login and already authenticated
  if (pathname === "/ugaas/login" && sessionCookie) {
    return NextResponse.redirect(new URL("/ugaas", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ugaas/:path*"],
};

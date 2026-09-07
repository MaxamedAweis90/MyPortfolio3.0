import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // If requesting protected /ugaas routes (except /ugaas/login) and no session cookie
  if (pathname.startsWith("/ugaas") && pathname !== "/ugaas/login" && !sessionCookie) {
    const loginUrl = new URL("/ugaas/login", request.url);
    if (pathname !== "/ugaas") {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/ugaas/:path*"],
};

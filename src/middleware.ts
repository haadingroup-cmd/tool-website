import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, authConfigured, clearSession, refreshSession, secondsLeft, writeSession } from "@/lib/auth/gotrue";

/**
 * Keeps the Supabase session fresh on signed-in pages only; every other page stays static.
 * When the access token is missing or about to expire, swap the refresh token for a new pair,
 * and pass the new cookies both to this request (so the page sees them) and back to the browser.
 */
export async function middleware(req: NextRequest) {
  const refresh = req.cookies.get(COOKIE.refresh)?.value;
  const access = req.cookies.get(COOKIE.access)?.value;
  if (!authConfigured() || !refresh || (access && secondsLeft(access) > 60)) return NextResponse.next();

  const session = await refreshSession(refresh).catch(() => null);
  if (!session) {
    for (const name of [COOKIE.access, COOKIE.refresh]) req.cookies.delete(name);
    const res = NextResponse.next({ request: req });
    clearSession(res.cookies);
    return res;
  }

  req.cookies.set(COOKIE.access, session.accessToken);
  req.cookies.set(COOKIE.refresh, session.refreshToken);
  const res = NextResponse.next({ request: req });
  writeSession(res.cookies, session);
  return res;
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/vendor/:path*", "/api/account/:path*", "/api/admin/:path*", "/api/vendor/:path*", "/api/me", "/api/reviews/:path*"],
};

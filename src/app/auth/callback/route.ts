import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, cookieOptions, exchangeCode, safeNext, writeSession } from "@/lib/auth/gotrue";
import { ensureProfile } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The magic link lands here with ?code=…; swap it (plus the verifier cookie) for a session. */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const verifier = req.cookies.get(COOKIE.verifier)?.value;
  const fail = (reason: string) => {
    const res = NextResponse.redirect(new URL(`/login/?error=${reason}`, url.origin), 303);
    res.cookies.set(COOKIE.verifier, "", cookieOptions(0));
    return res;
  };

  // Supabase reports expired or already-used links as ?error=…&error_code=otp_expired.
  if (url.searchParams.get("error") || !code) return fail("expired");
  // No verifier: the link was opened in a different browser from the one that asked for it.
  if (!verifier) return fail("browser");

  const session = await exchangeCode(code, verifier).catch(() => null);
  if (!session) return fail("expired");

  try {
    await ensureProfile(session.user.id);
  } catch {
    // The account works without the row; /account/ retries creating it.
    console.error("[auth] could not create profile row");
  }

  const res = NextResponse.redirect(new URL(safeNext(url.searchParams.get("next")), url.origin), 303);
  res.cookies.set(COOKIE.verifier, "", cookieOptions(0));
  writeSession(res.cookies, session);
  return res;
}

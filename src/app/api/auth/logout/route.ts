import { NextResponse, type NextRequest } from "next/server";
import { isSameOrigin, json } from "@/lib/security";
import { COOKIE, clearSession, signOut } from "@/lib/auth/gotrue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Plain HTML form POST from /account/, so it works without JavaScript. */
export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return json({ ok: false, error: "Forbidden." }, 403);
  const token = req.cookies.get(COOKIE.access)?.value;
  if (token) await signOut(token);
  const res = NextResponse.redirect(new URL("/", req.nextUrl.origin), 303);
  clearSession(res.cookies);
  return res;
}

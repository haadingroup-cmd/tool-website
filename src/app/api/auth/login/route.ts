import type { NextRequest } from "next/server";
import { loginSchema } from "@/lib/validation";
import { clientIp, guardPost, json, tooFast } from "@/lib/security";
import { CAPTCHA_ERROR, verifyTurnstile } from "@/lib/turnstile";
import { fakeOk, firstIssue } from "@/lib/api";
import {
  AuthNotConfiguredError,
  AuthRateLimitError,
  COOKIE,
  VERIFIER_MAX_AGE,
  cookieOptions,
  newCodeVerifier,
  safeNext,
  sendMagicLink,
} from "@/lib/auth/gotrue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "login", limit: 5, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.res;

  const parsed = loginSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  const { email, next, website, startedAt, turnstileToken } = parsed.data;
  if (website || tooFast(startedAt)) return fakeOk();
  if (!(await verifyTurnstile(turnstileToken, clientIp(req)))) return json({ ok: false, error: CAPTCHA_ERROR }, 403);

  // The link comes back to the host the user is on (production or a Vercel preview);
  // Supabase only honours it if it is in Authentication → URL Configuration → Redirect URLs.
  const callback = new URL("/auth/callback/", req.nextUrl.origin);
  callback.searchParams.set("next", safeNext(next));

  const verifier = newCodeVerifier();
  try {
    await sendMagicLink(email, callback.toString(), verifier);
  } catch (err) {
    if (err instanceof AuthRateLimitError) {
      return json({ ok: false, error: "Too many sign-in emails were requested. Please wait a few minutes and try again." }, 429);
    }
    if (err instanceof AuthNotConfiguredError) {
      console.error("[auth] SUPABASE_URL / SUPABASE_ANON_KEY are not set.");
      return json({ ok: false, error: "Sign-in is temporarily unavailable." }, 503);
    }
    return json({ ok: false, error: "We couldn't send the sign-in email. Please try again in a moment." }, 502);
  }

  const res = json({ ok: true });
  res.cookies.set(COOKIE.verifier, verifier, cookieOptions(VERIFIER_MAX_AGE));
  return res;
}

/**
 * Minimal Supabase Auth (GoTrue) client using fetch — no SDK, same approach as src/lib/db.ts.
 * Uses only the anon key. No "server-only" import so the middleware (edge runtime) can share it;
 * nothing here is ever imported by a client component.
 *
 * Flow: magic link with PKCE. The code verifier and the session tokens live in httpOnly cookies,
 * so the browser's JavaScript never sees a token.
 */

export const COOKIE = {
  access: "sb_access",
  refresh: "sb_refresh",
  verifier: "sb_verifier",
} as const;

// Supabase's default refresh-token lifetime is effectively unlimited; keep the browser cookie for 30 days.
export const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;
export const VERIFIER_MAX_AGE = 60 * 60; // magic links expire after 1 hour by default

export interface AuthUser {
  id: string;
  email: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export const authConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

export class AuthNotConfiguredError extends Error {
  constructor() {
    super("Auth is not configured");
  }
}

export class AuthRateLimitError extends Error {
  constructor() {
    super("Too many emails requested");
  }
}

function conn() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new AuthNotConfiguredError();
  return { url, key };
}

async function call(path: string, init: { method: "GET" | "POST"; body?: unknown; token?: string; query?: Record<string, string> }) {
  const { url, key } = conn();
  const endpoint = new URL(`/auth/v1/${path}`, url);
  for (const [k, v] of Object.entries(init.query ?? {})) endpoint.searchParams.set(k, v);
  return fetch(endpoint, {
    method: init.method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${init.token ?? key}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
}

// ---------- PKCE ----------

const b64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export function newCodeVerifier(): string {
  return b64url(crypto.getRandomValues(new Uint8Array(48)));
}

export async function codeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return b64url(new Uint8Array(digest));
}

// ---------- GoTrue endpoints ----------

/** Sends a magic link. New email addresses get an account on first use. */
export async function sendMagicLink(email: string, redirectTo: string, verifier: string): Promise<void> {
  const res = await call("otp", {
    method: "POST",
    query: { redirect_to: redirectTo },
    body: { email, create_user: true, code_challenge: await codeChallenge(verifier), code_challenge_method: "s256" },
  });
  if (res.status === 429) throw new AuthRateLimitError();
  if (!res.ok) {
    // Status only — never log the email address.
    console.error(`[auth] otp failed with status ${res.status}`);
    throw new Error("Magic link request failed");
  }
}

function toSession(data: Record<string, unknown>): Session | null {
  const user = data.user as { id?: string; email?: string } | undefined;
  if (typeof data.access_token !== "string" || typeof data.refresh_token !== "string" || !user?.id) return null;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: typeof data.expires_in === "number" ? data.expires_in : 3600,
    user: { id: user.id, email: user.email ?? "" },
  };
}

export async function exchangeCode(authCode: string, verifier: string): Promise<Session | null> {
  const res = await call("token", {
    method: "POST",
    query: { grant_type: "pkce" },
    body: { auth_code: authCode, code_verifier: verifier },
  });
  if (!res.ok) {
    console.error(`[auth] code exchange failed with status ${res.status}`);
    return null;
  }
  return toSession((await res.json()) as Record<string, unknown>);
}

export async function refreshSession(refreshToken: string): Promise<Session | null> {
  const res = await call("token", {
    method: "POST",
    query: { grant_type: "refresh_token" },
    body: { refresh_token: refreshToken },
  });
  if (!res.ok) return null;
  return toSession((await res.json()) as Record<string, unknown>);
}

/** Validates an access token with Supabase and returns its user, or null. */
export async function fetchUser(accessToken: string): Promise<AuthUser | null> {
  const res = await call("user", { method: "GET", token: accessToken });
  if (!res.ok) return null;
  const data = (await res.json()) as { id?: string; email?: string };
  return data.id ? { id: data.id, email: data.email ?? "" } : null;
}

/** Revokes this device's refresh token. Errors are ignored: cookies are cleared either way. */
export async function signOut(accessToken: string): Promise<void> {
  await call("logout", { method: "POST", token: accessToken, query: { scope: "local" } }).catch(() => undefined);
}

/** Seconds until a JWT expires (0 if unreadable). Timing hint only — never used to trust a token. */
export function secondsLeft(jwt: string): number {
  try {
    const payload = JSON.parse(atob(jwt.split(".")[1]!.replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp - Math.floor(Date.now() / 1000) : 0;
  } catch {
    return 0;
  }
}

// ---------- Cookies ----------

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, // the callback is a top-level GET from the email link, which Lax allows
  path: "/",
  maxAge,
});

interface CookieJar {
  set(name: string, value: string, options: ReturnType<typeof cookieOptions>): unknown;
}

export function writeSession(jar: CookieJar, s: Session) {
  jar.set(COOKIE.access, s.accessToken, cookieOptions(s.expiresIn));
  jar.set(COOKIE.refresh, s.refreshToken, cookieOptions(REFRESH_MAX_AGE));
}

export function clearSession(jar: CookieJar) {
  for (const name of Object.values(COOKIE)) jar.set(name, "", cookieOptions(0));
}

/** Only same-site relative paths are allowed as post-login destinations. */
export function safeNext(next: string | null | undefined, fallback = "/account/"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}

import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { SITE } from "./site";

/**
 * Best-effort in-memory sliding-window rate limiter.
 * On serverless platforms each instance has its own memory, so this throttles bursts per instance;
 * guardPost uses Upstash Redis for a global limit when it is configured.
 */
const buckets = new Map<string, number[]>();
const MAX_KEYS = 10_000;

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - hits[0]!)) / 1000);
    buckets.set(key, hits);
    return { ok: false, retryAfter };
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > MAX_KEYS) {
    // Drop the oldest entries to bound memory.
    const drop = buckets.size - MAX_KEYS;
    let i = 0;
    for (const k of buckets.keys()) {
      if (i++ >= drop) break;
      buckets.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}

/**
 * Global fixed-window limit shared by every server instance, via Upstash Redis's REST API.
 * Optional: without UPSTASH_REDIS_REST_URL / _TOKEN (or if Upstash is unreachable) it falls back to the in-memory limiter.
 */
async function sharedRateLimit(key: string, limit: number, windowMs: number): Promise<{ ok: boolean; retryAfter: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return rateLimit(key, limit, windowMs);
  const now = Date.now();
  const bucket = `rl:${key}:${Math.floor(now / windowMs)}`;
  try {
    const res = await fetch(`${url.replace(/\/+$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", bucket], ["PEXPIRE", bucket, String(windowMs)]]),
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const [incr] = (await res.json()) as { result?: number }[];
    const count = Number(incr?.result ?? 0);
    return count > limit ? { ok: false, retryAfter: Math.ceil((windowMs - (now % windowMs)) / 1000) } : { ok: true, retryAfter: 0 };
  } catch {
    console.error("[ratelimit] Upstash unavailable — using in-memory limiter");
    return rateLimit(key, limit, windowMs);
  }
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  return ip.slice(0, 64);
}

/** Reject cross-site POSTs (CSRF defence for JSON endpoints). */
export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return req.headers.get("sec-fetch-site") === "same-origin";
  try {
    const o = new URL(origin);
    const allowed = new Set([new URL(SITE.url).host, req.headers.get("host") ?? ""]);
    if (process.env.VERCEL_URL) allowed.add(process.env.VERCEL_URL);
    return allowed.has(o.host);
  } catch {
    return false;
  }
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

const MAX_BODY_BYTES = 16 * 1024;

/** Common guard for form POST endpoints: origin, content type, size, rate limit, JSON parse. */
export async function guardPost(
  req: NextRequest,
  opts: { key: string; limit: number; windowMs: number },
): Promise<{ ok: true; body: unknown } | { ok: false; res: NextResponse }> {
  if (!isSameOrigin(req)) return { ok: false, res: json({ ok: false, error: "Forbidden." }, 403) };

  const type = req.headers.get("content-type") ?? "";
  if (!type.toLowerCase().startsWith("application/json")) {
    return { ok: false, res: json({ ok: false, error: "Unsupported content type." }, 415) };
  }

  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return { ok: false, res: json({ ok: false, error: "Request too large." }, 413) };

  const rl = await sharedRateLimit(`${opts.key}:${clientIp(req)}`, opts.limit, opts.windowMs);
  if (!rl.ok) {
    return {
      ok: false,
      res: json({ ok: false, error: "Too many requests. Please try again shortly." }, 429, { "Retry-After": String(rl.retryAfter) }),
    };
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, res: json({ ok: false, error: "Invalid request." }, 400) };
  }
  if (raw.length > MAX_BODY_BYTES) return { ok: false, res: json({ ok: false, error: "Request too large." }, 413) };

  try {
    return { ok: true, body: JSON.parse(raw) as unknown };
  } catch {
    return { ok: false, res: json({ ok: false, error: "Invalid JSON." }, 400) };
  }
}

/** Bots typically submit within a second of page load. */
export const tooFast = (startedAt?: number) => typeof startedAt === "number" && Date.now() - startedAt < 1500;

import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { reviewSchema } from "@/lib/validation";
import { clientIp, guardPost, json, tooFast } from "@/lib/security";
import { DbWriteError, insertRow, selectRows } from "@/lib/db";
import { fakeOk, firstIssue, handleWriteError } from "@/lib/api";
import { ensureProfile, getCurrentUser } from "@/lib/auth/session";
import { productId } from "@/lib/reviews";
import { CAPTCHA_ERROR, verifyTurnstile } from "@/lib/turnstile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const URL_RE = /(https?:\/\/|www\.)\S+/gi;

/** Signals for the moderator, not an automatic verdict: every review is checked by a person anyway. */
function spamScore(text: string): number {
  let score = (text.match(URL_RE)?.length ?? 0) * 3;
  const letters = text.replace(/[^a-z]/gi, "");
  if (letters.length > 40 && letters.replace(/[^A-Z]/g, "").length / letters.length > 0.6) score += 2; // shouting
  if (/(.)\1{7,}/.test(text)) score += 2; // "!!!!!!!!" / "aaaaaaaa"
  if (/\b(discount|coupon|promo code|click here|dm me|whatsapp)\b/i.test(text)) score += 3;
  return Math.min(score, 100);
}

/** Pseudonymous IP fingerprint for spotting review rings; the raw IP is never stored. */
const ipHash = (ip: string) => createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").update(ip).digest("hex").slice(0, 32);

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "review", limit: 5, windowMs: 60 * 60_000 });
  if (!guard.ok) return guard.res;

  const user = await getCurrentUser();
  if (!user) return json({ ok: false, error: "Please sign in to write a review." }, 401);

  const parsed = reviewSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  const r = parsed.data;
  if (r.website || tooFast(r.startedAt)) return fakeOk();
  if (!(await verifyTurnstile(r.turnstileToken, clientIp(req)))) return json({ ok: false, error: CAPTCHA_ERROR }, 403);

  try {
    const id = await productId(r.productSlug);
    if (id == null) return json({ ok: false, error: "Unknown product." }, 404);

    // Review policy: vendors and their staff cannot review their own products.
    const claims = await selectRows("listing_claims", { product_id: `eq.${id}`, user_id: `eq.${user.id}`, status: "eq.verified" }, "id", { limit: 1 });
    if (claims.length) return json({ ok: false, error: "You manage this listing, so you can't review it." }, 403);

    await ensureProfile(user.id);
    await insertRow("reviews", {
      product_id: id,
      user_id: user.id,
      status: "submitted",
      overall: r.overall,
      ease_of_use: r.easeOfUse ?? null,
      features: r.features ?? null,
      value_for_money: r.valueForMoney ?? null,
      support: r.support ?? null,
      uk_suitability: r.ukSuitability ?? null,
      title: r.title,
      pros: r.pros,
      cons: r.cons,
      use_case: r.useCase || null,
      business_size: r.businessSize ?? null,
      duration_of_use: r.durationOfUse,
      connection: r.connection,
      spam_score: spamScore(`${r.title} ${r.pros} ${r.cons} ${r.useCase ?? ""}`),
      ip_hash: ipHash(clientIp(req)),
    });
    await insertRow("events", { name: "review_submit", path: `/tools/${r.productSlug}/`, product_id: id }).catch(() => undefined);
    return json({ ok: true });
  } catch (err) {
    if (err instanceof DbWriteError && err.status === 409) {
      return json({ ok: false, error: "You've already reviewed this product. Each person can review a product once." }, 409);
    }
    return handleWriteError(err);
  }
}

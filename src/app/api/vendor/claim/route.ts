import type { NextRequest } from "next/server";
import { vendorClaimSchema } from "@/lib/validation";
import { guardPost, json } from "@/lib/security";
import { DbWriteError, insertRow, selectRows } from "@/lib/db";
import { firstIssue, handleWriteError } from "@/lib/api";
import { ensureProfile, getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const host = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, "").toLowerCase(); } catch { return ""; } };

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "vendor-claim", limit: 5, windowMs: 60 * 60_000 });
  if (!guard.ok) return guard.res;

  const user = await getCurrentUser();
  if (!user) return json({ ok: false, error: "Please sign in again." }, 401);

  const parsed = vendorClaimSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  const { productSlug, jobTitle, evidence } = parsed.data;

  try {
    const [product] = await selectRows<{ id: number; website_url: string }>("products", { slug: `eq.${productSlug}` }, "id,website_url", { limit: 1 });
    if (!product) return json({ ok: false, error: "Unknown product." }, 404);
    const domain = host(product.website_url);
    const emailDomain = user.email.split("@")[1]?.toLowerCase() ?? "";
    const sameDomain = Boolean(domain && emailDomain && (emailDomain === domain || emailDomain.endsWith(`.${domain}`) || domain.endsWith(`.${emailDomain}`)));

    await ensureProfile(user.id);
    await insertRow("listing_claims", {
      product_id: product.id,
      user_id: user.id,
      // The sign-in link already proved the user controls this address; a moderator still approves every claim.
      method: sameDomain ? "company_email" : "manual",
      email: user.email,
      job_title: jobTitle,
      evidence: evidence || null,
    });
    return json({ ok: true });
  } catch (err) {
    if (err instanceof DbWriteError && err.status === 409) return json({ ok: false, error: "You already have a claim for this listing." }, 409);
    return handleWriteError(err);
  }
}

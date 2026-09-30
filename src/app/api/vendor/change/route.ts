import type { NextRequest } from "next/server";
import { changeRequestSchema } from "@/lib/validation";
import { guardPost, json } from "@/lib/security";
import { insertRow, selectRows } from "@/lib/db";
import { firstIssue, handleWriteError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "vendor-change", limit: 20, windowMs: 60 * 60_000 });
  if (!guard.ok) return guard.res;

  const user = await getCurrentUser();
  if (!user) return json({ ok: false, error: "Please sign in again." }, 401);

  const parsed = changeRequestSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  const { productSlug, field, value, evidenceUrl } = parsed.data;

  try {
    const [product] = await selectRows<{ id: number }>("products", { slug: `eq.${productSlug}` }, "id", { limit: 1 });
    if (!product) return json({ ok: false, error: "Unknown product." }, 404);
    // Only a verified claim on this exact product allows change requests.
    const claims = await selectRows("listing_claims", { product_id: `eq.${product.id}`, user_id: `eq.${user.id}`, status: "eq.verified" }, "id", { limit: 1 });
    if (!claims.length) return json({ ok: false, error: "Your claim on this listing hasn't been verified yet." }, 403);

    await insertRow("change_requests", { product_id: product.id, user_id: user.id, field, proposed: { value }, evidence_url: evidenceUrl || null });
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}

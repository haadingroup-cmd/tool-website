import type { NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { guardPost, json } from "@/lib/security";
import { insertRow, selectRows, updateRows } from "@/lib/db";
import { firstIssue, handleWriteError } from "@/lib/api";
import { audit } from "@/lib/audit";
import { STAFF_ROLES, getCurrentUser, getProfile } from "@/lib/auth/session";
import { REVIEWS_TAG } from "@/lib/reviews";
import { userEmail } from "@/lib/auth/admin";
import { emailConfigured, sendClaimDecisionEmail, sendReviewDecisionEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const id = z.number().int().positive();
const note = z.string().trim().max(1000).optional().default("");

const actionSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("review"), id, decision: z.enum(["publish", "reject", "keep"]), note }),
  z.object({ kind: z.literal("claim"), id, decision: z.enum(["verify", "reject"]), note }),
  z.object({ kind: z.literal("claim_request"), id, decision: z.enum(["verified", "rejected"]), note }),
  z.object({ kind: z.literal("submission"), id, decision: z.enum(["reviewing", "accepted", "rejected"]), note }),
  z.object({ kind: z.literal("message"), id, decision: z.enum(["handled", "open"]), note }),
  z.object({ kind: z.literal("change"), id, decision: z.enum(["approved", "rejected", "needs_info"]), note }),
]);
type Action = z.infer<typeof actionSchema>;

const now = () => new Date().toISOString();

async function refreshProductPage(productId: number) {
  const [p] = await selectRows<{ slug: string; name: string }>("products", { id: `eq.${productId}` }, "slug,name", { limit: 1 });
  revalidateTag(REVIEWS_TAG);
  if (p) revalidatePath(`/tools/${p.slug}/`);
  return p;
}

/** Best effort: a failed or unconfigured email never undoes or blocks the decision. */
async function notify(userId: string, sendTo: (email: string) => Promise<boolean>) {
  if (!emailConfigured()) return;
  const email = await userEmail(userId);
  if (email) await sendTo(email).catch(() => false);
}

async function run(a: Action, actor: string): Promise<boolean> {
  switch (a.kind) {
    case "review": {
      const [before] = await selectRows<{ status: string; product_id: number; user_id: string }>("reviews", { id: `eq.${a.id}` }, "status,product_id,user_id", { limit: 1 });
      if (!before) return false;
      if (a.decision !== "keep") {
        const status = a.decision === "publish" ? "published" : "rejected";
        await updateRows("reviews", { id: `eq.${a.id}` }, {
          status,
          moderated_by: actor,
          moderation_notes: a.note || null,
          ...(status === "published" && before.status !== "published" ? { published_at: now() } : {}),
        });
        await audit(actor, `review.${a.decision}`, "reviews", a.id, { status: before.status }, { status, note: a.note });
      } else {
        await audit(actor, "review.keep", "reviews", a.id, null, { note: a.note });
      }
      // Any decision closes the open reports on this review.
      await updateRows("review_reports", { review_id: `eq.${a.id}`, resolved_at: "is.null" }, { resolved_at: now(), resolved_by: actor });
      const product = await refreshProductPage(before.product_id);
      // Tell the reviewer only when their review's visibility actually changes.
      const published = a.decision === "publish";
      if (product && a.decision !== "keep" && (before.status === "published") !== published) {
        await notify(before.user_id, (to) => sendReviewDecisionEmail(to, { productName: product.name, productSlug: product.slug, published, reason: a.note || undefined }));
      }
      return true;
    }
    case "claim": {
      const [c] = await selectRows<{ status: string; product_id: number; user_id: string; products: { company_id: number | null; name: string } | null }>(
        "listing_claims", { id: `eq.${a.id}` }, "status,product_id,user_id,products(company_id,name)", { limit: 1 },
      );
      if (!c) return false;
      if (a.decision === "verify") {
        await updateRows("listing_claims", { id: `eq.${a.id}` }, { status: "verified", verified_at: now(), reviewed_by: actor, notes: a.note || null });
        if (c.products?.company_id) {
          await insertRow("vendor_accounts", { company_id: c.products.company_id, user_id: c.user_id }, { ignoreDuplicatesOn: "company_id,user_id" });
        }
        // Promote plain users only; staff keep their role.
        await updateRows("profiles", { user_id: `eq.${c.user_id}`, role: "eq.user" }, { role: "vendor" }, "user_id");
      } else {
        await updateRows("listing_claims", { id: `eq.${a.id}` }, { status: "rejected", reviewed_by: actor, notes: a.note || null });
      }
      await audit(actor, `claim.${a.decision}`, "listing_claims", a.id, { status: c.status }, { note: a.note });
      if (c.products) {
        const productName = c.products.name;
        await notify(c.user_id, (to) => sendClaimDecisionEmail(to, { productName, verified: a.decision === "verify", reason: a.note || undefined }));
      }
      return true;
    }
    case "claim_request":
      return simpleStatus("claim_requests", a, actor, { status: a.decision });
    case "submission":
      return simpleStatus("tool_submissions", a, actor, { status: a.decision });
    case "message":
      return simpleStatus("contact_messages", a, actor, { handled: a.decision === "handled" });
    case "change":
      return simpleStatus("change_requests", a, actor, { status: a.decision, notes: a.note || null, reviewed_by: actor, reviewed_at: now() });
  }
}

async function simpleStatus(table: "claim_requests" | "tool_submissions" | "contact_messages" | "change_requests", a: Action, actor: string, patch: Record<string, unknown>) {
  const changed = await updateRows(table, { id: `eq.${a.id}` }, patch);
  if (changed) await audit(actor, `${a.kind}.${a.decision}`, table, a.id, null, { ...patch, note: a.note || undefined });
  return changed > 0;
}

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "admin", limit: 120, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.res;

  const user = await getCurrentUser();
  const profile = user ? await getProfile(user.id).catch(() => null) : null;
  if (!user || !profile || !STAFF_ROLES.includes(profile.role)) return json({ ok: false, error: "Not allowed." }, 403);

  const parsed = actionSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);

  try {
    const done = await run(parsed.data, user.id);
    return done ? json({ ok: true }) : json({ ok: false, error: "Item not found." }, 404);
  } catch (err) {
    return handleWriteError(err);
  }
}

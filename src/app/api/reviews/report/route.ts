import type { NextRequest } from "next/server";
import { reportSchema } from "@/lib/validation";
import { guardPost, json } from "@/lib/security";
import { insertRow, selectRows } from "@/lib/db";
import { firstIssue, handleWriteError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Any signed-in user can report a published review; a moderator re-checks it. */
export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "report", limit: 10, windowMs: 60 * 60_000 });
  if (!guard.ok) return guard.res;

  const user = await getCurrentUser();
  if (!user) return json({ ok: false, error: "Please sign in to report a review." }, 401);

  const parsed = reportSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);

  try {
    const found = await selectRows("reviews", { id: `eq.${parsed.data.reviewId}`, status: "eq.published" }, "id", { limit: 1 });
    if (!found.length) return json({ ok: false, error: "Review not found." }, 404);
    // One report per person per review; repeats are silently accepted.
    await insertRow("review_reports", { review_id: parsed.data.reviewId, reporter_id: user.id, reason: parsed.data.reason }, { ignoreDuplicatesOn: "review_id,reporter_id" });
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}

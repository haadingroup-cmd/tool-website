import type { NextRequest } from "next/server";
import { profileSchema } from "@/lib/validation";
import { guardPost, json } from "@/lib/security";
import { firstIssue, handleWriteError } from "@/lib/api";
import { updateRows } from "@/lib/db";
import { ensureProfile, getCurrentUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "profile", limit: 10, windowMs: 10 * 60_000 });
  if (!guard.ok) return guard.res;

  const user = await getCurrentUser();
  if (!user) return json({ ok: false, error: "Please sign in again." }, 401);

  const parsed = profileSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);

  try {
    await ensureProfile(user.id);
    // Only display_name is writable here; role changes are admin-only.
    await updateRows("profiles", { user_id: `eq.${user.id}` }, { display_name: parsed.data.displayName }, "user_id");
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}

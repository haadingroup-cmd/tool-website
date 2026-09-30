import type { NextRequest } from "next/server";
import { claimSchema } from "@/lib/validation";
import { guardPost, json, tooFast } from "@/lib/security";
import { insertRow } from "@/lib/db";
import { toolBySlug } from "@/lib/catalog";
import { fakeOk, firstIssue, handleWriteError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "claim", limit: 3, windowMs: 30 * 60_000 });
  if (!guard.ok) return guard.res;

  const parsed = claimSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false, error: firstIssue(parsed.error) }, 422);
  const { website, startedAt, productSlug, contactName, jobTitle, companyDomain, email, message } = parsed.data;
  if (website || tooFast(startedAt)) return fakeOk();
  if (!toolBySlug(productSlug)) return json({ ok: false, error: "Please choose a product." }, 422);
  if (!email.toLowerCase().endsWith(`@${companyDomain}`))
    return json({ ok: false, error: "Please use an email address at your company domain so we can verify the claim." }, 422);

  try {
    await insertRow("claim_requests", { product_slug: productSlug, contact_name: contactName, email, job_title: jobTitle, company_domain: companyDomain, message });
    return json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}

import { type NextRequest } from "next/server";
import { z } from "zod";
import { guardPost, json } from "@/lib/security";
import { dbConfigured, insertRow } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// First-party, cookie-less product analytics. No IP address, user agent or identifier is stored.
const eventSchema = z.object({
  name: z.enum(["tool_view", "official_site_click", "compare_click", "search", "filter_use", "finder_complete", "newsletter_signup"]),
  path: z.string().max(200).regex(/^\/[\w\-/.]*$/).optional(),
  slug: z.string().max(80).regex(/^[a-z0-9-]+$/).optional(),
  props: z.record(z.string().max(40), z.union([z.string().max(120), z.number(), z.boolean()])).optional()
    .refine((p) => !p || Object.keys(p).length <= 10, "Too many properties"),
});

export async function POST(req: NextRequest) {
  const guard = await guardPost(req, { key: "events", limit: 60, windowMs: 60_000 });
  if (!guard.ok) return guard.res;
  const parsed = eventSchema.safeParse(guard.body);
  if (!parsed.success) return json({ ok: false }, 422);
  if (!dbConfigured()) return new Response(null, { status: 204 });
  const { name, path, slug, props } = parsed.data;
  try {
    await insertRow("events", { name, path: path ?? null, props: { ...(props ?? {}), ...(slug ? { slug } : {}) } });
  } catch {
    // Analytics must never break the page.
  }
  return new Response(null, { status: 204 });
}

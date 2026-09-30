import { after, NextResponse, type NextRequest } from "next/server";
import { toolBySlug } from "@/lib/catalog";
import { dbConfigured, insertRow } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Affiliate redirect. Only ever redirects to the URL stored in our catalogue for that
// slug (never to a URL taken from the request), so it cannot be used as an open redirect.
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const t = toolBySlug((await params).slug);
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer-when-downgrade" };
  if (!t) return new NextResponse("Not found", { status: 404, headers });
  const target = t.affiliateUrl ?? t.website;
  if (dbConfigured() && rateLimit(`go:${clientIp(req)}`, 30, 60_000).ok) {
    after(() =>
      insertRow("events", { name: t.affiliateUrl ? "affiliate_click" : "official_site_click", path: `/go/${t.slug}/`, props: { slug: t.slug } }).catch(() => undefined),
    );
  }
  return NextResponse.redirect(target, { status: 302, headers });
}

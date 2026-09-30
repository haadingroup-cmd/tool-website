import { SITEMAP_GROUPS } from "@/lib/urls";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_GROUPS.map((g) => `<sitemap><loc>${SITE.url}/sitemaps/${g}.xml</loc><lastmod>${SITE.lastUpdated}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

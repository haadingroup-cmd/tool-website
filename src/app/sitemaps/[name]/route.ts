import { SITEMAP_GROUPS, siteUrls, type UrlGroup } from "@/lib/urls";
import { absoluteUrl } from "@/lib/site";
import { escapeXml } from "@/lib/xml";

export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => SITEMAP_GROUPS.map((g) => ({ name: `${g}.xml` }));

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const group = (await params).name.replace(/\.xml$/, "") as UrlGroup;
  const urls = siteUrls().filter((u) => u.group === group);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${escapeXml(absoluteUrl(u.path))}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

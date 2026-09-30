import { GUIDES, guidePath } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { TOOLS } from "@/lib/catalog";
import { indexableListings } from "@/lib/listings";
import { altPages } from "@/lib/alternatives";
import { segmentPages } from "@/lib/segments";
import { bestPages } from "@/lib/best";
import { SITE } from "@/lib/site";

// Single registry of indexable URLs. Feeds the sitemap index and the content
// checker, so a page that is noindex or skipped never reaches a sitemap.

export type UrlGroup = "pages" | "listings" | "tools" | "content";
export interface SiteUrl { path: string; lastmod: string; group: UrlGroup }

const STATIC_PAGES = [
  "/", "/ai-tools/", "/software/", "/tools/", "/guides/", "/compare/",
  "/uk/", "/uk/making-tax-digital/", "/methodology/", "/industries/", "/use-cases/", "/find-my-tool/", "/best/", "/editorial-policy/", "/review-policy/", "/newsletter/", "/claim-listing/", "/authors/editorial-team/", "/about/", "/submit-tool/", "/contact/", "/affiliate-disclosure/", "/privacy-policy/", "/terms/",
];

export function siteUrls(): SiteUrl[] {
  const now = SITE.lastUpdated;
  return [
    ...STATIC_PAGES.map((path) => ({ path, lastmod: now, group: "pages" as const })),
    ...indexableListings().map((l) => ({ path: l.path, lastmod: now, group: "listings" as const })),
    ...TOOLS.map((t) => ({ path: `/tools/${t.slug}/`, lastmod: now, group: "tools" as const })),
    ...GUIDES.map((g) => ({ path: guidePath(g), lastmod: g.updated, group: "content" as const })),
    ...altPages().filter((p) => p.gate === "index").map((p) => ({ path: `/alternatives/${p.tool.slug}/`, lastmod: now, group: "content" as const })),
    ...segmentPages().filter((p) => p.gate === "index").map((p) => ({ path: p.path, lastmod: now, group: "listings" as const })),
    ...bestPages().map((p) => ({ path: p.path, lastmod: now, group: "listings" as const })),
    ...COMPARISONS.map((c) => ({ path: `/compare/${c.slug}/`, lastmod: c.updated, group: "content" as const })),
  ];
}

export const SITEMAP_GROUPS: UrlGroup[] = ["pages", "listings", "tools", "content"];

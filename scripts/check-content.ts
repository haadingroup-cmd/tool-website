// Content integrity check: unique slugs, valid references, resolvable internal links,
// redirect targets that exist, canonical comparison slugs and no comparison "winners".
// Run with `npm run check:content`. Exits non-zero on any problem.
import { readFileSync } from "node:fs";
import { TOOLS } from "../src/lib/catalog";
import { GUIDES } from "../src/data/guides";
import { COMPARISONS } from "../src/data/comparisons";
import { CATEGORIES } from "../src/data/taxonomy";
import { allListings, publishedListings } from "../src/lib/listings";
import { siteUrls } from "../src/lib/urls";
import { segmentPages } from "../src/lib/segments";
import { publishedAltPages } from "../src/lib/alternatives";
import type { Block, Section } from "../src/lib/types";

const errors: string[] = [];
const toolSlugs = new Set(TOOLS.map((t) => t.slug));
const catKeys = new Set<string>(CATEGORIES.map((c) => c.key));
const redirects: { source: string; destination: string }[] = JSON.parse(readFileSync(new URL("../src/data/redirects.json", import.meta.url), "utf8"));

const dupes = (name: string, slugs: string[]) =>
  slugs.filter((s, i) => slugs.indexOf(s) !== i).forEach((s) => errors.push(`duplicate ${name} slug: ${s}`));
dupes("tool", TOOLS.map((t) => t.slug));
dupes("guide", GUIDES.map((g) => g.slug));
dupes("comparison", COMPARISONS.map((c) => c.slug));
dupes("category", CATEGORIES.map((c) => c.key));

const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
const routes = new Set<string>([
  ...siteUrls().map((u) => norm(u.path)),
  ...publishedListings().map((l) => norm(l.path)), // noindex listings still render
  ...segmentPages().filter((p) => p.gate !== "skip").map((p) => norm(p.path)),
  ...publishedAltPages().map((p) => `/alternatives/${p.tool.slug}`),
  "/search", "/unsubscribe", "/login", "/account",
]);
const redirectSources = new Set(redirects.map((r) => norm(r.source)));

for (const r of redirects) {
  if (r.destination.includes(":")) continue; // pattern redirects (e.g. /blog/:slug)
  if (!routes.has(norm(r.destination))) errors.push(`redirect ${r.source} → ${r.destination}: destination does not exist`);
  if (routes.has(norm(r.source))) errors.push(`redirect ${r.source}: source is still a live page`);
}

const checkText = (where: string, text: string) => {
  for (const m of text.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
    const href = m[1]!;
    const path = norm(href.split("#")[0]!);
    if (href.startsWith("/")) {
      if (redirectSources.has(path)) errors.push(`${where}: links to redirected URL ${href}`);
      else if (!routes.has(path)) errors.push(`${where}: broken internal link ${href}`);
    } else if (!href.startsWith("https://")) errors.push(`${where}: non-https link ${href}`);
  }
};
const checkBlock = (where: string, b: Block) => {
  if (b.type === "p" || b.type === "h3" || b.type === "quote") checkText(where, b.text);
  if (b.type === "ul" || b.type === "ol") b.items.forEach((i) => checkText(where, i));
  if (b.type === "callout") checkText(where, b.text);
  if (b.type === "table") b.rows.flat().forEach((c) => checkText(where, c));
  if (b.type === "tools") b.slugs.forEach((s) => toolSlugs.has(s) || errors.push(`${where}: unknown tool ${s}`));
};
const checkSections = (where: string, sections: Section[]) => {
  const ids = sections.map((s) => s.id);
  ids.filter((s, i) => ids.indexOf(s) !== i).forEach((s) => errors.push(`${where}: duplicate section id ${s}`));
  sections.forEach((s) => s.blocks.forEach((b) => checkBlock(`${where}#${s.id}`, b)));
};

for (const t of TOOLS) {
  t.alternatives.forEach((a) => toolSlugs.has(a) || errors.push(`tool ${t.slug}: unknown alternative ${a}`));
  if (!t.categories.length) errors.push(`tool ${t.slug}: no categories`);
  t.categories.forEach((c) => catKeys.has(c) || errors.push(`tool ${t.slug}: unknown category ${c}`));
  if (t.score != null && (t.score < 0 || t.score > 10)) errors.push(`tool ${t.slug}: score out of range`);
  if (t.scores && t.score == null) errors.push(`tool ${t.slug}: sub-scores without an overall score`);
  if (!t.website.startsWith("https://")) errors.push(`tool ${t.slug}: website must be https`);
  if (t.pricing.status && t.pricing.status !== "unverified" && !(t.pricing.sourceUrl && t.pricing.checkedAt))
    errors.push(`tool ${t.slug}: verified price needs sourceUrl and checkedAt`);
  for (const [k, f] of Object.entries(t.uk)) {
    if (k === "ukIntegrations" || !f || typeof f !== "object" || !("status" in f)) continue;
    if ((f.status === "official_verified" || f.status === "source_verified") && !(f.source && f.checkedAt))
      errors.push(`tool ${t.slug}: uk.${k} marked verified without source/checkedAt`);
  }
  [t.summary, ...t.review].forEach((p) => checkText(`tool ${t.slug}`, p));
}
for (const g of GUIDES) {
  checkSections(`guide ${g.slug}`, g.sections);
  g.faqs.forEach((f) => checkText(`guide ${g.slug} faq`, f.a));
  g.relatedTools.forEach((s) => toolSlugs.has(s) || errors.push(`guide ${g.slug}: unknown related tool ${s}`));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g.updated) || !/^\d{4}-\d{2}-\d{2}$/.test(g.published)) errors.push(`guide ${g.slug}: bad date`);
}
for (const c of COMPARISONS) {
  [c.a, c.b].forEach((s) => toolSlugs.has(s) || errors.push(`comparison ${c.slug}: unknown tool ${s}`));
  if (!(c.a < c.b) || c.slug !== `${c.a}-vs-${c.b}`) errors.push(`comparison ${c.slug}: slug must be canonical "${[c.a, c.b].sort().join("-vs-")}" with a < b`);
  if (/\b(winner|wins|our pick|the verdict)\b/i.test(`${c.summary} ${c.faqs.map((f) => f.a).join(" ")}`)) errors.push(`comparison ${c.slug}: declares a winner`);
  checkSections(`comparison ${c.slug}`, c.sections);
  c.faqs.forEach((f) => checkText(`comparison ${c.slug} faq`, f.a));
}

const L = allListings();
const count = (g: string) => L.filter((l) => l.gate === g).length;

if (errors.length) {
  console.error(`✗ ${errors.length} content problem(s):\n${errors.map((e) => `  - ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `✓ content OK — ${TOOLS.length} products, ${GUIDES.length} guides, ${COMPARISONS.length} comparisons, ${CATEGORIES.length} categories; ` +
    `listings: ${count("index")} indexed, ${count("noindex")} noindex, ${count("skip")} not generated; ${siteUrls().length} sitemap URLs`,
);

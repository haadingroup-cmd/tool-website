import { TOOLS, byRank, toolBySlug } from "@/lib/catalog";
import { gateFor, qualityScore, type Gate } from "@/lib/quality";
import type { Tool } from "@/lib/types";

// /alternatives/{slug}/ — editor-curated alternatives first, then products sharing the
// primary category. Pages with too few genuine alternatives are not generated.

export interface AltPage { tool: Tool; alts: Tool[]; gate: Gate; quality: number }

export function alternativesFor(t: Tool): Tool[] {
  const curated = t.alternatives.map(toolBySlug).filter((x): x is Tool => Boolean(x));
  const primary = t.categories[0];
  const overlap = (x: Tool) => (x.categories[0] === primary ? 2 : 0) + x.categories.filter((c) => t.categories.includes(c)).length;
  const related = TOOLS.filter((x) => x.slug !== t.slug && !curated.includes(x) && overlap(x) > 0)
    .sort((a, b) => overlap(b) - overlap(a) || byRank(a, b));
  return [...curated, ...related].slice(0, 8);
}

let cache: AltPage[] | null = null;
export function altPages(): AltPage[] {
  if (cache) return cache;
  cache = TOOLS.map((tool) => {
    const alts = alternativesFor(tool);
    const quality = qualityScore({
      products: alts.length,
      introChars: tool.summary.length,
      criteria: 4,
      hasUkNotes: Boolean(tool.ukNotes),
      faqs: 3,
      relatedGuides: 1,
      scoredProducts: alts.filter((a) => a.score != null).length,
    });
    return { tool, alts, quality, gate: alts.length >= 3 ? gateFor(quality, alts.length) : "skip" };
  });
  return cache;
}

export const publishedAltPages = () => altPages().filter((p) => p.gate !== "skip");
export const altPageFor = (slug: string) => publishedAltPages().find((p) => p.tool.slug === slug);

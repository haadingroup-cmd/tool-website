import { GUIDES } from "@/data/guides";
import { INDUSTRIES, USE_CASES, type Segment } from "@/data/segments";
import { TOOLS, byRank } from "@/lib/catalog";
import { categoryHref } from "@/lib/listings";
import { gateFor, qualityScore, type Gate } from "@/lib/quality";
import { categoryByKey } from "@/data/taxonomy";
import type { Guide, Tool } from "@/lib/types";

export type SegmentKind = "industries" | "use-cases";
export interface SegmentPage {
  kind: SegmentKind;
  seg: Segment;
  path: string;
  tools: Tool[];
  guides: Guide[];
  links: { name: string; href: string }[];
  quality: number;
  gate: Gate;
}

function build(kind: SegmentKind, seg: Segment): SegmentPage {
  // Products from the segment's categories, in the segment's priority order, then by rank.
  const idx = (t: Tool) => Math.min(...t.categories.map((c) => { const i = seg.categories.indexOf(c); return i < 0 ? 99 : i; }));
  const tools = TOOLS.filter((t) => idx(t) < 99 || t.industries.includes(seg.slug) || t.useCases.includes(seg.slug))
    .sort((a, b) => idx(a) - idx(b) || byRank(a, b))
    .slice(0, 12);
  const guides = seg.guides.map((s) => GUIDES.find((g) => g.slug === s)).filter((g): g is Guide => Boolean(g));
  const links = seg.categories.map((k) => ({ name: categoryByKey(k)?.name ?? k, href: categoryHref(k) }));
  const quality = qualityScore({
    products: tools.length, introChars: seg.intro.length, criteria: seg.needs.length, hasUkNotes: Boolean(seg.ukNotes),
    faqs: 2, relatedGuides: guides.length, scoredProducts: tools.filter((t) => t.score != null).length,
  });
  return { kind, seg, path: `/${kind}/${seg.slug}/`, tools, guides, links, quality, gate: gateFor(quality, tools.length) };
}

let cache: SegmentPage[] | null = null;
export const segmentPages = () => (cache ??= [...INDUSTRIES.map((s) => build("industries", s)), ...USE_CASES.map((s) => build("use-cases", s))]);
export const publishedSegments = (kind: SegmentKind) => segmentPages().filter((p) => p.kind === kind && p.gate !== "skip");
export const segmentFor = (kind: SegmentKind, slug: string) => publishedSegments(kind).find((p) => p.seg.slug === slug);

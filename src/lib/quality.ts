// Programmatic-SEO quality gate (blueprint §N, master prompt §38).
// Every generated listing page is scored 0–100 from facts we actually have:
//   >= 70  index, in sitemap
//   50–69  rendered but noindex (useful to visitors, too thin for search)
//   < 50   not generated at all
// The inputs are deliberately simple and deterministic so the check can run in CI.

export interface QualityInput {
  products: number;
  /** Unique editorial intro, in characters. */
  introChars: number;
  /** Buying-criteria bullet points specific to this page. */
  criteria: number;
  hasUkNotes: boolean;
  faqs: number;
  relatedGuides: number;
  /** Products on the page that have been hands-on scored. */
  scoredProducts: number;
}

export function qualityScore(q: QualityInput): number {
  let s = 0;
  s += Math.min(q.products, 5) * 8; // up to 40: a list needs real choices
  s += q.introChars >= 250 ? 15 : q.introChars >= 120 ? 10 : q.introChars >= 60 ? 5 : 0;
  s += Math.min(q.criteria, 5) * 2; // up to 10
  s += q.hasUkNotes ? 10 : 0;
  s += Math.min(q.faqs, 3) * 3; // up to 9
  s += Math.min(q.relatedGuides, 2) * 3; // up to 6
  s += q.products ? Math.round((q.scoredProducts / q.products) * 10) : 0; // up to 10
  return Math.min(100, s);
}

export type Gate = "index" | "noindex" | "skip";
/** Hard floors on top of the score: an empty list is never generated, and a list of fewer than 3 products is never indexed. */
export const gateFor = (score: number, products = Infinity): Gate => {
  if (products === 0) return "skip";
  const g: Gate = score >= 70 ? "index" : score >= 50 ? "noindex" : "skip";
  return g === "index" && products < 3 ? "noindex" : g;
};

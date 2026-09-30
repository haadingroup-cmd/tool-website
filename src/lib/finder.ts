// Pure, rule-based matching for /find-my-tool/. Runs in the browser; every reason shown
// to the user comes from a listed fact, and unverified facts are flagged as such.

export interface FinderTool {
  slug: string;
  name: string;
  bestFor: string;
  categories: string[];
  free: boolean;
  trial: boolean;
  platforms: string[];
  mtd: boolean;
  ukData: boolean;
  ukBuilt: boolean;
  score: number | null;
  sub: { value: number; easeOfUse: number; ukFit: number; features: number } | null;
  text: string;
}

export interface Answers {
  need: string;          // category key
  industry: string;      // segment slug or ""
  size: "solo" | "small" | "medium" | "large";
  budget: "free" | "trial" | "any";
  platforms: string[];
  data: "required" | "preferred" | "no";
  mtd: "yes" | "no" | "unsure";
  uses: string[];        // e.g. "microsoft 365", "xero"
  priority: "easeOfUse" | "value" | "features" | "ukFit";
  ukVendor: boolean;
}

export interface Match { tool: FinderTool; points: number; reasons: string[]; caveats: string[] }

export function rank(tools: FinderTool[], a: Answers): { matches: Match[]; relaxed: string[] } {
  const relaxed: string[] = [];
  const base = tools.filter((t) => t.categories.includes(a.need));
  const hard = (t: FinderTool, relax: Set<string>) =>
    (relax.has("budget") || a.budget !== "free" || t.free) &&
    (relax.has("budget") || a.budget !== "trial" || t.free || t.trial) &&
    (relax.has("platform") || a.platforms.every((p) => t.platforms.includes(p))) &&
    (relax.has("data") || a.data !== "required" || t.ukData) &&
    (relax.has("mtd") || a.mtd !== "yes" || t.mtd);

  // If nothing passes every hard filter, relax them one at a time (and say so).
  const order = ["platform", "data", "budget", "mtd"];
  const relax = new Set<string>();
  let pool = base.filter((t) => hard(t, relax));
  for (const r of order) {
    if (pool.length) break;
    relax.add(r);
    relaxed.push(r);
    pool = base.filter((t) => hard(t, relax));
  }

  const matches = pool.map((t) => {
    let points = t.score ?? 6;
    const reasons: string[] = [];
    const caveats: string[] = [];
    reasons.push(`Suits: ${t.bestFor}`);
    if (t.free) reasons.push("Has a free plan");
    else if (t.trial) reasons.push("Offers a free trial");
    if (a.priority !== "ukFit" && t.sub) points += (t.sub[a.priority] - 8) * 0.8;
    if (a.priority === "ukFit") { if (t.sub) points += (t.sub.ukFit - 8) * 0.8; if (t.ukBuilt) points += 0.5; }
    if (a.data !== "no" && t.ukData) { points += a.data === "required" ? 0.5 : 0.3; reasons.push("UK/EU data-hosting option"); caveats.push("Data hosting not yet verified — check the vendor's DPA"); }
    if (a.mtd !== "no" && t.mtd) { points += 0.6; reasons.push("Listed as Making Tax Digital compatible"); caveats.push("Confirm on HMRC's compatible-software list"); }
    if (a.ukVendor && t.ukBuilt) { points += 0.6; reasons.push("UK-built company"); }
    for (const u of a.uses) if (t.text.includes(u)) { points += 0.4; reasons.push(`Works with ${u.replace(/\b\w/g, (c) => c.toUpperCase())}`); }
    if (a.size === "solo" && t.free) points += 0.3;
    if (a.size === "large" && t.sub && t.sub.features >= 9) points += 0.3;
    if (a.platforms.length && a.platforms.every((p) => t.platforms.includes(p))) reasons.push("Available on your platforms");
    if (t.score == null) caveats.push("Not yet tested by our editors");
    return { tool: t, points, reasons, caveats };
  });
  matches.sort((x, y) => y.points - x.points || x.tool.name.localeCompare(y.tool.name));
  return { matches: matches.slice(0, 5), relaxed };
}

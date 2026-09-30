import { BEST, type BestDef } from "@/data/best";
import { TOOLS, byRank } from "@/lib/catalog";
import type { Tool } from "@/lib/types";

export interface BestPage { def: BestDef; path: string; ranked: Tool[]; untested: Tool[] }

export function bestPages(): BestPage[] {
  return BEST.map((def) => {
    const pool = TOOLS.filter((t) => t.categories.some((c) => def.categories.includes(c)) && !def.exclude?.includes(t.slug)).sort(byRank);
    return { def, path: `/best/${def.slug}/`, ranked: pool.filter((t) => t.score != null), untested: pool.filter((t) => t.score == null) };
  }).filter((p) => p.ranked.length >= 3); // never a "best" list without at least 3 tested products
}
export const bestFor = (slug: string) => bestPages().find((p) => p.def.slug === slug);

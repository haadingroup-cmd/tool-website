import { TOOLS_INPUT } from "@/data/tools";
import { SOFTWARE_INPUT } from "@/data/tools-software";
import { ukCheckFor } from "@/data/tool-meta";
import { CATEGORIES, categoryByKey, categoryPath } from "@/data/taxonomy";
import type { Category, CategoryRoot, Tool } from "@/lib/types";

// Single read layer for product data. Pages import from here, never from src/data
// directly, so the source can move to Postgres (supabase/migrations) without
// touching page code. scripts/db-seed.ts loads this same shape into the database.

const DEFAULT_ADDED = "2026-09-01";

export const TOOLS: Tool[] = [...TOOLS_INPUT, ...SOFTWARE_INPUT].map((t) => ({
  ...t,
  platforms: t.platforms ?? ["web"],
  uk: ukCheckFor(t.slug, t.categories),
  addedAt: t.addedAt ?? DEFAULT_ADDED,
  useCases: t.useCases ?? [],
  industries: t.industries ?? [],
}));

const BY_SLUG = new Map(TOOLS.map((t) => [t.slug, t]));

export const toolBySlug = (slug: string) => BY_SLUG.get(slug);

/** Tested products first (by score), untested products after, alphabetically. */
export const byRank = (a: Tool, b: Tool) => (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name);

export const topTools = (n: number) => [...TOOLS].sort(byRank).slice(0, n);

export const toolsInCategory = (key: string) => TOOLS.filter((t) => t.categories.includes(key as Tool["categories"][number])).sort(byRank);

export const toolsInRoot = (root: CategoryRoot) => TOOLS.filter((t) => t.categories.some((c) => c.startsWith(`${root}/`))).sort(byRank);

/** Categories that currently have at least one product. */
export const liveCategories = (root?: CategoryRoot): Category[] =>
  CATEGORIES.filter((c) => (!root || c.root === root) && toolsInCategory(c.key).length > 0);

export const primaryCategory = (t: Tool) => categoryByKey(t.categories[0]!)!;

export const scoreLabel = (t: Tool) => (t.score == null ? "Not yet scored" : `${t.score.toFixed(1)}/10`);

export { CATEGORIES, categoryByKey, categoryPath };

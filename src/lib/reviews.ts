import "server-only";
import { dbConfigured, selectRows } from "./db";

export const REVIEWS_TAG = "reviews";
const REVALIDATE = 3600;

export interface PublicReview {
  id: number;
  display_name: string;
  overall: number;
  ease_of_use: number | null;
  features: number | null;
  value_for_money: number | null;
  support: number | null;
  uk_suitability: number | null;
  title: string;
  pros: string;
  cons: string;
  use_case: string | null;
  business_size: string | null;
  duration_of_use: string | null;
  verified_usage: boolean;
  published_at: string;
  connection: "none" | "competitor" | "partner";
}

export interface RatingSummary {
  review_count: number;
  avg_overall: number;
}

export const BUSINESS_SIZES = { solo: "Sole trader", "2-9": "2–9 staff", "10-49": "10–49 staff", "50-249": "50–249 staff", "250+": "250+ staff" } as const;
export const DURATIONS = { "<6m": "Less than 6 months", "6-12m": "6–12 months", "1-2y": "1–2 years", "2y+": "Over 2 years" } as const;
export const CONNECTIONS = { none: "No connection", competitor: "Works for or with a competitor", partner: "Reseller, partner or consultant for this product" } as const;

let idCache: { at: number; map: Map<string, number> } | null = null;

/**
 * Database id for a catalogue slug (products are seeded from src/data, so slugs match).
 * `cached` puts the lookup in Next's data cache — required inside statically generated pages,
 * where an uncached fetch would force the page to become dynamic.
 */
export async function productId(slug: string, cached = false): Promise<number | null> {
  if (cached) {
    const rows = await selectRows<{ id: number; slug: string }>("products", {}, "id,slug", { limit: 1000, revalidate: 86_400, tags: ["products"] });
    return rows.find((r) => r.slug === slug)?.id ?? null;
  }
  if (!idCache || Date.now() - idCache.at > 5 * 60_000) {
    const rows = await selectRows<{ id: number; slug: string }>("products", {}, "id,slug", { limit: 1000 });
    idCache = { at: Date.now(), map: new Map(rows.map((r) => [r.slug, r.id])) };
  }
  return idCache.map.get(slug) ?? null;
}

/**
 * Published reviews and the rating summary for a product page. Cached for an hour and refreshed
 * immediately when a moderator publishes or removes a review. Never throws: a page still renders
 * (without reviews) when the database is unreachable or not configured, e.g. in CI builds.
 */
export async function reviewsFor(slug: string): Promise<{ reviews: PublicReview[]; summary: RatingSummary | null }> {
  if (!dbConfigured()) return { reviews: [], summary: null };
  try {
    const id = await productId(slug, true);
    if (id == null) return { reviews: [], summary: null };
    const cacheOpts = { revalidate: REVALIDATE, tags: [REVIEWS_TAG] };
    const [reviews, summary] = await Promise.all([
      selectRows<PublicReview & Record<string, unknown>>("public_reviews", { product_id: `eq.${id}`, order: "published_at.desc" }, "*", { ...cacheOpts, limit: 50 }),
      // The view itself only returns products with at least 3 published reviews.
      selectRows<RatingSummary & Record<string, unknown>>("product_rating_summary", { product_id: `eq.${id}` }, "review_count,avg_overall", { ...cacheOpts, limit: 1 }),
    ]);
    const s = summary[0];
    return { reviews, summary: s && s.review_count >= 3 ? { review_count: s.review_count, avg_overall: Number(s.avg_overall) } : null };
  } catch {
    return { reviews: [], summary: null };
  }
}

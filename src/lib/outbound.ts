import type { Tool } from "./types";

/**
 * Outbound vendor links. Affiliate links go through /go/{slug}/ (disallowed in robots.txt,
 * logged as an affiliate click) and are marked rel="sponsored"; plain links are "nofollow".
 */
export const outboundUrl = (t: Tool) => (t.affiliateUrl ? `/go/${t.slug}/` : t.website);
export const outboundRel = (t: Tool) => (t.affiliateUrl ? "sponsored nofollow noopener" : "nofollow noopener noreferrer");

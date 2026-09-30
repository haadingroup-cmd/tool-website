# Build status against the blueprint

Last updated: 30 September 2026. Decisions applied: D1 `/best/{slug}/`, D2 single product URL `/tools/{slug}/`, D3 user reviews ship with auth (schema ready, UI deferred until Supabase keys exist).

## Done

| Phase | Delivered |
|---|---|
| 1 Data layer | Two-root taxonomy (`src/data/taxonomy.ts`, 46 categories). Catalogue read layer `src/lib/catalog.ts`. `Fact<T>` provenance with verification status. UK checks per product (`src/data/tool-meta.ts`). SQL migration + idempotent seed, round-trip tested on PostgreSQL 16 and in CI. |
| 2 Directories | `/ai-tools/`, `/software/`, category pages, curated lists, product-page UK suitability panel, price provenance labels, platform / UK-EU-data / MTD / free filters. |
| 3 Technical SEO | `trailingSlash: true` with canonical helper, 301 map (`src/data/redirects.json`), sitemap index + 4 child sitemaps from one URL registry (`src/lib/urls.ts`), quality gate, related-content links, `/go/` and `/search/` disallowed. |
| 5–6 Comparisons & UK | Neutral comparisons (no winner, canonical `a-vs-b` slugs, UK facts side by side), `/alternatives/`, `/best/` (only with ≥3 tested products), `/uk/` hub, MTD cluster separating "What HMRC says" from "Our explanation". |
| 7–9 Discovery | Industries, use cases, 10-step finder, rule-based natural-language search, 31 business-software listings (no invented prices or scores), `/go/` redirect, events API, claim-listing form, editorial / review policies, newsletter and author pages. |
| Auth | Magic-link sign-in (Supabase GoTrue, PKCE), httpOnly cookie session refreshed by middleware on `/account/`, `/admin/`, `/api/account/`; `/login/`, `/account/`, sign out; `profiles` row created on first login with a neutral display name. Needs Supabase URL configuration + a preview test. |
| Reviews | Signed-in review form on every product page (overall + 5 optional sub-ratings, connection disclosure, honesty confirmation, spam signals, IP fingerprint, one per person per product, vendors blocked from their own product). Stored as `submitted`; only `published` reviews show (via `public_reviews`); AggregateRating JSON-LD only from `product_rating_summary` (≥3). Product pages are ISR (1 h) and refresh immediately on a moderation decision. Report-a-review for signed-in users. |
| Admin | `/admin/` (roles moderator/editor/analyst/admin from `profiles.role`, everyone else gets 404): overview counts, review queue (waiting/reported/published/rejected), listing claims + public claim requests, vendor change requests, tool submissions, contact messages, audit log. Every decision goes through `/api/admin/action` and writes `audit_log`. |
| Vendors | `/vendor/`: signed-in users claim a listing (company-email match flagged for the moderator); once verified (role → vendor, `vendor_accounts` row) they send change requests with evidence. Scores, verdicts and reviews are never vendor-editable. |
| SEO dashboard | `/admin/seo/` (analyst/editor/admin): sitemap counts per child sitemap, quality score + gate for every generated listing/segment/alternatives page, noindex / not-generated filters, fact-verification counters. |
| Optional services | Code ready, switched on by env vars alone: Cloudflare Turnstile on sign-in and review forms (fails closed once configured; CSP allows Cloudflare only then), Upstash shared rate limits in every form endpoint (falls back to in-memory), Resend emails for review and claim decisions (reviewer email via the GoTrue admin API). |
| 10 Verification | check:content, typecheck, lint, build, full crawl (238 pages, 0 errors, 0 broken links, valid JSON-LD, sitemap = indexable pages), Playwright desktop + mobile (no console errors, no overflow), API tests. |

## Honest labels still on the site (need real checks)

- All UK facts and all prices are **"Not yet verified"**. GOV.UK was blocked by this build environment's network policy, so nothing was source-checked. Allow `www.gov.uk` (and vendor domains) in the environment's network settings, or have an editor check them, then set `status`, `source` and `checkedAt` — `check:content` rejects a "verified" fact without a source and date.
- The 31 new business-software products are listings, not reviews. Scores are added only after hands-on testing.

## Deferred (needs owner input — see ACCESS-CHECKLIST.md)

- Reviews, admin, vendor dashboard and SEO dashboard are built and tested end to end against PostgreSQL 16 + PostgREST locally. They need `supabase/migrations/0002_reviews_moderation.sql` run once in Supabase and an admin role set on the owner's profile.
- Keyword volumes for the quality gate need a keyword API (item 13).
- Keys for Turnstile (item 8), Upstash (item 9) and Resend (item 7); the code is ready and waits for them.

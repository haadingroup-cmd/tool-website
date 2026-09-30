# SmarterBiz.uk — Platform Blueprint (v1, for review)

Status: **draft for review. No production code is written against this document until it is approved** (master prompt §68 and §75).

This blueprint upgrades the existing site: Next.js 15, 37 tools, 18 guides, 10 comparisons and the Supabase-backed forms. It turns that site into the UK-first AI tools and business software discovery platform described in the master prompt. It builds on the current codebase; nothing is rebuilt from scratch.

Companion files:
- [`schema-draft.sql`](./schema-draft.sql): full PostgreSQL schema (ERD in DDL form)
- [`ACCESS-CHECKLIST.md`](./ACCESS-CHECKLIST.md): every account, key and decision needed from the owner

---

## 0. Technology choice (and why)

| Layer | Choice | Why |
|---|---|---|
| Frontend + server | **Next.js 15 (App Router), React 19, TypeScript**, as today | SSG/ISR for SEO pages, server components (little client JS), already built and passing CI |
| Database | **PostgreSQL on Supabase** (London region) | Already integrated. RLS, row-level audit and full-text search are built in, and it scales past 100k products |
| ORM / migrations | **Drizzle ORM + drizzle-kit** | Typed SQL, no heavy runtime, migrations in git |
| Search | **Postgres FTS (`tsvector`) + `pg_trgm`** for autocomplete and typos | No extra service for the MVP. `search_documents` is an abstraction, so Typesense or OpenSearch can replace it later |
| Natural-language search | **Rule-based query parser first**, optional LLM parser later | The parser turns text into structured filters and only ever queries the DB, so it never generates product facts |
| Auth | **Supabase Auth** (email + magic link, email verification) | Password hashing, sessions and verification are handled. Roles are enforced with RLS |
| Anti-spam | **Cloudflare Turnstile** plus the existing rate limits, honeypot and timing checks | Privacy-friendly CAPTCHA with no cookies |
| Storage | **Supabase Storage** (logos, screenshots) behind the Vercel image CDN | Upload validation, then WebP/AVIF delivered via `next/image` |
| Email | **Resend** (already wired) | Newsletter confirmations, review verification, vendor notifications |
| Analytics | **Plausible** (cookie-less) plus first-party event table | No consent banner needed for basic analytics. Custom events go to our own DB for the dashboards |
| Hosting | **Vercel** (EU region) plus Supabase London | CDN, ISR, preview deploys per PR |
| CI | GitHub Actions (already live) | Audit, content check, typecheck, lint, build; later also schema validation, link check and Lighthouse CI |

**Rendering strategy**

| Page type | Rendering |
|---|---|
| Product, category, comparison, guide | ISR. Statically generated, revalidated on admin edit via `revalidateTag('product:xero')`, with a daily safety revalidate |
| Search, tool finder, account, admin | Dynamic (SSR), `noindex` |
| API routes | Node runtime, rate-limited |

---

## Identified problems (to resolve before coding)

| # | Problem | Resolution proposed |
|---|---|---|
| P1 | Content lives in TypeScript files, which cannot scale to 10k+ products and cannot be edited without code | Migrate to Postgres. The TS files become a one-off **seed script**. Admin panel for all edits |
| P2 | **URL collision:** the prompt uses `/software/{category}/` *and* `/software/{product}/` (e.g. a product slug `crm` would collide with the CRM category) | **One canonical product URL: `/tools/{slug}/`** for every product (AI or not; `/tools/xero/` is fine and already live). Categories live under `/ai-tools/{cat}/` and `/software/{cat}/`. A reserved-slug list blocks collisions. `/software/{product}/` 301s to `/tools/{product}/` |
| P3 | Current comparisons declare a **winner**; the prompt forbids that | Remove the `winner` field; replace it with a neutral "best suited for" per product |
| P4 | Current prices are **approximate** (e.g. "~£18/mo"); the prompt forbids invented prices | Move to the `prices` table with `source_url`, `checked_at` and `verification_status`. Every existing price is re-checked from the vendor's page before migration; unverified prices show "Pricing not verified — check vendor" |
| P5 | Ratings: we have **editorial scores only**, no user reviews yet | Show "Editorial score" separately. `AggregateRating` schema is emitted **only** when ≥ 3 approved verified user reviews exist. No fake counts, ever |
| P6 | Existing URLs (`/categories/*`, `/guides/*`) must not break | Redirect manager: `/categories/finance-vat` → `/software/accounting/` etc. (301); a full map is generated at migration |
| P7 | E-E-A-T needs a **real named author**; the current byline is "Editorial Team" | Owner provides at least one real editor (name, photo, bio, LinkedIn). See the access checklist |
| P8 | Logos are trademarks | Use the vendor's official logo only where the brand guidelines allow it or after a claimed listing uploads it; otherwise keep the monogram tiles |
| P9 | "Top ranking in 3–6 months" on a new domain | Achievable for **long-tail UK intents** (e.g. "xero vs quickbooks uk", "mtd software for landlords"), not head terms like "best ai tools". The roadmap (§Z) targets those first. No one can guarantee rankings |
| P10 | 100k products means a single sitemap is impossible (50k URL limit) | Sitemap index with chunked child sitemaps (5k URLs each) generated from the DB |

---

## A. Complete sitemap

```
/                                   Home (hero search)
/ai-tools/                          AI tools hub
  /ai-tools/{category}/             20 categories (writing, image-generation, video, audio, music, coding,
                                    marketing, seo, sales, customer-support, productivity, research, education,
                                    presentation, design, finance, legal, healthcare, ecommerce, social-media)
  /ai-tools/free/  /free-trial/  /paid/  /uk/  /new/  /popular/
/software/                          Business software hub
  /software/{category}/             25 categories (accounting, crm, project-management, hr, payroll, marketing,
                                    seo, email-marketing, customer-support, helpdesk, erp, inventory, pos, ecommerce,
                                    website-builders, analytics, cybersecurity, communication, video-conferencing,
                                    document-management, legal, education, restaurant, real-estate, construction)
/tools/{slug}/                      Canonical product page (all products)
  /tools/{slug}/reviews/            User reviews (indexed only when ≥ 3 approved reviews)
  /tools/{slug}/pricing/            Pricing detail (indexed only with ≥ 2 verified plans)
/compare/                           Comparison hub
  /compare/{a}-vs-{b}/              Alphabetically-ordered pair (canonical); reverse order 301s
/alternatives/                      Alternatives hub
  /alternatives/{slug}/
/best/{slug}/                       "Best for" pages (e.g. /best/crm-for-small-business-uk/)
/use-cases/  /use-cases/{slug}/
/industries/ /industries/{slug}/
/guides/     /guides/{slug}/
/uk/                                UK hub
  /uk/making-tax-digital/           MTD cluster
    /software/  /xero/  /quickbooks/  /faq/
  /uk/gdpr-and-ai/                  (existing guide moves here)
/find-my-tool/                      Questionnaire (noindex results)
/search/                            Search (noindex)
/newsletter/                        Newsletter landing page
/submit-tool/  /claim-listing/      Vendor funnels
/account/ …                         User area (noindex)
/vendor/ …                          Vendor dashboard (noindex)
/admin/ …                           Admin (noindex, auth + IP-allowlist optional)
/about/ /contact/ /editorial-policy/ /review-policy/ /methodology/ /privacy/ /terms/ /affiliate-disclosure/
/authors/{slug}/                    Author profile pages (E-E-A-T)
/sitemap.xml (index) /robots.txt /llms.txt /llms-full.txt /feed.xml
```

**"Best for" URL decision:** the prompt shows root-level `/best-crm-for-small-business-uk/`. I recommend **`/best/…/`** instead: one route, no collision with future root pages, and the same SEO value. This is decision **D1** for the owner.

## B. URL rules

- Lowercase, hyphenated, trailing slash (`trailingSlash: true`, a single canonical form enforced by a 308 redirect).
- Slugs are immutable once published. Changing one writes a `redirects` row automatically (301).
- Comparison slugs are alphabetical (`quickbooks-vs-xero`); any other order 301s. This prevents duplicate intent.
- Filters use query params (`?free=1&platform=ios`), which are `noindex, follow` and canonicalised to the clean category URL. Only curated filter pages (e.g. `/ai-tools/free/`) are indexable static routes.
- Tracking params (`utm_*`, `ref`, `gclid`) are stripped from the canonical URL.
- Pagination: `?page=2`, self-canonical, indexable only up to page 5, with "View all in search" beyond that.

## C. Database ERD

The full DDL is in [`schema-draft.sql`](./schema-draft.sql). Entity overview:

```
companies 1─* products *─* categories (product_categories, is_primary)
products *─* use_cases (product_use_cases)       products *─* industries (product_industries)
products *─* integrations (product_integrations) products *─* platforms (product_platforms)
products 1─* features (product_features, grouped)  products 1─* prices (plans, currency, source, checked_at)
products 1─* uk_checks (one row per UK field, with source + status)
products 1─* fact_sources (generic provenance for any field)
products *─* products  (product_relations: alternative_of | competes_with | integrates_with)
comparisons (a_id, b_id, status, content) ─ comparison_sections
reviews (product_id, user_id, status, ratings…) ─ review_reports ─ review_votes
users (auth) ─ roles ─ vendor_accounts ─ listing_claims
submissions (vendor tool submissions)            guides / authors / guide_products
seo_pages (quality score, index decision, target keyword)   keyword_map (keyword → url, unique)
redirects   affiliate_links   placements (sponsored/featured, with start/end)   events   audit_log
```

## D. Product data model

The core fields follow master prompt §29. **Provenance** (§30) is handled by a generic `fact_sources` table:

```
fact_sources(product_id, field, value_json, source_url, source_type, verification_status, checked_at, checked_by)
verification_status ∈ official_verified | source_verified | vendor_reported | community_reported | unverified
```

- The UI renders the badge next to each fact ("Verified from official documentation · checked 30 Sep 2026", or "Vendor-reported").
- A product can be **published** only when its name, URL, category, description and ≥ 1 sourced price or "pricing not public" statement are present.

## E. Review data model

```
reviews(id, product_id, user_id, status, overall, ease_of_use, features, value, support,
        implementation, reliability, ux, uk_suitability,           -- 1–5, nullable except overall
        title, pros, cons, use_case, business_size, industry, role, company_size,
        duration_of_use, verified_email, verified_usage (screenshot/invoice reviewed by moderator),
        created_at, published_at, moderation_notes, spam_score, ip_hash, ua_hash)
status: submitted → pending → approved → published | rejected | reported → (re-review)
```

**Anti-spam controls**
- Turnstile on submission.
- Verified email is required.
- Rate limit: 3 reviews per user per day.
- Duplicate detection: trigram similarity > 0.8 against the same product.
- Suspicious-signal score: new account, burst from the same IP hash, vendor-domain email reviewing its own product. A high score forces manual review.
- **Nothing publishes without human approval.**

**Editorial score vs user reviews:** these are stored in separate tables and rendered in visually separate blocks. They are never averaged together.

## F. Comparison data model

```
comparisons(id, slug, product_a_id, product_b_id, status, intro, last_reviewed_at, author_id)
comparison_facets(comparison_id, facet, a_value, b_value, source_ids[])
   facets: pricing, free_plan, key_features, integrations, support, ease_of_use, uk_availability,
           gdpr, data_residency, mtd (accounting only), best_suited_for
```

- **No `winner` column.** The UI shows the facts side by side, plus "Choose A if… / Choose B if…".
- Facet values are **pulled live from product data** where possible, so comparisons never drift out of date.
- A comparison page is generated only for pairs in `product_relations(competes_with)` **and** with keyword demand (see §I).

## G. Category hierarchy

There are two roots: `ai-tools` (20 categories) and `software` (25 categories). Categories are a self-referencing tree (`parent_id`), so sub-categories can be added without code (e.g. `software/accounting/bookkeeping`).

The current 14 categories map onto the new tree:

| Current | New |
|---|---|
| ai-assistants | ai-tools/productivity + research |
| writing | ai-tools/writing |
| finance-vat | software/accounting |
| sales-crm | software/crm |
| marketing | ai-tools/marketing and software/marketing |
| customer-support | software/customer-support |
| automation | ai-tools/productivity (plus a new "automation" subcategory) |
| meetings | software/video-conferencing |
| design-video | ai-tools/design and ai-tools/video |
| presentations | ai-tools/presentation |
| research | ai-tools/research |
| ecommerce-web | software/ecommerce and software/website-builders |
| ai-detection | ai-tools/writing, subcategory "ai-detection" |
| productivity | ai-tools/productivity |

Old URLs 301 to the best new URL.

## H. Internal linking architecture

Every page computes a **related-content block** from the graph, never hand-written:

| Page | Links out to |
|---|---|
| Product | primary category, sibling top products (same category), alternatives, comparisons containing it, guides mentioning it, industries and use cases, MTD page (if accounting) |
| Category | parent/child categories, top products, comparisons within category, best-for pages, buying guide, related industries |
| Comparison | both products, both products' alternatives pages, the category, other comparisons of A and of B |
| Guide | products mentioned, category, related guides |

**Anchor-text rotation:** product name, "{name} review", "{name} pricing", or "{name} for UK businesses". The rotation is deterministic per link pair, which avoids exact-match stuffing.

**Other link rules**
- An **orphan check** in the SEO dashboard flags any indexable page with fewer than 3 internal inbound links.
- Breadcrumbs everywhere, with `BreadcrumbList` schema (already implemented).

## I. Programmatic SEO architecture

**Candidate generation.** A nightly job enumerates combinations: product × {category, use case, industry, platform, pricing type}, pairs from `competes_with`, and product → alternatives.

**Quality gate (`seo_pages`).** Each candidate is written to `seo_pages` with a **quality score 0–100**:

| Signal | Weight |
|---|---|
| Keyword demand (from `keyword_map` / keyword API) | 20 |
| Products matching (≥ 5 for lists, 2 for comparisons) | 15 |
| Data completeness of those products | 15 |
| Unique editorial text present (≥ 150 words not shared) | 20 |
| Internal inbound links ≥ 3 | 10 |
| No cannibalisation (keyword not already mapped to another URL) | 10 |
| Trust: author + sources present | 10 |

**Index decision:**

| Score | Result |
|---|---|
| ≥ 70 | `index`, added to the sitemap |
| 50–69 | Page renders but is `noindex`, shown in the "needs content" queue |
| < 50 | Page is **not generated** (404) |

The score is internal QA only. It is never shown to users and is not a "Google score".

**Cannibalisation control:** `keyword_map(keyword UNIQUE, url, intent)`. Creating a page whose target keyword is already mapped is blocked, and the editor must choose to merge, improve the existing page, or document a distinct intent.

## J. Admin dashboard architecture

`/admin` is role-gated (`admin`, `editor`, `moderator`, `analyst`). Every write goes to `audit_log`.

| Module | Key functions |
|---|---|
| Dashboard | Pending reviews/submissions/claims, stale-data alerts, top pages, errors |
| Products / Companies | CRUD, bulk CSV import, field-level sources, publish workflow, discontinue (→ alternatives) |
| Categories / Use cases / Industries | Tree editor, content blocks, FAQs |
| Pricing | Plans per product, currency, source, checked date, bulk "re-check due" list |
| Sources & Verification | Queue of facts older than 90 days or unverified |
| Reviews | Moderation queue, spam score, bulk actions, reports |
| Users / Vendors / Claims | Roles, vendor verification (email domain, DNS TXT, code), change requests |
| Submissions | Approve / reject / request changes → becomes a draft product |
| Comparisons / Alternatives / Best-for | Generator + quality score + editor text |
| Guides / Authors | Markdown/MDX editor, sources list, review and fact-check dates |
| SEO | Index/noindex overview, missing meta, duplicate titles, orphans, thin pages, schema errors, sitemap status |
| Redirects | 301 manager, chain detection |
| Affiliate links / Placements | Link cloaking `/go/{slug}` (rel=sponsored), sponsored slot scheduling with a mandatory label |
| Reports / Analytics | Events, outbound clicks, affiliate CTR, search terms with no results |
| Settings | Site config, feature flags, newsletter lists |

## K. API architecture

These are internal APIs (Next.js route handlers), versioned under `/api/v1/`:

| Area | Endpoints |
|---|---|
| Public (read) | `GET /api/v1/search?q=&filters=` (rate-limited), `GET /api/v1/autocomplete?q=`, `GET /api/v1/products/{slug}` (public subset) |
| User | `POST /api/v1/reviews`, `POST /api/v1/reviews/{id}/report`, `POST /api/v1/reviews/{id}/vote` |
| Vendor | `POST /api/v1/submissions`, `POST /api/v1/claims`, `POST /api/v1/claims/{id}/verify`, `POST /api/v1/change-requests` |
| Existing | `/api/subscribe`, `/api/unsubscribe`, `/api/contact` (moved under v1 with aliases) |
| Tracking | `POST /api/v1/events` (first-party, batched, no PII), `GET /go/{affiliateSlug}` (logs the click, then 302 to the vendor) |
| Admin | Server Actions (not public routes), all role-checked server-side |

A future paid data API (revenue item 10) would be a separate key-authenticated `/api/public/v1` with quotas.

## L. Authentication architecture

- **Users:** Supabase Auth with email magic link or password (bcrypt via Supabase). Email verification is required before reviewing.
- **Roles:** `profiles.role` ∈ {user, vendor, moderator, editor, analyst, admin}, enforced in both **RLS policies** and server code. Admins can optionally require TOTP 2FA.
- **Sessions:** HTTP-only, Secure, SameSite=Lax cookies via `@supabase/ssr`. No tokens in localStorage.
- **Vendors:** a normal account plus an approved `listing_claims` row. They can only raise *change requests*; they never write directly to product tables.

## M. Security architecture

The current controls are kept: strict CSP, HSTS, same-origin checks, zod validation, body limits, rate limits and honeypots. Additions:

| Area | Control |
|---|---|
| SQL injection | Drizzle parameterised queries only; no string SQL. RLS as a second wall |
| XSS | React escaping, no raw HTML. Guide MDX is compiled server-side from an allow-listed component set; user text is rendered as text only |
| CSRF | SameSite cookies, origin checks on mutations, Server Actions (built-in tokens) |
| Rate limiting | Upstash Redis (global), replacing the per-instance in-memory limiter |
| Uploads | Images only (PNG/JPEG/WebP/SVG sanitised), ≤ 2 MB, content-type sniffed, re-encoded, stored under random names |
| Secrets | Vercel env vars only; the service-role key is never used client-side |
| Audit | `audit_log` records every admin/vendor write (who, what, before/after) |
| Backups | Supabase daily backups plus weekly `pg_dump` to separate storage (Point-in-Time Recovery on the paid plan) |
| Dependencies | `npm audit` in CI (already), Dependabot, lockfile only |
| Admin | Optional IP allowlist + 2FA; `/admin` is `noindex` and excluded in robots |

## N. Monetisation architecture

| Stream | Mechanism | Disclosure |
|---|---|---|
| Affiliate | `affiliate_links` table → `/go/{slug}` redirect with click logging | "Affiliate link" label + `rel="sponsored"`; affiliate status never touches scores |
| Sponsored / featured | `placements` table (slot, product, start/end, price) | Labelled "Sponsored" or "Featured"; sponsored slots are separate from ranked lists |
| Vendor subscriptions | Stripe (later), enhanced profile: screenshots, videos, lead form | "Enhanced profile" label; editorial fields remain admin-controlled |
| Lead generation | Opt-in "Get quotes" form on category pages → vendor | Explicit consent text (UK GDPR) |
| Newsletter sponsorship | Resend/Beehiiv lists | Sponsor labelled in email |
| Ads | Only after 50k monthly visits; lazy-loaded, CLS-reserved slots | "Advertisement" label |
| Reports / API | Stripe checkout + keyed API | — |

The **independence rule** is enforced in code. The ranking/score functions have no access to `affiliate_links` or `placements`, and a unit test asserts this.

## O. UK-specific architecture

`uk_checks(product_id, field, value, source_url, verification_status, checked_at)` has one row per field:

| Field | Values |
|---|---|
| `uk_available` | yes / no / limited / unknown |
| `gbp_pricing` | available / not_available / unknown |
| `uk_vat_support` | yes / no / unknown |
| `uk_gdpr_info` | available / unknown (+ link to vendor DPA/privacy page) |
| `data_residency` | uk / eu / us / global / unknown |
| `mtd` | compatible / not_compatible / not_applicable / unknown (source: HMRC software list) |
| `companies_house` | yes / no / unknown |
| `uk_support` | yes / no / unknown |
| `uk_integrations` | list (e.g. UK bank feeds, HMRC, Companies House, Royal Mail, Sage) |

**How it surfaces**
- A "UK suitability" panel on every product page, with a badge per value showing its status.
- `unknown` is displayed as "Unknown — not yet verified", never hidden.
- Filters: "UK data residency", "MTD compatible", "GBP pricing".
- MTD cluster pages clearly separate an **"HMRC says"** box (quoted, linked to GOV.UK) from an **"Our explanation"** box.

**Prices**
- Stored in their original currency.
- GBP is shown when the vendor publishes GBP.
- Converted figures are shown only as "≈ £X (converted from $Y on {date}, estimate)".

## P. Schema.org implementation plan

| Page | Types |
|---|---|
| All | Organization, WebSite (+SearchAction), WebPage, BreadcrumbList |
| Product | SoftwareApplication (+ `offers` from verified prices only). A `Review` block for the editorial review is attributed to a named author. `AggregateRating` only when ≥ 3 approved user reviews exist, and it uses only those |
| Category / Best-for / Alternatives | ItemList (+ FAQPage when real FAQs exist) |
| Comparison | Article (`about` both SoftwareApplications) + FAQPage |
| Guide | Article (author Person, dateModified, citations) + HowTo only for true step-by-step guides |
| Author | Person (sameAs LinkedIn) |

- **Validation:** CI runs a JSON-LD validator on the built HTML of sample pages (schema-dts types + a custom rule set).
- The admin SEO dashboard shows schema errors per page.

## Q. Technical SEO implementation plan

**Already done:** canonicals, sitemap, robots, OG images, `llms.txt`, IndexNow, security headers, SSG.

**To add:**
- **Sitemap index** (`/sitemap.xml`) → `sitemaps/products-1.xml…`, `categories.xml`, `comparisons.xml`, `guides.xml`, `industries.xml`, `use-cases.xml`. Contents are DB-driven, include only `seo_pages.indexable = true`, and set `lastmod` from `updated_at`.
- **Faceted navigation control:** `robots` meta `noindex,follow` on parameter URLs, canonical to the clean URL, and `Disallow: /search` in robots.txt (already).
- **Redirect manager** backed by the DB and applied in Next middleware (edge-cached map), with a chain-flattening job.
- **Discontinued products:** keep the URL with a "Discontinued" banner plus alternatives (200). If it has no value, return a 410.
- **Core Web Vitals:** LCP < 2.0 s, CLS < 0.05, INP < 150 ms. Lighthouse CI budget in GitHub Actions blocks regressions.
- **Images:** `next/image` (AVIF/WebP, width/height, lazy), logo alt = product name only.
- **Hreflang:** `en-GB` + `x-default` (already). If US content is added later, use `en-US` variants.

## R. Homepage wireframe

```
┌──────────────────────────────────────────────────────────────┐
│ Header: logo · AI tools · Software · Compare · Guides · UK · 🔍│
├──────────────────────────────────────────────────────────────┤
│  H1: Find the right AI tools & business software for your     │
│      UK business                                              │
│  [ Search AI tools, software or business problems…   ] [Go]   │
│  Try: "MTD software for landlords" · "CRM for 10-person team" │
│  [ Not sure? → Find My Tool (2-min quiz) ]                    │
├──────────────────────────────────────────────────────────────┤
│ Popular categories (8 tiles: Accounting, CRM, AI writing…)    │
├──────────────────────────────────────────────────────────────┤
│ Trending tools (cards)          │ Popular comparisons (list)  │
├──────────────────────────────────────────────────────────────┤
│ UK essentials: MTD · UK GDPR · UK data residency (3 cards)    │
├──────────────────────────────────────────────────────────────┤
│ Recently added · Latest guides · Newsletter signup            │
├──────────────────────────────────────────────────────────────┤
│ Trust strip: methodology · independence · last updated        │
└──────────────────────────────────────────────────────────────┘
```

## S. Product page wireframe

```
Breadcrumb: Home › Software › Accounting › Xero
┌ Header ───────────────────────────────────────────────────────┐
│ [logo] Xero · Accounting software · ★ Editorial 8.8/10        │
│ Short description           [Visit official website ↗] [Compare] │
│ Free plan: No · Trial: 30 days · UK: Available · Updated 30 Sep 2026 │
└───────────────────────────────────────────────────────────────┘
Tabs/anchors: Overview · Pricing · Features · UK check · Reviews · Alternatives · FAQ
Main (8 cols)                              │ Sidebar (4 cols, sticky)
 Overview / Best for chips                 │  Scorecard (editorial)
 Key features (grouped, sourced)           │  User rating (if ≥3 reviews)
 Pricing table (plans × monthly/annual,    │  UK check summary badges
   currency, "checked {date}", source ↗)   │  Visit website CTA
 UK suitability panel (field · value ·     │  Compare with… (top 3)
   status badge · source)                  │  Newsletter
 Pros / Cons                               │
 User reviews (filter by size/industry)    │
 Alternatives (cards) · Comparisons        │
 FAQ · Sources & methodology · Author box  │
Related: tools · categories · guides · industries · use cases
```

## T. Category page wireframe

```
Breadcrumb · H1 "Best accounting software for UK businesses (2026)"
Intro (unique, 150–300 words) · "Our top picks" summary box (3 products + why)
[Filters: price · free plan · MTD · UK data · platform · team size]  [Sort]
Comparison table (sortable; mobile → cards)
Product cards (paged 20)
Buying guide section · UK considerations (VAT/MTD/GDPR) · Pricing overview
Who needs this · Key features to look for · Free options
Popular comparisons · Related categories · FAQ · Author/method/sources
```

## U. Comparison page wireframe

```
H1 "Xero vs QuickBooks for UK businesses"   Updated · Author
Neutral intro (what each is, who each suits)
Side-by-side header cards (logo, starting price, free/trial, CTA ×2)
Facet table: pricing · free plan · features · integrations · support · ease of use
             · UK availability · GDPR/data residency · MTD
"Choose Xero if…" | "Choose QuickBooks if…"
Pros/Cons each · Alternatives to both · Related comparisons · FAQ · Sources
(no "winner")
```

## V. Review component

```
Summary: user rating (n reviews) with distribution bars; sub-ratings (ease, value, support, UK suitability…)
Filters: business size · industry · role · rating
Review card: ★★★★☆ · title · pros · cons · use case · "Used for 1–2 years" · company size · industry
             · "Verified email" / "Verified user" badge · date · helpful? (vote) · report
[Write a review] → login → form (Turnstile) → pending moderation message
Editorial score block is visually separate and labelled "SmarterBiz editorial score".
```

## W. Search page

- **Autocomplete** (products, categories, comparisons) after 2 characters, debounced, via `pg_trgm`.
- **Results page:** grouped tabs (All · Tools · Categories · Comparisons · Guides · Use cases · Industries) and a filter sidebar. The URL is `/search?q=…&type=…`, `noindex, follow`.
- **Natural-language parsing:** "accounting software for a small UK business under £30/month" becomes `{category: accounting, uk_available: yes, max_monthly_gbp: 30, team_size: small}`. The applied filters are shown as removable chips.
- **Missing data:** "Information not available" is shown rather than guessed.
- **Zero-result queries** are logged to the admin as content ideas.

## X. Tool finder flow

```
10 steps (one question per screen, progress bar, skippable):
need → business type → team size → budget (£) → UK-based? → free/paid → integrations → tech level → industry → main goal
→ scoring = structured match (category, price ≤ budget, UK fields, integrations, platform) over published products
→ results: "Based on your selected requirements…" top 5 with "why it matched" + "what we couldn't check"
→ CTA: compare selected · email me these results (newsletter consent separate)
Results URL is shareable but noindex.
```

## Y. Content strategy

**Pillars (topic clusters)**

| Cluster | Pillar URL | Supporting content |
|---|---|---|
| Accounting & MTD | `/software/accounting/` | Products (Xero, QuickBooks, FreeAgent, Sage, Dext, FreshBooks, Zoho Books); comparisons (Xero vs QuickBooks, Xero vs FreeAgent, QuickBooks vs FreeAgent, Sage vs Xero); alternatives (Xero, QuickBooks, Sage); `/best/accounting-software-uk/`, `/best/accounting-software-for-sole-traders-uk/`; the MTD cluster (5 pages); guides such as "How to choose accounting software" |
| CRM | `/software/crm/` | HubSpot, Pipedrive, Salesforce, Zoho CRM, Capsule (UK-built), Freshsales; comparisons; best-for pages |
| AI assistants | `/ai-tools/productivity/` | ChatGPT, Claude, Gemini, Copilot, Le Chat; model comparison; GDPR guides |
| Payroll & HR | `/software/payroll/` | BrightPay (UK), Sage Payroll, Xero Payroll, Breathe HR (UK), BambooHR, CharlieHR (UK) |
| E-commerce | `/software/ecommerce/` | Shopify, WooCommerce, Wix, Squarespace, BigCommerce, Ekm (UK) |
| Project management | `/software/project-management/` | Asana, monday, ClickUp, Trello, Notion, Basecamp |

**First-90-day content targets:** 150 product pages, 45 category pages, 40 comparisons, 25 alternatives pages, 15 best-for pages, 10 industry pages, 8 use-case pages and 25 guides. Every page is individually edited; no bulk AI text.

**GEO/AEO:**
- Keep quick-answer boxes, FAQs, `llms.txt` and `llms-full.txt` (generated from the DB).
- Make fact tables quotable, each with a date and source.
- Consistent entity naming, with author `Person` sameAs.

**Off-page:** as in `SEO-PLAYBOOK.md` (digital PR with original UK data, vendor "Editor's Choice" badges, UK trade press, communities). No PBNs or paid links.

## Z. Launch roadmap (phases → the prompt's 10 phases)

| Week | Phase | Deliverable | Gate |
|---|---|---|---|
| 0 | **Review** | This blueprint approved; access checklist provided | Owner sign-off |
| 1–2 | 1 Foundation | Drizzle + migrations, Supabase Auth, roles, design system tokens, new nav/home, seed script from existing data, redirect map | CI green, Lighthouse ≥ 95 |
| 2–4 | 2 Directory | Products/categories DB-driven, `/ai-tools` & `/software` trees, filters, FTS search + autocomplete, new product page | 150 products migrated/added with sources |
| 4–5 | 3 SEO | Sitemap index, `seo_pages` quality gate, internal-link engine, schema validator, SEO dashboard | 0 schema errors, 0 orphans |
| 5–6 | 5 Comparisons | Facet-driven comparisons, alternatives, best-for pages | 40 comparisons live |
| 6–7 | 6 UK features | `uk_checks`, UK panel, MTD cluster, GBP price DB | Every accounting product has an MTD source |
| 7–8 | 4 Reviews | Accounts, review form, moderation queue, Turnstile | Moderation tested end-to-end |
| 8–10 | 7 Content | Guides, industries, use cases, tool finder, NL search | Content targets above |
| 10–11 | 8 Monetisation | `/go/` affiliate links, placements, vendor claims/change requests | Disclosure test passes |
| 11–12 | 9 Analytics | Event pipeline, dashboards | Events verified |
| 12 | 10 Audit | Security review, pen-test checklist, CWV, accessibility (axe), backup restore test | Launch checklist §74 all ✓ |

**Ranking expectation (honest):** a new domain typically needs 3–6 months to earn trust. By month 3, aim for page-1 positions on 50–150 long-tail UK queries (comparisons, "X alternatives UK", MTD, "for sole traders"). By month 6, aim for mid-tail category terms. Head terms ("best AI tools") need authority built through PR and links, which takes longer. Progress is tracked in Search Console weekly.

# What the owner needs to provide

Items are in priority order. **Never paste secret keys into chat or commit them to GitHub.** Add them in Vercel → Project → Settings → Environment Variables (and GitHub → Settings → Secrets for CI), then just say "done".

## Needed before Phase 1 starts (week 1)

| # | Item | Why | How |
|---|---|---|---|
| 1 | **Blueprint approval**, plus decisions D1–D3 below | The master prompt requires review before coding | Reply with "approved" or with changes |
| 2 | **Domain name** (e.g. smarterbiz.uk) and access to its DNS | Canonical URLs, email sending, Search Console | Buy the domain; share the registrar name |
| 3 | **Vercel project** connected to `haadingroup-cmd/tool-website` | Hosting, preview deploys | vercel.com → Add New → Project → import repo (defaults are fine) |
| 4 | **Supabase project** (region: London) | Database, auth, storage | supabase.com → New project. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` and `DATABASE_URL` (Session pooler connection string) to Vercel |
| 5 | **Real editor/author details**: name, photo, 80–150 word bio, LinkedIn URL | Google E-E-A-T; fake or anonymous authors hurt rankings | Send them as text; the photo can be uploaded later |
| 6 | **Business details**: legal name, company number (if registered), contact email | Footer, Organization schema, privacy policy | Send them as text |

## Needed by Phase 2–4 (weeks 2–8)

| # | Item | Why | How |
|---|---|---|---|
| 7 | **Resend** API key + verified sending domain | Email verification, newsletter, review notifications | resend.com → add domain (DNS records) → API key → Vercel `RESEND_API_KEY`, `EMAIL_FROM` |
| 8 | **Cloudflare Turnstile** site key + secret key | CAPTCHA on reviews/submissions | dash.cloudflare.com → Turnstile → add site |
| 9 | **Upstash Redis** (free tier) | Global rate limiting across servers | upstash.com → Redis → `UPSTASH_REDIS_REST_URL`/`TOKEN` |
| 10 | **Google Search Console** access (add me/the service account as a user) | Indexing, queries, SEO dashboard data | search.google.com/search-console → Settings → Users |
| 11 | **Bing Webmaster Tools** | Bing + ChatGPT search visibility | bing.com/webmasters → import from GSC |
| 12 | **Plausible** (or PostHog) account | Cookie-less analytics | plausible.io → add site |
| 13 | **Keyword data API**: Semrush API units top-up **or** a DataForSEO account | Real UK search volumes for the programmatic-SEO quality gate (Semrush currently has 0 API units; Ahrefs plan lacks Keywords Explorer; OpenRush credits are exhausted) | Semrush: top up at semrush.com/mcp-access. Cheaper alternative: dataforseo.com pay-as-you-go |

## Needed by Phase 7–8 (weeks 8–11)

| # | Item | Why |
|---|---|---|
| 14 | **Anthropic API key** (optional) | Upgrades natural-language search from rule-based to LLM parsing. It still only queries our DB and never generates product facts |
| 15 | **Affiliate network accounts** (e.g. PartnerStack, Impact, direct programmes such as HubSpot, Xero, Shopify) | Affiliate revenue |
| 16 | **Stripe** account | Vendor subscriptions, featured listings, reports |

## Decisions needed

- **D1: "Best for" URL format.** `/best/crm-for-small-business-uk/` (recommended) or root-level `/best-crm-for-small-business-uk/`.
- **D2: Product URL.** Keep `/tools/{slug}/` as the single canonical URL for all products (recommended; already live, and it avoids category/product collisions), or split into `/tools/` for AI tools and `/software/{slug}/` for software.
- **D3: User accounts at launch.** Launch reviews in Phase 4 as planned (recommended), or launch without user reviews and add them after the first traffic arrives.
- **D4: The old repo.** Close `haadingroup-cmd/testing-phase-2#6` now that the site lives in `tool-website`?

## What I can already do without any of the above

- Write the migrations, seed script, components and all code.
- Run everything locally against a real PostgreSQL 16 instance (the draft schema has already been applied successfully to one).
- Push to GitHub and run CI.
- Research vendor pricing and UK facts from official pages, each with a source and date.

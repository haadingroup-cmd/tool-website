# Handoff for the next session (read this first)

Repo: `haadingroup-cmd/tool-website`. Work on branch **`claude/platform-blueprint`** (PR #1, green). Full build status: `docs/STATUS.md`.
The owner communicates in Roman Urdu; keep instructions step by step and one small part at a time.

## Done by the owner (30 Sep 2026)
- New Supabase project (London), ref `plbrjrrvgrobxrvyahnr`.
- `supabase/setup-all.sql` run once in the SQL Editor → 41 public tables. `supabase/seed.sql` run → 68 products.
- Vercel env (tool-website project): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` updated to the new project; `SUPABASE_ANON_KEY`, `DATABASE_URL` added.
  Other existing vars there: `NEXT_PUBLIC_SITE_URL`, Google/Bing verification, `INDEXNOW_KEY` (leave as is).
- Claude environment: `SUPABASE_URL` env var; network access set to Full (verify with a request to www.gov.uk).
- No secret keys are available to Claude. Never ask for them in chat. The owner's other website uses a different Vercel project — don't touch it.

## Next work, in order
1. **Auth — code done (30 Sep 2026)**: magic link + PKCE, no SDK (`src/lib/auth/gotrue.ts`, `src/lib/auth/session.ts`, `src/middleware.ts`),
   `/login/`, `/account/` (display name, sign out), `/auth/callback/`, `profiles` row on first login. Tested end to end against a mock GoTrue/PostgREST.
   Owner set Supabase Site URL = the PR #1 preview URL and Redirect URL `https://*-haadingroup-4472s-projects.vercel.app/**`,
   and signed in + out successfully on the preview (30 Sep 2026). Change Site URL / add the production redirect once the domain is live.
   Supabase's built-in email only reaches the project's team members and is heavily rate-limited — custom SMTP (Resend) is needed before real users sign in.
2–5. **Reviews, admin/moderation, vendor dashboard, SEO dashboard — code done (30 Sep 2026)**, see `docs/STATUS.md`.
   Owner steps: run `supabase/migrations/0002_reviews_moderation.sql` in the SQL Editor; make their own profile admin with
   `update profiles set role = 'admin' where user_id = (select id from auth.users where email = '<their email>');`
   then test on the preview: `/admin/`, a review on any product page, `/vendor/`.
   Local test rig: PostgreSQL 16 (port 5433, socket /var/tmp) + PostgREST binary + a small GoTrue stand-in; see commit message of the reviews commit.
6. **Verify UK facts & prices — BLOCKED (30 Sep 2026)**: this session's egress proxy still denies www.gov.uk and vendor domains
   (curl and WebFetch both refused) although the owner set network to Full; retry in a new session. Only the GOV.UK MTD source URLs were
   updated to the current page addresses (found via web search); nothing was marked verified. When the network works: set `status`, `source`, `checkedAt` in `src/data/tool-meta.ts` / `src/data/uk.ts` / pricing; `check:content` enforces sources.
7. Then ask the owner for: author details, domain, Resend, Turnstile, DataForSEO (see `docs/ACCESS-CHECKLIST.md`), and whether to merge PR #1.

Testing without keys: local PostgreSQL 16 at `/usr/lib/postgresql/16/bin` (run as `postgres`, data dir under /var/tmp), plus Playwright (`npm root -g`/playwright). Real end-to-end checks happen on the Vercel preview.

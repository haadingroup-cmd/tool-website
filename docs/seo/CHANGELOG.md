# Changelog

## 2026-10-14 — Rebrand + UK & US expansion (branch claude/awesome-meitner-vj6q5b)
- Renamed SmarterBiz.uk → **HA Tools** everywhere (UI, logo, OG images, emails, schema, llms.txt, package name, docs); domain → https://www.hatools.boats.
- Markets: UK → **UK + US**. `html lang="en"`; hreflang en-GB + en-US + x-default; Organization `areaServed` both countries; Offers in GBP and USD.
- Every tool (37) now has a USD entry price (`pricing.usd`) and US notes (`usNotes`), shown on review pages, FAQs, llms-full.txt.
- New US guides: best AI tools for US small businesses; AI bookkeeping software (US); AI data privacy checklist (US).
- Removed the unverified "London" address from Organization schema (prompt book: no invented NAP).
- Replaced unverifiable first-hand "we tested / we ran" claims with accurate "reviewed/assessed" wording (prompt book C13/BL04).
- robots.txt: /search and /unsubscribe no longer blocked, so crawlers can see their `noindex` (prompt book T06).
- Privacy policy: added US visitor section (no sale/sharing, access/deletion requests). Affiliate disclosure references FTC.
- Checks passed: check:content, typecheck, lint, next build (94 sitemap URLs).
- Rollback: revert this commit.

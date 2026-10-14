# Access and authority (no secrets here)

| Service | Status | Needed for |
|---|---|---|
| GitHub repo | Read/write via session | Code changes — done |
| Hosting (Vercel or other) | Not connected | Deploy, domain hookup |
| DNS for hatools.boats | Not resolving | Point `www` + apex to hosting |
| Google Search Console | Not connected | Verify domain, submit sitemap, indexing reports |
| Bing Webmaster Tools | Not connected | Verify, submit sitemap, AI citation reports, IndexNow |
| GA4 / analytics | Not installed (site currently has no analytics cookies) | Baseline + conversions; needs consent banner if cookies used |
| Semrush MCP | Connected, **no API units** | US/UK keyword volumes |
| Ahrefs MCP | Connected, **plan insufficient** | Keyword volumes |
| OpenRush MCP | Connected, **no credits** | Keyword volumes |
| Supabase | Unknown | Forms (newsletter, contact, submit) |

Standing authority: owner allowed all repository changes. Deploying, DNS changes, outreach and spending still require the owner's own accounts.

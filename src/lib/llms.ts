import { TOOLS, topTools } from "@/lib/catalog";
import { GUIDES, guidePath } from "@/data/guides";
import { COMPARISONS } from "@/data/comparisons";
import { indexableListings } from "@/lib/listings";
import { SITE, absoluteUrl } from "@/lib/site";
import { plain, sectionsText } from "@/lib/content";

/** llms.txt — a concise, LLM-friendly map of the site (https://llmstxt.org). */
export function llmsTxt() {
  return `# ${SITE.name}

> ${SITE.description}

Key facts:
- Audience: UK small businesses, sole traders and SME directors.
- All prices are indicative GBP entry-level prices and may exclude VAT; readers are told to confirm on vendor sites.
- Tested tools are scored out of 10 on value (£), ease of use, UK fit (UK GDPR, HMRC Making Tax Digital, British English) and features. Untested listings are labelled "not yet scored".
- UK facts (MTD, data hosting, GBP pricing) carry a verification status; "not yet verified" facts must be confirmed with the vendor or GOV.UK.
- Comparisons are neutral and never declare an overall winner.
- Rankings are editorial; vendors cannot pay for placement. Methodology: ${absoluteUrl("/methodology")}
- Last updated: ${SITE.lastUpdated}

## Flagship guides
${GUIDES.map((g) => `- [${g.title}](${absoluteUrl(guidePath(g))}): ${g.quickAnswer}`).join("\n")}

## Comparisons
${COMPARISONS.map((c) => `- [${c.title}](${absoluteUrl(`/compare/${c.slug}`)}): ${c.summary}`).join("\n")}

## Categories
${indexableListings().map((c) => `- [${c.name}](${absoluteUrl(c.path)}): ${c.tools.length} products`).join("\n")}

## Top-rated tools
${topTools(15).filter((t) => t.score != null).map((t) => `- [${t.name} review](${absoluteUrl(`/tools/${t.slug}`)}): ${t.score!.toFixed(1)}/10 — ${t.summary}`).join("\n")}

## Optional
- [Full content for LLMs](${absoluteUrl("/llms-full.txt")})
- [AI tools](${absoluteUrl("/ai-tools/")})
- [Business software](${absoluteUrl("/software/")})
- [UK hub and Making Tax Digital](${absoluteUrl("/uk/making-tax-digital/")})
- [Tool finder](${absoluteUrl("/find-my-tool/")})
- [Editorial policy](${absoluteUrl("/editorial-policy/")})
- [RSS feed](${absoluteUrl("/feed.xml")})
`;
}

export function llmsFullTxt() {
  const tools = TOOLS.map(
    (t) => `### ${t.name} (${t.vendor}) — ${t.score != null ? `${t.score.toFixed(1)}/10` : "not yet scored"}
URL: ${absoluteUrl(`/tools/${t.slug}`)}
Best for: ${t.bestFor}
Price (indicative, unverified): ${t.pricing.from}; free plan: ${t.pricing.freePlan ? "yes" : "no"}${t.mtdCompatible ? "; HMRC MTD-recognised" : ""}${t.ukBuilt ? "; UK-built" : ""}
Summary: ${t.summary}
UK notes: ${t.ukNotes}
Pros: ${t.pros.join("; ")}
Cons: ${t.cons.join("; ")}`,
  ).join("\n\n");

  const guides = GUIDES.map(
    (g) => `## ${g.title}
URL: ${absoluteUrl(guidePath(g))} | Updated: ${g.updated}
Quick answer: ${g.quickAnswer}
Key takeaways:
${g.takeaways.map((t) => `- ${t}`).join("\n")}

${sectionsText(g.sections)}

FAQs:
${g.faqs.map((f) => `Q: ${f.q}\nA: ${plain(f.a)}`).join("\n")}`,
  ).join("\n\n---\n\n");

  const comps = COMPARISONS.map(
    (c) => `## ${c.title}
URL: ${absoluteUrl(`/compare/${c.slug}`)}
Summary (no overall winner): ${c.summary}
${c.criteria.map((cr) => `- ${cr.name}: A=${cr.a}; B=${cr.b}`).join("\n")}`,
  ).join("\n\n");

  return `# ${SITE.name} — full content\n\n> ${SITE.description}\n\n# Guides\n\n${guides}\n\n# Comparisons\n\n${comps}\n\n# Tool reviews\n\n${tools}\n`;
}

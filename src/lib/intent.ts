import { CATEGORIES } from "@/data/taxonomy";
import { INDUSTRIES } from "@/data/segments";
import { TOOLS, byRank } from "@/lib/catalog";
import type { Platform, Tool } from "@/lib/types";

// Rule-based natural-language search (blueprint §Q). Turns a query such as
// "free crm for estate agents with uk data on iphone" into structured filters and
// returns matching products from our catalogue only — it never generates facts.

export interface Intent {
  categories: string[];
  free: boolean;
  mtd: boolean;
  ukData: boolean;
  ukBuilt: boolean;
  platforms: Platform[];
  industry?: string;
  labels: string[];
}

const PLATFORM_WORDS: [RegExp, Platform, string][] = [
  [/\b(iphone|ipad|ios)\b/, "ios", "iPhone/iPad"],
  [/\bandroid\b/, "android", "Android"],
  [/\b(mac|macos)\b/, "mac", "Mac"],
  [/\bwindows\b/, "windows", "Windows"],
  [/\b(self[- ]?host(ed)?|on[- ]?prem)\b/, "self-hosted", "Self-hosted"],
  [/\bapi\b/, "api", "API"],
];

// Extra synonyms that map to category keys.
const SYNONYMS: [RegExp, string][] = [
  [/\b(bookkeeping|invoic\w*|vat return|accounts? software)\b/, "software/accounting"],
  [/\b(sales pipeline|leads?|customer database)\b/, "software/crm"],
  [/\b(chat ?bot|live chat)\b/, "ai-tools/customer-support"],
  [/\b(ticket\w*|help ?desk)\b/, "software/helpdesk"],
  [/\b(zap\w*|automat\w*|workflows?|integrat\w* apps)\b/, "software/automation"],
  [/\b(transcri\w*|meeting notes?|note[- ]?taker)\b/, "software/video-conferencing"],
  [/\b(deck|slides|powerpoint)\b/, "ai-tools/presentation"],
  [/\b(newsletter|email campaign\w*)\b/, "software/email-marketing"],
  [/\b(password\w*)\b/, "software/cybersecurity"],
  [/\b(online shop|e-?commerce store|sell online)\b/, "software/ecommerce"],
  [/\b(till|card reader|card payments?)\b/, "software/pos"],
  [/\b(rota|holiday booking|absence)\b/, "software/hr"],
  [/\b(kanban|task management)\b/, "software/project-management"],
  [/\b(chatgpt alternative|ai assistant|chat assistant)\b/, "ai-tools/productivity"],
];

export function parseIntent(query: string): Intent {
  const q = ` ${query.toLowerCase()} `;
  const i: Intent = { categories: [], free: false, mtd: false, ukData: false, ukBuilt: false, platforms: [], labels: [] };
  const add = (key: string) => { if (!i.categories.includes(key)) i.categories.push(key); };

  for (const c of CATEGORIES) {
    const short = c.short.toLowerCase();
    if (short.length > 2 && new RegExp(`\\b${short.replace(/[^a-z0-9 ]/g, "")}\\b`).test(q)) add(c.key);
  }
  if (/\bcrm\b/.test(q)) add("software/crm");
  if (/\bpos\b/.test(q)) add("software/pos");
  if (/\bseo\b/.test(q)) add("software/seo");
  if (/\bhr\b/.test(q)) add("software/hr");
  if (/\berp\b/.test(q)) add("software/erp");
  for (const [re, key] of SYNONYMS) if (re.test(q)) add(key);
  // Prefer the AI root when the query says "ai", otherwise software, when both roots share a slug.
  const wantsAi = /\bai\b/.test(q);
  i.categories = i.categories.filter((k) => {
    const slug = k.split("/")[1];
    const both = i.categories.filter((x) => x.split("/")[1] === slug).length > 1;
    return !both || k.startsWith(wantsAi ? "ai-tools/" : "software/");
  });

  if (/\bfree\b/.test(q)) i.free = true;
  if (/\b(mtd|making tax digital|hmrc)\b/.test(q)) i.mtd = true;
  if (/\buk[- ](hosted|data|servers?)\b|\bdata (in|stored in) (the )?uk\b|\bgdpr\b/.test(q)) i.ukData = true;
  if (/\b(uk[- ]built|british[- ](made|company)|uk company)\b/.test(q)) i.ukBuilt = true;
  for (const [re, p, label] of PLATFORM_WORDS) if (re.test(q)) { i.platforms.push(p); i.labels.push(label); }
  const ind = INDUSTRIES.find((s) => q.includes(s.slug.replace("-", " ")) || q.includes(s.name.toLowerCase().split(" ")[0]!.replace(/s$/, "")));
  if (ind) i.industry = ind.slug;

  i.labels.unshift(
    ...i.categories.map((k) => CATEGORIES.find((c) => c.key === k)!.name),
    ...(i.free ? ["Free plan"] : []),
    ...(i.mtd ? ["Making Tax Digital"] : []),
    ...(i.ukData ? ["UK/EU data hosting"] : []),
    ...(i.ukBuilt ? ["UK-built"] : []),
    ...(ind ? [ind.name] : []),
  );
  return i;
}

export const hasFilters = (i: Intent) => i.categories.length > 0 || i.free || i.mtd || i.ukData || i.ukBuilt || i.platforms.length > 0;

export function matchTools(i: Intent, limit = 8): Tool[] {
  if (!hasFilters(i)) return [];
  const industryCats = i.industry ? INDUSTRIES.find((s) => s.slug === i.industry)?.categories ?? [] : [];
  return TOOLS.filter(
    (t) =>
      (!i.categories.length || t.categories.some((c) => i.categories.includes(c))) &&
      (i.categories.length || !industryCats.length || t.categories.some((c) => industryCats.includes(c))) &&
      (!i.free || t.pricing.freePlan) &&
      (!i.mtd || t.uk.mtd.value === "compatible") &&
      (!i.ukData || ["uk", "eu"].includes(t.uk.dataResidency.value)) &&
      (!i.ukBuilt || t.ukBuilt) &&
      i.platforms.every((p) => t.platforms.includes(p)),
  )
    .sort(byRank)
    .slice(0, limit);
}

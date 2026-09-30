import { GUIDES } from "@/data/guides";
import { CATEGORIES, categoryPath, ROOTS } from "@/data/taxonomy";
import { TOOLS, byRank, toolsInRoot } from "@/lib/catalog";
import { gateFor, qualityScore, type Gate } from "@/lib/quality";
import type { Category, CategoryRoot, Faq, Guide, Tool } from "@/lib/types";

// Listing pages under /ai-tools/ and /software/: one per category plus a few
// curated cuts (free, paid, UK-built…). Each passes through the quality gate.

export interface Listing {
  root: CategoryRoot;
  slug: string;
  path: string;
  kind: "category" | "curated";
  name: string;
  h1: string;
  title: string;
  description: string;
  intro: string;
  keyword: string;
  icon: string;
  criteria: string[];
  ukNotes: string;
  tools: Tool[];
  guides: Guide[];
  faqs: Faq[];
  quality: number;
  gate: Gate;
  category?: Category;
}

interface Curated {
  slug: string;
  name: string;
  icon: string;
  keyword: string;
  intro: string;
  criteria: string[];
  ukNotes: string;
  pick: (t: Tool) => boolean;
}

const CURATED: Record<CategoryRoot, Curated[]> = {
  "ai-tools": [
    {
      slug: "free", name: "Free AI Tools", icon: "Sparkles", keyword: "free ai tools for business",
      intro: "Every AI tool on this page has a genuinely free plan — not just a trial — so you can test it on real work before spending anything. Free plans usually limit usage, features or team size, and some use your inputs to improve their models, so check the data settings before pasting in anything confidential.",
      criteria: ["How generous the free usage limits are", "Whether free-plan data is used for training", "Which features are held back for paid tiers", "Whether a team can share one free workspace"],
      ukNotes: "Free consumer plans often have weaker data-protection terms than business plans. Don't process customer or staff personal data on a free plan without checking the privacy policy and opt-outs.",
      pick: (t) => t.pricing.freePlan,
    },
    {
      slug: "free-trial", name: "AI Tools with a Free Trial", icon: "Rocket", keyword: "ai tools free trial",
      intro: "These AI tools don't have a permanent free plan but do let you trial them before paying. A trial is the best time to test a tool on your own documents and workflows, so plan what you want to evaluate before you start the clock, and set a reminder before any automatic renewal.",
      criteria: ["Trial length and whether a card is required", "Which plan the trial unlocks", "Whether data is kept if you don't convert", "Cancellation terms"],
      ukNotes: "Under UK consumer law, business purchases have fewer cancellation rights than consumer ones — read the renewal terms before the trial ends.",
      pick: (t) => !t.pricing.freePlan && Boolean(t.pricing.trial),
    },
    {
      slug: "paid", name: "Paid AI Tools", icon: "BadgeCheck", keyword: "paid ai tools for business",
      intro: "Paid-only AI tools that skip a free tier, usually because they target businesses with specific needs such as avatar video, SEO data or enterprise meeting capture. Prices shown are indicative entry points in sterling and may exclude VAT; always confirm on the vendor's pricing page before you buy.",
      criteria: ["Entry price and how it scales per seat or usage", "Monthly versus annual commitment", "Business-grade data-protection terms", "Support and onboarding included"],
      ukNotes: "Check whether prices are quoted in GBP or converted from USD, and whether VAT is added at checkout.",
      pick: (t) => !t.pricing.freePlan,
    },
    {
      slug: "uk", name: "UK-Built AI Tools", icon: "ShieldCheck", keyword: "uk ai tools",
      intro: "AI tools built by companies founded or headquartered in the UK. Being UK-built doesn't automatically mean UK data hosting, but UK vendors tend to price in sterling, understand HMRC and UK GDPR requirements, and offer support during UK business hours — which matters when something breaks on a Monday morning.",
      criteria: ["Where customer data is actually hosted", "Sterling pricing and VAT invoices", "UK-hours support", "Integrations with UK banks, HMRC and UK platforms"],
      ukNotes: "Headquarters and data location are different things; check the data-processing terms for hosting regions.",
      pick: (t) => Boolean(t.ukBuilt),
    },
  ],
  software: [
    {
      slug: "free", name: "Free Business Software", icon: "Sparkles", keyword: "free business software uk",
      intro: "Business software with a free-forever plan: CRM, automation, design and website tools you can run a small business on before paying for an upgrade. Free tiers usually cap users, records or automation runs, so check where the ceiling is before you build your processes around one.",
      criteria: ["User, contact or task limits", "Whether key integrations are paid-only", "Branding on free plans", "The price of the first paid tier"],
      ukNotes: "Free plans still process personal data — you remain the data controller under UK GDPR.",
      pick: (t) => t.pricing.freePlan,
    },
  ],
};

const relatedGuides = (tools: Tool[]) =>
  GUIDES.filter((g) => g.relatedTools.some((s) => tools.some((t) => t.slug === s))).slice(0, 4);

function faqsFor(name: string, tools: Tool[], ukNotes: string): Faq[] {
  const lower = name.toLowerCase();
  const scored = tools.filter((t) => t.score != null);
  const free = tools.filter((t) => t.pricing.freePlan);
  const faqs: Faq[] = [];
  if (scored.length) {
    const top = scored[0]!;
    faqs.push({
      q: `Which ${lower} scored highest in SmarterBiz testing?`,
      a: `[${top.name}](/tools/${top.slug}/) currently has the highest editorial score on this page (${top.score!.toFixed(1)}/10) and is best for ${top.bestFor.toLowerCase()}. The right choice depends on your needs — see [how we test](/methodology/).`,
    });
  }
  faqs.push({
    q: `Are there free ${lower}?`,
    a: free.length
      ? `Yes — ${free.slice(0, 6).map((t) => `[${t.name}](/tools/${t.slug}/)`).join(", ")} ${free.length === 1 ? "has" : "have"} a free plan. Free plans have usage limits; check the vendor's site for current terms.`
      : "None of the products listed here currently has a permanent free plan, though several offer free trials.",
  });
  faqs.push({ q: `What should UK businesses check before choosing ${lower}?`, a: ukNotes });
  return faqs;
}

function build(root: CategoryRoot, slug: string, kind: Listing["kind"], d: { name: string; intro: string; keyword: string; icon: string; criteria: string[]; ukNotes: string }, tools: Tool[], category?: Category): Listing {
  const guides = relatedGuides(tools);
  const faqs = faqsFor(d.name, tools, d.ukNotes);
  const quality = qualityScore({
    products: tools.length,
    introChars: d.intro.length,
    criteria: d.criteria.length,
    hasUkNotes: Boolean(d.ukNotes),
    faqs: faqs.length,
    relatedGuides: guides.length,
    scoredProducts: tools.filter((t) => t.score != null).length,
  });
  const year = new Date().getFullYear();
  return {
    root, slug, kind, category,
    path: `/${root}/${slug}/`,
    name: d.name,
    h1: `${d.name} for UK businesses`,
    title: [`${d.name} for UK Businesses (${year})`, `${d.name} UK (${year})`].find((x) => x.length <= 65) ?? d.name,
    description: `${tools.length} ${d.name.toLowerCase()} reviewed for UK businesses: sterling pricing, free-plan availability, UK data-protection notes and how to choose.`,
    intro: d.intro,
    keyword: d.keyword,
    icon: d.icon,
    criteria: d.criteria,
    ukNotes: d.ukNotes,
    tools, guides, faqs, quality,
    gate: gateFor(quality, tools.length),
  };
}

let cache: Listing[] | null = null;

export function allListings(): Listing[] {
  if (cache) return cache;
  const out: Listing[] = [];
  for (const c of CATEGORIES) {
    const tools = TOOLS.filter((t) => t.categories.includes(c.key)).sort(byRank);
    out.push(build(c.root, c.slug, "category", { ...c, criteria: c.features }, tools, c));
  }
  for (const root of Object.keys(CURATED) as CategoryRoot[]) {
    const pool = toolsInRoot(root);
    for (const cur of CURATED[root]) out.push(build(root, cur.slug, "curated", cur, pool.filter(cur.pick)));
  }
  cache = out;
  return out;
}

/** Listings that are rendered (index or noindex). */
export const publishedListings = (root?: CategoryRoot) => allListings().filter((l) => l.gate !== "skip" && (!root || l.root === root));
export const indexableListings = () => allListings().filter((l) => l.gate === "index");
export const listingFor = (root: CategoryRoot, slug: string) => publishedListings(root).find((l) => l.slug === slug);

/** Link target for a category key: the listing if published, else the root hub. */
export const categoryHref = (key: string) => {
  const l = allListings().find((x) => x.category?.key === key && x.gate !== "skip");
  return l ? l.path : `/${key.split("/")[0]}/`;
};

export { ROOTS, categoryPath };

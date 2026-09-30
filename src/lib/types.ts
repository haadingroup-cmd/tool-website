export type CategoryRoot = "ai-tools" | "software";
export type CategoryKey = `${CategoryRoot}/${string}`;

export interface Category {
  key: CategoryKey;
  root: CategoryRoot;
  slug: string;
  name: string;
  short: string;
  icon: string;
  intro: string;
  keyword: string;
  features: string[];
  ukNotes: string;
}

/** Provenance for any fact (blueprint §D / master prompt §30). */
export type VerificationStatus = "official_verified" | "source_verified" | "vendor_reported" | "community_reported" | "unverified";

export interface Fact<T> {
  value: T;
  status: VerificationStatus;
  source?: string;
  checkedAt?: string;
  note?: string;
}

export type Tri = "yes" | "no" | "limited" | "unknown";
export type Residency = "uk" | "eu" | "us" | "global" | "other" | "unknown";
export type MtdState = "compatible" | "not_compatible" | "not_applicable" | "unknown";

export interface UkCheck {
  available: Fact<Tri>;
  gbpPricing: Fact<Tri>;
  vatSupport: Fact<Tri>;
  gdprInfoUrl?: Fact<string>;
  dataResidency: Fact<Residency>;
  mtd: Fact<MtdState>;
  companiesHouse: Fact<Tri>;
  ukSupport: Fact<Tri>;
  ukIntegrations: string[];
}

export type Platform = "web" | "windows" | "mac" | "ios" | "android" | "chrome-extension" | "api" | "self-hosted";

/** Tool record as authored in src/data (optional fields get safe defaults in the catalog). */
export interface ToolInput {
  slug: string;
  name: string;
  vendor: string;
  tagline: string;
  summary: string;
  review: string[];
  categories: CategoryKey[];
  /** Editorial score out of 10 — omitted until the product has been hands-on tested. */
  score?: number;
  scores?: { value: number; easeOfUse: number; ukFit: number; features: number };
  pricing: {
    from: string;
    freePlan: boolean;
    trial?: string;
    note?: string;
    /** Prices are indicative until checked against the vendor's pricing page. */
    status?: VerificationStatus;
    sourceUrl?: string;
    checkedAt?: string;
  };
  bestFor: string;
  ukNotes: string;
  pros: string[];
  cons: string[];
  features: string[];
  website: string;
  affiliateUrl?: string;
  editorsChoice?: boolean;
  ukBuilt?: boolean;
  mtdCompatible?: boolean;
  badges?: string[];
  alternatives: string[];
  color: string;
  platforms?: Platform[];
  openSource?: boolean;
  api?: boolean;
  addedAt?: string;
  useCases?: string[];
  industries?: string[];
}

export interface Tool extends ToolInput {
  platforms: Platform[];
  uk: UkCheck;
  addedAt: string;
  useCases: string[];
  industries: string[];
}

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "callout"; tone?: "info" | "warn" | "tip"; title: string; text: string }
  | { type: "tools"; slugs: string[] }
  | { type: "quote"; text: string; cite?: string };

export interface Section {
  id: string;
  heading: string;
  blocks: Block[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  kicker: string;
  keywords: string[];
  published: string;
  updated: string;
  quickAnswer: string;
  takeaways: string[];
  sections: Section[];
  faqs: Faq[];
  relatedTools: string[];
  featured?: boolean;
  /** Canonical path when the guide belongs to a hub instead of /guides/ (e.g. /uk/making-tax-digital/software/). */
  path?: string;
  cover: { icon: string; tone: "navy" | "blue" | "teal" | "slate" };
}

export interface Comparison {
  slug: string;
  a: string;
  b: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  published: string;
  updated: string;
  /** Neutral, characteristics-based summary — comparisons never declare a winner (master prompt §10). */
  summary: string;
  criteria: { name: string; a: string; b: string }[];
  pickA: string[];
  pickB: string[];
  sections: Section[];
  faqs: Faq[];
}

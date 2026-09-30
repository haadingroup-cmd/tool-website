import type { Fact, MtdState, Residency, Tri, UkCheck } from "@/lib/types";

// UK suitability facts per product (blueprint §H). Every value here is "unverified"
// until it has been checked against an official source (GOV.UK, the vendor's
// trust/pricing pages) and given a source URL + date. Pages label them clearly.

type UkOverride = Partial<Record<"available" | "gbpPricing" | "vatSupport" | "companiesHouse" | "ukSupport", Tri>> & {
  dataResidency?: Residency;
  mtd?: MtdState;
  notes?: Partial<Record<keyof UkCheck, string>>;
  ukIntegrations?: string[];
};

const MTD_NOTE = "Listed as MTD-compatible by the vendor; confirm on GOV.UK's list of recognised software.";

export const UK_META: Record<string, UkOverride> = {
  xero: { gbpPricing: "yes", vatSupport: "yes", mtd: "compatible", ukSupport: "yes", companiesHouse: "limited",
    ukIntegrations: ["UK bank feeds", "HMRC MTD for VAT"], notes: { mtd: MTD_NOTE } },
  quickbooks: { gbpPricing: "yes", vatSupport: "yes", mtd: "compatible", ukSupport: "yes",
    ukIntegrations: ["UK bank feeds", "HMRC MTD for VAT"], notes: { mtd: MTD_NOTE } },
  freeagent: { gbpPricing: "yes", vatSupport: "yes", mtd: "compatible", ukSupport: "yes", companiesHouse: "yes",
    ukIntegrations: ["UK bank feeds", "HMRC MTD", "NatWest / RBS / Mettle customer offer"], notes: { mtd: MTD_NOTE } },
  dext: { gbpPricing: "yes", vatSupport: "yes", ukSupport: "yes", ukIntegrations: ["Xero", "QuickBooks", "FreeAgent"],
    notes: { mtd: "Not MTD software itself — feeds data into MTD-recognised ledgers." } },
  "microsoft-365-copilot": { gbpPricing: "yes", dataResidency: "uk", notes: { dataResidency: "UK data residency options for Microsoft 365 tenants." } },
  "mistral-le-chat": { dataResidency: "eu", notes: { dataResidency: "EU-based provider." } },
  deepseek: { dataResidency: "other", notes: { dataResidency: "Data stored in China per DeepSeek's privacy policy." } },
  make: { dataResidency: "eu", notes: { dataResidency: "EU hosting zones available." } },
  n8n: { dataResidency: "other", notes: { dataResidency: "Self-hosting lets you choose any region, including the UK." } },
  hubspot: { gbpPricing: "yes", dataResidency: "eu", notes: { dataResidency: "EU data centre option." } },
  "intercom-fin": { dataResidency: "eu", notes: { dataResidency: "EU hosting available on eligible plans." } },
  zendesk: { dataResidency: "eu", notes: { dataResidency: "EU data-locality add-on available." } },
  "sage-accounting": { gbpPricing: "yes", vatSupport: "yes", mtd: "compatible", ukSupport: "yes", ukIntegrations: ["UK bank feeds", "HMRC MTD"], notes: { mtd: MTD_NOTE } },
  freshbooks: { vatSupport: "yes", mtd: "compatible", notes: { mtd: MTD_NOTE } },
  "zoho-books": { gbpPricing: "yes", vatSupport: "yes", mtd: "compatible", dataResidency: "eu", notes: { mtd: MTD_NOTE, dataResidency: "EU data centre available." } },
  "zoho-crm": { gbpPricing: "yes", dataResidency: "eu", notes: { dataResidency: "EU data centre available." } },
  capsule: { gbpPricing: "yes", ukSupport: "yes", ukIntegrations: ["Xero"] },
  brightpay: { gbpPricing: "yes", ukSupport: "yes", mtd: "not_applicable", ukIntegrations: ["HMRC RTI", "Auto-enrolment pension providers"] },
  breathe: { gbpPricing: "yes", ukSupport: "yes" },
  charliehr: { gbpPricing: "yes", ukSupport: "yes" },
  brevo: { dataResidency: "eu", notes: { dataResidency: "EU-based vendor." } },
  freshdesk: { dataResidency: "eu", notes: { dataResidency: "EU data centre option." } },
  "microsoft-teams": { gbpPricing: "yes", dataResidency: "uk", notes: { dataResidency: "UK data residency options for Microsoft 365 tenants." } },
  bitwarden: { dataResidency: "eu", notes: { dataResidency: "EU cloud region and self-hosting available." } },
  woocommerce: { dataResidency: "other", notes: { dataResidency: "Self-hosted — you choose the hosting location." } },
  ekm: { gbpPricing: "yes", vatSupport: "yes", ukSupport: "yes", ukIntegrations: ["UK couriers"] },
  "epos-now": { gbpPricing: "yes", ukSupport: "yes" },
  square: { gbpPricing: "yes" },
  sumup: { gbpPricing: "yes" },
  shopify: { gbpPricing: "yes", vatSupport: "yes" },
  wix: { gbpPricing: "yes" },
  canva: { gbpPricing: "yes" },
};

const FINANCE_CATS = new Set(["software/accounting", "software/payroll", "software/erp", "ai-tools/finance"]);

const f = <T,>(value: T, note?: string): Fact<T> => ({ value, status: "unverified", ...(note ? { note } : {}) });

export function ukCheckFor(slug: string, categories: string[]): UkCheck {
  const o = UK_META[slug] ?? {};
  const n = o.notes ?? {};
  const financeish = categories.some((c) => FINANCE_CATS.has(c));
  return {
    available: f(o.available ?? "yes", n.available),
    gbpPricing: f(o.gbpPricing ?? "unknown", n.gbpPricing),
    vatSupport: f(o.vatSupport ?? "unknown", n.vatSupport),
    dataResidency: f(o.dataResidency ?? "unknown", n.dataResidency),
    mtd: f(o.mtd ?? (financeish ? "unknown" : "not_applicable"), n.mtd),
    companiesHouse: f(o.companiesHouse ?? "unknown", n.companiesHouse),
    ukSupport: f(o.ukSupport ?? "unknown", n.ukSupport),
    ukIntegrations: o.ukIntegrations ?? [],
  };
}

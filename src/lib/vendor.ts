// Fields a verified vendor may propose changes to. Scores, verdicts, pros/cons and reviews are
// editorial and deliberately absent: vendors can correct facts, never our opinion.
export const CHANGE_FIELDS = {
  short_description: "Short description",
  website_url: "Official website URL",
  pricing: "Pricing / plans (GBP)",
  free_plan: "Free plan or free trial",
  platforms: "Platforms (web, iOS, Windows…)",
  integrations: "Integrations",
  uk_gdpr: "UK GDPR / data protection information",
  data_residency: "Data storage location (UK/EU/US)",
  uk_vat: "UK VAT support",
  mtd: "Making Tax Digital (HMRC) recognition",
  uk_support: "UK support hours / phone",
  logo: "Logo",
  other: "Other factual correction",
} as const;
export type ChangeField = keyof typeof CHANGE_FIELDS;
export const CHANGE_FIELD_KEYS = Object.keys(CHANGE_FIELDS) as [ChangeField, ...ChangeField[]];

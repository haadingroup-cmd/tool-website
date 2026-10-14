// Central site configuration. Edit these values before going live.
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.hatools.boats";

export const SITE = {
  name: "HA Tools",
  shortName: "HA Tools",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "en_GB",
  // One English edition serves both markets; pages carry UK and US notes side by side.
  language: "en",
  markets: ["United Kingdom", "United States"],
  tagline: "Practical AI tools for small businesses in the UK & US",
  description:
    "Independent reviews, comparisons and guides to the best AI tools for small businesses in the UK and US — with £ and $ pricing, UK GDPR and US privacy notes, and tax-software checks.",
  email: "hello@hatools.boats",
  editorialEmail: "editorial@hatools.boats",
  // Fill in once your company is registered — shown in the footer and Organization schema only when set.
  legalName: "",
  companyNumber: "",
  // Only publish a real, verified business address. Leave empty until the owner confirms one.
  address: { locality: "", country: "" },
  // Add real profile URLs (LinkedIn, X, YouTube, Medium…) — they become Organization "sameAs" signals.
  social: [] as string[],
  author: {
    name: "HA Tools Editorial Team",
    role: "Small Business Technology Desk (UK & US)",
    bio: "Our editors assess AI and business software against the realities of running a small business in the UK or US: pricing in pounds and dollars, VAT and sales tax, UK GDPR and US state privacy laws, HMRC Making Tax Digital and IRS-ready bookkeeping.",
  },
  // Year shown in edition labels and titles.
  year: 2026,
  lastUpdated: "2026-10-14",
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

export const NAV = [
  { href: "/tools", label: "AI Tools Directory" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/methodology", label: "How We Review" },
] as const;

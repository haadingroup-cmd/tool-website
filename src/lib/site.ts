// Central site configuration. Edit these values before going live.
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.smarterbiz.uk";

export const SITE = {
  name: "SmarterBiz.uk",
  shortName: "SmarterBiz",
  url: rawUrl.replace(/\/+$/, ""),
  locale: "en_GB",
  language: "en-GB",
  tagline: "Practical AI tools for smarter UK small businesses",
  description:
    "Independent reviews, comparisons and guides to the best AI tools for UK small businesses — with sterling pricing, UK GDPR notes and Making Tax Digital compatibility.",
  email: "hello@smarterbiz.uk",
  editorialEmail: "editorial@smarterbiz.uk",
  // Fill in once your company is registered — shown in the footer and Organization schema only when set.
  legalName: "",
  companyNumber: "",
  address: { locality: "London", country: "GB" },
  // Add real profile URLs (LinkedIn, X, YouTube, Medium…) — they become Organization "sameAs" signals.
  social: [] as string[],
  author: {
    name: "SmarterBiz Editorial Team",
    role: "UK SME Technology Desk",
    bio: "Our editors test AI and business software against the realities of running a UK small business: sterling pricing and VAT, UK GDPR, HMRC's Making Tax Digital rules and British English output.",
  },
  // Year shown in edition labels and titles.
  year: 2026,
  lastUpdated: "2026-09-24",
} as const;

/** Canonical path form: leading and trailing slash (next.config trailingSlash: true), except files like /feed.xml. */
export const canonicalPath = (path = "/") => {
  const [p, rest = ""] = path.split(/(?=[?#])/);
  let out = p!.startsWith("/") ? p! : `/${p}`;
  if (!out.endsWith("/") && !/\.[a-z0-9]+$/i.test(out) && !out.endsWith("opengraph-image")) out += "/";
  return out + rest;
};

export const absoluteUrl = (path = "/") => `${SITE.url}${canonicalPath(path)}`;

export const NAV = [
  { href: "/ai-tools/", label: "AI Tools" },
  { href: "/software/", label: "Software" },
  { href: "/compare", label: "Compare" },
  { href: "/guides/", label: "Guides" },
  { href: "/uk/", label: "UK & MTD" },
  { href: "/find-my-tool/", label: "Find my tool" },
] as const;

import type { Faq, VerificationStatus } from "@/lib/types";

// Official-rule statements for the UK hub. Each one quotes the substance of a GOV.UK page
// and links to it. Status stays "unverified" until an editor re-checks the page and sets
// checkedAt — the UI shows that plainly. Our own explanations are kept separate.

export interface OfficialFact {
  id: string;
  says: string;
  source: { title: string; url: string };
  status: VerificationStatus;
  checkedAt?: string;
}

export const MTD_FACTS: OfficialFact[] = [
  {
    id: "vat",
    says: "All VAT-registered businesses must follow Making Tax Digital rules for VAT: keep digital records and file VAT returns using compatible software.",
    source: { title: "GOV.UK — Making Tax Digital for VAT", url: "https://www.gov.uk/government/publications/making-tax-digital/overview-of-making-tax-digital" },
    status: "unverified",
  },
  {
    id: "itsa-dates",
    says: "Making Tax Digital for Income Tax applies to sole traders and landlords from 6 April 2026 if qualifying income is over £50,000, from 6 April 2027 if over £30,000, and from 6 April 2028 if over £20,000.",
    source: { title: "GOV.UK — Check if you're eligible for Making Tax Digital for Income Tax", url: "https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax" },
    status: "unverified",
  },
  {
    id: "qualifying-income",
    says: "Qualifying income is the total gross income (before expenses) from self-employment and property, taken from an earlier Self Assessment tax return.",
    source: { title: "GOV.UK — Check if you're eligible for Making Tax Digital for Income Tax", url: "https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax" },
    status: "unverified",
  },
  {
    id: "obligations",
    says: "Those in scope must keep digital records, send quarterly updates to HMRC and submit their tax return using compatible software.",
    source: { title: "GOV.UK — Making Tax Digital for Income Tax", url: "https://www.gov.uk/government/collections/making-tax-digital-for-income-tax" },
    status: "unverified",
  },
  {
    id: "software",
    says: "HMRC publishes lists of software that is compatible with Making Tax Digital for VAT and for Income Tax. HMRC does not recommend or endorse any particular product.",
    source: { title: "GOV.UK — Find software that's compatible with Making Tax Digital for Income Tax", url: "https://www.gov.uk/guidance/find-software-thats-compatible-with-making-tax-digital-for-income-tax" },
    status: "unverified",
  },
];

export const MTD_EXPLAINED: { heading: string; text: string }[] = [
  {
    heading: "Does it affect me?",
    text: "Add up your turnover from self-employment and rental property — before expenses. If that combined figure is above the threshold for the relevant year, you are likely in scope. A sole trader with £55,000 of sales and £30,000 of costs is still over £50,000, because expenses are not deducted for this test.",
  },
  {
    heading: "What changes day to day",
    text: "Instead of one annual tax return built from a shoebox of receipts, you keep records in software as you go and send a short summary to HMRC every quarter. The summaries are not extra tax bills; tax is still settled through Self Assessment. In practice, the businesses that cope best reconcile their bank feed weekly.",
  },
  {
    heading: "Choosing software",
    text: "Start from HMRC's compatible-software list, then shortlist based on how you work: bank-feed quality for your bank, receipt capture, whether your accountant already uses the product, and whether you also need VAT, payroll or CIS. Bridging software can work for spreadsheet users, but full accounting software usually saves more time.",
  },
  {
    heading: "Where AI helps (and where it doesn't)",
    text: "AI features in accounting tools are good at reading receipts, suggesting categories and flagging duplicates. They do not make you compliant on their own — you remain responsible for the figures you submit, so review AI-suggested categories before each quarterly update.",
  },
];

export const MTD_FAQS: Faq[] = [
  { q: "When did Making Tax Digital for Income Tax start?", a: "It started on 6 April 2026 for sole traders and landlords with qualifying income over £50,000, according to GOV.UK. The threshold falls to £30,000 from April 2027 and £20,000 from April 2028. Always check the [GOV.UK eligibility guidance](https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax) for your situation." },
  { q: "Is qualifying income calculated before or after expenses?", a: "Before expenses. It is your gross income from self-employment and property combined, per GOV.UK's eligibility guidance." },
  { q: "Which software is MTD compatible?", a: "HMRC publishes the official list on GOV.UK. Products on SmarterBiz marked \"MTD\" are listed by their vendors as compatible — we label that status clearly and you should confirm on HMRC's list. See our [MTD software guide](/uk/making-tax-digital/software/)." },
  { q: "Do I still need an accountant?", a: "MTD doesn't require one, but many sole traders and landlords keep one for year-end adjustments and tax planning. Most accounting products let you invite your accountant for free." },
];

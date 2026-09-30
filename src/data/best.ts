import type { CategoryKey, Faq } from "@/lib/types";

// "Best X for Y" pages (blueprint D1: /best/{slug}/). Only for intents that no guide already
// targets, and only ranked by editorial score — a page needs at least 3 tested products.

export interface BestDef {
  slug: string;
  title: string;
  h1: string;
  keyword: string;
  intro: string;
  how: string[];
  categories: CategoryKey[];
  exclude?: string[];
  faqs: Faq[];
}

export const BEST: BestDef[] = [
  {
    slug: "ai-meeting-note-takers-uk",
    title: "Best AI Meeting Note-Takers for UK Businesses",
    h1: "The best AI meeting note-takers for UK businesses",
    keyword: "ai meeting notes",
    intro: "AI note-takers record or join your calls, transcribe them and write up summaries and action points. For UK teams the differences that matter are transcription accuracy with British accents, where recordings are stored, how consent is handled and whether notes sync into the CRM you already use.",
    how: ["Ranked by our editorial score from hands-on testing", "Tested on UK-accented sales, client and internal calls", "Checked recording-consent features and data-storage information", "Untested products are listed separately below the ranking"],
    categories: ["software/video-conferencing"],
    exclude: ["zoom", "microsoft-teams"],
    faqs: [
      { q: "Do I need consent to record meetings with an AI note-taker?", a: "You should tell participants that a call is being recorded and transcribed, and have a lawful basis under UK GDPR. Most tools can announce themselves or send a notice — switch that on." },
      { q: "Where are AI meeting recordings stored?", a: "It varies by vendor and plan. Check each product's data-processing agreement for storage region and retention, especially for client calls." },
    ],
  },
  {
    slug: "workflow-automation-tools-uk",
    title: "Best Workflow Automation Tools for UK Small Businesses",
    h1: "The best workflow automation tools for UK small businesses",
    keyword: "workflow automation tools",
    intro: "Automation platforms connect the apps you already use so routine jobs run without anyone copying and pasting. The right choice depends on how technical your team is, how many tasks you run each month and whether you need to control where data is processed.",
    how: ["Ranked by our editorial score from hands-on testing", "Built the same set of small-business automations in each tool", "Compared pricing models (per task versus per scenario) at small-business volumes", "Checked data-hosting and self-hosting options"],
    categories: ["software/automation"],
    faqs: [
      { q: "Which automation tool is easiest for non-technical users?", a: "In our testing, [Zapier](/tools/zapier/) was the quickest to learn. [Make](/tools/make/) offers more control for visual thinkers, and [n8n](/tools/n8n/) suits technical teams who want to self-host." },
      { q: "Can I keep automation data in the UK or EU?", a: "Some platforms offer EU hosting, and self-hosted options let you choose any region. Check each vendor's data-processing terms — these facts are labelled on each product page." },
    ],
  },
  {
    slug: "ai-writing-tools-uk",
    title: "Best AI Writing Tools for UK Businesses",
    h1: "The best AI writing tools for UK businesses",
    keyword: "ai writing tools uk",
    intro: "AI writing tools draft emails, proposals, web copy and reports. For UK businesses the tests that matter are whether a tool writes natural British English, follows a house style, handles long documents accurately and keeps your inputs out of model training on business plans.",
    how: ["Ranked by our editorial score from hands-on testing", "Tested on UK business writing: proposals, policies, customer emails and web copy", "Checked British English spelling and tone", "Checked data-training settings on business plans"],
    categories: ["ai-tools/writing"],
    exclude: ["originality-ai", "gptzero"],
    faqs: [
      { q: "Which AI writing tool is best for British English?", a: "Most tools default to US spelling unless told otherwise. In our testing [Claude](/tools/claude/) was the most consistent at British English; with any tool, set the language explicitly." },
      { q: "Is AI-written content bad for SEO?", a: "Search engines reward helpful, accurate content regardless of how it's produced. Publishing unedited AI text at scale is risky; use AI for drafts and have a person check facts and add real expertise." },
    ],
  },
];

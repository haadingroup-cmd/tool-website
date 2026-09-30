import type { CategoryKey } from "@/lib/types";

// Industries and use cases (master prompt §§12–13). Each page draws its product list from
// the categories a segment needs — never from a hand-typed "best" list — and passes the
// same quality gate as category pages.

export interface Segment {
  slug: string;
  name: string;
  /** H1 fragment, e.g. "Software for estate agents". */
  h1: string;
  keyword: string;
  icon: string;
  intro: string;
  needs: string[];
  ukNotes: string;
  categories: CategoryKey[];
  guides: string[];
}

export const INDUSTRIES: Segment[] = [
  {
    slug: "accountants", name: "Accountants & bookkeepers", h1: "Software and AI tools for UK accountants", keyword: "software for accountants uk", icon: "Receipt",
    intro: "Accountancy practices run on client ledgers, deadlines and document chasing. The most useful tools automate data capture, keep Making Tax Digital submissions on track across many clients, and give the practice a secure way to collect documents and communicate — while keeping client data under tight control.",
    needs: ["Multi-client MTD for VAT and Income Tax workflows", "Receipt and invoice capture", "Secure client document requests", "Practice management and deadlines", "Clear data-processing terms"],
    ukNotes: "Check HMRC recognition for each MTD service, and make sure AI tools used on client data are covered by your engagement letters and data-processing agreements.",
    categories: ["software/accounting", "ai-tools/finance", "software/payroll", "software/document-management"],
    guides: ["ai-tools-for-accountants-uk", "best-accounting-software-for-sole-traders-uk", "uk-gdpr-ai-compliance-checklist"],
  },
  {
    slug: "estate-agents", name: "Estate & letting agents", h1: "Software and AI tools for UK estate agents", keyword: "estate agent software uk", icon: "Building2",
    intro: "Estate and letting agents juggle listings, viewings, vendor updates and compliance. AI now drafts property descriptions and follow-up emails, while CRMs and automation keep applicants moving. The key is accuracy: material information rules mean AI copy must be checked before it reaches a portal.",
    needs: ["Applicant and vendor CRM", "Listing descriptions and marketing copy", "Viewing and follow-up automation", "Meeting and call notes", "Lettings compliance reminders"],
    ukNotes: "Listings must include accurate material information under Trading Standards guidance; check every AI-written description. Lettings work involves deposit protection and right-to-rent records.",
    categories: ["software/crm", "ai-tools/writing", "software/automation", "software/video-conferencing"],
    guides: ["ai-tools-for-estate-agents-uk", "best-ai-crm-for-small-business"],
  },
  {
    slug: "trades", name: "Trades & construction", h1: "Software and AI tools for UK tradespeople", keyword: "software for tradesmen uk", icon: "HardHat",
    intro: "For plumbers, electricians, builders and other trades, the admin happens in the van or at the kitchen table. The best tools take card payments on site, turn quotes into invoices, capture receipts from a phone and keep books ready for Making Tax Digital — without needing a laptop.",
    needs: ["Quotes and invoices from a phone", "Card payments on site", "Receipt capture", "MTD-ready bookkeeping", "Customer reminders"],
    ukNotes: "Sole traders over the MTD for Income Tax threshold need compatible software. If you use subcontractors, check Construction Industry Scheme (CIS) support.",
    categories: ["software/accounting", "software/pos", "ai-tools/finance", "ai-tools/productivity"],
    guides: ["ai-tools-for-tradespeople-uk", "best-accounting-software-for-sole-traders-uk"],
  },
  {
    slug: "retail-ecommerce", name: "Retail & ecommerce", h1: "Software and AI tools for UK retailers and online shops", keyword: "ecommerce software uk", icon: "Store",
    intro: "Shops selling online, in person or both need a store platform, payments, stock control and marketing that uses customer data well. AI helps write product copy, answer routine customer questions and segment email lists — but product claims and pricing still need a human check under UK consumer law.",
    needs: ["Online store platform", "In-person card payments", "Stock and inventory sync", "Email and SMS marketing", "Customer-service chat"],
    ukNotes: "Configure UK VAT correctly and publish the information required by the Consumer Contracts Regulations. SMS and email marketing need PECR-compliant consent.",
    categories: ["software/ecommerce", "software/pos", "software/email-marketing", "ai-tools/ecommerce", "ai-tools/customer-support"],
    guides: ["best-ai-customer-service-software-uk", "best-free-ai-tools-for-small-business-uk"],
  },
  {
    slug: "hospitality", name: "Restaurants & hospitality", h1: "Software for UK restaurants, cafés and pubs", keyword: "restaurant software uk", icon: "UtensilsCrossed",
    intro: "Hospitality businesses need fast tills, reliable card payments and simple tools for rotas, bookings and marketing. Margins are tight, so transaction fees and contract terms matter as much as features.",
    needs: ["POS and card payments", "Table bookings and online ordering", "Staff rotas and HR records", "Email marketing to regulars", "Accounting integration"],
    ukNotes: "Allergen information must meet UK food-information rules. Compare card-processing fees and minimum contract terms carefully.",
    categories: ["software/pos", "software/restaurant", "software/hr", "software/email-marketing"],
    guides: ["how-to-use-ai-in-your-small-business"],
  },
  {
    slug: "agencies", name: "Agencies & consultancies", h1: "Software and AI tools for UK agencies and consultancies", keyword: "software for agencies uk", icon: "Megaphone",
    intro: "Agencies and consultancies sell time and expertise, so they need project tracking, time-based invoicing, client communication and AI that speeds up research and drafting without leaking client data.",
    needs: ["Project and task management", "Time tracking and invoicing", "Meeting notes and summaries", "Research and writing assistants", "Client-safe AI data settings"],
    ukNotes: "Check client contracts before putting their data into AI tools, and use business plans that don't train on your inputs.",
    categories: ["software/project-management", "ai-tools/writing", "ai-tools/research", "software/video-conferencing", "software/accounting"],
    guides: ["ai-workflows-for-small-business", "best-ai-research-tools", "is-chatgpt-gdpr-compliant"],
  },
];

export const USE_CASES: Segment[] = [
  {
    slug: "invoicing-and-bookkeeping", name: "Invoicing & bookkeeping", h1: "Software for invoicing and bookkeeping", keyword: "invoicing software uk", icon: "Receipt",
    intro: "Getting paid on time and keeping tidy books are the two admin jobs every UK business shares. Modern accounting software sends invoices with payment links, chases late payers automatically, reconciles bank feeds and reads receipts with AI — and files VAT and Income Tax updates under Making Tax Digital.",
    needs: ["Invoices with online payment links", "Automatic payment reminders", "UK bank feeds", "Receipt capture", "MTD submissions"],
    ukNotes: "Check HMRC's compatible-software list for the MTD service you need.",
    categories: ["software/accounting", "ai-tools/finance"],
    guides: ["best-accounting-software-for-sole-traders-uk"],
  },
  {
    slug: "sales-pipeline", name: "Managing a sales pipeline", h1: "Software for managing leads and a sales pipeline", keyword: "sales pipeline software", icon: "Handshake",
    intro: "A CRM keeps every enquiry, quote and follow-up in one place so deals don't go cold in someone's inbox. AI features now summarise calls, draft follow-ups and highlight deals that need attention.",
    needs: ["Visual pipeline", "Email and calendar sync", "Follow-up reminders", "Call and meeting notes", "Reporting"],
    ukNotes: "Record the lawful basis for holding each contact and honour opt-outs.",
    categories: ["software/crm", "ai-tools/sales"],
    guides: ["best-ai-crm-for-small-business"],
  },
  {
    slug: "workflow-automation", name: "Automating repetitive tasks", h1: "Tools for automating repetitive business tasks", keyword: "workflow automation tools", icon: "Workflow",
    intro: "Automation platforms connect your apps so routine work happens on its own — new enquiries into the CRM, invoices into accounts, files into the right folder. Adding AI steps lets automations read, classify and draft as they go.",
    needs: ["Connectors for the apps you use", "AI steps", "Error alerts", "Cost per task", "Self-hosting option"],
    ukNotes: "Map where each automation copies personal data and include it in your record of processing.",
    categories: ["software/automation", "ai-tools/productivity"],
    guides: ["ai-workflows-for-small-business"],
  },
  {
    slug: "customer-support", name: "Customer support & chatbots", h1: "Software for customer support and AI chatbots", keyword: "customer support software uk", icon: "Headset",
    intro: "Support tools bring email, chat and social messages into a shared inbox, and AI agents can now answer routine questions from your help content. The best set-ups hand over to a human smoothly and never invent answers.",
    needs: ["Shared inbox", "Help centre", "AI answers from your content", "Human handover", "Reporting"],
    ukNotes: "Tell customers when they're talking to AI and check where conversation data is hosted.",
    categories: ["software/customer-support", "software/helpdesk", "ai-tools/customer-support"],
    guides: ["best-ai-customer-service-software-uk"],
  },
  {
    slug: "meeting-notes", name: "Meeting notes & summaries", h1: "Tools for AI meeting notes and summaries", keyword: "ai meeting notes", icon: "Video",
    intro: "AI note-takers join or record your calls, transcribe them and produce summaries and action points, saving the time spent writing up meetings. They work best when everyone knows the call is being recorded.",
    needs: ["Accurate UK-accent transcription", "Summaries and actions", "CRM sync", "Recording consent", "Storage location"],
    ukNotes: "Tell participants before recording, and check how long recordings are kept.",
    categories: ["software/video-conferencing"],
    guides: ["ai-workflows-for-small-business"],
  },
  {
    slug: "email-marketing", name: "Email marketing", h1: "Software for email marketing", keyword: "email marketing software uk", icon: "Mail",
    intro: "Email is still one of the most cost-effective channels for small businesses. Good platforms make it easy to capture consented sign-ups, send well-designed campaigns and automate welcome and follow-up sequences.",
    needs: ["Consent-first sign-up forms", "Templates", "Automations", "Segmentation", "Deliverability"],
    ukNotes: "PECR requires consent for marketing emails to individuals and sole traders — use double opt-in.",
    categories: ["software/email-marketing", "software/marketing"],
    guides: ["how-to-use-ai-in-your-small-business"],
  },
  {
    slug: "writing-and-content", name: "Writing & content", h1: "AI tools for business writing and content", keyword: "ai writing tools for business", icon: "PenLine",
    intro: "AI writing assistants draft emails, proposals, web copy and reports in seconds. Used well, they give you a strong first draft in your house style; used carelessly, they publish confident errors. A human edit is always part of the process.",
    needs: ["British English", "House style", "Long-document handling", "Fact-checking support", "Data controls"],
    ukNotes: "Set British English explicitly and avoid pasting confidential client information into consumer plans.",
    categories: ["ai-tools/writing"],
    guides: ["ai-model-comparison", "best-ai-detection-tools"],
  },
  {
    slug: "project-management", name: "Project & task management", h1: "Software for managing projects and tasks", keyword: "project management software uk", icon: "KanbanSquare",
    intro: "Project tools give everyone one place to see who's doing what by when. Small teams often start with simple boards and move to timelines and workload views as they grow.",
    needs: ["Boards and lists", "Timelines", "Automations", "Client/guest access", "Integrations"],
    ukNotes: "Check guest-access pricing and where attachments are stored for client projects.",
    categories: ["software/project-management"],
    guides: ["ai-workflows-for-small-business"],
  },
  {
    slug: "selling-online", name: "Selling online", h1: "Software for selling online", keyword: "sell online uk", icon: "Store",
    intro: "Whether you're launching a first shop or moving platforms, the choice is between hosted platforms that handle everything and open-source options that give you more control. Payments, VAT and delivery settings matter as much as templates.",
    needs: ["Checkout and payments", "UK VAT", "Delivery options", "Marketing integrations", "Apps and extensions"],
    ukNotes: "Publish returns and cancellation information required by UK consumer law.",
    categories: ["software/ecommerce", "ai-tools/ecommerce"],
    guides: ["best-free-ai-tools-for-small-business-uk"],
  },
  {
    slug: "password-security", name: "Password security", h1: "Tools for business password security", keyword: "business password manager", icon: "ShieldCheck",
    intro: "Weak and reused passwords are behind a large share of small-business breaches. A team password manager plus multi-factor authentication is one of the cheapest, most effective security steps you can take.",
    needs: ["Shared vaults", "MFA support", "Admin recovery", "Breach alerts", "Staff offboarding"],
    ukNotes: "The NCSC's Cyber Essentials scheme is a sensible baseline for UK SMEs.",
    categories: ["software/cybersecurity"],
    guides: ["uk-gdpr-ai-compliance-checklist"],
  },
];

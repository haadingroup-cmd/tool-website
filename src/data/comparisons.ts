import type { Comparison } from "@/lib/types";

const RAW: Comparison[] = [
  {
    slug: "chatgpt-vs-claude",
    a: "chatgpt",
    b: "claude",
    title: "ChatGPT vs Claude: Which Is Better for UK Small Businesses?",
    metaTitle: "ChatGPT vs Claude (2026): Which Is Better for UK Business?",
    description:
      "ChatGPT vs Claude for UK business: we compare writing quality, British English, document analysis, integrations, data protection and pricing in £ to help you choose.",
    keywords: ["chatgpt vs claude", "claude vs chatgpt", "claude vs chatgpt for business", "is claude better than chatgpt"],
    published: "2026-01-20",
    updated: "2026-09-24",
    summary:
      "ChatGPT and Claude are both leading general AI assistants with similar entry pricing. Claude is strongest at long documents, contract review and natural British English; ChatGPT has the broader feature set — image generation, voice mode, custom GPTs and the largest integration ecosystem.",
    criteria: [
      { name: "Writing quality & British English", a: "Very good; US spelling by default", b: "Excellent; natural British tone" },
      { name: "Long documents & contracts", a: "Strong", b: "Best in class" },
      { name: "Image generation", a: "Built in", b: "Not built in" },
      { name: "Integrations & custom assistants", a: "Custom GPTs, largest ecosystem", b: "Projects & connectors" },
      { name: "Data analysis", a: "Excellent", b: "Excellent" },
      { name: "Business data training defaults", a: "Off on Business/Enterprise", b: "Off on Team/Enterprise/API" },
      { name: "Entry price", a: "~£20/month (Plus)", b: "~£18/month (Pro)" },
    ],
    pickA: [
      "You want one tool for writing, images, voice and data analysis",
      "Your team already knows ChatGPT",
      "You plan to build custom GPTs for repeatable tasks",
    ],
    pickB: [
      "Client-facing writing and tone matter most",
      "You review contracts, policies or long reports",
      "You want Projects that hold company knowledge for every chat",
    ],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "We ran both assistants through the same set of real UK small-business tasks: drafting a quote, rewriting terms and conditions in plain English, summarising a 60-page tender, building a cash-flow spreadsheet and replying to an unhappy customer. Both are excellent — the differences are in tone, features and ecosystem.",
          },
          {
            type: "p",
            text: "**Claude** consistently produced writing that needed fewer edits before sending, with correct British spelling and a measured tone. It was also more faithful when summarising long documents. **ChatGPT** was faster to produce visuals, handled voice conversations and offered far more integrations through custom GPTs and connectors.",
          },
        ],
      },
      {
        id: "data",
        heading: "Data protection",
        blocks: [
          {
            type: "p",
            text: "On business plans, neither provider trains on your content by default. On individual plans, check the data controls in settings. See our [UK GDPR and AI checklist](/guides/uk-gdpr-ai-compliance-checklist).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Claude better than ChatGPT for business?",
        a: "Claude is better for writing quality, British English and long-document analysis. ChatGPT is better for versatility, image generation and integrations. The best choice depends on your main tasks.",
      },
      {
        q: "Which is cheaper, ChatGPT or Claude?",
        a: "Both have free plans and individual paid plans around £18–£20 a month, with per-seat team plans. Prices change often, so check each vendor's site.",
      },
    ],
  },
  {
    slug: "gemini-vs-microsoft-365-copilot",
    a: "microsoft-365-copilot",
    b: "gemini",
    title: "Microsoft 365 Copilot vs Gemini for Workspace: Which Should Your Business Use?",
    metaTitle: "Microsoft Copilot vs Gemini (2026) for UK Small Businesses",
    description:
      "Microsoft 365 Copilot vs Google Gemini for small businesses: integrations, pricing, data protection and which AI fits your office suite.",
    keywords: ["copilot vs gemini", "microsoft copilot vs google gemini", "gemini vs copilot for business"],
    published: "2026-03-02",
    updated: "2026-09-24",
    summary:
      "Each assistant works best inside its own office suite: Microsoft 365 Copilot inside Outlook, Word, Excel and Teams; Gemini inside Gmail, Docs, Sheets and Meet, where it is often included in the Workspace plan.",
    criteria: [
      { name: "Office integration", a: "Outlook, Word, Excel, PowerPoint, Teams", b: "Gmail, Docs, Sheets, Slides, Meet" },
      { name: "Value", a: "Full Copilot is a paid add-on", b: "Included in many Workspace plans" },
      { name: "Meeting summaries", a: "Excellent in Teams", b: "Good in Meet" },
      { name: "Research", a: "Good", b: "Excellent (Deep Research, NotebookLM)" },
      { name: "Compliance & data residency", a: "Strong, UK datacentre options", b: "Strong, data regions on some editions" },
    ],
    pickA: ["You run on Microsoft 365 and Teams", "You need strong compliance controls", "Meetings dominate your week"],
    pickB: ["You run on Google Workspace", "You want AI included in your existing plan", "You do lots of research"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "The biggest factor is where your files, email and meetings already live. Switching office suites to get a different AI is rarely worth the disruption. Both assistants exclude your business data from model training under their business terms.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Copilot or Gemini better?",
        a: "Copilot is better for Microsoft 365 users and Gemini is better for Google Workspace users. Each works best inside its own ecosystem.",
      },
    ],
  },
  {
    slug: "chatgpt-vs-gemini",
    a: "chatgpt",
    b: "gemini",
    title: "ChatGPT vs Gemini: Which AI Assistant Is Best for Business?",
    metaTitle: "ChatGPT vs Gemini (2026): Best AI Assistant for Business?",
    description:
      "ChatGPT vs Gemini compared for small businesses: writing, research, Google Workspace integration, image generation and pricing in £.",
    keywords: ["chatgpt vs gemini", "gemini vs chatgpt", "gemini or chatgpt for business"],
    published: "2026-04-14",
    updated: "2026-09-24",
    summary:
      "ChatGPT offers the broader standalone feature set and ecosystem. Gemini is built into Google Workspace, is often included in Workspace plans and has strong research features.",
    criteria: [
      { name: "Standalone features", a: "Broadest feature set", b: "Strong" },
      { name: "Google Workspace integration", a: "Via connectors", b: "Native" },
      { name: "Research", a: "Deep research", b: "Deep Research + NotebookLM" },
      { name: "Custom assistants", a: "Custom GPTs", b: "Gems" },
      { name: "Value", a: "Separate subscription", b: "Often included in Workspace" },
    ],
    pickA: ["You want the most capable standalone assistant", "You don't use Google Workspace", "You want custom GPTs"],
    pickB: ["You use Gmail, Docs and Sheets daily", "You want AI included in your existing plan", "You do document-heavy research"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "Both are excellent general assistants. ChatGPT's custom GPTs and ecosystem make it more flexible; Gemini's native integration into Workspace makes it more convenient for Google-based businesses.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Gemini as good as ChatGPT?",
        a: "Gemini is comparable for most business tasks and excels at research and Google Workspace integration. ChatGPT offers a broader feature set and ecosystem.",
      },
    ],
  },
  {
    slug: "quickbooks-vs-xero",
    a: "xero",
    b: "quickbooks",
    title: "Xero vs QuickBooks UK: Which AI Accounting Software Is Best?",
    metaTitle: "Xero vs QuickBooks UK (2026): MTD, AI Features & Pricing",
    description:
      "Xero vs QuickBooks for UK small businesses: Making Tax Digital support, AI features, bank feeds, accountant support and real pricing in £.",
    keywords: ["xero vs quickbooks uk", "quickbooks vs xero", "best accounting software uk small business"],
    published: "2026-02-25",
    updated: "2026-09-24",
    summary:
      "Both are HMRC-recognised Making Tax Digital platforms with AI-assisted bookkeeping and similar entry pricing. Xero is very widely used by UK accountants and has a large app marketplace; QuickBooks is known for its mobile app and frequent introductory offers.",
    criteria: [
      { name: "MTD for VAT & Income Tax", a: "Yes", b: "Yes" },
      { name: "UK accountant support", a: "Very widely supported", b: "Widely supported" },
      { name: "Mobile app", a: "Good", b: "Excellent" },
      { name: "AI features", a: "JAX assistant, reconciliation suggestions", b: "Intuit Assist, categorisation" },
      { name: "Integrations", a: "Very large marketplace", b: "Large marketplace" },
      { name: "Pricing", a: "From ~£16/month", b: "From ~£16/month; frequent intro offers" },
    ],
    pickA: ["You work with an accountant or bookkeeper", "You need lots of integrations", "You're VAT-registered and growing"],
    pickB: ["You're a sole trader managing books on your phone", "You want MTD for Income Tax made simple", "You like intro discounts"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "Both platforms handle invoicing, bank reconciliation, VAT and reporting well, and both use AI to reduce manual categorisation. The deciding factor is usually your accountant's preference. Also consider [FreeAgent](/tools/freeagent) if you bank with NatWest, RBS, Ulster Bank or Mettle.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Xero or QuickBooks better in the UK?",
        a: "It depends on how you work. Xero suits businesses that work closely with an accountant and want a large integration marketplace; QuickBooks suits sole traders who prefer managing their books on a phone. Both are MTD-recognised.",
      },
    ],
  },
  {
    slug: "make-vs-zapier",
    a: "zapier",
    b: "make",
    title: "Zapier vs Make: Which Automation Tool Is Best for AI Workflows?",
    metaTitle: "Zapier vs Make (2026): Best for AI Workflows & Pricing",
    description:
      "Zapier vs Make for small business AI automation: ease of use, AI features, pricing at volume, EU hosting and which to choose.",
    keywords: ["zapier vs make", "make vs zapier", "best automation tool for small business"],
    published: "2026-05-19",
    updated: "2026-09-24",
    summary:
      "Zapier is the easier of the two to learn and connects the most apps. Make offers a visual builder suited to complex logic, is typically cheaper at high volumes and offers EU hosting.",
    criteria: [
      { name: "Ease of use", a: "Easiest", b: "Moderate" },
      { name: "App library", a: "Largest", b: "Large" },
      { name: "Complex logic", a: "Good", b: "Excellent" },
      { name: "Price at volume", a: "Higher", b: "Lower" },
      { name: "EU hosting", a: "No (US)", b: "Yes" },
      { name: "AI agents", a: "Yes", b: "Yes" },
    ],
    pickA: ["You're new to automation", "You need an obscure app integration", "Speed of setup matters most"],
    pickB: ["You run high volumes", "You need branching and data transformation", "You prefer EU data hosting"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "For a first automation, Zapier gets you running in minutes. As workflows grow more complex and volumes rise, Make's visual builder and pricing become more attractive. Technical teams wanting to self-host should also consider [n8n](/tools/n8n).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Make cheaper than Zapier?",
        a: "Usually, yes — especially at higher volumes. Make charges by operations/credits and its entry plans cost less than Zapier's.",
      },
    ],
  },
  {
    slug: "fathom-vs-fireflies",
    a: "fathom",
    b: "fireflies",
    title: "Fathom vs Fireflies: Best AI Meeting Notetaker?",
    metaTitle: "Fathom vs Fireflies (2026): Best AI Meeting Notes Tool",
    description:
      "Fathom vs Fireflies.ai compared: free plans, summary quality, CRM sync, search and UK GDPR considerations for AI meeting notes.",
    keywords: ["fathom vs fireflies", "best ai meeting notes", "ai notetaker"],
    published: "2026-06-03",
    updated: "2026-09-24",
    summary:
      "Fathom has a generous free plan and concise summaries. Fireflies focuses on searchable call history and conversation analytics for sales teams.",
    criteria: [
      { name: "Free plan", a: "Very generous", b: "Limited storage" },
      { name: "Summary quality", a: "Excellent, concise", b: "Good, detailed" },
      { name: "Search across meetings", a: "Good", b: "Excellent" },
      { name: "Analytics", a: "Basic", b: "Conversation analytics" },
      { name: "CRM sync", a: "Yes", b: "Yes" },
    ],
    pickA: ["You want great free meeting notes", "You value concise summaries"],
    pickB: ["You run a sales team", "You want to search across every call"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "Both tools join your calls, transcribe and summarise. Remember to tell participants you are recording and check where recordings are stored.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Fathom really free?",
        a: "Fathom offers a genuinely useful free plan for recording, transcribing and summarising calls. Paid plans add team features and advanced AI.",
      },
    ],
  },
  {
    slug: "chatgpt-vs-microsoft-365-copilot",
    a: "chatgpt",
    b: "microsoft-365-copilot",
    title: "ChatGPT vs Microsoft Copilot: Which Should a UK Business Use?",
    metaTitle: "ChatGPT vs Copilot (2026): Which Is Best for UK Business?",
    description:
      "ChatGPT vs Microsoft 365 Copilot for small businesses: standalone versatility vs working inside Outlook, Word, Excel and Teams — features, data protection and cost in £.",
    keywords: ["chatgpt vs copilot", "copilot vs chatgpt", "microsoft copilot or chatgpt for business"],
    published: "2026-09-25",
    updated: "2026-09-25",
    summary:
      "Microsoft 365 Copilot works inside Outlook, Teams and SharePoint using your own work data. ChatGPT is a standalone assistant with a broader feature set that isn't tied to one office suite.",
    criteria: [
      { name: "Works inside Office apps", a: "Via connectors", b: "Native in Outlook, Word, Excel, Teams" },
      { name: "Standalone versatility", a: "Broadest feature set", b: "Good" },
      { name: "Grounded in your work data", a: "Via connected files", b: "Emails, meetings, chats and files" },
      { name: "Compliance & data residency", a: "Strong on Business/Enterprise", b: "Inherits Microsoft 365 controls" },
      { name: "Cost for a small team", a: "Plus or per-seat Business plan", b: "Copilot Chat free; full Copilot paid add-on" },
      { name: "Image generation & voice", a: "Built in", b: "Available, less central" },
    ],
    pickA: ["You use Google Workspace or a mix of tools", "You want images, voice and custom GPTs", "Budget per person matters most"],
    pickB: ["Your business runs on Microsoft 365 and Teams", "Meetings and email dominate your week", "You need enterprise compliance controls"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "The key difference is context. Copilot can read the email thread you're replying to, the Teams meeting you missed and the proposal in SharePoint, within your existing permissions. ChatGPT is more capable as a general tool but needs you to bring the context. Many Microsoft 365 businesses start with the free Copilot Chat and buy full Copilot licences only for the heaviest email and meeting users.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Copilot better than ChatGPT?",
        a: "Copilot is better inside Microsoft 365 apps because it uses your emails, meetings and files. ChatGPT is better as a standalone, general-purpose assistant.",
      },
      {
        q: "Is Microsoft Copilot free for business?",
        a: "Copilot Chat is available to Microsoft 365 business users at no extra cost. The full Microsoft 365 Copilot, which works inside Outlook, Word, Excel and Teams with your work data, is a paid add-on.",
      },
    ],
  },
  {
    slug: "claude-vs-gemini",
    a: "claude",
    b: "gemini",
    title: "Claude vs Gemini: Which AI Assistant Is Better for Business?",
    metaTitle: "Claude vs Gemini (2026): Best AI Assistant for UK Business?",
    description:
      "Claude vs Google Gemini for UK small businesses: writing quality, long documents, research, Google Workspace integration, data protection and price in £.",
    keywords: ["claude vs gemini", "gemini vs claude", "claude or gemini for business"],
    published: "2026-09-25",
    updated: "2026-09-25",
    summary:
      "Claude is strongest for writing, contracts and long documents. Gemini is built into Google Workspace, is often included in the plan and has strong research features.",
    criteria: [
      { name: "Writing quality & British English", a: "Excellent", b: "Good" },
      { name: "Long documents & contracts", a: "Best in class", b: "Strong" },
      { name: "Google Workspace integration", a: "Via connectors", b: "Native" },
      { name: "Research", a: "Good, with web search", b: "Excellent (Deep Research, NotebookLM)" },
      { name: "Value", a: "Separate subscription", b: "Often included in Workspace" },
    ],
    pickA: ["Client-facing writing matters most", "You review contracts and long reports", "You use Microsoft 365 or mixed tools"],
    pickB: ["You run on Google Workspace", "You want AI included in your plan", "You do lots of research"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "For a Google Workspace business, Gemini is the pragmatic default — it's already where your email and documents are. Claude earns its place when writing quality and accuracy on long documents make a visible difference to clients. Plenty of businesses use Gemini inside Workspace and Claude for their most important writing.",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Claude better than Gemini?",
        a: "Claude is better for writing and long-document analysis; Gemini is better for Google Workspace integration and research, and is often better value because it may be included in your Workspace plan.",
      },
    ],
  },
  {
    slug: "canva-vs-gamma",
    a: "canva",
    b: "gamma",
    title: "Canva vs Gamma: Which Is the Better AI Presentation Maker?",
    metaTitle: "Canva vs Gamma (2026): Best AI Presentation Maker?",
    description:
      "Canva vs Gamma for AI presentations: first-draft quality, editing, brand control, PowerPoint export and price in £ — plus which to choose for pitches, proposals and training decks.",
    keywords: ["canva vs gamma", "gamma vs canva", "best ai presentation maker"],
    published: "2026-09-25",
    updated: "2026-09-25",
    summary:
      "Gamma focuses on generating and restructuring presentations quickly. Canva is an all-round design platform covering social, print, video and presentations.",
    criteria: [
      { name: "First-draft deck quality", a: "Good, template-led", b: "Excellent" },
      { name: "Editing & restructuring", a: "Slide-by-slide", b: "Fast card-based editing" },
      { name: "Beyond presentations", a: "Social, print, video, docs", b: "Docs and simple web pages" },
      { name: "Brand control", a: "Brand Kit", b: "Themes" },
      { name: "PowerPoint export", a: "Yes", b: "Yes" },
      { name: "Price", a: "Pro ~£11/month", b: "Plus ~£8–£10/month" },
    ],
    pickA: ["You need one design tool for everything", "Your Brand Kit is already in Canva", "You create lots of social content"],
    pickB: ["Presentations are the main job", "You start from documents or outlines", "You want share links with analytics"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "In our tests Gamma's decks needed the least rework before they could go to a client. Canva's strength is breadth. If you only pay for one, most small businesses should pick Canva for its all-round value; teams that pitch weekly will find Gamma pays for itself. See our [AI presentation makers guide](/guides/best-ai-presentation-makers).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is Gamma better than Canva for presentations?",
        a: "Yes — Gamma generates better first drafts and is faster to restructure. Canva is better as an all-round design platform for social media, print and video.",
      },
    ],
  },
  {
    slug: "hubspot-vs-pipedrive",
    a: "hubspot",
    b: "pipedrive",
    title: "HubSpot vs Pipedrive: Which CRM Is Best for a UK Small Business?",
    metaTitle: "HubSpot vs Pipedrive (2026): Best CRM for UK Small Business?",
    description:
      "HubSpot vs Pipedrive for UK small businesses: free plans, AI features, ease of use, marketing tools, GDPR features and per-seat pricing in £.",
    keywords: ["hubspot vs pipedrive", "pipedrive vs hubspot", "best crm for small business uk"],
    published: "2026-09-25",
    updated: "2026-09-25",
    summary:
      "HubSpot offers a free CRM with marketing, sales and service tools in one platform. Pipedrive focuses on a simple, visual sales pipeline with predictable per-seat pricing.",
    criteria: [
      { name: "Free plan", a: "Free CRM, no user limit", b: "Trial only" },
      { name: "Ease of use for sales", a: "Good", b: "Excellent" },
      { name: "Marketing & service tools", a: "Built in", b: "Add-ons" },
      { name: "AI features", a: "Breeze assistant & agents", b: "AI sales assistant" },
      { name: "Price as you grow", a: "Professional tiers get expensive", b: "Predictable per seat" },
      { name: "GDPR tools", a: "Consent & subscription management", b: "GDPR features included" },
    ],
    pickA: ["You want to start free", "You need marketing and service too", "You want AI agents"],
    pickB: ["You run a small B2B sales team", "You want the simplest pipeline", "You prefer predictable per-seat pricing"],
    sections: [
      {
        id: "analysis",
        heading: "The editorial analysis",
        blocks: [
          {
            type: "p",
            text: "Start with HubSpot's free CRM unless you already know you only need a sales pipeline. Watch the jump to Professional tiers — that's where HubSpot's cost rises sharply, and where Pipedrive can be better value for pure sales teams. See our [AI CRM guide](/guides/best-ai-crm-for-small-business).",
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Is HubSpot better than Pipedrive?",
        a: "HubSpot suits businesses that want a free start and marketing, sales and service in one platform. Pipedrive suits small sales teams that want a simple, visual pipeline.",
      },
    ],
  },
];

/** Canonical order: tools sorted alphabetically by slug, so each pair has exactly one URL (blueprint §L). */
const canonical = (c: Comparison): Comparison =>
  c.a < c.b
    ? c
    : { ...c, a: c.b, b: c.a, pickA: c.pickB, pickB: c.pickA, criteria: c.criteria.map((r) => ({ name: r.name, a: r.b, b: r.a })) };

export const COMPARISONS: Comparison[] = RAW.map(canonical);

export const comparisonBySlug = (slug: string) => COMPARISONS.find((c) => c.slug === slug);

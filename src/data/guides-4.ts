import type { Guide } from "@/lib/types";

// US-market guides. Facts reflect public vendor and regulator information as of the `updated` date;
// prices are indicative USD entry tiers and every guide tells readers to confirm with the vendor.
export const GUIDES_4: Guide[] = [
  {
    slug: "best-ai-tools-for-us-small-businesses",
    title: "The Best AI Tools for US Small Businesses in 2026",
    metaTitle: "Best AI Tools for Small Business in the USA (2026) — Priced in $",
    description:
      "The best AI tools for US small businesses in 2026, with dollar pricing and notes on sales tax, state privacy laws and call-recording consent. Our picks for writing, bookkeeping, CRM, support, automation and more.",
    kicker: "Flagship Guide · US",
    keywords: [
      "best ai tools for small business",
      "ai tools for small business",
      "ai tools for small business usa",
      "best ai tools for small business owners",
      "ai for small business",
      "ai tools for business",
    ],
    published: "2026-10-14",
    updated: "2026-10-14",
    cover: { icon: "Trophy", tone: "blue" },
    quickAnswer:
      "The best AI tools for most US small businesses in 2026 are ChatGPT or Claude as a general assistant (about $20 a month), Microsoft 365 Copilot or Gemini if your team lives in Microsoft or Google apps, QuickBooks Online for bookkeeping and sales tax, HubSpot's free CRM, Zapier for automation, Canva for design and Fathom for meeting notes. Start with one assistant and one automation, then add tools only where they save measurable hours.",
    takeaways: [
      "One paid AI assistant at roughly $20 a month delivers most of the value for most small businesses.",
      "Check which AI features your existing Microsoft 365 or Google Workspace plan already includes before buying anything new.",
      "Pick bookkeeping software your CPA already supports; QuickBooks Online is the most common choice in the US.",
      "Before recording calls with an AI notetaker, check the consent rules in every state your callers are in.",
    ],
    sections: [
      {
        id: "how-we-chose",
        heading: "How we chose these AI tools",
        blocks: [
          {
            type: "p",
            text: "Most small businesses need fewer than five AI tools. We shortlisted the tools US owner-operators most often buy, then scored each one on **value for money**, **ease of use**, **regional fit** (US English, state privacy laws, sales tax and accountant support, US integrations) and **features**. Nobody can pay to be included or to rank higher — read our [review methodology](/methodology).",
          },
          {
            type: "p",
            text: "Prices are indicative entry-level paid tiers in US dollars, before any sales tax. AI vendors change pricing often, so confirm on the vendor's own site before you buy.",
          },
        ],
      },
      {
        id: "quick-picks",
        heading: "Quick picks: the best AI tool for each job",
        blocks: [
          {
            type: "table",
            caption: "Our top AI tools for US small businesses by use case",
            head: ["Job to be done", "Our pick", "Runner-up", "Entry price (approx.)"],
            rows: [
              ["General assistant & writing", "[ChatGPT](/tools/chatgpt)", "[Claude](/tools/claude)", "Free / ~$20 per month"],
              ["Microsoft 365 businesses", "[Microsoft 365 Copilot](/tools/microsoft-365-copilot)", "[ChatGPT](/tools/chatgpt)", "Copilot Chat free; add-on ~$30 per user"],
              ["Google Workspace businesses", "[Gemini](/tools/gemini)", "[Claude](/tools/claude)", "Included in many Workspace plans"],
              ["Bookkeeping & sales tax", "[QuickBooks](/tools/quickbooks)", "[Xero](/tools/xero)", "From ~$20–$35 per month"],
              ["Receipts & expenses", "[Dext](/tools/dext)", "[QuickBooks](/tools/quickbooks)", "Often via your accountant"],
              ["CRM & sales", "[HubSpot](/tools/hubspot)", "[Pipedrive](/tools/pipedrive)", "Free CRM / ~$14–$20 per seat"],
              ["Automation", "[Zapier](/tools/zapier)", "[Make](/tools/make)", "Free / ~$10–$20 per month"],
              ["Website chat & support", "[Tidio](/tools/tidio)", "[Intercom Fin](/tools/intercom-fin)", "Free / ~$25–$30 per month"],
              ["Meeting notes", "[Fathom](/tools/fathom)", "[Fireflies](/tools/fireflies)", "Free / ~$10–$20 per month"],
              ["Design & social content", "[Canva](/tools/canva)", "[Gamma](/tools/gamma)", "Free / ~$10–$15 per month"],
              ["Online store", "[Shopify](/tools/shopify)", "[Wix](/tools/wix)", "From ~$29–$39 per month"],
            ],
          },
        ],
      },
      {
        id: "assistants",
        heading: "1. A general AI assistant: ChatGPT or Claude",
        blocks: [
          {
            type: "p",
            text: "A general assistant is the one AI tool almost every small business should pay for. [ChatGPT](/tools/chatgpt) is the most versatile, with image generation, voice, data analysis and custom GPTs that package repeatable jobs such as quoting or onboarding. [Claude](/tools/claude) is stronger on long documents — contracts, leases, RFPs and policies — and on careful, well-structured writing.",
          },
          {
            type: "p",
            text: "For anything involving customer or employee data, use a business plan (ChatGPT Business or Enterprise, Claude Team or Enterprise), where the vendor does not train on your content by default and you get admin controls. If you handle health information covered by HIPAA, only use a plan where the vendor will sign a business associate agreement (BAA).",
          },
          { type: "tools", slugs: ["chatgpt", "claude", "gemini"] },
        ],
      },
      {
        id: "office-suite",
        heading: "2. AI inside the office suite you already pay for",
        blocks: [
          {
            type: "p",
            text: "If your team works in Outlook, Word, Excel and Teams, [Microsoft 365 Copilot](/tools/microsoft-365-copilot) can summarize email threads, draft documents from your files and analyze spreadsheets. If you run on Gmail and Google Docs, [Gemini](/tools/gemini) is built into many Google Workspace business plans. Check your current plan first — many businesses already have some AI features they are not using.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Fix sharing permissions first",
            text: "Office-suite AI can surface any file a user has access to. Before rollout, check that sensitive folders (payroll, HR, legal) are not shared with everyone.",
          },
        ],
      },
      {
        id: "bookkeeping",
        heading: "3. Bookkeeping, sales tax and receipts",
        blocks: [
          {
            type: "p",
            text: "[QuickBooks Online](/tools/quickbooks) is the default small-business ledger in the US and the one most CPAs and tax preparers support. Its AI features categorize bank transactions, chase unpaid invoices and flag anomalies. [Xero](/tools/xero) is a strong alternative with unlimited users on every plan. Add [Dext](/tools/dext) if you have a lot of paper receipts or supplier bills.",
          },
          {
            type: "p",
            text: "Whatever you choose, AI does not replace a tax professional. Sales-tax obligations depend on where you have nexus, and contractor reporting rules change — see our [AI bookkeeping guide for US small businesses](/guides/best-ai-bookkeeping-software-for-us-small-businesses).",
          },
        ],
      },
      {
        id: "sales-support",
        heading: "4. Sales, marketing and customer support",
        blocks: [
          {
            type: "p",
            text: "[HubSpot](/tools/hubspot) offers a genuinely useful free CRM with AI email drafting and call summaries; [Pipedrive](/tools/pipedrive) suits small, pipeline-driven sales teams. For your website, [Tidio](/tools/tidio) gives micro-businesses an affordable AI chatbot, while [Intercom Fin](/tools/intercom-fin) charges per resolved conversation and suits busier support teams.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Texts and AI voice calls need consent",
            text: "If you use AI to send marketing texts or make calls with an AI-generated voice, the Telephone Consumer Protection Act (TCPA) consent rules apply. Get prior express written consent for marketing calls and texts.",
          },
        ],
      },
      {
        id: "automation-meetings",
        heading: "5. Automation and meeting notes",
        blocks: [
          {
            type: "p",
            text: "[Zapier](/tools/zapier) connects thousands of apps so that, for example, a new form lead is added to your CRM, enriched by AI and sent to Slack. [Make](/tools/make) is cheaper for complex, high-volume workflows. For meetings, [Fathom](/tools/fathom) records, transcribes and summarizes Zoom, Google Meet and Teams calls with a generous free plan.",
          },
          {
            type: "p",
            text: "Recording laws differ by state. Several states — including California, Florida, Illinois, Maryland, Massachusetts, Pennsylvania and Washington — generally require every participant to consent. The simplest policy is to announce recording at the start of every call.",
          },
        ],
      },
      {
        id: "budget",
        heading: "What a sensible AI stack costs",
        blocks: [
          {
            type: "table",
            caption: "Indicative monthly cost for a five-person US small business",
            head: ["Stack", "Tools", "Approx. monthly cost"],
            rows: [
              ["Starter", "ChatGPT or Claude (1 seat), HubSpot free CRM, Canva free, Fathom free", "~$20"],
              ["Growing", "Business assistant (5 seats), QuickBooks Online, Zapier Pro, Canva Pro", "~$250–$350"],
              ["Established", "Microsoft 365 Copilot (5 seats), QuickBooks Online, HubSpot Starter, Zapier, Intercom Fin", "~$500–$800"],
            ],
          },
          {
            type: "p",
            text: "These are planning estimates, not quotes. Annual billing usually reduces the price, and sales tax may be added depending on your state.",
          },
        ],
      },
      {
        id: "getting-started",
        heading: "How to get started in a week",
        blocks: [
          {
            type: "ol",
            items: [
              "List the five most repetitive tasks in your business and estimate the hours each takes per week.",
              "Buy one business-grade AI assistant and write a one-page acceptable-use policy (what data staff may and may not paste in).",
              "Automate one workflow end to end — for example, lead form → CRM → follow-up email draft.",
              "Measure hours saved after 30 days before adding another tool.",
              "Review vendor data terms and update your privacy policy if customer data now flows to a new provider — see our [US AI data privacy guide](/guides/ai-data-privacy-for-us-small-businesses).",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is the best free AI tool for a small business?",
        a: "The free plans of ChatGPT, Claude and Gemini cover most occasional writing and research tasks. HubSpot's free CRM, Canva's free plan and Fathom's free meeting notes are also genuinely useful at no cost.",
      },
      {
        q: "How much should a small business spend on AI tools?",
        a: "Most small businesses get the majority of the value from one paid assistant at about $20 per user per month. A five-person team with bookkeeping, automation and design tools typically spends $250–$350 a month.",
      },
      {
        q: "Is ChatGPT or Claude better for a US small business?",
        a: "ChatGPT is more versatile (images, voice, custom GPTs, more integrations); Claude is better for long documents and careful writing. Read our [ChatGPT vs Claude comparison](/compare/chatgpt-vs-claude).",
      },
      {
        q: "Are AI tools safe to use with customer data in the US?",
        a: "They can be, if you use business plans that do not train on your data, sign the vendor's data processing terms (and a BAA for HIPAA data), and update your privacy notice. Our [US AI data privacy guide](/guides/ai-data-privacy-for-us-small-businesses) explains the steps.",
      },
      {
        q: "Do you also cover the UK?",
        a: "Yes. Every tool review shows UK pricing in pounds and UK GDPR notes alongside US notes, and we have a separate [guide to the best AI tools for UK small businesses](/guides/best-ai-tools-for-uk-small-businesses).",
      },
    ],
    relatedTools: ["chatgpt", "claude", "microsoft-365-copilot", "gemini", "quickbooks", "hubspot", "zapier", "canva", "fathom"],
  },
  {
    slug: "best-ai-bookkeeping-software-for-us-small-businesses",
    title: "Best AI Bookkeeping & Accounting Software for US Small Businesses",
    metaTitle: "Best AI Bookkeeping Software for Small Business (US, 2026)",
    description:
      "QuickBooks Online vs Xero vs Dext for US small businesses: what AI bookkeeping actually automates, sales tax and contractor reporting, dollar pricing and how to choose with your CPA.",
    kicker: "Finance · US",
    keywords: [
      "ai bookkeeping software",
      "ai accounting software for small business",
      "best accounting software for small business",
      "quickbooks vs xero",
      "ai bookkeeping",
    ],
    published: "2026-10-14",
    updated: "2026-10-14",
    cover: { icon: "Receipt", tone: "teal" },
    quickAnswer:
      "For most US small businesses, QuickBooks Online is the best AI-assisted bookkeeping software because almost every CPA supports it and it handles sales-tax tracking, contractor payments and payroll add-ons in one place. Xero is the best alternative if you want unlimited users and a cleaner interface. Add Dext if you process a lot of receipts or supplier bills. AI speeds up categorization and reconciliation, but a human should still review the books before tax filings.",
    takeaways: [
      "AI bookkeeping mainly saves time on transaction categorization, receipt capture, reconciliation and invoice follow-up.",
      "Choose the ledger your CPA or bookkeeper already uses — switching later is expensive.",
      "Sales-tax obligations depend on economic nexus in each state where you sell, not just where you are based.",
      "AI suggestions can be wrong; review categorizations monthly and before every tax deadline.",
    ],
    sections: [
      {
        id: "what-ai-does",
        heading: "What AI bookkeeping actually does",
        blocks: [
          {
            type: "ul",
            items: [
              "**Bank-feed categorization:** suggests the right account for each transaction and learns from your corrections.",
              "**Receipt and bill capture:** reads vendor, date, amount and tax from photos, PDFs and emailed bills.",
              "**Reconciliation:** matches bank lines to invoices and bills so month-end takes minutes rather than hours.",
              "**Cash-flow and invoice follow-up:** predicts late payers and drafts reminder emails.",
              "**Anomaly detection:** flags duplicates, unusual amounts and missing receipts.",
            ],
          },
        ],
      },
      {
        id: "comparison",
        heading: "QuickBooks Online vs Xero vs Dext",
        blocks: [
          {
            type: "table",
            caption: "AI bookkeeping options for US small businesses (indicative pricing)",
            head: ["", "QuickBooks Online", "Xero", "Dext"],
            rows: [
              ["Best for", "Most US small businesses; CPA collaboration", "Growing teams wanting unlimited users", "Receipt- and bill-heavy businesses"],
              ["Entry price", "~$35/mo (Simple Start)", "~$20/mo (entry tier, limited invoices)", "Often bundled by your accountant"],
              ["Sales tax", "Built-in sales-tax tracking", "Via Avalara integration", "Captures tax on receipts for your ledger"],
              ["Payroll", "QuickBooks Payroll add-on", "Gusto integration", "No"],
              ["Contractor (1099) support", "Built-in 1099 tracking and e-filing", "Via integrations", "No"],
              ["Review", "[QuickBooks review](/tools/quickbooks)", "[Xero review](/tools/xero)", "[Dext review](/tools/dext)"],
            ],
          },
          {
            type: "p",
            text: "Read our detailed [Xero vs QuickBooks comparison](/compare/xero-vs-quickbooks) for a feature-by-feature verdict.",
          },
        ],
      },
      {
        id: "sales-tax",
        heading: "Sales tax and AI: what to watch",
        blocks: [
          {
            type: "p",
            text: "Since the Supreme Court's 2018 *South Dakota v. Wayfair* decision, states can require out-of-state sellers to collect sales tax once they pass an economic-nexus threshold — many states use $100,000 in annual sales into the state. Your software can track sales by state, but deciding where you have nexus is a judgment you should make with your accountant.",
          },
          {
            type: "callout",
            tone: "warn",
            title: "Contractor reporting thresholds change",
            text: "IRS information-reporting thresholds for contractor payments (Form 1099-NEC) and payment platforms (Form 1099-K) have changed in recent years. Check the current thresholds on IRS.gov or with your tax preparer each year rather than relying on old defaults in your software.",
          },
        ],
      },
      {
        id: "how-to-choose",
        heading: "How to choose in four steps",
        blocks: [
          {
            type: "ol",
            items: [
              "Ask your CPA or bookkeeper which ledger they support and whether they offer a discounted subscription.",
              "List the states you sell into and confirm how the software tracks sales tax for each.",
              "Connect your bank feeds and run one month of transactions on a free trial before committing.",
              "Set a monthly 30-minute review to correct AI categorizations — accuracy improves quickly when you do.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: "Can AI replace my bookkeeper?",
        a: "Not entirely. AI removes most of the data entry, but someone still needs to review categorizations, reconcile exceptions and prepare filings. Many small businesses use AI software plus a part-time bookkeeper or CPA.",
      },
      {
        q: "Is QuickBooks or Xero better for a US small business?",
        a: "QuickBooks Online is the safer default because most US accountants support it and it has built-in sales tax and 1099 tools. Xero suits teams that want unlimited users and a simpler interface. See our [Xero vs QuickBooks comparison](/compare/xero-vs-quickbooks).",
      },
      {
        q: "Is FreeAgent available in the US?",
        a: "No. [FreeAgent](/tools/freeagent) is built for UK tax rules (HMRC and Making Tax Digital). US businesses should look at QuickBooks or Xero.",
      },
    ],
    relatedTools: ["quickbooks", "xero", "dext"],
  },
  {
    slug: "ai-data-privacy-for-us-small-businesses",
    title: "AI and Data Privacy for US Small Businesses: A Practical Checklist",
    metaTitle: "AI Data Privacy Checklist for US Small Businesses (2026)",
    description:
      "How US small businesses can use ChatGPT, Claude, Copilot and other AI tools without breaking privacy rules: state privacy laws like the CCPA, HIPAA BAAs, call-recording consent, FTC rules and a 10-step checklist.",
    kicker: "Data Privacy · US",
    keywords: [
      "ai data privacy small business",
      "is chatgpt safe for business",
      "ccpa ai",
      "ai compliance small business",
      "hipaa chatgpt",
    ],
    published: "2026-10-14",
    updated: "2026-10-14",
    cover: { icon: "ShieldCheck", tone: "slate" },
    quickAnswer:
      "US small businesses can use AI tools safely by choosing business plans that do not train on their data, keeping sensitive data (health, financial account and Social Security numbers) out of consumer AI apps, getting a business associate agreement before using AI with HIPAA-covered health data, telling customers in the privacy policy which AI providers process their information, and following state consent rules before recording calls. The US has no single federal privacy law, so the rules that apply depend on your industry and the states your customers live in.",
    takeaways: [
      "There is no single US federal privacy law; about 20 states now have comprehensive consumer privacy laws, led by California's CCPA/CPRA.",
      "Use business or enterprise AI plans — they exclude your data from model training by default.",
      "HIPAA-covered entities need a signed BAA before putting protected health information into any AI tool.",
      "The FTC has made clear there is no AI exemption from the rules against deceptive claims and fake reviews.",
    ],
    sections: [
      {
        id: "which-laws",
        heading: "Which laws apply to a small business using AI?",
        blocks: [
          {
            type: "ul",
            items: [
              "**State consumer privacy laws:** California's CCPA (as amended by the CPRA) applies to for-profit businesses that meet at least one threshold — annual revenue above an inflation-adjusted figure of roughly $25 million, buying, selling or sharing the personal information of 100,000 or more California consumers or households, or earning half their revenue from selling or sharing personal information. Around 20 other states have similar laws with their own thresholds.",
              "**HIPAA:** applies to healthcare providers, health plans and their business associates. Any AI vendor that handles protected health information on your behalf must sign a business associate agreement.",
              "**FTC Act:** prohibits unfair or deceptive practices, including misleading claims about what your AI does and how you use customer data. The FTC's rule on fake reviews also covers AI-generated reviews.",
              "**TCPA:** the FCC has confirmed that calls using AI-generated voices count as artificial-voice calls, so consent rules apply.",
              "**State wiretap laws:** several states require all parties to consent before a call is recorded or transcribed.",
            ],
          },
          {
            type: "callout",
            tone: "info",
            title: "Not legal advice",
            text: "This guide is general information for small businesses. Thresholds and laws change; confirm your obligations with a qualified attorney, especially in healthcare, finance or education.",
          },
        ],
      },
      {
        id: "checklist",
        heading: "The 10-step AI privacy checklist",
        blocks: [
          {
            type: "ol",
            items: [
              "Make a list of every AI tool your team uses, including free browser extensions.",
              "Move business use onto business plans (ChatGPT Business/Enterprise, Claude Team/Enterprise, Copilot or Gemini for Workspace).",
              "Confirm in each vendor's terms that your inputs are not used to train models, and note where data is stored.",
              "Write a one-page acceptable-use policy listing data staff must never paste into AI: Social Security numbers, card and bank details, health records, passwords.",
              "Sign the vendor's data processing addendum, and a BAA if you handle HIPAA data.",
              "Update your privacy policy to describe AI service providers that process customer data.",
              "If you record or transcribe calls, announce it at the start of every call.",
              "Get prior express written consent before sending AI-assisted marketing texts or AI-voice calls.",
              "Have a human review AI outputs that affect customers — prices, refunds, eligibility decisions.",
              "Review this list every six months; AI terms and state laws change quickly.",
            ],
          },
        ],
      },
      {
        id: "safest-tools",
        heading: "Which AI tools are safest for business data?",
        blocks: [
          {
            type: "p",
            text: "The major assistants all offer business tiers with no training on your data by default: [ChatGPT](/tools/chatgpt) Business and Enterprise, [Claude](/tools/claude) Team and Enterprise, [Microsoft 365 Copilot](/tools/microsoft-365-copilot) and [Gemini](/tools/gemini) in Google Workspace. Be cautious with apps that store data in jurisdictions with weak protections — read our [DeepSeek data-protection guide](/guides/is-deepseek-safe-for-uk-businesses).",
          },
          { type: "tools", slugs: ["chatgpt", "claude", "microsoft-365-copilot", "gemini"] },
        ],
      },
    ],
    faqs: [
      {
        q: "Is ChatGPT safe for business use in the US?",
        a: "ChatGPT Business and Enterprise do not train on your data by default and include admin controls, which makes them suitable for most business data. On free and Plus plans, turn off model training in data controls and avoid entering sensitive personal information.",
      },
      {
        q: "Can I use AI with patient data?",
        a: "Only if you are using a service covered by a signed business associate agreement (BAA) with the vendor, and only for the minimum necessary data. Consumer AI apps are not appropriate for protected health information.",
      },
      {
        q: "Does the CCPA apply to my small business?",
        a: "Many small businesses fall below the CCPA thresholds, but if you meet any one of them — including handling personal information of 100,000 or more California consumers or households — it applies. Other states have different thresholds, so check each state where you have customers.",
      },
      {
        q: "Do I need to tell customers I use AI?",
        a: "You should describe AI service providers that process customer data in your privacy policy, and you must not make deceptive claims about how AI is used. Some states also require disclosure when customers interact with AI in certain situations.",
      },
    ],
    relatedTools: ["chatgpt", "claude", "microsoft-365-copilot", "gemini", "fathom"],
  },
];

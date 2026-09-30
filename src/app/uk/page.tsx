import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ToolMini } from "@/components/tools/ToolMini";
import { Icon } from "@/components/ui/Icon";
import { TOOLS, byRank } from "@/lib/catalog";
import { categoryHref } from "@/lib/listings";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "UK Business Software Hub: MTD, UK GDPR & UK-Hosted Tools",
  description: "Everything UK-specific in one place: Making Tax Digital, UK GDPR and data hosting, sterling pricing and UK-built software — with every fact labelled by how it was verified.",
  path: "/uk/",
  keywords: ["uk business software", "uk ai tools", "uk gdpr ai tools", "making tax digital software"],
});

const TOPICS = [
  { icon: "Landmark", title: "Making Tax Digital", href: "/uk/making-tax-digital/", text: "HMRC's rules for VAT and Income Tax, who is affected when, and compatible software." },
  { icon: "ShieldCheck", title: "UK GDPR & AI", href: "/guides/uk-gdpr-ai-compliance-checklist/", text: "A practical checklist before you put customer or staff data into an AI tool." },
  { icon: "Receipt", title: "Accounting software", href: categoryHref("software/accounting"), text: "Bookkeeping, VAT and MTD — compared on UK bank feeds and HMRC recognition." },
  { icon: "Users", title: "Payroll & HR", href: categoryHref("software/payroll"), text: "RTI submissions, auto-enrolment pensions and UK holiday rules." },
];

export default function UkHub() {
  const ukBuilt = TOOLS.filter((t) => t.ukBuilt).sort(byRank);
  const ukData = TOOLS.filter((t) => t.uk.dataResidency.value === "uk" || t.uk.dataResidency.value === "eu").sort(byRank);
  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "UK", path: "/uk/" }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Software for UK businesses: the UK-specific details</h1>
        <p className="mt-3 font-serif text-body-lead text-slate-body" data-speakable="">
          Most software reviews are written for the US market. This hub collects what changes in the UK — HMRC&apos;s Making Tax Digital, UK GDPR,
          sterling pricing and VAT, and where your data is stored — and shows how each fact on our listings was checked.
        </p>
      </header>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <li key={t.title}>
            <Link href={t.href} className="card group flex h-full gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand group-hover:bg-brand group-hover:text-white">
                <Icon name={t.icon} className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-headline-sm text-ink group-hover:underline">{t.title}</span>
                <span className="mt-1 block text-body-md text-slate-body">{t.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12 rounded-lg border border-rule bg-surface-lowest p-5" aria-labelledby="how-checked">
        <h2 id="how-checked" className="font-serif text-headline-md text-ink">How we label UK facts</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-md text-slate-body">
          <li><strong className="text-ink">Verified (official source)</strong> — checked against GOV.UK, HMRC, the ICO or Companies House, with the date.</li>
          <li><strong className="text-ink">Verified (vendor source)</strong> — checked against the vendor&apos;s own pricing, trust or documentation page, with the date.</li>
          <li><strong className="text-ink">Vendor reported</strong> — supplied by the vendor and not yet independently checked.</li>
          <li><strong className="text-ink">Not yet verified</strong> — our current understanding; confirm before relying on it.</li>
        </ul>
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {ukBuilt.length > 0 && (
          <section aria-labelledby="uk-built">
            <h2 id="uk-built" className="font-serif text-headline-md text-ink">UK-built products</h2>
            <div className="mt-4 flex flex-col gap-2">{ukBuilt.map((t) => <ToolMini key={t.slug} tool={t} />)}</div>
          </section>
        )}
        {ukData.length > 0 && (
          <section aria-labelledby="uk-data">
            <h2 id="uk-data" className="font-serif text-headline-md text-ink">UK or EU data hosting options</h2>
            <p className="mt-1 text-body-sm text-slate-mute">Not yet verified — check each vendor&apos;s data-processing terms.</p>
            <div className="mt-4 flex flex-col gap-2">{ukData.map((t) => <ToolMini key={t.slug} tool={t} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
}

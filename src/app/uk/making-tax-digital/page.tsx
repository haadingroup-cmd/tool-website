import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqList } from "@/components/ui/Faq";
import { ToolCard } from "@/components/tools/ToolCard";
import { OfficialFacts } from "@/components/content/OfficialFacts";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { MTD_EXPLAINED, MTD_FACTS, MTD_FAQS } from "@/data/uk";
import { TOOLS, byRank } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Making Tax Digital (MTD) Explained for UK Businesses (2026)",
  description: "What HMRC's Making Tax Digital rules require for VAT and Income Tax, who is affected from April 2026, 2027 and 2028, and how to choose compatible software — official rules and plain-English explanation kept separate.",
  path: "/uk/making-tax-digital/",
  keywords: ["making tax digital", "mtd for income tax", "mtd for vat", "making tax digital 2026"],
});

export default function MtdHub() {
  const tools = TOOLS.filter((t) => t.uk.mtd.value === "compatible").sort(byRank);
  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "UK", path: "/uk/" }, { name: "Making Tax Digital", path: "/uk/making-tax-digital/" }]} />
      <header className="mt-4 max-w-3xl">
        <p className="kicker">UK compliance hub</p>
        <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Making Tax Digital, explained</h1>
        <p className="mt-3 font-serif text-body-lead text-slate-body" data-speakable="">
          Making Tax Digital (MTD) is HMRC&apos;s requirement to keep digital records and file through compatible software. It already applies to
          VAT, and since 6 April 2026 it applies to Income Tax for sole traders and landlords above an income threshold that falls each year to
          2028.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <OfficialFacts facts={MTD_FACTS} />
        <section aria-labelledby="explained" className="rounded-lg border border-teal/30 bg-teal/5 p-5">
          <h2 id="explained" className="font-serif text-headline-md text-ink">Our explanation</h2>
          <p className="mt-1 text-body-sm text-slate-mute">Editorial guidance from SmarterBiz — not official advice. Speak to an accountant about your circumstances.</p>
          <div className="mt-4 space-y-4">
            {MTD_EXPLAINED.map((e) => (
              <div key={e.heading}>
                <h3 className="text-headline-sm text-ink">{e.heading}</h3>
                <p className="mt-1 text-body-md text-slate-body">{e.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-12" aria-labelledby="mtd-software">
        <h2 id="mtd-software" className="font-serif text-headline-md text-ink md:text-headline-lg">Software listed as MTD-compatible</h2>
        <p className="mt-2 max-w-3xl text-body-md text-slate-body">
          These products are described by their vendors as MTD-compatible. We have not yet re-checked each against HMRC&apos;s list, so confirm
          there before you buy. For our detailed picks, read the <Link href="/uk/making-tax-digital/software/" className="text-brand underline">MTD software guide</Link>.
        </p>
        <div className="mt-4"><AffiliateDisclosure /></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      <div className="max-w-read"><FaqList faqs={MTD_FAQS} heading="Making Tax Digital FAQs" /></div>
    </div>
  );
}

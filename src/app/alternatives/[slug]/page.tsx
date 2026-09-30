import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqList } from "@/components/ui/Faq";
import { ToolCard } from "@/components/tools/ToolCard";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { factText } from "@/components/tools/UkChecks";
import { COMPARISONS } from "@/data/comparisons";
import { altPageFor, publishedAltPages } from "@/lib/alternatives";
import { itemListLd, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import type { Faq } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => publishedAltPages().map((p) => ({ slug: p.tool.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const p = altPageFor((await params).slug);
  if (!p) return {};
  const t = p.tool;
  return pageMetadata({
    title: `${p.alts.length} ${t.name} Alternatives for UK Businesses (${SITE.year})`,
    description: `Looking beyond ${t.name}? Compare ${p.alts.slice(0, 4).map((a) => a.name).join(", ")} and more on UK pricing, free plans, platforms and data hosting.`,
    path: `/alternatives/${t.slug}/`,
    keywords: [`${t.name.toLowerCase()} alternatives`, `alternatives to ${t.name.toLowerCase()}`, `${t.name.toLowerCase()} alternative uk`],
    noindex: p.gate !== "index",
  });
}

export default async function AlternativesPage({ params }: Props) {
  const p = altPageFor((await params).slug);
  if (!p) notFound();
  const { tool: t, alts } = p;
  const comps = COMPARISONS.filter((c) => c.a === t.slug || c.b === t.slug);
  const free = alts.filter((a) => a.pricing.freePlan);
  const faqs: Faq[] = [
    { q: `What are the main alternatives to ${t.name}?`, a: `${alts.slice(0, 5).map((a) => `[${a.name}](/tools/${a.slug}/)`).join(", ")} are the closest alternatives we list. Which fits best depends on your use case — each card above says who it suits.` },
    { q: `Is there a free alternative to ${t.name}?`, a: free.length ? `Yes — ${free.map((a) => `[${a.name}](/tools/${a.slug}/)`).join(", ")} ${free.length === 1 ? "has" : "have"} a free plan, with usage limits.` : `None of the alternatives listed here has a permanent free plan; several offer free trials.` },
    { q: `Why look for a ${t.name} alternative?`, a: `Common reasons are price, missing features or data-hosting requirements. Our ${t.name} review lists its limitations: ${t.cons.slice(0, 2).join("; ").toLowerCase()}.` },
  ];

  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd(`${t.name} alternatives`, alts.map((a) => ({ name: a.name, path: `/tools/${a.slug}/` })))} />
      <Breadcrumbs items={[{ name: t.name, path: `/tools/${t.slug}/` }, { name: "Alternatives", path: `/alternatives/${t.slug}/` }]} />
      <header className="mt-4 max-w-3xl">
        <p className="kicker">Alternatives</p>
        <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{t.name} alternatives for UK businesses</h1>
        <p className="mt-3 text-body-lg text-slate-body" data-speakable="">
          {t.name} is best for {t.bestFor.toLowerCase()}. If that isn&apos;t quite what you need, these {alts.length} products cover similar
          ground. They are listed with editor-picked alternatives first, then other products in the same category — not as a ranking.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>

      <div className="-mx-4 mt-8 overflow-x-auto px-4 md:mx-0 md:px-0">
        <table className="w-full min-w-[720px] border-collapse overflow-hidden rounded-lg border border-rule bg-surface-lowest text-left text-body-sm">
          <caption className="sr-only">{t.name} and alternatives at a glance</caption>
          <thead className="bg-ink text-white">
            <tr>
              {["Product", "Suits", "Indicative price", "Free plan", "Data hosting (unverified)"].map((h) => <th key={h} scope="col" className="px-3 py-2.5 text-label">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {[t, ...alts].map((a, i) => (
              <tr key={a.slug} className={`border-t border-rule ${i === 0 ? "bg-brand-tint" : i % 2 ? "bg-surface" : ""}`}>
                <th scope="row" className="px-3 py-2.5 font-semibold text-ink"><Link href={`/tools/${a.slug}/`} className="hover:underline">{a.name}</Link>{i === 0 && <span className="ml-1 text-caption font-normal text-slate-mute">(current)</span>}</th>
                <td className="px-3 py-2.5 text-slate-body">{a.bestFor}</td>
                <td className="px-3 py-2.5 text-slate-body">{a.pricing.from}</td>
                <td className="px-3 py-2.5 text-slate-body">{a.pricing.freePlan ? "Yes" : "No"}</td>
                <td className="px-3 py-2.5 text-slate-body">{factText(a.uk.dataResidency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {alts.map((a) => <ToolCard key={a.slug} tool={a} />)}
      </div>

      {comps.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-headline-md text-ink">Head-to-head comparisons with {t.name}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {comps.map((c) => <li key={c.slug}><Link href={`/compare/${c.slug}/`} className="card block p-4 font-semibold text-ink hover:underline">{c.title}</Link></li>)}
          </ul>
        </section>
      )}
      <div className="max-w-read"><FaqList faqs={faqs} /></div>
    </div>
  );
}

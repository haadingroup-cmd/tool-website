import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { COMPARISONS, comparisonBySlug } from "@/data/comparisons";
import { toolBySlug } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/ui/Faq";
import { Sections } from "@/components/content/Blocks";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { comparisonLd, pageMetadata } from "@/lib/seo";
import { outboundRel, outboundUrl } from "@/lib/outbound";
import { OutboundLink } from "@/components/tools/OutboundLink";
import { formatDate } from "@/lib/content";
import type { Fact, Tool } from "@/lib/types";
import { StatusTag, UK_ROWS, factText } from "@/components/tools/UkChecks";
import { ScoreBadge } from "@/components/ui/Badges";

export const dynamicParams = false;
export const generateStaticParams = () => COMPARISONS.map((c) => ({ slug: c.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) return {};
  return pageMetadata({
    title: c.metaTitle,
    absoluteTitle: true,
    description: c.description,
    path: `/compare/${c.slug}`,
    keywords: c.keywords,
    type: "article",
    publishedTime: c.published,
    modifiedTime: c.updated,
  });
}

function Side({ t, pick }: { t: Tool; pick: string[] }) {
  return (
    <div className="card relative flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-3">
          <ToolLogo name={t.name} color={t.color} />
          <span>
            <Link href={`/tools/${t.slug}`} className="text-headline-sm text-ink hover:underline">{t.name}</Link>
            <span className="block text-caption text-slate-mute">{t.vendor}</span>
          </span>
        </span>
        <ScoreBadge score={t.score} />
      </div>
      <p className="chip-price w-fit" title="Indicative — confirm on the vendor\u2019s site">{t.pricing.from}</p>
      <p className="text-label text-ink">Choose {t.name} if…</p>
      <ul className="space-y-1.5 text-body-md text-slate-body">
        {pick.map((p) => <li key={p} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />{p}</li>)}
      </ul>
      <OutboundLink href={outboundUrl(t)} rel={outboundRel(t)} slug={t.slug} className="btn-secondary mt-auto">
        Try {t.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </OutboundLink>
    </div>
  );
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const c = comparisonBySlug(slug);
  if (!c) notFound();
  const a = toolBySlug(c.a);
  const b = toolBySlug(c.b);
  if (!a || !b) notFound();
  const others = COMPARISONS.filter((x) => x.slug !== c.slug).slice(0, 4);

  return (
    <div className="container-site py-8">
      <JsonLd data={comparisonLd(c, a.name, b.name)} />
      <Breadcrumbs items={[{ name: "Compare", path: "/compare" }, { name: `${a.name} vs ${b.name}`, path: `/compare/${c.slug}/` }]} />
      <header className="mt-4 max-w-3xl">
        <p className="kicker">Head-to-head • Updated <time dateTime={c.updated}>{formatDate(c.updated)}</time></p>
        <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{c.title}</h1>
      </header>

      <section aria-labelledby="verdict" className="mt-6 max-w-3xl rounded-lg border border-rule bg-ink-soft p-6 text-white">
        <h2 id="verdict" className="text-label uppercase tracking-wider text-brand-fixed">In short</h2>
        <p className="mt-2 font-serif text-body-lead" data-speakable="">{c.summary}</p>
        <p className="mt-3 text-body-sm text-periwinkle">We don&apos;t declare an overall winner: the better choice depends on your business, team and existing software.</p>
      </section>

      <div className="mt-6 max-w-3xl"><AffiliateDisclosure /></div>

      <Reveal className="mt-8 grid gap-6 md:grid-cols-2">
        <Side t={a} pick={c.pickA} />
        <Side t={b} pick={c.pickB} />
      </Reveal>

      <section className="mt-10" aria-labelledby="criteria">
        <h2 id="criteria" className="font-serif text-headline-md text-ink md:text-headline-lg">Side by side</h2>
        <div className="-mx-4 mt-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[620px] border-collapse overflow-hidden rounded-lg border border-rule bg-surface-lowest text-left text-body-md">
            <thead className="bg-ink text-white">
              <tr>
                <th scope="col" className="px-4 py-3 text-label">Criterion</th>
                <th scope="col" className="px-4 py-3 text-label">{a.name}</th>
                <th scope="col" className="px-4 py-3 text-label">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {c.criteria.map((cr, i) => (
                <tr key={cr.name} className={`border-t border-rule ${i % 2 ? "bg-surface" : ""}`}>
                  <th scope="row" className="px-4 py-3 font-semibold text-ink">{cr.name}</th>
                  <td className="px-4 py-3 text-slate-body">{cr.a}</td>
                  <td className="px-4 py-3 text-slate-body">{cr.b}</td>
                </tr>
              ))}
              <tr className="border-t border-rule bg-surface-low">
                <th scope="row" className="px-4 py-3 font-semibold text-ink">Indicative price</th>
                <td className="px-4 py-3 text-slate-body">{a.pricing.from}</td>
                <td className="px-4 py-3 text-slate-body">{b.pricing.from}</td>
              </tr>
              {UK_ROWS.map(({ key, label }) => (
                <tr key={key} className="border-t border-rule">
                  <th scope="row" className="px-4 py-3 font-semibold text-ink">{label}</th>
                  {[a, b].map((t) => {
                    const f = t.uk[key] as Fact<string>;
                    return (
                      <td key={t.slug} className="px-4 py-3 text-slate-body">
                        {factText(f)} <StatusTag status={f.status} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="max-w-read">
        <div className="prose-editorial mt-4">
          <Sections sections={c.sections} />
        </div>
        <FaqList faqs={c.faqs} />
        <section className="mt-12">
          <h2 className="font-serif text-headline-md text-ink">More comparisons</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}><Link href={`/compare/${o.slug}`} className="card block p-4 text-body-md font-semibold text-ink hover:shadow-pop hover:underline">{o.title}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { FaqList } from "@/components/ui/Faq";
import { ToolCard } from "@/components/tools/ToolCard";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { bestFor, bestPages } from "@/lib/best";
import { itemListLd, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => bestPages().map((p) => ({ slug: p.def.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const p = bestFor((await params).slug);
  if (!p) return {};
  return pageMetadata({ title: `${p.def.title} (${SITE.year})`, description: p.def.intro, path: p.path, keywords: [p.def.keyword] });
}

export default async function BestPage({ params }: Props) {
  const p = bestFor((await params).slug);
  if (!p) notFound();
  const { def } = p;
  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd(def.h1, p.ranked.map((t) => ({ name: t.name, path: `/tools/${t.slug}/` })))} />
      <Breadcrumbs items={[{ name: "Best of", path: "/best/" }, { name: def.title, path: p.path }]} />
      <header className="mt-4 max-w-3xl">
        <p className="kicker">Tested shortlist • {SITE.year}</p>
        <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{def.h1}</h1>
        <p className="mt-3 text-body-lg text-slate-body" data-speakable="">{def.intro}</p>
      </header>
      <section className="mt-6 max-w-3xl rounded-lg border border-brand-line bg-brand-tint p-5" aria-labelledby="quick">
        <h2 id="quick" className="text-label uppercase tracking-wider text-brand-active">Quick answer</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-body-md text-ink">
          {p.ranked.slice(0, 5).map((t) => <li key={t.slug}><Link href={`/tools/${t.slug}/`} className="font-semibold hover:underline">{t.name}</Link> — best for {t.bestFor.toLowerCase()}</li>)}
        </ol>
      </section>
      <div className="mt-6"><AffiliateDisclosure /></div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {p.ranked.map((t, i) => <ToolCard key={t.slug} tool={t} rank={i + 1} />)}
      </div>
      <section className="mt-12 max-w-3xl" aria-labelledby="how">
        <h2 id="how" className="font-serif text-headline-md text-ink">How we chose</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-md text-slate-body">{def.how.map((h) => <li key={h}>{h}</li>)}</ul>
        <p className="mt-3 text-body-sm text-slate-mute">Vendors cannot pay to appear or move up this list. <Link href="/methodology/" className="underline">Our methodology</Link>.</p>
      </section>
      {p.untested.length > 0 && (
        <section className="mt-12" aria-labelledby="untested">
          <h2 id="untested" className="font-serif text-headline-md text-ink">Also worth a look (not yet tested)</h2>
          <ul className="mt-3 flex flex-wrap gap-2">{p.untested.map((t) => <li key={t.slug}><Link href={`/tools/${t.slug}/`} className="chip hover:underline">{t.name}</Link></li>)}</ul>
        </section>
      )}
      <div className="max-w-read"><FaqList faqs={def.faqs} /></div>
    </div>
  );
}

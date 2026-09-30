import { guidePath } from "@/data/guides";
import Link from "next/link";
import { Info } from "lucide-react";
import type { Listing } from "@/lib/listings";
import { ROOTS, publishedListings } from "@/lib/listings";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ToolCard } from "@/components/tools/ToolCard";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { FaqList } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { itemListLd } from "@/lib/seo";

export function ListingView({ l }: { l: Listing }) {
  const root = ROOTS[l.root];
  const siblings = publishedListings(l.root).filter((x) => x.slug !== l.slug && x.kind === l.kind).slice(0, 12);
  const other = l.category ? publishedListings(l.root === "ai-tools" ? "software" : "ai-tools").find((x) => x.slug === l.slug) : undefined;

  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd(l.h1, l.tools.map((t) => ({ name: t.name, path: `/tools/${t.slug}/` })))} />
      <Breadcrumbs items={[{ name: root.name, path: `/${l.root}/` }, { name: l.name, path: l.path }]} />
      <header className="mt-4 max-w-3xl">
        <p className="kicker flex items-center gap-2"><Icon name={l.icon} className="h-4 w-4" /> {root.name}</p>
        <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{l.h1}</h1>
        <p className="mt-3 text-body-lg text-slate-body" data-speakable="">{l.intro}</p>
        <p className="mt-3 text-body-sm text-slate-mute">
          {l.tools.length} product{l.tools.length === 1 ? "" : "s"} listed. Ordered by editorial score; products we have not tested yet are
          listed after scored ones, alphabetically. <Link href="/methodology/" className="underline">How we test</Link>.
        </p>
      </header>
      <div className="mt-6"><AffiliateDisclosure /></div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {l.tools.map((t, i) => <ToolCard key={t.slug} tool={t} rank={t.score != null ? i + 1 : undefined} />)}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-serif text-headline-md text-ink">What to look for</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-body-md text-slate-body">
            {l.criteria.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </section>
        <section className="card border-teal/40 p-6">
          <h2 className="flex items-center gap-2 font-serif text-headline-md text-ink"><Info className="h-5 w-5 text-teal-deep" aria-hidden="true" /> UK considerations</h2>
          <p className="mt-3 text-body-md text-slate-body">{l.ukNotes}</p>
        </section>
      </div>

      {l.guides.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-headline-md text-ink">Related guides</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {l.guides.map((g) => (
              <li key={g.slug}><Link href={guidePath(g)} className="card block p-4 text-body-md font-semibold text-ink hover:shadow-pop hover:underline">{g.title}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <div className="max-w-read"><FaqList faqs={l.faqs} /></div>

      {(siblings.length > 0 || other) && (
        <nav aria-label="Related categories" className="mt-12">
          <h2 className="font-serif text-headline-md text-ink">Explore more</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {other && <li><Link href={other.path} className="chip border-brand text-brand hover:underline">{other.name}</Link></li>}
            {siblings.map((s) => <li key={s.path}><Link href={s.path} className="chip hover:underline">{s.name}</Link></li>)}
          </ul>
        </nav>
      )}
    </div>
  );
}

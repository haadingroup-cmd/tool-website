import Link from "next/link";
import { CheckCircle2, Info } from "lucide-react";
import type { SegmentPage } from "@/lib/segments";
import { publishedSegments } from "@/lib/segments";
import { guidePath } from "@/data/guides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ToolCard } from "@/components/tools/ToolCard";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { FaqList } from "@/components/ui/Faq";
import { Icon } from "@/components/ui/Icon";
import { itemListLd } from "@/lib/seo";

export const KIND_LABEL = { industries: "Industries", "use-cases": "Use cases" } as const;

export function SegmentView({ p }: { p: SegmentPage }) {
  const { seg } = p;
  const siblings = publishedSegments(p.kind).filter((x) => x.seg.slug !== seg.slug);
  const free = p.tools.filter((t) => t.pricing.freePlan);
  const faqs = [
    { q: `What should I look for in ${seg.name.toLowerCase()} software?`, a: `Focus on: ${seg.needs.join("; ").toLowerCase()}. ${seg.ukNotes}` },
    { q: "Are there free options?", a: free.length ? `Yes — ${free.slice(0, 5).map((t) => `[${t.name}](/tools/${t.slug}/)`).join(", ")} ${free.length === 1 ? "has" : "have"} a free plan, with limits.` : "Most products listed here are paid, though several offer free trials." },
  ];
  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd(seg.h1, p.tools.map((t) => ({ name: t.name, path: `/tools/${t.slug}/` })))} />
      <Breadcrumbs items={[{ name: KIND_LABEL[p.kind], path: `/${p.kind}/` }, { name: seg.name, path: p.path }]} />
      <header className="mt-4 max-w-3xl">
        <p className="kicker flex items-center gap-2"><Icon name={seg.icon} className="h-4 w-4" /> {KIND_LABEL[p.kind]}</p>
        <h1 className="mt-2 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{seg.h1}</h1>
        <p className="mt-3 text-body-lg text-slate-body" data-speakable="">{seg.intro}</p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6" aria-labelledby="needs">
          <h2 id="needs" className="font-serif text-headline-md text-ink">What to look for</h2>
          <ul className="mt-3 space-y-2 text-body-md text-slate-body">
            {seg.needs.map((n) => <li key={n} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />{n}</li>)}
          </ul>
        </section>
        <section className="card border-teal/40 p-6" aria-labelledby="uk">
          <h2 id="uk" className="flex items-center gap-2 font-serif text-headline-md text-ink"><Info className="h-5 w-5 text-teal-deep" aria-hidden="true" /> UK considerations</h2>
          <p className="mt-3 text-body-md text-slate-body">{seg.ukNotes}</p>
          <p className="mt-4 text-label text-ink">Browse by category</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {p.links.map((l) => <li key={l.href + l.name}><Link href={l.href} className="chip hover:underline">{l.name}</Link></li>)}
          </ul>
        </section>
      </div>

      <section className="mt-12" aria-labelledby="products">
        <h2 id="products" className="font-serif text-headline-md text-ink md:text-headline-lg">Products to consider</h2>
        <p className="mt-1 text-body-sm text-slate-mute">Drawn from the categories above; tested products first. Not a paid ranking.</p>
        <div className="mt-4"><AffiliateDisclosure /></div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {p.tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {p.guides.length > 0 && (
        <section className="mt-12">
          <h2 className="font-serif text-headline-md text-ink">Related guides</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {p.guides.map((g) => <li key={g.slug}><Link href={guidePath(g)} className="card block p-4 font-semibold text-ink hover:underline">{g.title}</Link></li>)}
          </ul>
        </section>
      )}
      <div className="max-w-read"><FaqList faqs={faqs} /></div>
      {siblings.length > 0 && (
        <nav aria-label={`More ${KIND_LABEL[p.kind].toLowerCase()}`} className="mt-12">
          <h2 className="font-serif text-headline-md text-ink">More {KIND_LABEL[p.kind].toLowerCase()}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">{siblings.map((s) => <li key={s.path}><Link href={s.path} className="chip hover:underline">{s.seg.name}</Link></li>)}</ul>
        </nav>
      )}
    </div>
  );
}

export function SegmentIndex({ kind, title, lead }: { kind: "industries" | "use-cases"; title: string; lead: string }) {
  const pages = publishedSegments(kind);
  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd(title, pages.map((p) => ({ name: p.seg.name, path: p.path })))} />
      <Breadcrumbs items={[{ name: KIND_LABEL[kind], path: `/${kind}/` }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{title}</h1>
        <p className="mt-3 font-serif text-body-lead text-slate-body">{lead}</p>
      </header>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => (
          <li key={p.path}>
            <Link href={p.path} className="card group flex h-full gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand group-hover:bg-brand group-hover:text-white"><Icon name={p.seg.icon} className="h-5 w-5" /></span>
              <span>
                <span className="block text-headline-sm text-ink group-hover:underline">{p.seg.name}</span>
                <span className="mt-1 line-clamp-2 block text-body-sm text-slate-body">{p.seg.intro}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

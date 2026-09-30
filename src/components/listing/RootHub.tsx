import Link from "next/link";
import type { CategoryRoot } from "@/lib/types";
import { ROOTS, publishedListings } from "@/lib/listings";
import { toolsInRoot } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { ToolDirectory } from "@/components/tools/ToolDirectory";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { itemListLd } from "@/lib/seo";

export function RootHub({ root }: { root: CategoryRoot }) {
  const r = ROOTS[root];
  const cats = publishedListings(root).filter((l) => l.kind === "category");
  const curated = publishedListings(root).filter((l) => l.kind === "curated");
  const tools = toolsInRoot(root);
  return (
    <div className="container-site py-8">
      <JsonLd data={itemListLd(r.title, cats.map((c) => ({ name: c.name, path: c.path })))} />
      <Breadcrumbs items={[{ name: r.name, path: `/${root}/` }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{r.title}</h1>
        <p className="mt-3 font-serif text-body-lead text-slate-body" data-speakable="">{r.intro}</p>
      </header>

      <section aria-labelledby="cats" className="mt-8">
        <h2 id="cats" className="font-serif text-headline-md text-ink">Browse by category</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <li key={c.path}>
              <Link href={c.path} className="card group flex h-full items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-pop">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand group-hover:bg-brand group-hover:text-white">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-headline-sm text-ink">{c.name}</span>
                  <span className="text-caption text-slate-mute">{c.tools.length} product{c.tools.length === 1 ? "" : "s"}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {curated.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Curated lists">
            {curated.map((c) => <li key={c.path}><Link href={c.path} className="chip hover:underline">{c.name}</Link></li>)}
          </ul>
        )}
      </section>

      <section aria-labelledby="all" className="mt-12">
        <h2 id="all" className="font-serif text-headline-md text-ink">All {r.name.toLowerCase()} ({tools.length})</h2>
        <div className="mt-4"><AffiliateDisclosure /></div>
        <div className="mt-4"><ToolDirectory tools={tools} /></div>
      </section>
    </div>
  );
}

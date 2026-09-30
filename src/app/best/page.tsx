import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { bestPages } from "@/lib/best";
import { GUIDES, guidePath } from "@/data/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Best Software & AI Tools for UK Businesses: Tested Shortlists",
  description: "Shortlists of the best AI tools and business software for UK businesses, ranked by our hands-on editorial scores — never by payment.",
  path: "/best/",
});

export default function BestIndex() {
  const bestGuides = GUIDES.filter((g) => g.slug.startsWith("best-"));
  return (
    <div className="container-read py-8">
      <Breadcrumbs items={[{ name: "Best of", path: "/best/" }]} />
      <h1 className="mt-4 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Tested shortlists</h1>
      <p className="mt-3 font-serif text-body-lead text-slate-body">Every list is ranked by editorial scores from hands-on testing. We only publish a list when we&apos;ve tested at least three products for it.</p>
      <ul className="mt-8 space-y-3">
        {bestPages().map((p) => <li key={p.path}><Link href={p.path} className="card block p-4 font-semibold text-ink hover:underline">{p.def.title}</Link></li>)}
        {bestGuides.map((g) => <li key={g.slug}><Link href={guidePath(g)} className="card block p-4 font-semibold text-ink hover:underline">{g.title}</Link></li>)}
      </ul>
    </div>
  );
}

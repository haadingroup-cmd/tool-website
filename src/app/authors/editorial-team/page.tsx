import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { GuideCard } from "@/components/content/GuideCard";
import { GUIDES } from "@/data/guides";
import { pageMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: `${SITE.author.name}: About Our Writers`,
  description: SITE.author.bio,
  path: "/authors/editorial-team/",
});

export default function EditorialTeam() {
  return (
    <div className="container-site py-8">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: { "@type": "Organization", name: SITE.author.name, description: SITE.author.bio, url: absoluteUrl("/authors/editorial-team/"), parentOrganization: { "@id": `${SITE.url}/#organization` } } }} />
      <Breadcrumbs items={[{ name: "Authors", path: "/authors/editorial-team/" }, { name: SITE.author.name, path: "/authors/editorial-team/" }]} />
      <header className="mt-4 max-w-3xl">
        <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{SITE.author.name}</h1>
        <p className="mt-1 text-label uppercase text-brand">{SITE.author.role}</p>
        <p className="mt-3 font-serif text-body-lead text-slate-body">{SITE.author.bio}</p>
        <p className="mt-3 text-body-md text-slate-body">
          Read our <Link href="/editorial-policy/" className="text-brand underline">editorial policy</Link> and{" "}
          <Link href="/methodology/" className="text-brand underline">testing methodology</Link>.
        </p>
      </header>
      <section className="mt-10">
        <h2 className="font-serif text-headline-md text-ink">Guides by the team</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.slice(0, 9).map((g) => <GuideCard key={g.slug} guide={g} />)}
        </div>
      </section>
    </div>
  );
}

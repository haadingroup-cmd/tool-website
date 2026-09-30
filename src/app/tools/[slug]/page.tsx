import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Minus, ShieldCheck } from "lucide-react";
import { TOOLS, toolBySlug } from "@/lib/catalog";
import { COMPARISONS } from "@/data/comparisons";
import { GUIDES, guidePath } from "@/data/guides";
import { categoryByKey } from "@/data/taxonomy";
import { categoryHref } from "@/lib/listings";
import { altPageFor } from "@/lib/alternatives";
import { UkPanel, STATUS_LABEL } from "@/components/tools/UkChecks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ToolLogo } from "@/components/ui/ToolLogo";
import { ScoreBadge, ToolChips } from "@/components/ui/Badges";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Reveal } from "@/components/ui/Reveal";
import { FaqList } from "@/components/ui/Faq";
import { ToolMini } from "@/components/tools/ToolMini";
import { AffiliateDisclosure } from "@/components/content/Disclosure";
import { pageMetadata, toolLd } from "@/lib/seo";
import { outboundRel, outboundUrl } from "@/lib/outbound";
import { OutboundLink } from "@/components/tools/OutboundLink";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/content";
import type { Faq, Tool } from "@/lib/types";

export const dynamicParams = false;
export const generateStaticParams = () => TOOLS.map((t) => ({ slug: t.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const t = toolBySlug(slug);
  if (!t) return {};
  return pageMetadata({
    title: [`${t.name} Review UK (${SITE.year}): Pricing, Pros & Cons`, `${t.name} Review (${SITE.year}): UK Pricing & Verdict`, `${t.name} Review UK (${SITE.year})`].find((x) => x.length <= 60) ?? `${t.name} Review`,
    description: `${t.name} review for UK small businesses: ${t.tagline.toLowerCase()}. ${t.score != null ? `Score ${t.score.toFixed(1)}/10, ` : ""}${t.pricing.from}, pros and cons, UK GDPR notes and best alternatives.`,
    path: `/tools/${t.slug}/`,
    keywords: [`${t.name.toLowerCase()} review`, `${t.name.toLowerCase()} uk`, `${t.name.toLowerCase()} pricing uk`, `${t.name.toLowerCase()} alternatives`],
  });
}

function toolFaqs(t: Tool, alts: Tool[]): Faq[] {
  const quoted = !t.pricing.from.startsWith("See vendor");
  const price = quoted ? ` Paid plans start at ${t.pricing.from} (indicative).` : ` We haven't yet verified ${t.name}'s current prices — see the vendor's UK pricing page.`;
  return [
    {
      q: `Is ${t.name} free?`,
      a: t.pricing.freePlan
        ? `Yes — ${t.name} offers a free plan, usually with usage limits.${price}${t.pricing.note && quoted ? ` ${t.pricing.note}` : ""}`
        : `We haven't found a permanent free plan for ${t.name}${t.pricing.trial ? `, but it offers a ${t.pricing.trial.toLowerCase()}` : ""}.${price}`,
    },
    {
      q: `How much does ${t.name} cost in the UK?`,
      a: quoted
        ? `Entry pricing is ${t.pricing.from} (indicative, may exclude VAT). Prices change often, so confirm on the ${t.vendor} website before buying.`
        : `${t.vendor} publishes current pricing on its website. We only quote prices once we've checked them against the vendor's pricing page, and we'll add them here with the date checked.`,
    },
    { q: `Is ${t.name} GDPR compliant for UK businesses?`, a: `${t.ukNotes} Compliance also depends on how you use the tool — see our [UK GDPR and AI checklist](/guides/uk-gdpr-ai-compliance-checklist).` },
    ...(alts.length
      ? [{ q: `What are the alternatives to ${t.name}?`, a: `Common alternatives include ${alts.map((a) => `[${a.name}](/tools/${a.slug}/)`).join(", ")}.${altPageFor(t.slug) ? ` See [all ${t.name} alternatives](/alternatives/${t.slug}/).` : ""}` }]
      : []),
    { q: `Who is ${t.name} best for?`, a: `${t.bestFor}.` },
  ];
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const t = toolBySlug(slug);
  if (!t) notFound();
  const primary = categoryByKey(t.categories[0]!);
  const priceStatus = t.pricing.status ?? "unverified";
  const PLATFORM: Record<string, string> = { web: "Web", windows: "Windows", mac: "Mac", ios: "iPhone/iPad", android: "Android", "chrome-extension": "Chrome extension", api: "API", "self-hosted": "Self-hosted" };
  const alts = t.alternatives.map(toolBySlug).filter((x): x is Tool => Boolean(x));
  const comps = COMPARISONS.filter((c) => c.a === t.slug || c.b === t.slug);
  const guides = GUIDES.filter((g) => g.relatedTools.includes(t.slug)).slice(0, 4);

  return (
    <div className="container-site py-8">
      <JsonLd data={toolLd(t)} />
      <Breadcrumbs
        items={[
          ...(primary
            ? [{ name: primary.root === "ai-tools" ? "AI Tools" : "Software", path: `/${primary.root}/` }, { name: primary.short, path: categoryHref(primary.key) }]
            : [{ name: "Tools", path: "/tools/" }]),
          { name: t.name, path: `/tools/${t.slug}/` },
        ]}
      />

      <header className="mt-5 flex flex-col gap-5 border-b border-rule pb-8 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <ToolLogo name={t.name} color={t.color} size={64} />
          <div>
            <p className="kicker">{t.vendor} • {t.score != null ? `Tested ${SITE.year}` : "Listing — not yet tested"}</p>
            <h1 className="mt-1 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">{t.name} {t.score != null ? "review" : "overview"}</h1>
            <p className="mt-1 font-serif text-body-lead text-slate-body">{t.tagline}</p>
            <div className="mt-3"><ToolChips tool={t} max={5} /></div>
          </div>
        </div>
        <div className="flex items-center gap-4 md:flex-col md:items-end">
          <ScoreBadge score={t.score} size="lg" />
          <OutboundLink href={outboundUrl(t)} rel={outboundRel(t)} slug={t.slug} className="btn-primary">
            Visit {t.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </OutboundLink>
        </div>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="min-w-0">
          <AffiliateDisclosure />
          <section className="mt-6 rounded-lg border border-rule bg-surface-lowest p-5" aria-labelledby="verdict">
            <h2 id="verdict" className="text-label uppercase tracking-wider text-brand">{t.score != null ? "The short verdict" : "Overview"}</h2>
            <p className="mt-2 font-serif text-body-lead text-ink" data-speakable="">{t.summary}</p>
          </section>

          <div className="prose-editorial mt-8">
            <h2 id="review">{t.score != null ? `Our ${t.name} review` : `About ${t.name}`}</h2>
            {t.review.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <Reveal className="mt-10 grid gap-4 sm:grid-cols-2">
            <section className="card p-5" aria-labelledby="pros">
              <h2 id="pros" className="text-headline-sm text-teal-deep">What we like</h2>
              <ul className="mt-3 space-y-2 text-body-md">
                {t.pros.map((p) => <li key={p} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />{p}</li>)}
              </ul>
            </section>
            <section className="card p-5" aria-labelledby="cons">
              <h2 id="cons" className="text-headline-sm text-red-800">Watch out for</h2>
              <ul className="mt-3 space-y-2 text-body-md">
                {t.cons.map((p) => <li key={p} className="flex gap-2"><Minus className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />{p}</li>)}
              </ul>
            </section>
          </Reveal>

          <section className="mt-10" aria-labelledby="features">
            <h2 id="features" className="font-serif text-headline-md text-ink">Key features</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {t.features.map((f, i) => (
                <li key={f} className={`flex items-center gap-2 rounded px-3 py-2 text-body-md ${i % 2 ? "bg-surface" : "bg-surface-lowest"} border border-rule`}>
                  <Check className="h-4 w-4 text-brand" aria-hidden="true" />{f}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10 rounded-lg border border-teal/30 bg-teal/5 p-5" aria-labelledby="uk-notes">
            <h2 id="uk-notes" className="flex items-center gap-2 text-headline-sm text-teal-deep">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" /> UK business &amp; GDPR notes
            </h2>
            <p className="mt-2 text-body-lg text-on-surface">{t.ukNotes}</p>
          </section>

          <div className="mt-6"><UkPanel tool={t} /></div>

          <section className="mt-10" aria-labelledby="pricing">
            <h2 id="pricing" className="font-serif text-headline-md text-ink">{t.name} pricing (UK)</h2>
            <table className="mt-4 w-full border-collapse overflow-hidden rounded-lg border border-rule text-left text-body-md">
              <tbody className="tnum">
                <tr className="bg-surface-lowest"><th scope="row" className="w-1/3 px-4 py-3 font-semibold text-ink">Entry paid plan</th><td className="px-4 py-3">{t.pricing.from} <span className="ml-1 rounded bg-surface-high px-1.5 py-0.5 text-[11px] text-slate-mute">{priceStatus === "unverified" ? "Indicative — not yet verified" : STATUS_LABEL[priceStatus]}</span></td></tr>
                <tr className="border-t border-rule bg-surface"><th scope="row" className="px-4 py-3 font-semibold text-ink">Free plan</th><td className="px-4 py-3">{t.pricing.freePlan ? "Yes" : "None listed"}</td></tr>
                {t.pricing.trial && <tr className="border-t border-rule bg-surface-lowest"><th scope="row" className="px-4 py-3 font-semibold text-ink">Trial</th><td className="px-4 py-3">{t.pricing.trial}</td></tr>}
                {t.pricing.note && <tr className="border-t border-rule bg-surface"><th scope="row" className="px-4 py-3 font-semibold text-ink">Notes</th><td className="px-4 py-3">{t.pricing.note}</td></tr>}
              </tbody>
            </table>
            <p className="mt-2 text-caption text-slate-mute">
              {t.pricing.sourceUrl && t.pricing.checkedAt
                ? <>Checked against the <a href={t.pricing.sourceUrl} rel="nofollow noopener" target="_blank" className="underline">vendor&apos;s pricing page</a> on {formatDate(t.pricing.checkedAt)}. </>
                : <>Indicative pricing, not yet checked against the vendor&apos;s current pricing page. Last edited {formatDate(SITE.lastUpdated)}. </>}
              May exclude VAT — always confirm on the vendor&apos;s site before buying.
            </p>
          </section>

          {comps.length > 0 && (
            <section className="mt-10" aria-labelledby="comparisons">
              <h2 id="comparisons" className="font-serif text-headline-md text-ink">Head-to-head comparisons</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {comps.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/compare/${c.slug}/`} className="card block p-4 hover:border-rule-strong hover:shadow-pop">
                      <span className="text-body-md font-semibold text-ink">{c.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <FaqList faqs={toolFaqs(t, alts)} heading={`${t.name}: frequently asked questions`} />
        </article>

        <aside className="min-w-0">
          <div className="sticky top-28 flex flex-col gap-4">
            <Reveal className="card p-5">
              <p className="text-label uppercase tracking-wider text-ink">SmarterBiz scorecard</p>
              {t.score != null ? (
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="tnum font-serif text-[44px] font-semibold leading-none text-ink">{t.score.toFixed(1)}</span>
                  <span className="text-body-md text-slate-mute">/ 10</span>
                </div>
              ) : (
                <p className="mt-2 text-body-sm text-slate-body">Not yet scored. We only score products after hands-on testing.</p>
              )}
              {t.scores && (
                <div className="mt-4 space-y-3">
                  <ScoreBar label="Value for money (£)" value={t.scores.value} />
                  <ScoreBar label="Ease of use" value={t.scores.easeOfUse} />
                  <ScoreBar label="UK fit & compliance" value={t.scores.ukFit} tone="teal" />
                  <ScoreBar label="Features" value={t.scores.features} />
                </div>
              )}
              <dl className="mt-5 space-y-2 border-t border-rule pt-4 text-body-sm">
                <div className="flex justify-between gap-3"><dt className="text-slate-mute">Best for</dt><dd className="text-right font-medium text-ink">{t.bestFor}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-mute">From</dt><dd className="tnum text-right font-medium text-ink">{t.pricing.from}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-mute">Free plan</dt><dd className="text-right font-medium text-ink">{t.pricing.freePlan ? "Yes" : "None listed"}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-slate-mute">Platforms</dt><dd className="text-right font-medium text-ink">{t.platforms.map((p) => PLATFORM[p] ?? p).join(", ")}</dd></div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-mute">Categories</dt>
                  <dd className="text-right font-medium text-ink">
                    {t.categories.map((k, i) => (
                      <span key={k}>{i > 0 && ", "}<Link href={categoryHref(k)} className="hover:underline">{categoryByKey(k)?.short ?? k}</Link></span>
                    ))}
                  </dd>
                </div>
              </dl>
              <OutboundLink href={outboundUrl(t)} rel={outboundRel(t)} slug={t.slug} className="btn-primary mt-5 w-full">
                Visit {t.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </OutboundLink>
            </Reveal>
            {alts.length > 0 && (
              <div>
                <p className="mb-2 text-label uppercase tracking-wider text-ink">Alternatives</p>
                <div className="flex flex-col gap-2">{alts.map((a) => <ToolMini key={a.slug} tool={a} />)}</div>
                {altPageFor(t.slug) && <Link href={`/alternatives/${t.slug}/`} className="mt-2 inline-block text-body-sm font-semibold text-brand hover:underline">All {t.name} alternatives →</Link>}
              </div>
            )}
            {guides.length > 0 && (
              <div>
                <p className="mb-2 text-label uppercase tracking-wider text-ink">Featured in</p>
                <ul className="card divide-y divide-rule">
                  {guides.map((g) => (
                    <li key={g.slug}><Link href={guidePath(g)} className="block px-4 py-3 text-body-md text-ink hover:bg-surface hover:underline">{g.title}</Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

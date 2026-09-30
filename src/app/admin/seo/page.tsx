import { SEO_ROLES, requireRole } from "@/lib/auth/session";
import { SITEMAP_GROUPS, siteUrls } from "@/lib/urls";
import { allListings } from "@/lib/listings";
import { segmentPages } from "@/lib/segments";
import { altPages } from "@/lib/alternatives";
import { bestPages } from "@/lib/best";
import { TOOLS } from "@/lib/catalog";
import { MTD_FACTS } from "@/data/uk";
import type { Gate } from "@/lib/quality";
import type { UkCheck } from "@/lib/types";

interface Row { path: string; type: string; quality: number; products: number; gate: Gate }

const GATE_STYLE: Record<Gate, string> = { index: "text-teal-deep", noindex: "text-amber-800", skip: "text-slate-mute" };
const GATE_LABEL: Record<Gate, string> = { index: "Indexed", noindex: "noindex", skip: "Not generated" };
const UK_FIELDS: (keyof Omit<UkCheck, "ukIntegrations" | "gdprInfoUrl">)[] = ["available", "gbpPricing", "vatSupport", "dataResidency", "mtd", "companiesHouse", "ukSupport"];

export default async function AdminSeo({ searchParams }: { searchParams: Promise<{ gate?: string }> }) {
  await requireRole(SEO_ROLES, "/admin/seo/");
  const { gate: filter } = await searchParams;

  const rows: Row[] = [
    ...allListings().map((l) => ({ path: l.path, type: l.kind === "curated" ? "Curated list" : "Category", quality: l.quality, products: l.tools.length, gate: l.gate })),
    ...segmentPages().map((p) => ({ path: p.path, type: p.kind === "industries" ? "Industry" : "Use case", quality: p.quality, products: p.tools.length, gate: p.gate })),
    ...altPages().map((p) => ({ path: `/alternatives/${p.tool.slug}/`, type: "Alternatives", quality: p.quality, products: p.alts.length, gate: p.gate })),
  ].sort((a, b) => a.quality - b.quality);
  const shown = filter === "index" || filter === "noindex" || filter === "skip" ? rows.filter((r) => r.gate === filter) : rows;

  const urls = siteUrls();
  const perGroup = SITEMAP_GROUPS.map((g) => [g, urls.filter((u) => u.group === g).length] as const);
  const gates = (["index", "noindex", "skip"] as const).map((g) => [g, rows.filter((r) => r.gate === g).length] as const);

  const scored = TOOLS.filter((t) => t.score != null).length;
  const pricesVerified = TOOLS.filter((t) => t.pricing.status && t.pricing.status !== "unverified").length;
  const ukTotal = TOOLS.length * UK_FIELDS.length;
  const ukVerified = TOOLS.reduce((n, t) => n + UK_FIELDS.filter((f) => t.uk[f].status !== "unverified").length, 0);
  const mtdVerified = MTD_FACTS.filter((f) => f.status !== "unverified").length;

  const Stat = ({ n, label }: { n: string | number; label: string }) => (
    <div className="card p-4"><span className="tnum block font-serif text-[30px] leading-none text-ink">{n}</span><span className="mt-1 block text-body-sm text-slate-body">{label}</span></div>
  );

  return (
    <div>
      <h1 className="font-serif text-headline-lg text-ink">SEO dashboard</h1>
      <p className="mt-1 text-body-sm text-slate-body">
        Computed from the same code that builds the site, so it always matches what is live. Quality gate: ≥70 indexed, 50–69 noindex, &lt;50 not generated;
        fewer than 3 products is never indexed. Keyword volumes need a keyword API (not connected yet).
      </p>

      <h2 className="mt-6 text-headline-sm text-ink">Sitemaps</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat n={urls.length} label="URLs in sitemap.xml" />
        {perGroup.map(([g, n]) => <Stat key={g} n={n} label={`sitemaps/${g}.xml`} />)}
      </div>

      <h2 className="mt-6 text-headline-sm text-ink">Fact verification</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat n={`${scored} / ${TOOLS.length}`} label="Products hands-on scored" />
        <Stat n={`${pricesVerified} / ${TOOLS.length}`} label="Prices checked against a source" />
        <Stat n={`${ukVerified} / ${ukTotal}`} label="UK facts verified" />
        <Stat n={`${mtdVerified} / ${MTD_FACTS.length}`} label="GOV.UK MTD statements re-checked" />
      </div>

      <h2 className="mt-6 text-headline-sm text-ink">Generated pages and quality gate</h2>
      <div className="mt-3 flex flex-wrap gap-2 text-body-sm">
        <a href="/admin/seo/" className="rounded border border-rule px-3 py-1">All ({rows.length})</a>
        {gates.map(([g, n]) => <a key={g} href={`/admin/seo/?gate=${g}`} className={`rounded border border-rule px-3 py-1 ${GATE_STYLE[g]}`}>{GATE_LABEL[g]} ({n})</a>)}
        <span className="px-1 py-1 text-slate-mute">+ {bestPages().length} /best/ pages (only with ≥3 tested products)</span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead className="border-b border-rule text-slate-mute"><tr><th className="py-2 pr-4">Page</th><th className="py-2 pr-4">Type</th><th className="py-2 pr-4 text-right">Products</th><th className="py-2 pr-4 text-right">Quality</th><th className="py-2">Status</th></tr></thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.path} className="border-b border-rule">
                <td className="py-1.5 pr-4">{r.gate === "skip" ? r.path : <a className="underline" href={r.path}>{r.path}</a>}</td>
                <td className="py-1.5 pr-4">{r.type}</td>
                <td className="tnum py-1.5 pr-4 text-right">{r.products}</td>
                <td className="tnum py-1.5 pr-4 text-right">{r.quality}</td>
                <td className={`py-1.5 font-medium ${GATE_STYLE[r.gate]}`}>{GATE_LABEL[r.gate]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

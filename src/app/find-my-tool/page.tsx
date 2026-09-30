import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ToolFinder } from "@/components/tools/ToolFinder";
import { TOOLS } from "@/lib/catalog";
import { INDUSTRIES } from "@/data/segments";
import { publishedListings } from "@/lib/listings";
import type { FinderTool } from "@/lib/finder";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Find the Right Software for Your UK Business",
  description: "Answer 10 quick questions and get a shortlist of AI tools and business software matched to your needs, budget, platforms and UK requirements — with the reasons for each match.",
  path: "/find-my-tool/",
});

export default function FindMyTool() {
  const tools: FinderTool[] = TOOLS.map((t) => ({
    slug: t.slug, name: t.name, bestFor: t.bestFor, categories: t.categories, free: t.pricing.freePlan, trial: Boolean(t.pricing.trial),
    platforms: t.platforms, mtd: t.uk.mtd.value === "compatible", ukData: ["uk", "eu"].includes(t.uk.dataResidency.value), ukBuilt: Boolean(t.ukBuilt),
    score: t.score ?? null, sub: t.scores ?? null,
    text: `${t.features.join(" ")} ${t.review.join(" ")} ${t.pros.join(" ")}`.toLowerCase(),
  }));
  const needs = publishedListings().filter((l) => l.kind === "category" && l.tools.length >= 2).map((l) => ({ value: l.category!.key, label: l.name }));
  const industries = INDUSTRIES.map((s) => ({ value: s.slug, label: s.name }));
  return (
    <div className="container-read py-8">
      <Breadcrumbs items={[{ name: "Find my tool", path: "/find-my-tool/" }]} />
      <h1 className="mt-4 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Find the right tool</h1>
      <p className="mt-3 font-serif text-body-lead text-slate-body">Ten quick questions, then a shortlist with the reasons behind every match. Your answers stay in your browser; we only count, anonymously, which category was searched.</p>
      <div className="card mt-8 p-6"><ToolFinder tools={tools} needs={needs} industries={industries} /></div>
    </div>
  );
}

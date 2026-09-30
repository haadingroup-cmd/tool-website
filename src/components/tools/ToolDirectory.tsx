"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { Tool } from "@/lib/types";
import { ToolCard } from "./ToolCard";
import { CATEGORIES } from "@/data/taxonomy";
import type { Platform } from "@/lib/types";

const PER_PAGE = 12;
type Sort = "score" | "value" | "ukFit" | "name";

const PLATFORMS: [Platform, string][] = [
  ["web", "Web"], ["windows", "Windows"], ["mac", "Mac"], ["ios", "iPhone"], ["android", "Android"], ["api", "API"], ["self-hosted", "Self-hosted"],
];

export function ToolDirectory({ tools, showCategory = true }: { tools: Tool[]; showCategory?: boolean }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [ukData, setUkData] = useState(false);
  const [free, setFree] = useState(false);
  const [mtd, setMtd] = useState(false);
  const [sort, setSort] = useState<Sort>("score");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = tools.filter(
      (t) =>
        (cat === "all" || t.categories.includes(cat as Tool["categories"][number])) &&
        (!free || t.pricing.freePlan) &&
        (!mtd || t.mtdCompatible) &&
        (platform === "all" || t.platforms.includes(platform as Platform)) &&
        (!ukData || t.uk.dataResidency.value === "uk" || t.uk.dataResidency.value === "eu") &&
        (!needle || `${t.name} ${t.vendor} ${t.tagline} ${t.bestFor} ${t.features.join(" ")}`.toLowerCase().includes(needle)),
    );
    const by: Record<Sort, (a: Tool, b: Tool) => number> = {
      score: (a, b) => (b.score ?? -1) - (a.score ?? -1) || a.name.localeCompare(b.name),
      value: (a, b) => (b.scores?.value ?? -1) - (a.scores?.value ?? -1) || a.name.localeCompare(b.name),
      ukFit: (a, b) => (b.scores?.ukFit ?? -1) - (a.scores?.ukFit ?? -1) || a.name.localeCompare(b.name),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return list.sort(by[sort]);
  }, [tools, q, cat, free, mtd, platform, ukData, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const reset = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div>
      <div className="card z-30 flex flex-col gap-3 p-3 md:sticky md:top-[96px] md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search tools</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-mute" aria-hidden="true" />
          <input
            type="search"
            value={q}
            maxLength={80}
            onChange={(e) => reset(() => setQ(e.target.value))}
            placeholder="Filter by utility, vendor or feature…"
            className="input pl-9"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {showCategory && (
            <>
              <label className="sr-only" htmlFor="dir-cat">Category</label>
              <select id="dir-cat" value={cat} onChange={(e) => reset(() => setCat(e.target.value))} className="input w-auto">
                <option value="all">All categories</option>
                {(["ai-tools", "software"] as const).map((root) => (
                  <optgroup key={root} label={root === "ai-tools" ? "AI tools" : "Business software"}>
                    {CATEGORIES.filter((c) => c.root === root && tools.some((t) => t.categories.includes(c.key))).map((c) => (
                      <option key={c.key} value={c.key}>{c.short}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </>
          )}
          <label className="sr-only" htmlFor="dir-platform">Platform</label>
          <select id="dir-platform" value={platform} onChange={(e) => reset(() => setPlatform(e.target.value))} className="input w-auto">
            <option value="all">Any platform</option>
            {PLATFORMS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <label className="sr-only" htmlFor="dir-sort">Sort by</label>
          <select id="dir-sort" value={sort} onChange={(e) => reset(() => setSort(e.target.value as Sort))} className="input w-auto">
            <option value="score">Highest editorial score</option>
            <option value="value">Best value (£)</option>
            <option value="ukFit">Best UK fit</option>
            <option value="name">A–Z</option>
          </select>
          <button type="button" aria-pressed={free} onClick={() => reset(() => setFree((v) => !v))}
            className={`rounded-full border px-3 py-1.5 text-label ${free ? "border-ink bg-ink text-white" : "border-rule-strong bg-surface-lowest text-ink"}`}>
            Free plan
          </button>
          <button type="button" aria-pressed={mtd} onClick={() => reset(() => setMtd((v) => !v))}
            className={`rounded-full border px-3 py-1.5 text-label ${mtd ? "border-ink bg-ink text-white" : "border-rule-strong bg-surface-lowest text-ink"}`}>
            MTD ready
          </button>
          <button type="button" aria-pressed={ukData} onClick={() => reset(() => setUkData((v) => !v))}
            title="Vendor offers UK or EU data hosting (unverified — check the listing)"
            className={`rounded-full border px-3 py-1.5 text-label ${ukData ? "border-ink bg-ink text-white" : "border-rule-strong bg-surface-lowest text-ink"}`}>
            UK/EU data
          </button>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-body-sm text-slate-body" aria-live="polite">
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Showing {shown.length ? (current - 1) * PER_PAGE + 1 : 0}–{(current - 1) * PER_PAGE + shown.length} of {filtered.length} tools
      </p>

      {shown.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      ) : (
        <div className="card mt-4 p-8 text-center">
          <p className="text-headline-sm text-ink">No tools match those filters.</p>
          <button type="button" className="btn-secondary mt-4" onClick={() => { setQ(""); setCat("all"); setPlatform("all"); setFree(false); setMtd(false); setUkData(false); setPage(1); }}>
            Clear filters
          </button>
        </div>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
          <button type="button" className="btn-secondary px-3" disabled={current === 1} onClick={() => setPage(current - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => setPage(n)} aria-current={n === current ? "page" : undefined}
              className={`h-10 w-10 rounded text-label ${n === current ? "bg-ink text-white" : "border border-rule-strong bg-surface-lowest text-ink hover:bg-surface"}`}>
              {n}
            </button>
          ))}
          <button type="button" className="btn-secondary px-3" disabled={current === pages} onClick={() => setPage(current + 1)} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </div>
  );
}

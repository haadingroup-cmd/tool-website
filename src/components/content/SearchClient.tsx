"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Search, Sparkles } from "lucide-react";
import { track } from "@/lib/track";

interface Result { type: string; title: string; description: string; href: string }
interface Match { name: string; href: string; bestFor: string; free: boolean }

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").slice(0, 80);
  const [value, setValue] = useState(q);
  const [results, setResults] = useState<Result[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [understood, setUnderstood] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setValue(q), [q]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setMatches([]);
      setUnderstood([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/search/?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
      .then((r) => r.json() as Promise<{ ok: boolean; results?: Result[]; matches?: Match[]; understood?: string[]; error?: string }>)
      .then((d) => {
        if (d.ok) {
          setResults(d.results ?? []);
          setMatches(d.matches ?? []);
          setUnderstood(d.understood ?? []);
          track("search", { props: { q: q.slice(0, 80), results: (d.results ?? []).length } });
        }
        else setError(d.error ?? "Search failed.");
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") setError("Search is unavailable right now.");
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [q]);

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const v = value.trim().slice(0, 80);
          router.push(v ? `/search/?q=${encodeURIComponent(v)}` : "/search/");
        }}
        className="flex gap-2"
      >
        <label htmlFor="search-page" className="sr-only">Search</label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-mute" aria-hidden="true" />
          <input id="search-page" type="search" value={value} maxLength={80} onChange={(e) => setValue(e.target.value)} placeholder="Try ‘free CRM for estate agents’ or ‘MTD software on iPhone’" className="input pl-9" autoFocus />
        </div>
        <button type="submit" className="btn-dark">Search</button>
      </form>

      <div className="mt-6" aria-live="polite">
        {loading && <p className="flex items-center gap-2 text-body-md text-slate-body"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Searching…</p>}
        {error && <p role="alert" className="text-body-md text-red-700">{error}</p>}
        {!loading && q && !error && (
          <p className="text-body-sm text-slate-mute">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>
        )}
        {matches.length > 0 && (
          <section aria-labelledby="matches" className="mt-4 rounded-lg border border-brand-line bg-brand-tint p-4">
            <h2 id="matches" className="flex items-center gap-2 text-label uppercase tracking-wider text-brand-active"><Sparkles className="h-4 w-4" aria-hidden="true" /> Matching products</h2>
            <p className="mt-1 text-body-sm text-slate-body">We read your search as: {understood.map((u) => <span key={u} className="chip ml-1">{u}</span>)}</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {matches.map((m) => (
                <li key={m.href}><Link href={m.href} className="card block p-3 hover:shadow-pop"><span className="font-semibold text-ink">{m.name}</span>{m.free && <span className="chip-free ml-2">Free plan</span>}<span className="mt-0.5 block text-body-sm text-slate-body">{m.bestFor}</span></Link></li>
              ))}
            </ul>
            <p className="mt-2 text-caption text-slate-mute">Filters are applied to our listings only; UK facts are labelled with how they were verified on each page. Or try the <Link href="/find-my-tool/" className="underline">tool finder</Link>.</p>
          </section>
        )}
        <ul className="mt-3 flex flex-col gap-3">
          {results.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="card block p-4 hover:border-rule-strong hover:shadow-pop">
                <span className="text-caption uppercase tracking-wider text-brand">{r.type}</span>
                <span className="mt-1 block text-headline-sm text-ink">{r.title}</span>
                <span className="mt-1 line-clamp-2 block text-body-md text-slate-body">{r.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        {!loading && q && !error && results.length === 0 && (
          <p className="card mt-3 p-6 text-body-md text-slate-body">
            No matches. Browse <Link href="/ai-tools/" className="text-brand underline">AI tools</Link>, <Link href="/software/" className="text-brand underline">business software</Link> or <Link href="/guides" className="text-brand underline">guides</Link>.
          </p>
        )}
      </div>
    </div>
  );
}

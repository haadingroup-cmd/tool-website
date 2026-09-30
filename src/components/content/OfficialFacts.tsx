import { Landmark } from "lucide-react";
import type { OfficialFact } from "@/data/uk";
import { StatusTag } from "@/components/tools/UkChecks";
import { formatDate } from "@/lib/content";

/** "What the official source says" — visually separate from our own explanation. */
export function OfficialFacts({ facts, title = "What HMRC says" }: { facts: OfficialFact[]; title?: string }) {
  return (
    <section aria-labelledby="official" className="rounded-lg border border-rule bg-surface-lowest p-5">
      <h2 id="official" className="flex items-center gap-2 font-serif text-headline-md text-ink">
        <Landmark className="h-5 w-5 text-brand" aria-hidden="true" /> {title}
      </h2>
      <p className="mt-1 text-body-sm text-slate-mute">
        Summaries of official GOV.UK guidance, each linked to its source. Rules change — the GOV.UK page is always the authority.
      </p>
      <ul className="mt-4 divide-y divide-rule">
        {facts.map((f) => (
          <li key={f.id} className="py-3">
            <p className="text-body-md text-ink">{f.says}</p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-caption text-slate-mute">
              <a href={f.source.url} target="_blank" rel="noopener" className="text-brand underline">{f.source.title}</a>
              <StatusTag status={f.status} />
              {f.checkedAt && <span>Checked {formatDate(f.checkedAt)}</span>}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

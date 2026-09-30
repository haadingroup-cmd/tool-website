"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { rank, type Answers, type FinderTool } from "@/lib/finder";
import { track } from "@/lib/track";

type Opt = { value: string; label: string };
interface Step { key: keyof Answers; title: string; help?: string; multi?: boolean; options: Opt[] }

const RELAX_LABEL: Record<string, string> = { platform: "platform", data: "data-hosting", budget: "budget", mtd: "Making Tax Digital" };

export function ToolFinder({ tools, needs, industries }: { tools: FinderTool[]; needs: Opt[]; industries: Opt[] }) {
  const steps: Step[] = useMemo(() => [
    { key: "need", title: "What do you need help with?", options: needs },
    { key: "industry", title: "What kind of business are you?", options: [...industries, { value: "", label: "Something else" }] },
    { key: "size", title: "How many people will use it?", options: [{ value: "solo", label: "Just me" }, { value: "small", label: "2–10" }, { value: "medium", label: "11–50" }, { value: "large", label: "More than 50" }] },
    { key: "budget", title: "What's your budget?", help: "We don't filter by price yet — prices change often and we only quote them once verified.", options: [{ value: "free", label: "Free plan only" }, { value: "trial", label: "Free plan or free trial" }, { value: "any", label: "Happy to pay for the right tool" }] },
    { key: "platforms", title: "Where do you need it to work?", help: "Choose any that apply.", multi: true, options: [{ value: "web", label: "Web browser" }, { value: "windows", label: "Windows" }, { value: "mac", label: "Mac" }, { value: "ios", label: "iPhone/iPad" }, { value: "android", label: "Android" }] },
    { key: "data", title: "Does UK or EU data hosting matter?", options: [{ value: "required", label: "Yes, it's required" }, { value: "preferred", label: "Nice to have" }, { value: "no", label: "Not important" }] },
    { key: "mtd", title: "Do you need Making Tax Digital support?", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "Not sure" }] },
    { key: "uses", title: "Which of these do you already use?", help: "Choose any that apply.", multi: true, options: ["microsoft 365", "google workspace", "xero", "quickbooks", "shopify", "slack"].map((v) => ({ value: v, label: v.replace(/\b\w/g, (c) => c.toUpperCase()) })) },
    { key: "priority", title: "What matters most?", options: [{ value: "easeOfUse", label: "Easy to use" }, { value: "value", label: "Value for money" }, { value: "features", label: "Most features" }, { value: "ukFit", label: "Best UK fit" }] },
    { key: "ukVendor", title: "Would you prefer a UK-based company?", options: [{ value: "yes", label: "Yes, if possible" }, { value: "no", label: "Doesn't matter" }] },
  ], [needs, industries]);

  const [i, setI] = useState(0);
  const [a, setA] = useState<Partial<Record<keyof Answers, string | string[]>>>({ platforms: [], uses: [] });
  const done = i >= steps.length;
  const step = steps[Math.min(i, steps.length - 1)]!;

  const result = useMemo(() => {
    if (!done) return null;
    const answers: Answers = {
      need: String(a.need), industry: String(a.industry ?? ""), size: a.size as Answers["size"], budget: a.budget as Answers["budget"],
      platforms: (a.platforms as string[]) ?? [], data: a.data as Answers["data"], mtd: a.mtd as Answers["mtd"],
      uses: (a.uses as string[]) ?? [], priority: a.priority as Answers["priority"], ukVendor: a.ukVendor === "yes",
    };
    return rank(tools, answers);
  }, [done, a, tools]);

  const choose = (v: string) => {
    if (step.multi) {
      const cur = (a[step.key] as string[]) ?? [];
      setA({ ...a, [step.key]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
      return;
    }
    setA({ ...a, [step.key]: v });
    const next = i + 1;
    setI(next);
    if (next === steps.length) track("finder_complete", { props: { need: step.key === "need" ? v : String(a.need) } });
  };
  const next = () => { setI(i + 1); if (i + 1 === steps.length) track("finder_complete", { props: { need: String(a.need) } }); };

  if (done && result) {
    return (
      <div aria-live="polite">
        <h2 className="font-serif text-headline-md text-ink">Your shortlist</h2>
        {result.relaxed.length > 0 && (
          <p className="mt-2 rounded border border-amber-300 bg-amber-50 p-3 text-body-sm text-amber-900">
            Nothing matched every answer, so we relaxed your {result.relaxed.map((r) => RELAX_LABEL[r]).join(" and ")} requirement.
          </p>
        )}
        {result.matches.length === 0 ? (
          <p className="card mt-4 p-6 text-body-md">We don&apos;t list a matching product yet. <Link href="/submit-tool/" className="text-brand underline">Suggest one</Link>.</p>
        ) : (
          <ol className="mt-4 space-y-3">
            {result.matches.map((m, n) => (
              <li key={m.tool.slug} className="card p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-headline-sm text-ink"><span className="tnum text-slate-mute">{n + 1}.</span> <Link href={`/tools/${m.tool.slug}/`} className="hover:underline">{m.tool.name}</Link></h3>
                  <span className="text-caption text-slate-mute">{m.tool.score != null ? `${m.tool.score.toFixed(1)}/10` : "Not yet scored"}</span>
                </div>
                <ul className="mt-2 list-disc pl-5 text-body-sm text-slate-body">{m.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                {m.caveats.length > 0 && <p className="mt-2 text-caption text-slate-mute">Check: {m.caveats.join("; ")}.</p>}
              </li>
            ))}
          </ol>
        )}
        <p className="mt-4 text-caption text-slate-mute">Matches are rule-based on our listing data. We don&apos;t sell placement in these results.</p>
        <button type="button" className="btn-secondary mt-4" onClick={() => { setI(0); setA({ platforms: [], uses: [] }); }}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Start again
        </button>
      </div>
    );
  }

  const selected = a[step.key];
  return (
    <div>
      <div className="flex items-center justify-between text-caption text-slate-mute">
        <span>Question {i + 1} of {steps.length}</span>
        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-high" aria-hidden="true"><div className="h-full bg-brand" style={{ width: `${((i + 1) / steps.length) * 100}%` }} /></div>
      </div>
      <fieldset className="mt-4">
        <legend className="font-serif text-headline-md text-ink">{step.title}</legend>
        {step.help && <p className="mt-1 text-body-sm text-slate-mute">{step.help}</p>}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {step.options.map((o) => {
            const on = step.multi ? ((selected as string[]) ?? []).includes(o.value) : selected === o.value;
            return (
              <button key={o.value || "none"} type="button" aria-pressed={on} onClick={() => choose(o.value)}
                className={`rounded-lg border px-4 py-3 text-left text-body-md transition ${on ? "border-ink bg-ink text-white" : "border-rule-strong bg-surface-lowest text-ink hover:border-ink"}`}>
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-6 flex items-center gap-3">
        {i > 0 && <button type="button" className="btn-ghost" onClick={() => setI(i - 1)}><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back</button>}
        {step.multi && <button type="button" className="btn-primary" onClick={next}>{((selected as string[]) ?? []).length ? "Next" : "Skip"} <ArrowRight className="h-4 w-4" aria-hidden="true" /></button>}
      </div>
    </div>
  );
}

"use client";

import { Check, Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Honeypot, useSubmit } from "@/components/forms/useSubmit";
import { Turnstile } from "@/components/forms/Turnstile";

type Me = { signedIn: boolean; displayName?: string | null; reviewStatus?: string | null };

const SUB_RATINGS = [
  ["easeOfUse", "Ease of use"],
  ["features", "Features"],
  ["valueForMoney", "Value for money"],
  ["support", "Customer support"],
  ["ukSuitability", "Fit for UK businesses (VAT, GBP, UK GDPR)"],
] as const;

function StarInput({ name, label, value, onChange, required }: { name: string; label: string; value: number; onChange: (v: number) => void; required?: boolean }) {
  return (
    <fieldset className="grid gap-1.5">
      <legend className="text-label text-ink">{label}{!required && <span className="font-normal text-slate-mute"> (optional)</span>}</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <label key={i} className="cursor-pointer">
            <input type="radio" name={name} value={i} checked={value === i} onChange={() => onChange(i)} className="peer sr-only" required={required && i === 1} />
            <Star
              aria-hidden="true"
              className={`h-7 w-7 rounded peer-focus-visible:ring-2 peer-focus-visible:ring-brand ${i <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
            />
            <span className="sr-only">{i} star{i > 1 ? "s" : ""}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ReviewForm({ productSlug, productName }: { productSlug: string; productName: string }) {
  const [me, setMe] = useState<Me | null>(null);
  const [open, setOpen] = useState(false);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [token, setToken] = useState("");
  const [attempt, setAttempt] = useState(0);
  const { status, message, submit } = useSubmit("/api/reviews");

  useEffect(() => {
    fetch(`/api/me/?product=${encodeURIComponent(productSlug)}`, { cache: "no-store" })
      .then((r) => r.json() as Promise<Me>)
      .then(setMe)
      .catch(() => setMe({ signedIn: false }));
  }, [productSlug]);

  const loginHref = `/login/?next=${encodeURIComponent(`/tools/${productSlug}/#write-review`)}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = (k: string) => String(fd.get(k) ?? "");
    const ok = await submit({
      productSlug,
      turnstileToken: token || undefined,
      ...ratings,
      title: text("title"),
      pros: text("pros"),
      cons: text("cons"),
      useCase: text("useCase") || undefined,
      businessSize: text("businessSize") || undefined,
      durationOfUse: text("durationOfUse"),
      connection: text("connection"),
      honest: fd.get("honest") === "on",
      website: text("website"),
    });
    if (!ok) setAttempt((n) => n + 1); // a Turnstile token is single-use
  }

  if (!me) return <div className="card h-24 animate-pulse" aria-hidden="true" />;

  if (!me.signedIn) {
    return (
      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <p className="text-body-md text-slate-body">Used {productName} at work? Share what it&apos;s really like.</p>
        <a href={loginHref} className="btn-primary">Sign in to write a review</a>
      </div>
    );
  }

  if (status === "success" || me.reviewStatus) {
    const published = me.reviewStatus === "published";
    return (
      <div role="status" className="card flex items-start gap-3 p-5">
        <Check className="mt-0.5 h-5 w-5 text-teal" aria-hidden="true" />
        <p className="text-body-md text-slate-body">
          {status === "success"
            ? "Thanks — your review has been received. A moderator checks every review before it is published, usually within two working days."
            : published
              ? "You've reviewed this product — thank you."
              : me.reviewStatus === "rejected"
                ? "Your review of this product wasn't published because it didn't meet our review policy."
                : "Your review is waiting for a moderator to check it."}
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <p className="text-body-md text-slate-body">Used {productName} at work? Share what it&apos;s really like.</p>
        <button type="button" className="btn-primary" onClick={() => setOpen(true)}>Write a review</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card relative grid gap-5 p-6">
      <Honeypot />
      <p className="text-body-sm text-slate-body">
        Posting as <strong className="text-ink">{me.displayName ?? "SmarterBiz member"}</strong> — <a href="/account/" className="underline">change name</a>.
        Please read our <a href="/review-policy/" className="underline">review policy</a> first.
      </p>
      <StarInput name="overall" label="Overall rating" value={ratings.overall ?? 0} onChange={(v) => setRatings((r) => ({ ...r, overall: v }))} required />
      <div className="grid gap-4 sm:grid-cols-2">
        {SUB_RATINGS.map(([key, label]) => (
          <StarInput key={key} name={key} label={label} value={ratings[key] ?? 0} onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))} />
        ))}
      </div>
      <label className="grid gap-1.5 text-label text-ink">
        Review title
        <input name="title" required minLength={5} maxLength={120} className="input font-normal" />
      </label>
      <label className="grid gap-1.5 text-label text-ink">
        What do you like?
        <textarea name="pros" required minLength={20} maxLength={3000} className="textarea font-normal" />
      </label>
      <label className="grid gap-1.5 text-label text-ink">
        What could be better?
        <textarea name="cons" required minLength={20} maxLength={3000} className="textarea font-normal" />
      </label>
      <label className="grid gap-1.5 text-label text-ink">
        What do you use it for? <span className="font-normal text-slate-mute">(optional)</span>
        <input name="useCase" maxLength={200} className="input font-normal" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-label text-ink">
          How long have you used it?
          <select name="durationOfUse" required defaultValue="" className="input font-normal">
            <option value="" disabled>Choose…</option>
            <option value="<6m">Less than 6 months</option>
            <option value="6-12m">6–12 months</option>
            <option value="1-2y">1–2 years</option>
            <option value="2y+">Over 2 years</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-label text-ink">
          Business size <span className="font-normal text-slate-mute">(optional)</span>
          <select name="businessSize" defaultValue="" className="input font-normal">
            <option value="">Prefer not to say</option>
            <option value="solo">Sole trader</option>
            <option value="2-9">2–9 staff</option>
            <option value="10-49">10–49 staff</option>
            <option value="50-249">50–249 staff</option>
            <option value="250+">250+ staff</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1.5 text-label text-ink">
        Your connection to {productName}
        <select name="connection" required defaultValue="none" className="input font-normal">
          <option value="none">None — I&apos;m a customer or user</option>
          <option value="competitor">I work for or with a competitor</option>
          <option value="partner">I&apos;m a reseller, partner or consultant for it</option>
        </select>
        <span className="text-caption font-normal text-slate-mute">Vendor staff can&apos;t review their own product. Declared connections are shown with the review.</span>
      </label>
      <label className="flex items-start gap-2 text-body-sm text-ink">
        <input type="checkbox" name="honest" required className="mt-1" />
        I have used {productName} for work, this review is my honest opinion, and I haven&apos;t been paid or rewarded for it.
      </label>
      <Turnstile onToken={setToken} resetKey={attempt} />
      {status === "error" && <p role="alert" className="text-body-sm text-red-700">{message}</p>}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Submit review
        </button>
      </div>
    </form>
  );
}

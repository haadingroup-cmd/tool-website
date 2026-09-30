"use client";

import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSubmit } from "./useSubmit";

function Result({ status, message, done }: { status: string; message: string; done: string }) {
  if (status === "error") return <p role="alert" className="text-body-sm text-red-700">{message}</p>;
  if (status === "success") return <p role="status" className="flex items-center gap-1 text-body-sm text-teal"><Check className="h-4 w-4" aria-hidden="true" /> {done}</p>;
  return null;
}

export function ClaimListingForm({ products }: { products: { slug: string; name: string }[] }) {
  const router = useRouter();
  const { status, message, submit } = useSubmit("/api/vendor/claim/");
  useEffect(() => { if (status === "success") router.refresh(); }, [status, router]);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await submit({ productSlug: String(fd.get("productSlug")), jobTitle: String(fd.get("jobTitle") ?? ""), evidence: String(fd.get("evidence") ?? "") });
      }}
    >
      <label className="grid gap-1.5 text-label text-ink">
        Product you work for
        <select name="productSlug" required defaultValue="" className="input font-normal">
          <option value="" disabled>Choose a listing…</option>
          {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        </select>
      </label>
      <label className="grid gap-1.5 text-label text-ink">
        Your job title
        <input name="jobTitle" required minLength={2} maxLength={100} autoComplete="organization-title" className="input font-normal" />
      </label>
      <label className="grid gap-1.5 text-label text-ink">
        How can we confirm you work there? <span className="font-normal text-slate-mute">(optional if you signed in with a company email)</span>
        <textarea name="evidence" maxLength={2000} rows={3} className="textarea min-h-0 font-normal" placeholder="e.g. link to your team page, or ask us to email your company's official address" />
      </label>
      <Result status={status} message={message} done="Claim sent — we'll review it within two working days." />
      <div>
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Claim listing
        </button>
      </div>
    </form>
  );
}

export function ChangeRequestForm({ productSlug, fields }: { productSlug: string; fields: Record<string, string> }) {
  const router = useRouter();
  const { status, message, submit } = useSubmit("/api/vendor/change/");
  useEffect(() => { if (status === "success") router.refresh(); }, [status, router]);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const ok = await submit({ productSlug, field: String(fd.get("field")), value: String(fd.get("value") ?? ""), evidenceUrl: String(fd.get("evidenceUrl") ?? "") });
        if (ok) form.reset();
      }}
    >
      <label className="grid gap-1.5 text-label text-ink">
        What should change?
        <select name="field" required defaultValue="" className="input font-normal">
          <option value="" disabled>Choose…</option>
          {Object.entries(fields).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </label>
      <label className="grid gap-1.5 text-label text-ink">
        Correct information
        <textarea name="value" required minLength={5} maxLength={3000} rows={3} className="textarea min-h-0 font-normal" />
      </label>
      <label className="grid gap-1.5 text-label text-ink">
        Evidence link <span className="font-normal text-slate-mute">(your official pricing, docs or policy page)</span>
        <input name="evidenceUrl" type="url" maxLength={500} placeholder="https://" className="input font-normal" />
      </label>
      <Result status={status} message={message} done="Sent — an editor will check it against your evidence." />
      <div>
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Send change request
        </button>
      </div>
    </form>
  );
}

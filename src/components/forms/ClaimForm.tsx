"use client";

import { Check, Loader2 } from "lucide-react";
import { Honeypot, useSubmit } from "./useSubmit";

export function ClaimForm({ products }: { products: { slug: string; name: string }[] }) {
  const { status, message, submit } = useSubmit("/api/claim-listing");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const keys = ["productSlug", "contactName", "email", "jobTitle", "companyDomain", "message", "website"];
    await submit(Object.fromEntries(keys.map((k) => [k, String(fd.get(k) ?? "")])));
  }

  if (status === "success") {
    return (
      <div role="status" className="card flex items-start gap-3 p-6">
        <Check className="mt-0.5 h-5 w-5 text-teal" aria-hidden="true" />
        <div>
          <p className="text-headline-sm text-ink">Claim request received.</p>
          <p className="mt-1 text-body-md text-slate-body">We&apos;ll verify your connection to the company by email before giving you any access.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card relative grid gap-4 p-6">
      <Honeypot />
      <label className="grid gap-1.5 text-label text-ink">
        Product
        <select name="productSlug" required defaultValue="" className="input font-normal">
          <option value="" disabled>Choose the listing</option>
          {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-label text-ink">Your name<input name="contactName" required minLength={2} maxLength={100} className="input font-normal" autoComplete="name" /></label>
        <label className="grid gap-1.5 text-label text-ink">Job title<input name="jobTitle" required minLength={2} maxLength={100} className="input font-normal" autoComplete="organization-title" /></label>
        <label className="grid gap-1.5 text-label text-ink">Company domain<input name="companyDomain" required maxLength={120} placeholder="example.com" className="input font-normal" /></label>
        <label className="grid gap-1.5 text-label text-ink">Work email (at that domain)<input name="email" type="email" required maxLength={254} className="input font-normal" autoComplete="email" /></label>
      </div>
      <label className="grid gap-1.5 text-label text-ink">
        What would you like to update? (optional)
        <textarea name="message" maxLength={2000} rows={4} className="input font-normal" />
      </label>
      {message && <p role="alert" className="text-body-sm text-red-700">{message}</p>}
      <button type="submit" className="btn-primary w-fit" disabled={status === "loading"}>
        {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Send claim request
      </button>
      <p className="text-caption text-slate-mute">Claiming a listing lets you suggest factual corrections. It never changes our editorial scores, rankings or reviews.</p>
    </form>
  );
}

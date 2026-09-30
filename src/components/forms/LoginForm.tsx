"use client";

import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Honeypot, useSubmit } from "./useSubmit";

export function LoginForm({ next }: { next?: string }) {
  const { status, message, submit } = useSubmit("/api/auth/login");
  const [email, setEmail] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await submit({ email, next, website: String(fd.get("website") ?? "") });
  }

  if (status === "success") {
    return (
      <div role="status" className="card flex items-start gap-3 p-6">
        <Mail className="mt-0.5 h-5 w-5 text-teal" aria-hidden="true" />
        <div>
          <p className="text-headline-sm text-ink">Check your inbox</p>
          <p className="mt-1 text-body-md text-slate-body">
            We&apos;ve sent a sign-in link to <strong>{email}</strong>. Open it in this browser within an hour.
            It can take a minute to arrive — check your spam folder too.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card relative grid gap-4 p-6">
      <Honeypot />
      <label className="grid gap-1.5 text-label text-ink">
        Email
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input font-normal"
        />
      </label>
      {status === "error" && <p role="alert" className="text-body-sm text-red-700">{message}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-caption text-slate-mute">
          No password needed. New here? The same link creates your account. See our <a className="underline" href="/privacy-policy/">privacy policy</a>.
        </p>
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Email me a sign-in link
        </button>
      </div>
    </form>
  );
}

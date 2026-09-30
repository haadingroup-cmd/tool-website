"use client";

import { useState } from "react";
import { useSubmit } from "@/components/forms/useSubmit";

export function ReportButton({ reviewId }: { reviewId: number }) {
  const [open, setOpen] = useState(false);
  const { status, message, submit } = useSubmit("/api/reviews/report/");

  if (status === "success") return <p role="status" className="text-caption text-slate-mute">Thanks — a moderator will re-check this review.</p>;
  if (!open) {
    return (
      <button type="button" className="text-caption text-slate-mute underline hover:text-ink" onClick={() => setOpen(true)}>
        Report this review
      </button>
    );
  }
  return (
    <form
      className="mt-2 grid gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await submit({ reviewId, reason: String(new FormData(e.currentTarget).get("reason") ?? "") });
      }}
    >
      <label className="grid gap-1 text-caption text-ink">
        Why should we re-check it?
        <textarea name="reason" required minLength={10} maxLength={500} className="textarea min-h-0 font-normal" rows={2} />
      </label>
      {status === "error" && (
        <p role="alert" className="text-caption text-red-700">
          {message} {message.includes("sign in") && <a className="underline" href="/login/">Sign in</a>}
        </p>
      )}
      <div className="flex gap-2">
        <button type="submit" className="btn-secondary" disabled={status === "loading"}>Send report</button>
        <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}

"use client";

import { Check, Loader2 } from "lucide-react";
import { useSubmit } from "./useSubmit";

export function ProfileForm({ displayName }: { displayName: string }) {
  const { status, message, submit } = useSubmit("/api/account/profile");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await submit({ displayName: String(fd.get("displayName") ?? "") });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1.5 text-label text-ink">
        Display name
        <input
          name="displayName"
          required
          minLength={2}
          maxLength={50}
          defaultValue={displayName}
          autoComplete="nickname"
          className="input font-normal"
        />
        <span className="text-caption font-normal text-slate-mute">Shown next to any review you publish. Your email is never shown.</span>
      </label>
      {status === "error" && <p role="alert" className="text-body-sm text-red-700">{message}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={status === "loading"}>
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Save
        </button>
        {status === "success" && (
          <span role="status" className="flex items-center gap-1 text-body-sm text-teal">
            <Check className="h-4 w-4" aria-hidden="true" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Choice = { decision: string; label: string; tone?: "primary" | "danger"; askNote?: boolean };

/** Moderation buttons; every click goes through /api/admin/action, which checks the role and writes the audit log. */
export function ActionButtons({ kind, id, choices }: { kind: string; id: number; choices: Choice[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function act(c: Choice) {
    let note = "";
    if (c.askNote) {
      const answer = window.prompt(`${c.label}: note for the record (reason)`, "");
      if (answer === null) return;
      note = answer;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/action/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id, decision: c.decision, note }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) setError(data.error ?? "Failed.");
      else router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {choices.map((c) => (
        <button
          key={c.decision}
          type="button"
          disabled={busy}
          onClick={() => act(c)}
          className={c.tone === "primary" ? "btn-primary" : c.tone === "danger" ? "btn-secondary text-red-800" : "btn-secondary"}
        >
          {c.label}
        </button>
      ))}
      {error && <span role="alert" className="text-caption text-red-700">{error}</span>}
    </div>
  );
}

import Link from "next/link";
import { countRows } from "@/lib/db";

const QUEUES = [
  ["Reviews waiting", "/admin/reviews/", "reviews", { status: "eq.submitted" }],
  ["Open review reports", "/admin/reviews/?status=reported", "review_reports", { resolved_at: "is.null" }],
  ["Listing claims (signed in)", "/admin/claims/", "listing_claims", { status: "eq.pending" }],
  ["Claim requests (public form)", "/admin/claims/", "claim_requests", { status: "eq.new" }],
  ["Change requests", "/admin/changes/", "change_requests", { status: "eq.pending" }],
  ["Tool submissions", "/admin/submissions/", "tool_submissions", { status: "eq.pending" }],
  ["Unhandled messages", "/admin/messages/", "contact_messages", { handled: "eq.false" }],
] as const;

export default async function AdminHome() {
  const counts = await Promise.all(QUEUES.map(([, , table, f]) => countRows(table, { ...f }).catch(() => null)));
  return (
    <div>
      <h1 className="font-serif text-headline-lg text-ink">Moderation overview</h1>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {QUEUES.map(([label, href], i) => (
          <li key={label}>
            <Link href={href} className="card block p-5 hover:shadow-pop">
              <span className="tnum block font-serif text-[36px] leading-none text-ink">{counts[i] ?? "–"}</span>
              <span className="mt-2 block text-body-md text-slate-body">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
      {counts.some((c) => c === null) && <p className="mt-4 text-body-sm text-red-700">Some counts could not be loaded — has migration 0002 been run?</p>}
    </div>
  );
}

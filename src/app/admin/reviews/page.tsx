import { selectRows } from "@/lib/db";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { Empty, Tabs, when } from "@/components/admin/Empty";
import { Stars } from "@/components/reviews/Stars";
import { CONNECTIONS } from "@/lib/reviews";

const TABS = [["submitted", "Waiting"], ["reported", "Reported"], ["published", "Published"], ["rejected", "Rejected"]] as const;

interface Row {
  id: number;
  status: string;
  overall: number;
  title: string;
  pros: string;
  cons: string;
  use_case: string | null;
  duration_of_use: string | null;
  business_size: string | null;
  connection: keyof typeof CONNECTIONS;
  spam_score: number;
  ip_hash: string | null;
  moderation_notes: string | null;
  created_at: string;
  published_at: string | null;
  profiles: { display_name: string } | null;
  products: { name: string; slug: string } | null;
  review_reports: { reason: string; created_at: string; resolved_at: string | null }[];
}

const COLS = "id,status,overall,title,pros,cons,use_case,duration_of_use,business_size,connection,spam_score,ip_hash,moderation_notes,created_at,published_at,profiles(display_name),products(name,slug),review_reports(reason,created_at,resolved_at)";

export default async function AdminReviews({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireRole(STAFF_ROLES, "/admin/reviews/");
  const { status: raw } = await searchParams;
  const status = TABS.some(([k]) => k === raw) ? raw! : "submitted";

  let rows: Row[];
  if (status === "reported") {
    const open = await selectRows<{ review_id: number }>("review_reports", { resolved_at: "is.null" }, "review_id", { limit: 500 });
    const ids = [...new Set(open.map((r) => r.review_id))];
    rows = ids.length ? await selectRows<Row & Record<string, unknown>>("reviews", { id: `in.(${ids.join(",")})`, order: "created_at.asc" }, COLS) : [];
  } else {
    rows = await selectRows<Row & Record<string, unknown>>("reviews", { status: `eq.${status}`, order: status === "submitted" ? "created_at.asc" : "created_at.desc" }, COLS);
  }
  // Several reviews from one network in the same batch is a signal worth a second look.
  const ipCount = new Map<string, number>();
  for (const r of rows) if (r.ip_hash) ipCount.set(r.ip_hash, (ipCount.get(r.ip_hash) ?? 0) + 1);

  return (
    <div>
      <h1 className="font-serif text-headline-lg text-ink">Reviews</h1>
      <p className="mt-1 text-body-sm text-slate-body">Check each review against the <a className="underline" href="/review-policy/">review policy</a>. Never edit a review&apos;s meaning — publish or reject it with a reason.</p>
      <div className="mt-4"><Tabs base="/admin/reviews/" current={status} items={TABS} /></div>
      <div className="mt-6 grid gap-4">
        {rows.length === 0 && <Empty>Nothing here.</Empty>}
        {rows.map((r) => {
          const openReports = r.review_reports.filter((x) => !x.resolved_at);
          return (
            <article key={r.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-body-sm text-slate-body">
                  <a className="font-semibold text-ink underline" href={`/tools/${r.products?.slug}/`}>{r.products?.name}</a> · by {r.profiles?.display_name} · {when(r.created_at)} · #{r.id}
                </p>
                <Stars value={r.overall} />
              </div>
              <h2 className="mt-2 text-headline-sm text-ink">{r.title}</h2>
              <div className="mt-2 grid gap-2 text-body-md text-slate-body md:grid-cols-2">
                <div><p className="font-semibold text-teal-deep">Likes</p><p className="whitespace-pre-line">{r.pros}</p></div>
                <div><p className="font-semibold text-red-800">Could be better</p><p className="whitespace-pre-line">{r.cons}</p></div>
              </div>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-caption text-slate-mute">
                <span>Used: {r.duration_of_use ?? "—"}</span>
                <span>Size: {r.business_size ?? "—"}</span>
                {r.use_case && <span>For: {r.use_case}</span>}
                <span className={r.connection !== "none" ? "font-semibold text-amber-800" : ""}>Connection: {CONNECTIONS[r.connection]}</span>
                <span className={r.spam_score > 0 ? "font-semibold text-red-700" : ""}>Spam signals: {r.spam_score}</span>
                {r.ip_hash && (ipCount.get(r.ip_hash) ?? 0) > 1 && <span className="font-semibold text-red-700">Same network as {ipCount.get(r.ip_hash)! - 1} other review(s) in this list</span>}
              </p>
              {r.moderation_notes && <p className="mt-2 text-caption text-slate-body">Moderator note: {r.moderation_notes}</p>}
              {openReports.length > 0 && (
                <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-body-sm text-red-900">
                  <p className="font-semibold">{openReports.length} open report(s)</p>
                  <ul className="mt-1 list-disc pl-5">{openReports.map((x, i) => <li key={i}>{x.reason} <span className="text-caption">({when(x.created_at)})</span></li>)}</ul>
                </div>
              )}
              <div className="mt-4">
                <ActionButtons
                  kind="review"
                  id={r.id}
                  choices={
                    r.status === "published"
                      ? [
                          ...(openReports.length ? [{ decision: "keep", label: "Keep published", askNote: true }] : []),
                          { decision: "reject", label: "Remove", tone: "danger" as const, askNote: true },
                        ]
                      : r.status === "rejected"
                        ? [{ decision: "publish", label: "Publish after all", askNote: true }]
                        : [
                            { decision: "publish", label: "Publish", tone: "primary" as const },
                            { decision: "reject", label: "Reject", tone: "danger" as const, askNote: true },
                          ]
                  }
                />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

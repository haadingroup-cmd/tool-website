import { selectRows } from "@/lib/db";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { Empty, Tabs, when } from "@/components/admin/Empty";
import { CHANGE_FIELDS } from "@/lib/vendor";

const TABS = [["pending", "Pending"], ["needs_info", "Needs info"], ["approved", "Approved"], ["rejected", "Rejected"]] as const;

interface Change {
  id: number;
  field: string;
  proposed: { value?: string };
  evidence_url: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  profiles: { display_name: string } | null;
  products: { name: string; slug: string } | null;
}

export default async function AdminChanges({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireRole(STAFF_ROLES, "/admin/changes/");
  const { status: raw } = await searchParams;
  const status = TABS.some(([k]) => k === raw) ? raw! : "pending";
  const rows = await selectRows<Change & Record<string, unknown>>("change_requests", { status: `eq.${status}`, order: "created_at.asc" }, "id,field,proposed,evidence_url,status,notes,created_at,profiles(display_name),products(name,slug)");

  return (
    <div>
      <h1 className="font-serif text-headline-lg text-ink">Vendor change requests</h1>
      <p className="mt-1 text-body-sm text-slate-body">
        Approving records the decision; an editor then updates the listing in <code>src/data</code> with the evidence as its source.
        Scores, verdicts and reviews are never changed on a vendor&apos;s request.
      </p>
      <div className="mt-4"><Tabs base="/admin/changes/" current={status} items={TABS} /></div>
      <div className="mt-6 grid gap-3">
        {rows.length === 0 && <Empty>Nothing here.</Empty>}
        {rows.map((c) => (
          <article key={c.id} className="card p-5">
            <p className="text-body-md text-ink">
              <a className="font-semibold underline" href={`/tools/${c.products?.slug}/`}>{c.products?.name}</a> · {CHANGE_FIELDS[c.field as keyof typeof CHANGE_FIELDS] ?? c.field} · #{c.id} · {when(c.created_at)}
            </p>
            <p className="mt-1 text-caption text-slate-mute">From {c.profiles?.display_name} (verified vendor)</p>
            <p className="mt-2 whitespace-pre-line rounded bg-surface-low p-3 text-body-md text-ink">{c.proposed?.value}</p>
            {c.evidence_url && <p className="mt-2 text-body-sm">Evidence: <a className="break-all underline" href={c.evidence_url} rel="nofollow noopener noreferrer" target="_blank">{c.evidence_url}</a></p>}
            {c.notes && <p className="mt-2 text-caption text-slate-mute">Note: {c.notes}</p>}
            {(c.status === "pending" || c.status === "needs_info") && (
              <div className="mt-3">
                <ActionButtons
                  kind="change"
                  id={c.id}
                  choices={[
                    { decision: "approved", label: "Approve", tone: "primary", askNote: true },
                    { decision: "needs_info", label: "Needs info", askNote: true },
                    { decision: "rejected", label: "Reject", tone: "danger", askNote: true },
                  ]}
                />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

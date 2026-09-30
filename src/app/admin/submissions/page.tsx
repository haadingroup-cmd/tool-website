import { selectRows } from "@/lib/db";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { Empty, Tabs, when } from "@/components/admin/Empty";

const TABS = [["pending", "New"], ["reviewing", "Reviewing"], ["accepted", "Accepted"], ["rejected", "Rejected"]] as const;

interface Sub { id: number; tool_name: string; tool_url: string; category: string; contact_name: string; email: string; description: string; uk_pricing: string; status: string; created_at: string }

export default async function AdminSubmissions({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireRole(STAFF_ROLES, "/admin/submissions/");
  const { status: raw } = await searchParams;
  const status = TABS.some(([k]) => k === raw) ? raw! : "pending";
  const rows = await selectRows<Sub & Record<string, unknown>>("tool_submissions", { status: `eq.${status}`, order: "created_at.asc" }, "*");
  return (
    <div>
      <h1 className="font-serif text-headline-lg text-ink">Tool submissions</h1>
      <p className="mt-1 text-body-sm text-slate-body">Accepted tools become listings only after an editor adds them to <code>src/data</code> with sourced facts.</p>
      <div className="mt-4"><Tabs base="/admin/submissions/" current={status} items={TABS} /></div>
      <div className="mt-6 grid gap-3">
        {rows.length === 0 && <Empty>Nothing here.</Empty>}
        {rows.map((s) => (
          <article key={s.id} className="card p-5">
            <p className="text-body-md text-ink"><strong>{s.tool_name}</strong> · {s.category} · #{s.id} · {when(s.created_at)}</p>
            <p className="mt-1 text-body-sm"><a className="break-all underline" href={s.tool_url} rel="nofollow noopener noreferrer" target="_blank">{s.tool_url}</a></p>
            <p className="mt-1 text-body-sm text-slate-body">{s.contact_name} · {s.email}</p>
            <p className="mt-2 whitespace-pre-line text-body-sm text-slate-body">{s.description}</p>
            {s.uk_pricing && <p className="mt-1 text-body-sm text-slate-body">UK pricing (vendor-reported): {s.uk_pricing}</p>}
            <div className="mt-3">
              <ActionButtons
                kind="submission"
                id={s.id}
                choices={[
                  ...(s.status !== "reviewing" ? [{ decision: "reviewing", label: "Start review" }] : []),
                  ...(s.status !== "accepted" ? [{ decision: "accepted", label: "Accept", tone: "primary" as const }] : []),
                  ...(s.status !== "rejected" ? [{ decision: "rejected", label: "Reject", tone: "danger" as const, askNote: true }] : []),
                ]}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

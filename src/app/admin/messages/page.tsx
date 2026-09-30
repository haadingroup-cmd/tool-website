import { selectRows } from "@/lib/db";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { Empty, Tabs, when } from "@/components/admin/Empty";

const TABS = [["open", "Open"], ["handled", "Handled"]] as const;

interface Msg { id: number; name: string; email: string; subject: string; message: string; created_at: string; handled: boolean }

export default async function AdminMessages({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireRole(STAFF_ROLES, "/admin/messages/");
  const { status: raw } = await searchParams;
  const status = raw === "handled" ? "handled" : "open";
  const rows = await selectRows<Msg & Record<string, unknown>>("contact_messages", { handled: `eq.${status === "handled"}`, order: "created_at.desc" }, "*");
  return (
    <div>
      <h1 className="font-serif text-headline-lg text-ink">Contact messages</h1>
      <div className="mt-4"><Tabs base="/admin/messages/" current={status} items={TABS} /></div>
      <div className="mt-6 grid gap-3">
        {rows.length === 0 && <Empty>Nothing here.</Empty>}
        {rows.map((m) => (
          <article key={m.id} className="card p-5">
            <p className="text-body-md text-ink"><strong>{m.subject}</strong> · {m.name} · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a> · {when(m.created_at)}</p>
            <p className="mt-2 whitespace-pre-line text-body-md text-slate-body">{m.message}</p>
            <div className="mt-3">
              <ActionButtons kind="message" id={m.id} choices={[m.handled ? { decision: "open", label: "Re-open" } : { decision: "handled", label: "Mark handled", tone: "primary" }]} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

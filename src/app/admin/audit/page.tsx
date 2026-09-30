import { selectRows } from "@/lib/db";
import { requireRole } from "@/lib/auth/session";
import { Empty, when } from "@/components/admin/Empty";

interface Entry { id: number; actor_id: string | null; action: string; entity: string; entity_id: string; after: unknown; created_at: string }

export default async function AdminAudit() {
  await requireRole(["editor", "admin"], "/admin/audit/");
  const rows = await selectRows<Entry & Record<string, unknown>>("audit_log", { order: "created_at.desc" }, "id,actor_id,action,entity,entity_id,after,created_at", { limit: 200 });
  const names = new Map<string, string>();
  const actors = [...new Set(rows.map((r) => r.actor_id).filter((x): x is string => Boolean(x)))];
  if (actors.length) {
    const ps = await selectRows<{ user_id: string; display_name: string }>("profiles", { user_id: `in.(${actors.join(",")})` }, "user_id,display_name", { limit: 200 });
    for (const p of ps) names.set(p.user_id, p.display_name);
  }
  return (
    <div>
      <h1 className="font-serif text-headline-lg text-ink">Audit log</h1>
      <p className="mt-1 text-body-sm text-slate-body">Latest 200 moderation decisions. Entries cannot be edited from the site.</p>
      {rows.length === 0 ? (
        <div className="mt-6"><Empty>No decisions recorded yet.</Empty></div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-rule text-slate-mute"><tr><th className="py-2 pr-4">When</th><th className="py-2 pr-4">Who</th><th className="py-2 pr-4">Action</th><th className="py-2 pr-4">Item</th><th className="py-2">Details</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-rule align-top">
                  <td className="py-2 pr-4 whitespace-nowrap">{when(r.created_at)}</td>
                  <td className="py-2 pr-4">{(r.actor_id && names.get(r.actor_id)) ?? "—"}</td>
                  <td className="py-2 pr-4 font-medium text-ink">{r.action}</td>
                  <td className="py-2 pr-4">{r.entity} #{r.entity_id}</td>
                  <td className="py-2 break-all text-caption text-slate-mute">{r.after ? JSON.stringify(r.after) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import "server-only";
import { insertRow } from "./db";

/** Append-only record of every moderation decision. Failure to log never blocks the action itself. */
export async function audit(actorId: string, action: string, entity: string, entityId: string | number, before?: unknown, after?: unknown) {
  try {
    await insertRow("audit_log", { actor_id: actorId, action, entity, entity_id: String(entityId), before: before ?? null, after: after ?? null });
  } catch {
    console.error(`[audit] could not record ${action} on ${entity}`);
  }
}

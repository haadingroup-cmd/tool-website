import "server-only";

/**
 * Minimal Supabase REST (PostgREST) client using fetch — no SDK, server-side only.
 * Tables are created by supabase/schema.sql with Row Level Security enabled and no public policies,
 * so only the service-role key (kept on the server) can read or write.
 */

export type Table =
  | "subscribers" | "contact_messages" | "tool_submissions" | "claim_requests" | "events"
  | "profiles" | "products" | "companies" | "reviews" | "review_reports" | "listing_claims" | "vendor_accounts"
  | "change_requests" | "audit_log" | "public_reviews" | "product_rating_summary";
type Row = Record<string, unknown>;

export const dbConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export class DbNotConfiguredError extends Error {
  constructor() {
    super("Database is not configured");
  }
}

/** A rejected write; `status` 409 means a unique constraint (e.g. one review per product) was hit. */
export class DbWriteError extends Error {
  constructor(readonly status: number) {
    super("Database write failed");
  }
}

function conn() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new DbNotConfiguredError();
  return { url, key };
}

async function request(method: "POST" | "PATCH", endpoint: URL, key: string, body: Row, prefer: string, table: Table) {
  const res = await fetch(endpoint, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: prefer },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    // Log status only — never log the key or full payload (may contain personal data).
    console.error(`[db] ${method} ${table} failed with status ${res.status}`);
    throw new DbWriteError(res.status);
  }
  return res;
}

/**
 * Inserts a row. With `ignoreDuplicatesOn`, a conflicting row is skipped and the function returns false;
 * it returns true when a new row was actually created.
 */
export async function insertRow(table: Table, row: Row, opts: { ignoreDuplicatesOn?: string } = {}): Promise<boolean> {
  const { url, key } = conn();
  const endpoint = new URL(`/rest/v1/${table}`, url);
  if (!opts.ignoreDuplicatesOn) {
    await request("POST", endpoint, key, row, "return=minimal", table);
    return true;
  }
  endpoint.searchParams.set("on_conflict", opts.ignoreDuplicatesOn);
  // Return the conflict column(s): every table has them, not every table has an "id" (profiles).
  endpoint.searchParams.set("select", opts.ignoreDuplicatesOn);
  const res = await request("POST", endpoint, key, row, "return=representation,resolution=ignore-duplicates", table);
  const inserted = (await res.json().catch(() => [])) as unknown[];
  return Array.isArray(inserted) && inserted.length > 0;
}

/**
 * Updates rows matching simple filters (`column=eq.value` / `is.null` / `not.is.null`).
 * Returns the number of rows changed.
 */
export async function updateRows(table: Table, filters: Record<string, string>, patch: Row, keyColumn = "id"): Promise<number> {
  const { url, key } = conn();
  const endpoint = new URL(`/rest/v1/${table}`, url);
  for (const [col, expr] of Object.entries(filters)) endpoint.searchParams.set(col, expr);
  endpoint.searchParams.set("select", keyColumn);
  const res = await request("PATCH", endpoint, key, patch, "return=representation", table);
  const rows = (await res.json().catch(() => [])) as unknown[];
  return Array.isArray(rows) ? rows.length : 0;
}

/**
 * Reads rows matching simple filters (plus PostgREST params such as `order`).
 * `columns` is a PostgREST select list. With `revalidate` (seconds) the result joins Next's data cache
 * under the given tags, so statically generated pages can show it; otherwise it is always fresh.
 */
export async function selectRows<T extends Row = Row>(
  table: Table,
  filters: Record<string, string>,
  columns: string,
  opts: { limit?: number; revalidate?: number; tags?: string[] } = {},
): Promise<T[]> {
  const { url, key } = conn();
  const endpoint = new URL(`/rest/v1/${table}`, url);
  for (const [col, expr] of Object.entries(filters)) endpoint.searchParams.set(col, expr);
  endpoint.searchParams.set("select", columns);
  endpoint.searchParams.set("limit", String(opts.limit ?? 100));
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    ...(opts.revalidate ? { next: { revalidate: opts.revalidate, tags: opts.tags } } : { cache: "no-store" as const }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    console.error(`[db] GET ${table} failed with status ${res.status}`);
    throw new Error("Database read failed");
  }
  return (await res.json()) as T[];
}

/** Exact row count for simple filters. */
export async function countRows(table: Table, filters: Record<string, string> = {}): Promise<number> {
  const { url, key } = conn();
  const endpoint = new URL(`/rest/v1/${table}`, url);
  for (const [col, expr] of Object.entries(filters)) endpoint.searchParams.set(col, expr);
  endpoint.searchParams.set("select", "*");
  endpoint.searchParams.set("limit", "0");
  const res = await fetch(endpoint, {
    method: "HEAD",
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error("Database read failed");
  return Number(res.headers.get("content-range")?.split("/")[1] ?? 0) || 0;
}

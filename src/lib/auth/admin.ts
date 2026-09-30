import "server-only";

/**
 * Looks up a user's email with Supabase's GoTrue admin API (service-role key, server only).
 * Emails live in auth.users, which PostgREST does not expose. Returns null on any failure.
 */
export async function userEmail(userId: string): Promise<string | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !/^[0-9a-f-]{36}$/i.test(userId)) return null;
  try {
    const res = await fetch(new URL(`/auth/v1/admin/users/${userId}`, url), {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { email?: string };
    return data.email ?? null;
  } catch {
    return null;
  }
}

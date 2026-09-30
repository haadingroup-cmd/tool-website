import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { insertRow, selectRows } from "@/lib/db";
import { COOKIE, authConfigured, fetchUser, type AuthUser } from "./gotrue";

export type Role = "user" | "vendor" | "moderator" | "editor" | "analyst" | "admin";

export interface Profile {
  user_id: string;
  display_name: string;
  role: Role;
}

// Neutral default: the email address is never shown publicly. Users can change it on /account/.
export const DEFAULT_DISPLAY_NAME = "SmarterBiz member";

/**
 * The signed-in user for this request, verified with Supabase (not just a decoded cookie).
 * The middleware refreshes an expiring access token before pages that call this render.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  if (!authConfigured()) return null;
  const token = (await cookies()).get(COOKIE.access)?.value;
  if (!token) return null;
  return fetchUser(token).catch(() => null);
});

/** Redirects to /login/ when nobody is signed in. */
export async function requireUser(next: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login/?next=${encodeURIComponent(next)}`);
  return user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const rows = await selectRows<Profile & Record<string, unknown>>(
    "profiles",
    { user_id: `eq.${userId}` },
    "user_id,display_name,role",
    { limit: 1 },
  );
  return rows[0] ?? null;
}

/** Creates the profiles row on first login; an existing row is left untouched (role included). */
export async function ensureProfile(userId: string): Promise<void> {
  await insertRow("profiles", { user_id: userId, display_name: DEFAULT_DISPLAY_NAME }, { ignoreDuplicatesOn: "user_id" });
}

export const STAFF_ROLES: readonly Role[] = ["moderator", "editor", "admin"];
export const SEO_ROLES: readonly Role[] = ["analyst", "editor", "admin"];

/** Signed-in user whose profiles.role is one of `roles`; everyone else gets a 404, not a hint that the page exists. */
export async function requireRole(roles: readonly Role[], next: string): Promise<{ user: AuthUser; profile: Profile }> {
  const user = await requireUser(next);
  const profile = await getProfile(user.id).catch(() => null);
  if (!profile || !roles.includes(profile.role)) notFound();
  return { user, profile };
}

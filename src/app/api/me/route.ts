import type { NextRequest } from "next/server";
import { json } from "@/lib/security";
import { selectRows } from "@/lib/db";
import { getCurrentUser, getProfile } from "@/lib/auth/session";
import { productId } from "@/lib/reviews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Who is signed in, for client widgets on statically generated pages (review form). */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return json({ signedIn: false });
  const slug = req.nextUrl.searchParams.get("product");
  try {
    const profile = await getProfile(user.id);
    let reviewStatus: string | null = null;
    if (slug && /^[a-z0-9-]{1,80}$/.test(slug)) {
      const id = await productId(slug);
      if (id != null) {
        const rows = await selectRows<{ status: string }>("reviews", { product_id: `eq.${id}`, user_id: `eq.${user.id}` }, "status", { limit: 1 });
        reviewStatus = rows[0]?.status ?? null;
      }
    }
    return json({ signedIn: true, displayName: profile?.display_name ?? null, reviewStatus });
  } catch {
    return json({ signedIn: true, displayName: null, reviewStatus: null });
  }
}

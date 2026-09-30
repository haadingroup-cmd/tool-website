import { selectRows } from "@/lib/db";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { ActionButtons } from "@/components/admin/ActionButtons";
import { Empty, Tabs, when } from "@/components/admin/Empty";

const TABS = [["pending", "Pending"], ["verified", "Verified"], ["rejected", "Rejected"]] as const;

interface Claim {
  id: number;
  status: string;
  method: string;
  email: string | null;
  job_title: string | null;
  evidence: string | null;
  notes: string | null;
  created_at: string;
  profiles: { display_name: string } | null;
  products: { name: string; slug: string; website_url: string } | null;
}
interface PublicClaim {
  id: number;
  product_slug: string;
  contact_name: string;
  email: string;
  job_title: string;
  company_domain: string;
  message: string | null;
  status: string;
  created_at: string;
}

const host = (u?: string) => { try { return u ? new URL(u).hostname.replace(/^www\./, "") : ""; } catch { return ""; } };

export default async function AdminClaims({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireRole(STAFF_ROLES, "/admin/claims/");
  const { status: raw } = await searchParams;
  const status = TABS.some(([k]) => k === raw) ? raw! : "pending";
  const [claims, requests] = await Promise.all([
    selectRows<Claim & Record<string, unknown>>("listing_claims", { status: `eq.${status}`, order: "created_at.asc" }, "id,status,method,email,job_title,evidence,notes,created_at,profiles(display_name),products(name,slug,website_url)"),
    selectRows<PublicClaim & Record<string, unknown>>("claim_requests", { status: `eq.${status === "pending" ? "new" : status}`, order: "created_at.asc" }, "*"),
  ]);

  return (
    <div>
      <h1 className="font-serif text-headline-lg text-ink">Listing claims</h1>
      <p className="mt-1 text-body-sm text-slate-body">
        Verify that the person works for the vendor before approving: a company email on the product&apos;s domain, or a reply from the vendor&apos;s official address.
        Verified claimants can propose changes; they can never edit scores or reviews.
      </p>
      <div className="mt-4"><Tabs base="/admin/claims/" current={status} items={TABS} /></div>

      <h2 className="mt-8 text-headline-sm text-ink">From signed-in vendors</h2>
      <div className="mt-3 grid gap-3">
        {claims.length === 0 && <Empty>Nothing here.</Empty>}
        {claims.map((c) => {
          const domain = host(c.products?.website_url);
          const emailDomain = c.email?.split("@")[1]?.toLowerCase() ?? "";
          const match = Boolean(domain && emailDomain && (emailDomain === domain || emailDomain.endsWith(`.${domain}`) || domain.endsWith(`.${emailDomain}`)));
          return (
            <article key={c.id} className="card p-5">
              <p className="text-body-md text-ink"><strong>{c.products?.name}</strong> ({domain}) · #{c.id} · {when(c.created_at)}</p>
              <p className="mt-1 text-body-sm text-slate-body">
                {c.profiles?.display_name} · {c.job_title ?? "—"} · {c.email ?? "email unknown"}{" "}
                <span className={match ? "font-semibold text-teal-deep" : "font-semibold text-amber-800"}>{match ? "✓ email matches product domain" : "email does not match product domain"}</span>
              </p>
              {c.evidence && <p className="mt-2 whitespace-pre-line text-body-sm text-slate-body">{c.evidence}</p>}
              {c.notes && <p className="mt-2 text-caption text-slate-mute">Note: {c.notes}</p>}
              {c.status === "pending" && (
                <div className="mt-3">
                  <ActionButtons kind="claim" id={c.id} choices={[{ decision: "verify", label: "Verify", tone: "primary", askNote: true }, { decision: "reject", label: "Reject", tone: "danger", askNote: true }]} />
                </div>
              )}
            </article>
          );
        })}
      </div>

      <h2 className="mt-8 text-headline-sm text-ink">From the public claim form</h2>
      <p className="mt-1 text-body-sm text-slate-body">These people aren&apos;t signed in. Once checked, ask them to sign in and claim from <a className="underline" href="/vendor/">/vendor/</a> to get dashboard access.</p>
      <div className="mt-3 grid gap-3">
        {requests.length === 0 && <Empty>Nothing here.</Empty>}
        {requests.map((r) => (
          <article key={r.id} className="card p-5">
            <p className="text-body-md text-ink"><strong>{r.product_slug}</strong> · #{r.id} · {when(r.created_at)}</p>
            <p className="mt-1 text-body-sm text-slate-body">{r.contact_name} · {r.job_title} · {r.email} · domain: {r.company_domain}</p>
            {r.message && <p className="mt-2 whitespace-pre-line text-body-sm text-slate-body">{r.message}</p>}
            {r.status === "new" && (
              <div className="mt-3">
                <ActionButtons kind="claim_request" id={r.id} choices={[{ decision: "verified", label: "Mark verified", tone: "primary" }, { decision: "rejected", label: "Reject", tone: "danger", askNote: true }]} />
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

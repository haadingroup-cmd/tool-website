import { TOOLS } from "@/lib/catalog";
import { selectRows } from "@/lib/db";
import { pageMetadata } from "@/lib/seo";
import { requireUser } from "@/lib/auth/session";
import { CHANGE_FIELDS } from "@/lib/vendor";
import { ChangeRequestForm, ClaimListingForm } from "@/components/forms/VendorForms";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Vendor dashboard",
  description: "Claim your product listing on SmarterBiz.uk and send factual corrections.",
  path: "/vendor",
  noindex: true,
});

interface Claim { id: number; status: string; notes: string | null; product_id: number; products: { slug: string; name: string } | null }
interface Change { id: number; field: string; status: string; notes: string | null; created_at: string; product_id: number; proposed: { value?: string } }

const STATUS: Record<string, string> = { pending: "Waiting for review", verified: "Verified", rejected: "Not approved", approved: "Approved", needs_info: "More information needed" };

export default async function VendorPage() {
  const user = await requireUser("/vendor/");
  let claims: Claim[] = [];
  let changes: Change[] = [];
  let failed = false;
  try {
    claims = await selectRows<Claim & Record<string, unknown>>("listing_claims", { user_id: `eq.${user.id}`, order: "created_at.desc" }, "id,status,notes,product_id,products(slug,name)");
    changes = await selectRows<Change & Record<string, unknown>>("change_requests", { user_id: `eq.${user.id}`, order: "created_at.desc" }, "id,field,status,notes,created_at,product_id,proposed", { limit: 200 });
  } catch {
    failed = true;
  }
  const verified = claims.filter((c) => c.status === "verified");
  const claimed = new Set(claims.filter((c) => c.status !== "rejected").map((c) => c.products?.slug));
  const claimable = TOOLS.filter((t) => !claimed.has(t.slug)).map((t) => ({ slug: t.slug, name: t.name })).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container-read py-12">
      <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Vendor dashboard</h1>
      <p className="mt-3 text-body-md text-slate-body">
        Work for a software company listed on SmarterBiz.uk? Claim your listing to send factual corrections with evidence.
        Our scores, verdicts and user reviews stay independent — see our <a className="underline" href="/editorial-policy/">editorial policy</a>.
      </p>
      {failed && <p role="alert" className="mt-4 text-body-sm text-red-700">We couldn&apos;t load your listings. Please refresh in a moment.</p>}

      {claims.length > 0 && (
        <section className="card mt-8 p-6" aria-labelledby="claims-h">
          <h2 id="claims-h" className="text-headline-sm text-ink">Your claims</h2>
          <ul className="mt-3 divide-y divide-rule">
            {claims.map((c) => (
              <li key={c.id} className="flex flex-wrap justify-between gap-2 py-2 text-body-md">
                <a className="text-ink underline" href={`/tools/${c.products?.slug}/`}>{c.products?.name}</a>
                <span className="text-slate-body">{STATUS[c.status] ?? c.status}{c.notes && c.status === "rejected" ? ` — ${c.notes}` : ""}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {verified.map((c) => {
        const mine = changes.filter((x) => x.product_id === c.product_id);
        return (
          <section key={c.id} className="card mt-8 p-6" aria-labelledby={`p-${c.id}`}>
            <h2 id={`p-${c.id}`} className="text-headline-sm text-ink">Suggest a correction to {c.products?.name}</h2>
            <div className="mt-4"><ChangeRequestForm productSlug={c.products?.slug ?? ""} fields={CHANGE_FIELDS} /></div>
            {mine.length > 0 && (
              <>
                <h3 className="mt-6 text-label uppercase tracking-wider text-ink">Your requests</h3>
                <ul className="mt-2 divide-y divide-rule">
                  {mine.map((x) => (
                    <li key={x.id} className="py-2 text-body-sm">
                      <span className="font-medium text-ink">{CHANGE_FIELDS[x.field as keyof typeof CHANGE_FIELDS] ?? x.field}</span>
                      {" — "}<span className="text-slate-body">{STATUS[x.status] ?? x.status}</span>
                      {x.notes && <span className="block text-caption text-slate-mute">Editor: {x.notes}</span>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        );
      })}

      <section className="card mt-8 p-6" aria-labelledby="claim-h">
        <h2 id="claim-h" className="text-headline-sm text-ink">Claim a listing</h2>
        <p className="mt-1 text-body-sm text-slate-body">Signed in as {user.email}. Claims from an email on the product&apos;s own domain are quickest to verify.</p>
        <div className="mt-4"><ClaimListingForm products={claimable} /></div>
      </section>
    </div>
  );
}

import { ClaimForm } from "@/components/forms/ClaimForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TOOLS } from "@/lib/catalog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Claim Your Software Listing",
  description: "Work for a software vendor listed on SmarterBiz.uk? Claim your listing to suggest factual corrections to pricing, features and UK details.",
  path: "/claim-listing/",
});

export default function ClaimPage() {
  const products = [...TOOLS].sort((a, b) => a.name.localeCompare(b.name)).map((t) => ({ slug: t.slug, name: t.name }));
  return (
    <div className="container-read py-8">
      <Breadcrumbs items={[{ name: "Claim a listing", path: "/claim-listing/" }]} />
      <h1 className="mt-4 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Claim your listing</h1>
      <p className="mt-3 font-serif text-body-lead text-slate-body">
        Vendors can claim their listing to send us factual updates — pricing, features, integrations and UK details such as data hosting or
        Making Tax Digital status. Every change is checked against a source before it goes live.
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-body-md text-slate-body">
        <li>We verify claims using an email address at the company&apos;s own domain.</li>
        <li>Claiming is free. It never affects editorial scores, rankings, reviews or comparisons.</li>
        <li>Sponsored placements, if we offer them, are always labelled &ldquo;Sponsored&rdquo;.</li>
      </ul>
      <p className="mt-6 rounded-lg border border-teal/30 bg-teal/5 p-4 text-body-md text-slate-body">
        <strong className="text-ink">Quickest route:</strong> <a href="/login/?next=%2Fvendor%2F" className="text-brand underline">sign in with your company email</a> and
        claim from the vendor dashboard — once verified you can send corrections there directly. Or use the form below and we&apos;ll email you.
      </p>
      <div className="mt-8"><ClaimForm products={products} /></div>
    </div>
  );
}

import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How We Review AI Tools: Our 7-Point Method",
  description: "How HA Tools reviews and scores AI tools for UK & US small businesses: value for money, ease of use, regional fit (privacy, tax, language) and features — with no paid rankings.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <StaticPage title="How we review" path="/methodology" lead="Our 7-point method for reviewing AI and business software against the realities of running a small business in the UK or US.">
      <h2>The 7-point review method</h2>
      <ol>
        <li><strong>Real tasks:</strong> we judge each tool against common small-business jobs — quotes, contracts, bookkeeping, customer replies, reports — using free plans and trials where available, plus the vendor&apos;s documentation.</li>
        <li><strong>£ and $ pricing:</strong> we record entry-level pricing in pounds and dollars and note VAT or sales-tax treatment where the vendor makes it clear.</li>
        <li><strong>Privacy (UK GDPR and US state laws):</strong> we check whether the vendor trains on your data, where data is stored, whether a data processing agreement is available and, for US buyers, notes on the CCPA/CPRA, HIPAA BAAs and call-recording consent.</li>
        <li><strong>Tax compatibility:</strong> for finance tools, we check HMRC Making Tax Digital recognition in the UK and sales-tax, 1099 and accountant support in the US.</li>
        <li><strong>Language & local context:</strong> we check British and American English output, date formats and local knowledge.</li>
        <li><strong>Ease of use:</strong> how quickly a non-technical owner can get value.</li>
        <li><strong>Features & integrations:</strong> how well it fits with Microsoft 365, Google Workspace, UK and US banks and common SME apps.</li>
      </ol>
      <h2>How scores work</h2>
      <p>
        Each tool receives sub-scores out of 10 for <strong>value</strong>, <strong>ease of use</strong>, <strong>UK &amp; US fit</strong> and{" "}
        <strong>features</strong>. The overall score reflects these with editorial judgement about the tool&apos;s usefulness to small
        businesses in the UK and US. Scores are editorial opinions, not guarantees.
      </p>
      <h2>Independence</h2>
      <p>
        Vendors cannot pay for inclusion, placement or scores. Some outbound links may be affiliate links; these are marked as sponsored in our
        code and never influence rankings. Read our <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
      </p>
      <h2>Updates and corrections</h2>
      <p>
        AI tools change quickly. We review guides regularly and show the last-updated date on every page. Spotted an error? <Link href="/contact">Tell us</Link> and we&apos;ll fix it.
      </p>
    </StaticPage>
  );
}

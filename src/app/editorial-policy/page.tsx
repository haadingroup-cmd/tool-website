import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/content";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Editorial Policy: Independence, Sources & Corrections",
  description: "How SmarterBiz.uk researches, writes and updates content: independence from vendors, how facts are sourced and labelled, no winners in comparisons, and how to request a correction.",
  path: "/editorial-policy/",
});

export default function EditorialPolicy() {
  return (
    <StaticPage title="Editorial policy" path="/editorial-policy/" updated={formatDate(SITE.lastUpdated)}
      lead="The rules we follow so you can trust what you read here — including what we don't do.">
      <h2>Independence</h2>
      <ul>
        <li>Vendors cannot pay for inclusion, scores, rankings, reviews or comparison outcomes.</li>
        <li>Some outbound links are affiliate links. They are marked <code>rel=&quot;sponsored&quot;</code>, disclosed on the page, and never influence what we write. See our <Link href="/affiliate-disclosure/">affiliate disclosure</Link>.</li>
        <li>Any paid placement is labelled &ldquo;Sponsored&rdquo; and kept separate from editorial rankings.</li>
      </ul>
      <h2>Tested reviews versus listings</h2>
      <p>
        A product with a score out of 10 has been tested by our editors against our <Link href="/methodology/">methodology</Link>. A product
        marked <strong>&ldquo;Not yet scored&rdquo;</strong> is a listing: an overview based on the vendor&apos;s public information, not a
        hands-on review. We never invent ratings, testimonials or user reviews.
      </p>
      <h2>How facts are sourced and labelled</h2>
      <ul>
        <li><strong>Prices</strong> are only shown as verified once checked against the vendor&apos;s pricing page, with the date. Otherwise they are marked indicative or &ldquo;see vendor pricing&rdquo;.</li>
        <li><strong>UK facts</strong> (Making Tax Digital, data hosting, VAT, UK support) carry a status: verified from an official source, verified from the vendor, vendor reported, or not yet verified.</li>
        <li><strong>Compliance statements</strong> link to the official source (GOV.UK, HMRC, the ICO) and are kept separate from our own explanation.</li>
      </ul>
      <h2>Comparisons</h2>
      <p>Our comparisons are neutral. We describe how products differ and who each suits, but never declare an overall winner — the right choice depends on your business.</p>
      <h2>Use of AI</h2>
      <p>We may use AI tools to help with research and drafting. Every page is reviewed, fact-checked and edited by a person before publication, and no product fact is published from AI output alone.</p>
      <h2>Updates and corrections</h2>
      <p>Pages show when they were last updated. If you spot an error, <Link href="/contact/">tell us</Link> — we aim to review correction requests within five working days and note material corrections on the page.</p>
    </StaticPage>
  );
}

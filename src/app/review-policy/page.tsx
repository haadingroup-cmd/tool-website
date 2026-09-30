import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "User Review Policy & Moderation Guidelines",
  description: "How user reviews on SmarterBiz.uk will work: who can post, what we moderate, how we detect fake reviews, and how vendors can respond.",
  path: "/review-policy/",
});

export default function ReviewPolicy() {
  return (
    <StaticPage title="User review policy" path="/review-policy/"
      lead="User reviews are coming to SmarterBiz.uk. These are the rules they will follow — published before launch so vendors and readers know what to expect.">
      <h2>Who can review</h2>
      <ul>
        <li>Anyone with a verified email address who has used the product for work.</li>
        <li>One review per person per product. Reviewers must declare any connection to the vendor or a competitor.</li>
        <li>Vendors and their staff cannot review their own products.</li>
      </ul>
      <h2>What we moderate</h2>
      <p>Every review is checked before publication. We reject reviews that are fake, incentivised without disclosure, abusive, off-topic, contain personal data, or copy text from elsewhere. We never edit a review to change its meaning.</p>
      <h2>Incentives</h2>
      <p>We will not pay for reviews or offer rewards conditional on a positive rating. Vendors may not offer incentives for reviews on this site.</p>
      <h2>Ratings on product pages</h2>
      <p>We show an average user rating only once a product has at least three published reviews, and we never display ratings that don&apos;t come from real, published reviews.</p>
      <h2>Vendor responses</h2>
      <p>Vendors who <Link href="/claim-listing/">claim their listing</Link> can respond publicly to reviews. They cannot remove or hide reviews; they can report a review that breaks these rules.</p>
      <h2>Reporting a review</h2>
      <p>Anyone can report a review. Reported reviews are re-checked by a moderator; our decision and the reason are recorded.</p>
      <p>This approach follows the UK&apos;s rules on fake reviews under the Digital Markets, Competition and Consumers Act 2024.</p>
    </StaticPage>
  );
}

import Link from "next/link";
import { StaticPage } from "@/components/content/StaticPage";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Us — Independent AI Tool Reviews for UK & US Small Businesses",
  description: "HA Tools publishes independent reviews, comparisons and guides to AI tools for small businesses in the UK and US, with £ and $ pricing and local privacy and tax notes.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <StaticPage title="About HA Tools" path="/about" lead="Practical, independent intelligence on the AI tools that help small businesses in the UK and US save time and money.">
      <h2>Why we exist</h2>
      <p>
        Most AI tool reviews ignore where you actually run your business. A founder in Manchester needs to know what a tool costs in pounds,
        whether it works with HMRC&apos;s Making Tax Digital and how it handles UK GDPR. A founder in Texas needs the dollar price, whether it
        plays well with QuickBooks and sales tax, and what state privacy laws such as the CCPA mean for customer data. Every review on HA Tools
        covers both, side by side.
      </p>
      <h2>Who we are</h2>
      <p>{SITE.author.bio}</p>
      <h2>Our principles</h2>
      <ul>
        <li><strong>Independence:</strong> vendors cannot pay for inclusion or rankings.</li>
        <li><strong>Transparency:</strong> we explain <Link href="/methodology">how we review</Link> and <Link href="/affiliate-disclosure">how we make money</Link>.</li>
        <li><strong>Accuracy:</strong> we update guides regularly and correct mistakes quickly — <Link href="/contact">report one here</Link>.</li>
        <li><strong>Practicality:</strong> we focus on what saves a small business real time.</li>
      </ul>
      <h2>Contact</h2>
      <p>Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or use our <Link href="/contact">contact form</Link>. Tool makers can <Link href="/submit-tool">submit a tool for review</Link>.</p>
    </StaticPage>
  );
}

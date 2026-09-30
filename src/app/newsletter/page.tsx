import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "The Thursday Briefing: Weekly UK SME Tech Newsletter",
  description: "One short email a week: tested AI tools and business software, a practical workflow, and UK updates such as Making Tax Digital and UK GDPR. Free, unsubscribe any time.",
  path: "/newsletter/",
});

export default function NewsletterPage() {
  return (
    <div className="container-read py-8">
      <Breadcrumbs items={[{ name: "Newsletter", path: "/newsletter/" }]} />
      <h1 className="mt-4 font-serif text-headline-xl-mobile text-ink md:text-headline-xl">The Thursday Briefing</h1>
      <p className="mt-3 font-serif text-body-lead text-slate-body">A short weekly email for UK business owners who want to use software well without wading through hype.</p>
      <ul className="mt-6 list-disc space-y-1.5 pl-5 text-body-md text-slate-body">
        <li>Three tools we&apos;ve looked at this week, with who they suit.</li>
        <li>One practical workflow you can copy.</li>
        <li>UK updates: Making Tax Digital, UK GDPR and other rule changes that affect your software.</li>
      </ul>
      <div className="card mt-8 p-6"><NewsletterForm source="newsletter-page" /></div>
      <p className="mt-3 text-caption text-slate-mute">We only use your email to send the briefing. Every email has a one-click unsubscribe link.</p>
    </div>
  );
}

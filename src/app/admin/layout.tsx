import Link from "next/link";
import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV = [
  ["/admin/", "Overview"],
  ["/admin/reviews/", "Reviews"],
  ["/admin/claims/", "Claims"],
  ["/admin/changes/", "Change requests"],
  ["/admin/submissions/", "Tool submissions"],
  ["/admin/messages/", "Messages"],
  ["/admin/seo/", "SEO"],
  ["/admin/audit/", "Audit log"],
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireRole(["moderator", "editor", "analyst", "admin"], "/admin/");
  return (
    <div className="container-site py-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="kicker">Admin · signed in as {profile.display_name} ({profile.role})</p>
      </div>
      <nav aria-label="Admin" className="mt-3 flex flex-wrap gap-2 border-b border-rule pb-4">
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} className="rounded-full border border-rule px-3 py-1 text-body-sm text-ink hover:bg-surface-low">{label}</Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}

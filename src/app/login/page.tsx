import { redirect } from "next/navigation";
import { LoginForm } from "@/components/forms/LoginForm";
import { pageMetadata } from "@/lib/seo";
import { safeNext } from "@/lib/auth/gotrue";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to SmarterBiz.uk with a one-time email link to write reviews and manage your account.",
  path: "/login",
  noindex: true,
});

const ERRORS: Record<string, string> = {
  expired: "That sign-in link has expired or was already used. Please request a new one.",
  browser: "Please open the sign-in link in the same browser you requested it from, or request a new link here.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  const destination = safeNext(next);
  if (await getCurrentUser()) redirect(destination);

  return (
    <div className="container-read py-12">
      <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Sign in</h1>
      <p className="mt-3 font-serif text-body-lead text-slate-body">
        Enter your email and we&apos;ll send you a secure link. You need an account to review tools or claim a listing.
      </p>
      {error && ERRORS[error] && (
        <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-body-sm text-red-800">{ERRORS[error]}</p>
      )}
      <div className="mt-8"><LoginForm next={destination} /></div>
    </div>
  );
}

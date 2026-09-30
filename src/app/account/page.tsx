import { ProfileForm } from "@/components/forms/ProfileForm";
import { pageMetadata } from "@/lib/seo";
import { DEFAULT_DISPLAY_NAME, ensureProfile, getProfile, requireUser, type Profile } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Your account",
  description: "Manage your SmarterBiz.uk account.",
  path: "/account",
  noindex: true,
});

async function loadProfile(userId: string): Promise<Profile | null> {
  try {
    const found = await getProfile(userId);
    if (found) return found;
    await ensureProfile(userId); // first login's insert may have failed; try once more
    return await getProfile(userId);
  } catch {
    return null;
  }
}

export default async function AccountPage() {
  const user = await requireUser("/account/");
  const profile = await loadProfile(user.id);

  return (
    <div className="container-read py-12">
      <h1 className="font-serif text-headline-xl-mobile text-ink md:text-headline-xl">Your account</h1>
      <p className="mt-3 text-body-md text-slate-body">
        Signed in as <strong className="text-ink">{user.email}</strong>
        {profile && profile.role !== "user" && <> · role: {profile.role}</>}
      </p>

      <section className="card mt-8 p-6" aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="text-headline-sm text-ink">Profile</h2>
        <div className="mt-4">
          {profile ? (
            <ProfileForm displayName={profile.display_name ?? DEFAULT_DISPLAY_NAME} />
          ) : (
            <p role="alert" className="text-body-sm text-red-700">We couldn&apos;t load your profile. Please refresh the page in a moment.</p>
          )}
        </div>
      </section>

      <form method="post" action="/api/auth/logout" className="mt-8">
        <button type="submit" className="btn-secondary">Sign out</button>
      </form>
    </div>
  );
}

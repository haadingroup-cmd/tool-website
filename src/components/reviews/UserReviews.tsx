import { BUSINESS_SIZES, CONNECTIONS, DURATIONS, type PublicReview, type RatingSummary } from "@/lib/reviews";
import { formatDate } from "@/lib/content";
import { Stars } from "./Stars";
import { ReviewForm } from "./ReviewForm";
import { ReportButton } from "./ReportButton";

export function UserReviews({ slug, name, reviews, summary }: { slug: string; name: string; reviews: PublicReview[]; summary: RatingSummary | null }) {
  return (
    <section className="mt-10" aria-labelledby="user-reviews">
      <h2 id="user-reviews" className="font-serif text-headline-md text-ink">{name} user reviews</h2>
      {summary ? (
        <p className="mt-2 flex flex-wrap items-center gap-2 text-body-md text-slate-body">
          <Stars value={summary.avg_overall} size={18} />
          <span><strong className="text-ink">{summary.avg_overall.toFixed(1)}</strong> out of 5 from {summary.review_count} published reviews</span>
        </p>
      ) : (
        <p className="mt-2 text-body-md text-slate-body">
          {reviews.length
            ? "We show an average rating once a product has at least three published reviews."
            : `No published user reviews of ${name} yet.`}{" "}
          Every review is checked against our <a href="/review-policy/" className="underline">review policy</a> before it appears.
        </p>
      )}

      {reviews.length > 0 && (
        <ol className="mt-5 grid gap-4">
          {reviews.map((r) => (
            <li key={r.id} className="card p-5">
              <article aria-label={`Review by ${r.display_name}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Stars value={r.overall} />
                  <time dateTime={r.published_at} className="text-caption text-slate-mute">{formatDate(r.published_at.slice(0, 10))}</time>
                </div>
                <h3 className="mt-2 text-headline-sm text-ink">{r.title}</h3>
                <p className="mt-1 text-caption text-slate-mute">
                  {r.display_name}
                  {r.business_size && ` · ${BUSINESS_SIZES[r.business_size as keyof typeof BUSINESS_SIZES] ?? r.business_size}`}
                  {r.duration_of_use && ` · used for ${(DURATIONS[r.duration_of_use as keyof typeof DURATIONS] ?? r.duration_of_use).toLowerCase()}`}
                </p>
                {r.connection !== "none" && (
                  <p className="mt-2 rounded border border-amber-300 bg-amber-50 px-2 py-1 text-caption text-amber-900">
                    Declared connection: {CONNECTIONS[r.connection]}
                  </p>
                )}
                <div className="mt-3 grid gap-3 text-body-md text-slate-body">
                  <div><p className="font-semibold text-teal-deep">What they like</p><p className="whitespace-pre-line">{r.pros}</p></div>
                  <div><p className="font-semibold text-red-800">What could be better</p><p className="whitespace-pre-line">{r.cons}</p></div>
                  {r.use_case && <p className="text-body-sm"><span className="font-semibold text-ink">Used for:</span> {r.use_case}</p>}
                </div>
                <div className="mt-3"><ReportButton reviewId={r.id} /></div>
              </article>
            </li>
          ))}
        </ol>
      )}

      <div id="write-review" className="mt-5 scroll-mt-28">
        <ReviewForm productSlug={slug} productName={name} />
      </div>
    </section>
  );
}

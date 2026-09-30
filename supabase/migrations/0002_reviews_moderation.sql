-- SmarterBiz.uk — migration 0002: user reviews, moderation and vendor workflow.
-- Run once in Supabase → SQL Editor after setup-all.sql (safe to re-run).

-- Review policy: reviewers declare any connection to the vendor's competitors or partners.
alter table reviews add column if not exists connection text not null default 'none'
  check (connection in ('none','competitor','partner'));

-- Reports are re-checked by a moderator; the decision is recorded.
alter table review_reports add column if not exists resolved_at timestamptz;
alter table review_reports add column if not exists resolved_by uuid;
create index if not exists review_reports_open_idx on review_reports (review_id) where resolved_at is null;
create unique index if not exists review_reports_once on review_reports (review_id, reporter_id);

-- Signed-in listing claims (vendor dashboard) and the moderator's decision.
alter table listing_claims add column if not exists email citext;
alter table listing_claims add column if not exists job_title text check (char_length(job_title) <= 100);
alter table listing_claims add column if not exists evidence text check (char_length(evidence) <= 2000);
alter table listing_claims add column if not exists notes text;
alter table listing_claims add column if not exists reviewed_by uuid;
create unique index if not exists listing_claims_open_once on listing_claims (product_id, user_id) where status <> 'rejected';

alter table change_requests add column if not exists notes text;
alter table change_requests add column if not exists reviewed_by uuid;
alter table change_requests add column if not exists reviewed_at timestamptz;
create index if not exists change_requests_status_idx on change_requests (status, created_at desc);
create index if not exists reviews_status_idx on reviews (status, created_at desc);
create index if not exists audit_log_time_idx on audit_log (created_at desc);

-- Re-create the public view with the disclosure column (still no user_id, IP hash or notes).
create or replace view public_reviews as
  select r.id, r.product_id, p.display_name, r.overall, r.ease_of_use, r.features, r.value_for_money, r.support,
         r.implementation, r.reliability, r.user_experience, r.uk_suitability, r.title, r.pros, r.cons, r.use_case,
         r.business_size, r.duration_of_use, r.verified_usage, r.published_at, r.connection
  from reviews r join profiles p on p.user_id = r.user_id
  where r.status = 'published';
grant select on public_reviews to anon;

-- ONE-TIME SETUP for a new Supabase project: paste this whole file into Supabase → SQL Editor → Run.
-- Contains supabase/schema.sql followed by supabase/migrations/0001_platform.sql. Run it only once.

-- SmarterBiz.uk database schema. Run in the Supabase SQL editor (Project → SQL Editor → New query).
-- RLS is enabled with NO public policies: only the server-side service-role key can read/write.

create extension if not exists citext;

create table if not exists public.subscribers (
  id bigint generated always as identity primary key,
  email citext not null unique,
  source text not null default 'site',
  consent_text text not null,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 100),
  email citext not null,
  subject text not null check (subject in ('general','editorial','correction','partnership','press')),
  message text not null check (char_length(message) between 20 and 5000),
  created_at timestamptz not null default now(),
  handled boolean not null default false
);

create table if not exists public.tool_submissions (
  id bigint generated always as identity primary key,
  tool_name text not null check (char_length(tool_name) between 2 and 100),
  tool_url text not null check (tool_url ~* '^https://'),
  category text not null,
  contact_name text not null,
  email citext not null,
  description text not null check (char_length(description) between 30 and 2000),
  uk_pricing text not null default '',
  status text not null default 'pending' check (status in ('pending','reviewing','accepted','rejected')),
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;
alter table public.contact_messages enable row level security;
alter table public.tool_submissions enable row level security;

-- Belt and braces: make sure anonymous/authenticated roles have no direct table access.
revoke all on public.subscribers, public.contact_messages, public.tool_submissions from anon, authenticated;

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists tool_submissions_status_idx on public.tool_submissions (status, created_at desc);

-- Listing claim requests from vendors (no login needed; verified manually by email/domain before any change).
create table if not exists public.claim_requests (
  id bigint generated always as identity primary key,
  product_slug text not null check (product_slug ~ '^[a-z0-9-]+$'),
  contact_name text not null check (char_length(contact_name) between 2 and 100),
  email citext not null,
  job_title text not null check (char_length(job_title) between 2 and 100),
  company_domain text not null check (char_length(company_domain) between 3 and 120),
  message text check (char_length(message) <= 2000),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','verified','rejected'))
);
alter table public.claim_requests enable row level security;

-- SmarterBiz.uk — platform schema (migration 0001).
-- PostgreSQL 15+ (Supabase). Apply with: psql "$DATABASE_URL" -f supabase/migrations/0001_platform.sql
-- Depends on nothing; the older supabase/schema.sql (subscribers, contact, submissions) is independent.

create extension if not exists citext;
create extension if not exists pg_trgm;

-- ───────────────────────── Enums ─────────────────────────
create type verification_status as enum ('official_verified','source_verified','vendor_reported','community_reported','unverified');
create type tri_state as enum ('yes','no','limited','unknown');
create type residency as enum ('uk','eu','us','global','other','unknown');
create type mtd_state as enum ('compatible','not_compatible','not_applicable','unknown');
create type publish_status as enum ('draft','in_review','published','discontinued','archived');
create type review_status as enum ('submitted','pending','approved','published','reported','rejected');
create type relation_type as enum ('alternative_of','competes_with','integrates_with');
create type user_role as enum ('user','vendor','moderator','editor','analyst','admin');
create type pricing_model as enum ('free','freemium','free_trial','paid','contact_sales','open_source');
create type category_root as enum ('ai-tools','software');

-- ───────────────────────── Core catalogue ─────────────────────────
create table companies (
  id            bigint generated always as identity primary key,
  name          text not null,
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  website_url   text check (website_url ~* '^https://'),
  hq_country    char(2),
  founded_year  smallint,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table products (
  id                 bigint generated always as identity primary key,
  company_id         bigint references companies(id) on delete set null,
  name               text not null,
  slug               text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status             publish_status not null default 'draft',
  logo_path          text,
  short_description  text not null check (char_length(short_description) between 20 and 200),
  long_description   text,
  website_url        text not null check (website_url ~* '^https://'),
  pricing_model      pricing_model,
  free_plan          tri_state not null default 'unknown',
  free_trial_days    smallint,
  api_available      tri_state not null default 'unknown',
  open_source        boolean,
  editorial_score    numeric(3,1) check (editorial_score between 0 and 10),
  editorial_notes    text,
  best_for           text[] not null default '{}',
  pros               text[] not null default '{}',
  cons               text[] not null default '{}',
  discontinued_at    date,
  last_verified_at   timestamptz,
  author_id          bigint,
  search             tsvector generated always as (
                       setweight(to_tsvector('english', coalesce(name,'')), 'A') ||
                       setweight(to_tsvector('english', coalesce(short_description,'')), 'B') ||
                       setweight(to_tsvector('english', coalesce(long_description,'')), 'C')) stored,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index products_search_idx on products using gin (search);
create index products_name_trgm on products using gin (name gin_trgm_ops);
create index products_status_idx on products (status);

-- Reserved slugs prevent collisions with category/hub routes (blueprint P2).
create table reserved_slugs (slug text primary key);
insert into reserved_slugs values ('free'),('paid'),('free-trial'),('uk'),('new'),('popular'),('reviews'),('pricing'),('compare'),('search');

create table categories (
  id           bigint generated always as identity primary key,
  root         category_root not null,
  parent_id    bigint references categories(id) on delete restrict,
  slug         text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name         text not null,
  intro        text,
  buying_guide text,
  uk_notes     text,
  meta_title   text,
  meta_description text,
  sort_order   int not null default 0,
  unique (root, parent_id, slug)
);

create table product_categories (
  product_id  bigint references products(id) on delete cascade,
  category_id bigint references categories(id) on delete cascade,
  is_primary  boolean not null default false,
  primary key (product_id, category_id)
);
create unique index one_primary_category on product_categories (product_id) where is_primary;

create table use_cases  (id bigint generated always as identity primary key, slug text unique not null, name text not null, intro text);
create table industries (id bigint generated always as identity primary key, slug text unique not null, name text not null, intro text, uk_notes text);
create table integrations (id bigint generated always as identity primary key, slug text unique not null, name text not null, uk_specific boolean not null default false);
create table platforms  (id bigint generated always as identity primary key, slug text unique not null, name text not null); -- web, chrome-extension, ios, android, windows, mac, api

create table product_use_cases    (product_id bigint references products(id) on delete cascade, use_case_id bigint references use_cases(id) on delete cascade, primary key (product_id, use_case_id));
create table product_industries   (product_id bigint references products(id) on delete cascade, industry_id bigint references industries(id) on delete cascade, primary key (product_id, industry_id));
create table product_integrations (product_id bigint references products(id) on delete cascade, integration_id bigint references integrations(id) on delete cascade, primary key (product_id, integration_id));
create table product_platforms    (product_id bigint references products(id) on delete cascade, platform_id bigint references platforms(id) on delete cascade, primary key (product_id, platform_id));

create table product_features (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references products(id) on delete cascade,
  feature_group text not null,
  feature     text not null,
  source_id   bigint
);

-- Knowledge-graph edges between products.
create table product_relations (
  from_product_id bigint references products(id) on delete cascade,
  to_product_id   bigint references products(id) on delete cascade,
  relation        relation_type not null,
  note            text,
  primary key (from_product_id, to_product_id, relation),
  check (from_product_id <> to_product_id)
);

-- ───────────────────────── Provenance & UK data ─────────────────────────
create table fact_sources (
  id                  bigint generated always as identity primary key,
  product_id          bigint not null references products(id) on delete cascade,
  field               text not null,
  source_url          text check (source_url ~* '^https://'),
  source_type         text not null check (source_type in ('official_docs','vendor_site','gov_uk','hmrc','ico','companies_house','vendor_submission','community','editorial_test')),
  verification_status verification_status not null default 'unverified',
  checked_at          timestamptz not null default now(),
  checked_by          uuid,
  notes               text
);
create index fact_sources_product_idx on fact_sources (product_id, field);
alter table product_features add constraint product_features_source_fk foreign key (source_id) references fact_sources(id) on delete set null;

create table uk_checks (
  product_id        bigint primary key references products(id) on delete cascade,
  uk_available      tri_state not null default 'unknown',
  gbp_pricing       tri_state not null default 'unknown',
  uk_vat_support    tri_state not null default 'unknown',
  uk_gdpr_info_url  text check (uk_gdpr_info_url ~* '^https://'),
  data_residency    residency not null default 'unknown',
  mtd               mtd_state not null default 'unknown',
  companies_house   tri_state not null default 'unknown',
  uk_support        tri_state not null default 'unknown',
  source_ids        bigint[] not null default '{}',
  checked_at        timestamptz
);

create table prices (
  id             bigint generated always as identity primary key,
  product_id     bigint not null references products(id) on delete cascade,
  plan_name      text not null,
  currency       char(3) not null check (currency in ('GBP','USD','EUR')),
  monthly_price  numeric(10,2) check (monthly_price >= 0),
  annual_price   numeric(10,2) check (annual_price >= 0),
  billing_period text check (billing_period in ('monthly','annual','one_off','usage')),
  per_user       boolean not null default false,
  ex_vat         boolean,
  user_limit     int,
  feature_limit  text,
  is_free_plan   boolean not null default false,
  source_url     text not null check (source_url ~* '^https://'),
  verification_status verification_status not null default 'unverified',
  checked_at     timestamptz not null,
  sort_order     int not null default 0
);
create index prices_product_idx on prices (product_id);

-- ───────────────────────── Users, reviews, vendors ─────────────────────────
-- Supabase auth.users holds credentials; profiles holds app data.
create table profiles (
  user_id      uuid primary key,          -- references auth.users(id)
  display_name text not null,
  role         user_role not null default 'user',
  job_role     text,
  company_size text,
  industry_id  bigint references industries(id),
  created_at   timestamptz not null default now()
);

create table reviews (
  id               bigint generated always as identity primary key,
  product_id       bigint not null references products(id) on delete cascade,
  user_id          uuid not null references profiles(user_id) on delete cascade,
  status           review_status not null default 'submitted',
  overall          smallint not null check (overall between 1 and 5),
  ease_of_use      smallint check (ease_of_use between 1 and 5),
  features         smallint check (features between 1 and 5),
  value_for_money  smallint check (value_for_money between 1 and 5),
  support          smallint check (support between 1 and 5),
  implementation   smallint check (implementation between 1 and 5),
  reliability      smallint check (reliability between 1 and 5),
  user_experience  smallint check (user_experience between 1 and 5),
  uk_suitability   smallint check (uk_suitability between 1 and 5),
  title            text not null check (char_length(title) between 5 and 120),
  pros             text not null check (char_length(pros) between 20 and 3000),
  cons             text not null check (char_length(cons) between 20 and 3000),
  use_case         text,
  business_size    text,
  industry_id      bigint references industries(id),
  duration_of_use  text check (duration_of_use in ('<6m','6-12m','1-2y','2y+')),
  verified_usage   boolean not null default false,
  spam_score       smallint not null default 0,
  ip_hash          text,
  moderation_notes text,
  moderated_by     uuid,
  created_at       timestamptz not null default now(),
  published_at     timestamptz,
  unique (product_id, user_id)            -- one review per user per product
);
create index reviews_product_status_idx on reviews (product_id, status);
create index reviews_pros_trgm on reviews using gin (pros gin_trgm_ops); -- duplicate detection

create table review_reports (id bigint generated always as identity primary key, review_id bigint references reviews(id) on delete cascade, reporter_id uuid, reason text not null, created_at timestamptz not null default now());
create table review_votes   (review_id bigint references reviews(id) on delete cascade, user_id uuid, helpful boolean not null, primary key (review_id, user_id));

create table vendor_accounts (
  id          bigint generated always as identity primary key,
  company_id  bigint not null references companies(id) on delete cascade,
  user_id     uuid not null references profiles(user_id) on delete cascade,
  unique (company_id, user_id)
);

create table listing_claims (
  id             bigint generated always as identity primary key,
  product_id     bigint not null references products(id) on delete cascade,
  user_id        uuid not null references profiles(user_id) on delete cascade,
  method         text not null check (method in ('company_email','dns_txt','html_code','manual')),
  token_hash     text,
  status         text not null default 'pending' check (status in ('pending','verified','rejected')),
  created_at     timestamptz not null default now(),
  verified_at    timestamptz
);

create table change_requests (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references products(id) on delete cascade,
  user_id     uuid not null references profiles(user_id),
  field       text not null,
  proposed    jsonb not null,
  evidence_url text,
  status      text not null default 'pending' check (status in ('pending','approved','rejected','needs_info')),
  created_at  timestamptz not null default now()
);

-- Existing table from supabase/schema.sql is kept (tool_submissions); submissions become draft products on approval.

-- ───────────────────────── Editorial content ─────────────────────────
create table authors (
  id        bigint generated always as identity primary key,
  slug      text unique not null,
  name      text not null,
  role      text,
  bio       text not null,
  photo_path text,
  same_as   text[] not null default '{}'   -- LinkedIn etc.
);
alter table products add constraint products_author_fk foreign key (author_id) references authors(id) on delete set null;

create table guides (
  id            bigint generated always as identity primary key,
  slug          text unique not null,
  title         text not null,
  meta_title    text,
  meta_description text,
  body_mdx      text not null,
  quick_answer  text,
  author_id     bigint references authors(id),
  status        publish_status not null default 'draft',
  published_at  timestamptz,
  reviewed_at   timestamptz,
  fact_checked_at timestamptz,
  sources       jsonb not null default '[]'
);
create table guide_products (guide_id bigint references guides(id) on delete cascade, product_id bigint references products(id) on delete cascade, primary key (guide_id, product_id));

create table comparisons (
  id               bigint generated always as identity primary key,
  slug             text unique not null,
  product_a_id     bigint not null references products(id) on delete cascade,
  product_b_id     bigint not null references products(id) on delete cascade,
  intro            text,
  choose_a_if      text[] not null default '{}',
  choose_b_if      text[] not null default '{}',
  status           publish_status not null default 'draft',
  author_id        bigint references authors(id),
  last_reviewed_at timestamptz,
  check (product_a_id < product_b_id),            -- canonical ordering, no duplicates
  unique (product_a_id, product_b_id)
);

create table faqs (
  id          bigint generated always as identity primary key,
  entity_type text not null check (entity_type in ('product','category','comparison','alternatives','guide','industry','use_case','uk')),
  entity_id   bigint not null,
  question    text not null,
  answer      text not null,
  sort_order  int not null default 0
);

-- ───────────────────────── SEO control ─────────────────────────
create table seo_pages (
  url             text primary key,
  page_type       text not null,
  target_keyword  citext,
  quality_score   smallint not null default 0 check (quality_score between 0 and 100),
  indexable       boolean not null default false,
  meta_title      text,
  meta_description text,
  inbound_links   int not null default 0,
  last_evaluated  timestamptz
);
create table keyword_map (
  keyword  citext primary key,
  url      text not null references seo_pages(url) on update cascade,
  intent   text not null check (intent in ('informational','commercial','transactional','navigational')),
  monthly_volume_uk int,
  source   text,
  checked_at date
);
create table redirects (
  from_path  text primary key,
  to_path    text not null,
  status     smallint not null default 301 check (status in (301,308,410)),
  created_at timestamptz not null default now()
);

-- ───────────────────────── Monetisation & analytics ─────────────────────────
create table affiliate_links (
  id         bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  slug       text unique not null,           -- /go/{slug}
  target_url text not null check (target_url ~* '^https://'),
  network    text,
  active     boolean not null default true
);
create table placements (
  id         bigint generated always as identity primary key,
  product_id bigint not null references products(id) on delete cascade,
  slot       text not null,                 -- e.g. 'category:accounting:sponsored-1'
  label      text not null check (label in ('Sponsored','Featured listing')),
  starts_at  timestamptz not null,
  ends_at    timestamptz not null,
  check (ends_at > starts_at)
);
create table events (
  id          bigint generated always as identity primary key,
  name        text not null check (name in ('tool_view','official_site_click','compare_click','affiliate_click','review_submit','search','filter_use','finder_complete','newsletter_signup')),
  path        text,
  product_id  bigint,
  props       jsonb not null default '{}',
  session_hash text,
  created_at  timestamptz not null default now()
);
create index events_name_time_idx on events (name, created_at desc);

create table audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid,
  action     text not null,
  entity     text not null,
  entity_id  text not null,
  before     jsonb,
  after      jsonb,
  created_at timestamptz not null default now()
);

-- ───────────────────────── Row-level security ─────────────────────────
-- RLS on every table. The server uses the service-role key (bypasses RLS);
-- the anon key may only read published catalogue data and reference tables.
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
end $$;

create policy products_public_read on products for select to anon using (status = 'published');
create policy companies_public_read on companies for select to anon using (true);
create policy categories_public_read on categories for select to anon using (true);
create policy product_categories_public_read on product_categories for select to anon
  using (exists (select 1 from products p where p.id = product_id and p.status = 'published'));
create policy uk_checks_public_read on uk_checks for select to anon
  using (exists (select 1 from products p where p.id = product_id and p.status = 'published'));
create policy prices_public_read on prices for select to anon
  using (exists (select 1 from products p where p.id = product_id and p.status = 'published'));
create policy comparisons_public_read on comparisons for select to anon using (status = 'published');
create policy platforms_public_read on platforms for select to anon using (true);
create policy product_platforms_public_read on product_platforms for select to anon using (true);
create policy product_relations_public_read on product_relations for select to anon using (true);

grant usage on schema public to anon;
grant select on products, companies, categories, product_categories, uk_checks, prices, comparisons,
  platforms, product_platforms, product_relations to anon;

-- Published reviews without personal data (no user_id, IP hash or moderation notes).
create view public_reviews as
  select r.id, r.product_id, p.display_name, r.overall, r.ease_of_use, r.features, r.value_for_money, r.support,
         r.implementation, r.reliability, r.user_experience, r.uk_suitability, r.title, r.pros, r.cons, r.use_case,
         r.business_size, r.duration_of_use, r.verified_usage, r.published_at
  from reviews r join profiles p on p.user_id = r.user_id
  where r.status = 'published';
grant select on public_reviews to anon;

-- AggregateRating may only be shown when a product has at least 3 published reviews (master prompt §29).
create view product_rating_summary as
  select product_id, count(*)::int as review_count, round(avg(overall)::numeric, 2) as avg_overall
  from reviews where status = 'published' group by product_id having count(*) >= 3;
grant select on product_rating_summary to anon;

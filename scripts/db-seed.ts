// Generates idempotent SQL that loads the catalogue (src/data → Postgres).
//   npm run -s db:seed-sql > /tmp/seed.sql && psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f /tmp/seed.sql
// Only facts we hold are written. Prices are NOT seeded: the prices table requires a
// source URL and check date, and our current prices are indicative (unverified).
import { TOOLS } from "../src/lib/catalog";
import { CATEGORIES } from "../src/data/taxonomy";
import { COMPARISONS } from "../src/data/comparisons";

const q = (v: unknown): string => {
  if (v == null) return "null";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (Array.isArray(v)) return `array[${v.map(q).join(",")}]::text[]`;
  return `'${String(v).replace(/'/g, "''")}'`;
};
const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const out: string[] = ["begin;"];

const companies = [...new Map(TOOLS.map((t) => [slugify(t.vendor), t.vendor])).entries()];
for (const [slug, name] of companies)
  out.push(`insert into companies (name, slug) values (${q(name)}, ${q(slug)}) on conflict (slug) do update set name = excluded.name, updated_at = now();`);

CATEGORIES.forEach((c, i) =>
  out.push(
    `insert into categories (root, slug, name, intro, uk_notes, sort_order) select ${q(c.root)}, ${q(c.slug)}, ${q(c.name)}, ${q(c.intro)}, ${q(c.ukNotes)}, ${i} ` +
      `where not exists (select 1 from categories where root = ${q(c.root)} and slug = ${q(c.slug)} and parent_id is null);`,
  ),
);

const PLATFORM_NAMES: Record<string, string> = { web: "Web", windows: "Windows", mac: "Mac", ios: "iOS", android: "Android", "chrome-extension": "Chrome extension", api: "API", "self-hosted": "Self-hosted" };
for (const [slug, name] of Object.entries(PLATFORM_NAMES))
  out.push(`insert into platforms (slug, name) values (${q(slug)}, ${q(name)}) on conflict (slug) do nothing;`);

// Insert in slug order so identity ids follow slug order (keeps comparisons' a < b check aligned with URLs).
for (const t of [...TOOLS].sort((a, b) => a.slug.localeCompare(b.slug))) {
  const cols = {
    company_id: `(select id from companies where slug = ${q(slugify(t.vendor))})`,
    name: q(t.name),
    slug: q(t.slug),
    status: q("published"),
    short_description: q(t.tagline),
    long_description: q(t.review.join("\n\n")),
    website_url: q(t.website),
    pricing_model: q(t.pricing.freePlan ? "freemium" : t.pricing.trial ? "free_trial" : "paid"),
    free_plan: q(t.pricing.freePlan ? "yes" : "no"),
    api_available: q(t.platforms.includes("api") ? "yes" : "unknown"),
    open_source: t.openSource == null ? "null" : q(t.openSource),
    editorial_score: t.score == null ? "null" : q(t.score),
    editorial_notes: q(t.summary),
    best_for: q([t.bestFor]),
    pros: q(t.pros),
    cons: q(t.cons),
  };
  const keys = Object.keys(cols);
  out.push(
    `insert into products (${keys.join(", ")}) values (${Object.values(cols).join(", ")}) on conflict (slug) do update set ` +
      keys.filter((k) => k !== "slug").map((k) => `${k} = excluded.${k}`).join(", ") + ", updated_at = now();",
  );
  const pid = `(select id from products where slug = ${q(t.slug)})`;
  out.push(`delete from product_categories where product_id = ${pid};`);
  t.categories.forEach((key, i) => {
    const [root, slug] = key.split("/");
    out.push(
      `insert into product_categories (product_id, category_id, is_primary) select ${pid}, id, ${i === 0} from categories where root = ${q(root)} and slug = ${q(slug)} and parent_id is null;`,
    );
  });
  out.push(`delete from product_platforms where product_id = ${pid};`);
  for (const p of t.platforms) out.push(`insert into product_platforms select ${pid}, id from platforms where slug = ${q(p)};`);
  const u = t.uk;
  out.push(
    `insert into uk_checks (product_id, uk_available, gbp_pricing, uk_vat_support, data_residency, mtd, companies_house, uk_support) values ` +
      `(${pid}, ${q(u.available.value)}, ${q(u.gbpPricing.value)}, ${q(u.vatSupport.value)}, ${q(u.dataResidency.value)}, ${q(u.mtd.value)}, ${q(u.companiesHouse.value)}, ${q(u.ukSupport.value)}) ` +
      `on conflict (product_id) do update set uk_available = excluded.uk_available, gbp_pricing = excluded.gbp_pricing, uk_vat_support = excluded.uk_vat_support, ` +
      `data_residency = excluded.data_residency, mtd = excluded.mtd, companies_house = excluded.companies_house, uk_support = excluded.uk_support;`,
  );
}

for (const t of TOOLS)
  for (const alt of t.alternatives)
    out.push(
      `insert into product_relations (from_product_id, to_product_id, relation) select a.id, b.id, 'alternative_of' from products a, products b ` +
        `where a.slug = ${q(t.slug)} and b.slug = ${q(alt)} on conflict do nothing;`,
    );

for (const c of COMPARISONS)
  out.push(
    `insert into comparisons (slug, product_a_id, product_b_id, intro, choose_a_if, choose_b_if, status) ` +
      `select ${q(c.slug)}, least(a.id, b.id), greatest(a.id, b.id), ${q(c.summary)}, ` +
      `case when a.id < b.id then ${q(c.pickA)} else ${q(c.pickB)} end, case when a.id < b.id then ${q(c.pickB)} else ${q(c.pickA)} end, 'published' ` +
      `from products a, products b where a.slug = ${q(c.a)} and b.slug = ${q(c.b)} ` +
      `on conflict (slug) do update set intro = excluded.intro, choose_a_if = excluded.choose_a_if, choose_b_if = excluded.choose_b_if;`,
  );

out.push("commit;");
console.log(out.join("\n"));

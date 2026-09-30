import type { Fact, Tool, UkCheck, VerificationStatus } from "@/lib/types";

// Renders UK suitability facts with their verification status (blueprint §H).
// Nothing is presented as confirmed unless its status says so.

export const STATUS_LABEL: Record<VerificationStatus, string> = {
  official_verified: "Verified (official source)",
  source_verified: "Verified (vendor source)",
  vendor_reported: "Vendor reported",
  community_reported: "Community reported",
  unverified: "Not yet verified",
};

const VALUE_LABEL: Record<string, string> = {
  yes: "Yes", no: "No", limited: "Limited", unknown: "Unknown",
  uk: "UK hosting available", eu: "EU hosting available", us: "US", global: "Global regions", other: "Other / varies",
  compatible: "Listed as compatible", not_compatible: "Not compatible", not_applicable: "Not applicable",
};

export const UK_ROWS: { key: keyof Omit<UkCheck, "ukIntegrations" | "gdprInfoUrl">; label: string }[] = [
  { key: "available", label: "Available in the UK" },
  { key: "gbpPricing", label: "Prices in GBP" },
  { key: "vatSupport", label: "UK VAT support" },
  { key: "mtd", label: "Making Tax Digital" },
  { key: "dataResidency", label: "Data hosting" },
  { key: "companiesHouse", label: "Companies House features" },
  { key: "ukSupport", label: "UK-hours support" },
];

export const factText = (f: Fact<string>) => VALUE_LABEL[f.value] ?? f.value;

export function StatusTag({ status }: { status: VerificationStatus }) {
  const ok = status === "official_verified" || status === "source_verified";
  return (
    <span className={`whitespace-nowrap rounded px-1.5 py-0.5 text-[11px] font-medium ${ok ? "bg-teal/15 text-teal-deep" : "bg-surface-high text-slate-mute"}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function UkPanel({ tool }: { tool: Tool }) {
  const u = tool.uk;
  return (
    <section aria-labelledby="uk-check" className="card p-5">
      <h2 id="uk-check" className="font-serif text-headline-md text-ink">UK suitability check</h2>
      <p className="mt-1 text-body-sm text-slate-mute">
        Each item shows how it was checked. &ldquo;Not yet verified&rdquo; means we have not confirmed it against an official or vendor source — check before
        relying on it.
      </p>
      <dl className="mt-4 divide-y divide-rule">
        {UK_ROWS.map(({ key, label }) => {
          const f = u[key] as Fact<string>;
          return (
            <div key={key} className="grid grid-cols-[1fr_auto] items-start gap-x-3 gap-y-1 py-2.5 sm:grid-cols-[180px_1fr_auto]">
              <dt className="text-body-sm font-semibold text-ink">{label}</dt>
              <dd className="order-3 col-span-2 text-body-sm text-slate-body sm:order-none sm:col-span-1">
                {factText(f)}
                {f.note && <span className="block text-caption text-slate-mute">{f.note}</span>}
                {f.source && (
                  <a href={f.source} className="block text-caption text-brand underline" rel="nofollow noopener" target="_blank">
                    Source{f.checkedAt ? `, checked ${f.checkedAt}` : ""}
                  </a>
                )}
              </dd>
              <dd><StatusTag status={f.status} /></dd>
            </div>
          );
        })}
        {u.ukIntegrations.length > 0 && (
          <div className="py-2.5 sm:grid sm:grid-cols-[180px_1fr] sm:gap-3">
            <dt className="text-body-sm font-semibold text-ink">UK integrations</dt>
            <dd className="text-body-sm text-slate-body">{u.ukIntegrations.join(", ")}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}

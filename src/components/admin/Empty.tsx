export const Empty = ({ children }: { children: React.ReactNode }) => <p className="card p-5 text-body-md text-slate-body">{children}</p>;

export const when = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" }) : "—";

export function Tabs({ base, current, items }: { base: string; current: string; items: readonly (readonly [string, string])[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([key, label]) => (
        <a
          key={key}
          href={`${base}?status=${key}`}
          aria-current={key === current ? "page" : undefined}
          className={`rounded px-3 py-1 text-body-sm ${key === current ? "bg-ink text-white" : "border border-rule text-ink hover:bg-surface-low"}`}
        >
          {label}
        </a>
      ))}
    </div>
  );
}

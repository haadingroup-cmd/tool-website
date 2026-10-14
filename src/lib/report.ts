import "server-only";
import { countRows, selectRows, type Filters } from "./db";
import { esc, send } from "./email";
import { SITE } from "./site";

/**
 * Daily client report: everything that came in through the site during one UK calendar day
 * (new subscribers, enquiries, tool submissions) plus the open backlog, emailed to REPORT_EMAIL.
 */

const TZ = "Europe/London";
const LIST_LIMIT = 50;

type Message = { id: number; name: string; email: string; subject: string; message: string; created_at: string };
type Submission = { id: number; tool_name: string; tool_url: string; category: string; contact_name: string; email: string; uk_pricing: string; created_at: string };

export type DailyReport = {
  date: string; // YYYY-MM-DD (UK)
  from: string; // ISO, inclusive
  to: string; // ISO, exclusive
  subscribers: { new: number; unsubscribed: number; active: number; bySource: Record<string, number> };
  messages: { new: number; unhandled: number; items: Message[] };
  submissions: { new: number; pending: number; items: Submission[] };
};

export const reportRecipients = () =>
  (process.env.REPORT_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** UTC offset of London (in ms) at the given instant, e.g. 3_600_000 during BST. */
function londonOffset(at: Date): number {
  const name = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, timeZoneName: "longOffset" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName")?.value;
  const m = name?.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) * 60_000;
}

/** Today's date in London as YYYY-MM-DD. */
const londonToday = (now = new Date()) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(now);

export const isReportDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

/** The UK day before `now`, as YYYY-MM-DD. */
export function yesterday(now = new Date()): string {
  const d = new Date(`${londonToday(now)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** UTC instants for midnight-to-midnight London time. Clocks change at 01:00 UTC, so midnight's offset is safe. */
export function dayWindow(date: string): { from: Date; to: Date } {
  const start = new Date(`${date}T00:00:00Z`);
  const next = new Date(start);
  next.setUTCDate(next.getUTCDate() + 1);
  return {
    from: new Date(start.getTime() - londonOffset(start)),
    to: new Date(next.getTime() - londonOffset(next)),
  };
}

export async function buildDailyReport(date: string): Promise<DailyReport> {
  const { from, to } = dayWindow(date);
  const inDay = (col: string): Filters => [
    [col, `gte.${from.toISOString()}`],
    [col, `lt.${to.toISOString()}`],
  ];

  const [newSubs, unsubscribed, active, messages, newMessages, unhandled, submissions, newSubmissions, pending] = await Promise.all([
    selectRows<{ source: string }>("subscribers", inDay("created_at"), { select: "source", limit: 5000 }),
    countRows("subscribers", inDay("unsubscribed_at")),
    countRows("subscribers", [["unsubscribed_at", "is.null"]]),
    selectRows<Message>("contact_messages", inDay("created_at"), { select: "id,name,email,subject,message,created_at", limit: LIST_LIMIT }),
    countRows("contact_messages", inDay("created_at")),
    countRows("contact_messages", [["handled", "is.false"]]),
    selectRows<Submission>("tool_submissions", inDay("created_at"), {
      select: "id,tool_name,tool_url,category,contact_name,email,uk_pricing,created_at",
      limit: LIST_LIMIT,
    }),
    countRows("tool_submissions", inDay("created_at")),
    countRows("tool_submissions", [["status", "in.(pending,reviewing)"]]),
  ]);

  const bySource: Record<string, number> = {};
  for (const s of newSubs) bySource[s.source] = (bySource[s.source] ?? 0) + 1;

  return {
    date,
    from: from.toISOString(),
    to: to.toISOString(),
    subscribers: { new: newSubs.length, unsubscribed, active, bySource },
    messages: { new: newMessages, unhandled, items: messages },
    submissions: { new: newSubmissions, pending, items: submissions },
  };
}

/** Counts only — safe to return from the API or log (no personal data). */
export const reportSummary = (r: DailyReport) => ({
  date: r.date,
  subscribers: r.subscribers,
  messages: { new: r.messages.new, unhandled: r.messages.unhandled },
  submissions: { new: r.submissions.new, pending: r.submissions.pending },
});

const prettyDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`),
  );

const time = (iso: string) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(iso));

const excerpt = (s: string, n = 280) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

const more = (shown: number, total: number) => (total > shown ? total - shown : 0);

export function renderReportEmail(r: DailyReport): { subject: string; html: string; text: string } {
  const day = prettyDate(r.date);
  const s = r.subscribers;
  const sources = Object.entries(s.bySource)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} (${v})`)
    .join(", ");

  const subject = `${SITE.shortName} daily report · ${r.date} · ${s.new} subscribers, ${r.messages.new} enquiries, ${r.submissions.new} submissions`;

  const stat = (label: string, value: number, note: string) =>
    `<td style="padding:12px;border:1px solid #E2E8F0;border-radius:6px;width:33%;vertical-align:top"><p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#64748B">${esc(label)}</p><p style="margin:4px 0 2px;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#0F172A">${value}</p><p style="margin:0;font-size:12px;color:#64748B">${esc(note)}</p></td>`;

  const heading = (t: string) =>
    `<p style="font-size:13px;font-weight:bold;letter-spacing:.04em;text-transform:uppercase;color:#0F172A;margin:28px 0 8px">${esc(t)}</p>`;

  const none = (t: string) => `<p style="font-size:14px;color:#64748B;margin:0">${esc(t)}</p>`;

  const overflow = (n: number) => (n ? `<p style="font-size:13px;color:#64748B">…and ${n} more in Supabase.</p>` : "");

  const messagesHtml = r.messages.items.length
    ? r.messages.items
        .map(
          (m) => `<div style="padding:12px 0;border-top:1px solid #E2E8F0"><p style="margin:0;font-size:14px;color:#0F172A"><strong>${esc(m.name)}</strong> &lt;<a href="mailto:${esc(m.email)}" style="color:#2563EB">${esc(m.email)}</a>&gt; · ${esc(m.subject)} · ${time(m.created_at)}</p><p style="margin:6px 0 0;font-size:14px;line-height:21px;color:#45464d;white-space:pre-line">${esc(excerpt(m.message))}</p></div>`,
        )
        .join("") + overflow(more(r.messages.items.length, r.messages.new))
    : none("No new enquiries.");

  const submissionsHtml = r.submissions.items.length
    ? r.submissions.items
        .map(
          (t) => `<div style="padding:12px 0;border-top:1px solid #E2E8F0"><p style="margin:0;font-size:14px;color:#0F172A"><strong><a href="${esc(t.tool_url)}" style="color:#2563EB">${esc(t.tool_name)}</a></strong> · ${esc(t.category)}${t.uk_pricing ? ` · ${esc(t.uk_pricing)}` : ""}</p><p style="margin:4px 0 0;font-size:13px;color:#64748B">From ${esc(t.contact_name)} &lt;${esc(t.email)}&gt; at ${time(t.created_at)}</p></div>`,
        )
        .join("") + overflow(more(r.submissions.items.length, r.submissions.new))
    : none("No new tool submissions.");

  const html = `<!doctype html><html lang="en-GB"><body style="margin:0;background:#f7f9fb;font-family:Arial,Helvetica,sans-serif;color:#191c1e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #E2E8F0;border-radius:8px">
<tr><td style="padding:28px 28px 8px"><p style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#0F172A">SmarterBiz<span style="color:#2563EB">.uk</span></p>
<h1 style="font-family:Georgia,serif;font-size:22px;line-height:28px;color:#0F172A;margin:12px 0 0">Daily report — ${esc(day)}</h1></td></tr>
<tr><td style="padding:16px 28px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="6"><tr>
${stat("New subscribers", s.new, `${s.unsubscribed} unsubscribed · ${s.active} active`)}
${stat("Enquiries", r.messages.new, `${r.messages.unhandled} unhandled in total`)}
${stat("Tool submissions", r.submissions.new, `${r.submissions.pending} awaiting review`)}
</tr></table>${sources ? `<p style="font-size:13px;color:#64748B;margin:8px 6px 0">Sign-up sources: ${esc(sources)}</p>` : ""}</td></tr>
<tr><td style="padding:0 28px">${heading("Enquiries")}${messagesHtml}${heading("Tool submissions")}${submissionsHtml}</td></tr>
<tr><td style="padding:24px 28px 28px;font-size:12px;line-height:18px;color:#64748B">Covers ${esc(day)}, 00:00–24:00 UK time. Mark enquiries handled and update submission status in Supabase so the backlog figures stay accurate. This email contains personal data — please don't forward it outside the team.</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    `${SITE.shortName} daily report — ${day}`,
    "",
    `New subscribers: ${s.new} (unsubscribed ${s.unsubscribed}, active ${s.active})${sources ? ` — sources: ${sources}` : ""}`,
    `Enquiries: ${r.messages.new} (unhandled in total: ${r.messages.unhandled})`,
    `Tool submissions: ${r.submissions.new} (awaiting review: ${r.submissions.pending})`,
    "",
    "ENQUIRIES",
    ...(r.messages.items.length
      ? r.messages.items.map((m) => `- ${m.name} <${m.email}> [${m.subject}] ${time(m.created_at)}\n  ${excerpt(m.message).replace(/\s+/g, " ")}`)
      : ["- None"]),
    "",
    "TOOL SUBMISSIONS",
    ...(r.submissions.items.length
      ? r.submissions.items.map((t) => `- ${t.tool_name} (${t.category}) ${t.tool_url} — from ${t.contact_name} <${t.email}>`)
      : ["- None"]),
  ].join("\n");

  return { subject, html, text };
}

export async function sendDailyReport(r: DailyReport): Promise<boolean> {
  const to = reportRecipients();
  if (!to.length) return false;
  return send({ to, ...renderReportEmail(r) });
}

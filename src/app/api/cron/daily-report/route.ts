import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { json } from "@/lib/security";
import { DbNotConfiguredError } from "@/lib/db";
import { emailConfigured } from "@/lib/email";
import { buildDailyReport, isReportDate, renderReportEmail, reportRecipients, reportSummary, sendDailyReport, yesterday } from "@/lib/report";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Daily client report. Vercel Cron calls this every morning (see vercel.json) with
 * `Authorization: Bearer $CRON_SECRET`. Optional query params for manual runs:
 *   ?date=YYYY-MM-DD  report on a specific UK day (default: yesterday)
 *   ?preview=1        return the email HTML instead of sending it
 */
function authorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return false;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) return json({ ok: false, error: "Unauthorised." }, 401);

  const params = req.nextUrl.searchParams;
  const date = params.get("date") ?? yesterday();
  if (!isReportDate(date)) return json({ ok: false, error: "date must be YYYY-MM-DD." }, 400);

  let report;
  try {
    report = await buildDailyReport(date);
  } catch (err) {
    if (err instanceof DbNotConfiguredError) return json({ ok: false, error: "Database is not configured." }, 503);
    return json({ ok: false, error: "Could not build the report." }, 500);
  }

  if (params.get("preview") === "1") {
    return new Response(renderReportEmail(report).html, {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  if (!emailConfigured() || !reportRecipients().length) {
    console.error("[report] RESEND_API_KEY / EMAIL_FROM / REPORT_EMAIL are not set — report not sent.");
    return json({ ok: false, sent: false, report: reportSummary(report) }, 503);
  }

  const sent = await sendDailyReport(report);
  return json({ ok: sent, sent, report: reportSummary(report) }, sent ? 200 : 502);
}

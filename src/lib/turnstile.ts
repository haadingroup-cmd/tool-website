import "server-only";

/**
 * Cloudflare Turnstile check. Optional: when TURNSTILE_SECRET_KEY is not set every request passes,
 * so forms keep working before the keys are added (honeypot, timing and rate limits still apply).
 */
export const turnstileConfigured = () => Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!turnstileConfigured()) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY!, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // Fail closed: if Cloudflare can't be reached we can't tell a person from a bot.
    console.error("[turnstile] verification request failed");
    return false;
  }
}

export const CAPTCHA_ERROR = "Please complete the security check and try again.";

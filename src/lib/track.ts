"use client";

/** Fire-and-forget first-party event (see /api/v1/events). Never throws. */
export function track(name: string, data: { slug?: string; props?: Record<string, string | number | boolean> } = {}) {
  try {
    void fetch("/api/v1/events/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, path: location.pathname, ...data }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* ignore */
  }
}

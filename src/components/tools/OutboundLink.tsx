"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/track";

/** Vendor link that records an official-site click (affiliate clicks are logged by /go/). */
export function OutboundLink({ href, rel, slug, className, label, children }: { href: string; rel: string; slug: string; className?: string; label?: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={className}
      aria-label={label}
      onClick={() => { if (!href.startsWith("/go/")) track("official_site_click", { slug }); }}
    >
      {children}
    </a>
  );
}

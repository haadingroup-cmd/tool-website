import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

// 301 map, shared with scripts/check-content.ts (which checks every destination exists).
const REDIRECTS = JSON.parse(readFileSync(new URL("./src/data/redirects.json", import.meta.url), "utf8"));

/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// Strict CSP: everything is self-hosted (fonts via next/font, local SVG graphics, no third-party scripts).
// 'unsafe-inline' for scripts is required by Next.js' inline hydration payload on statically generated pages;
// all other vectors (object, base, framing, form targets) are locked down.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  // Pin the file-tracing root to this project (avoids picking up lockfiles in parent folders).
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/(llms.txt|llms-full.txt)",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
    ];
  },
  async redirects() {
    // Match both /old and /old/ so legacy URLs reach their destination in a single 301 hop.
    return REDIRECTS.flatMap((r) => [
      { ...r, permanent: true },
      { ...r, source: `${r.source.replace(/\/$/, "")}/`, permanent: true },
    ]);
  },
};

export default nextConfig;

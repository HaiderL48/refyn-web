/** Public marketing site configuration (safe for client and SEO). */

export const siteConfig = {
  name: "RefynAI",
  shortDescription:
    "RefynAI refines AI prompts instantly with a global shortcut—better answers, fewer tokens, works in any app.",
  description:
    "RefynAI is desktop software that rewrites vague prompts into clear, specific AI instructions. Use your own API key (BYOK) or cloud plans. Works on Windows, macOS, and Linux.",
  keywords: [
    "RefynAI",
    "AI prompt enhancer",
    "prompt refinement",
    "ChatGPT prompts",
    "BYOK OpenAI",
    "desktop AI tool",
    "global shortcut",
    "prompt optimizer",
  ],
  locale: "en_US",
  twitterHandle: undefined as string | undefined,
} as const;

/** Canonical site URL for sitemap, Open Graph, and metadata (no trailing slash). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const publicRoutes = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.4 },
  { path: "/refund", changeFrequency: "yearly" as const, priority: 0.4 },
];

import type { MetadataRoute } from "next";

// Serves /robots.txt. Everything is public and every crawler is welcome —
// including the AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-
// Extended, …), which the wildcard covers. Being readable by answer engines
// is the point: the site sells AEO.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://marked-digital.com/sitemap.xml",
  };
}

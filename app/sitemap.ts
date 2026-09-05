import type { MetadataRoute } from "next";

import { JOURNAL_ENTRIES } from "@/lib/journal";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Journal detail pages are real content pages and belong in the index.
  const journalRoutes = JOURNAL_ENTRIES.map((entry) => ({
    url: absoluteUrl(`/journal/${entry.slug}`),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...journalRoutes];
}

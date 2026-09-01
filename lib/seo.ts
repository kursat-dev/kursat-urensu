import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

interface BuildMetadataInput {
  title: string;
  description: string;
  /** Route path, e.g. "/projects". Used for the canonical and OG url. */
  path: string;
  /** Skip the layout's "%s — Name" title template (used by the home route). */
  absoluteTitle?: boolean;
}

/**
 * Per-route metadata: canonical URL, Open Graph and Twitter cards.
 * Titles flow through the template defined in the root layout.
 */
export function buildMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: absoluteTitle ? title : `${title} — ${siteConfig.name}`,
      description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1134,
          height: 2016,
          alt: `${siteConfig.name} portresi`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} — ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

import { absoluteUrl, sameAs, schemaIds, siteConfig } from "@/lib/site";

import JsonLd from "./JsonLd";

/**
 * Site-wide identity graph, rendered on every page.
 *
 * Two nodes with stable @ids so the rest of the site can reference them:
 *   WebSite (#website) --publisher/author--> Person (#person)
 *
 * Every value is taken from content already published on the site; nothing is
 * inferred. `sameAs` carries only the three profiles the site actually links to.
 */
export default function SiteJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": schemaIds.website,
        url: `${siteConfig.url}/`,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.locale.replace("_", "-"),
        publisher: { "@id": schemaIds.person },
        author: { "@id": schemaIds.person },
        about: { "@id": schemaIds.person },
      },
      {
        "@type": "Person",
        "@id": schemaIds.person,
        name: siteConfig.name,
        url: `${siteConfig.url}/`,
        mainEntityOfPage: { "@id": schemaIds.website },
        jobTitle: "Software Developer",
        description: siteConfig.description,
        image: absoluteUrl(siteConfig.ogImage),
        address: {
          "@type": "PostalAddress",
          addressLocality: "Trabzon",
          addressCountry: "TR",
        },
        worksFor: { "@type": "Organization", name: "DentalPrices" },
        knowsAbout: ["Web ürünleri", "Platform geliştirme", "Kullanıcı araştırması"],
        sameAs,
      },
    ],
  };

  return <JsonLd data={graph} />;
}

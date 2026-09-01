import { sameAs, siteConfig } from "@/lib/site";

/**
 * schema.org Person for the primary identity page.
 * Only facts already published on the site are included.
 */
export default function PersonJsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    jobTitle: "Software Developer",
    description: siteConfig.description,
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  );
}

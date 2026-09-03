import { absoluteUrl, schemaIds, siteConfig } from "@/lib/site";

import JsonLd from "./JsonLd";

/**
 * /about is the canonical answer to "Kürşat Ürensü kimdir?", so it is marked as
 * a ProfilePage whose mainEntity is the Person node declared site-wide.
 * Referencing #person by @id keeps it one entity rather than a duplicate.
 */
export default function ProfilePageJsonLd({ description }: { description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${absoluteUrl("/about")}#webpage`,
    url: absoluteUrl("/about"),
    name: `${siteConfig.name} kimdir?`,
    description,
    inLanguage: siteConfig.locale.replace("_", "-"),
    isPartOf: { "@id": schemaIds.website },
    mainEntity: { "@id": schemaIds.person },
    about: { "@id": schemaIds.person },
  };

  return <JsonLd data={data} />;
}

import { JOURNAL_ENTRIES } from "@/lib/journal";
import { absoluteUrl, schemaIds, siteConfig } from "@/lib/site";

import JsonLd from "./JsonLd";

/** /journal as a CollectionPage listing the entries, tied to the Person node. */
export default function JournalListJsonLd({ description }: { description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/journal")}#webpage`,
    url: absoluteUrl("/journal"),
    name: `Journal — ${siteConfig.name}`,
    description,
    inLanguage: siteConfig.locale.replace("_", "-"),
    isPartOf: { "@id": schemaIds.website },
    about: { "@id": schemaIds.person },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: JOURNAL_ENTRIES.length,
      itemListElement: JOURNAL_ENTRIES.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/journal/${entry.slug}`),
        name: entry.title,
      })),
    },
  };

  return <JsonLd data={data} />;
}

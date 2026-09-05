import { entryImages, type JournalEntry } from "@/lib/journal";
import { absoluteUrl, schemaIds, siteConfig } from "@/lib/site";

import JsonLd from "./JsonLd";

/**
 * A journal entry as schema.org Article, authored by the site-wide Person node.
 *
 * Article rather than BlogPosting or NewsArticle: these are archival notes
 * about real events, not a blog feed or news reporting.
 *
 * `datePublished` is emitted only when a real date exists — several entries
 * have no known date and inventing one would be worse than omitting it.
 * Images are absolute URLs so Google Images can resolve them.
 */
export default function JournalJsonLd({ entry }: { entry: JournalEntry }) {
  const url = absoluteUrl(`/journal/${entry.slug}`);

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: entry.title,
    description: entry.description ?? entry.excerpt,
    inLanguage: siteConfig.locale.replace("_", "-"),
    isPartOf: { "@id": schemaIds.website },
    author: { "@id": schemaIds.person },
    creator: { "@id": schemaIds.person },
    publisher: { "@id": schemaIds.person },
    about: { "@id": schemaIds.person },
    articleSection: entry.category,
    image: entryImages(entry).map((image) => absoluteUrl(image.src)),
    ...(entry.date ? { datePublished: entry.date } : {}),
  };

  return <JsonLd data={data} />;
}

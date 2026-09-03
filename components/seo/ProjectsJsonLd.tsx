import { PROJECTS } from "@/lib/projects";
import { absoluteUrl, schemaIds, siteConfig } from "@/lib/site";

import JsonLd from "./JsonLd";

/**
 * /projects as a CollectionPage holding an ItemList of the real projects, each
 * authored by the site-wide Person node — that is the link that lets a crawler
 * attribute these projects to Kürşat Ürensü.
 *
 * CreativeWork (not SoftwareApplication) on purpose: the site publishes no
 * applicationCategory, operating system, demo URL or repository for these, and
 * claiming a type whose required properties are unknown would be wrong.
 * `url` is emitted only for the project that actually has a detail page.
 */
export default function ProjectsJsonLd({ description }: { description: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/projects")}#webpage`,
    url: absoluteUrl("/projects"),
    name: `Projeler — ${siteConfig.name}`,
    description,
    inLanguage: siteConfig.locale.replace("_", "-"),
    isPartOf: { "@id": schemaIds.website },
    about: { "@id": schemaIds.person },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          creator: { "@id": schemaIds.person },
          author: { "@id": schemaIds.person },
          dateCreated: project.year,
          creativeWorkStatus: project.status,
          ...(project.path ? { url: absoluteUrl(project.path) } : {}),
        },
      })),
    },
  };

  return <JsonLd data={data} />;
}

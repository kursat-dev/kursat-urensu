import { PROJECTS } from "@/lib/projects";
import { absoluteUrl, schemaIds, siteConfig } from "@/lib/site";

import JsonLd from "./JsonLd";
import { projectNode } from "./projectNode";

/**
 * /projects as a CollectionPage holding an ItemList of the real projects.
 * Each item carries its own live URL and case study, and is tied to the
 * site-wide Person node — that link is what lets a crawler attribute the work.
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
        item: projectNode(project),
      })),
    },
  };

  return <JsonLd data={data} />;
}

import type { ProjectEntity } from "@/lib/projects";
import { absoluteUrl, schemaIds, siteConfig } from "@/lib/site";

import JsonLd from "./JsonLd";

/** A single project detail page, attributed to the site-wide Person node. */
export default function CreativeWorkJsonLd({ project }: { project: ProjectEntity }) {
  const url = absoluteUrl(project.path ?? "/projects");

  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    url,
    name: project.name,
    description: project.description,
    creator: { "@id": schemaIds.person },
    author: { "@id": schemaIds.person },
    dateCreated: project.year,
    creativeWorkStatus: project.status,
    inLanguage: siteConfig.locale.replace("_", "-"),
    isPartOf: { "@id": schemaIds.website },
  };

  return <JsonLd data={data} />;
}

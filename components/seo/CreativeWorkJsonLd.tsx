import type { ProjectEntity } from "@/lib/projects";
import { absoluteUrl, schemaIds, siteConfig } from "@/lib/site";

import JsonLd from "./JsonLd";
import { projectNode } from "./projectNode";

/** A single project detail page, tied to the site-wide Person node. */
export default function CreativeWorkJsonLd({ project }: { project: ProjectEntity }) {
  const pageUrl = absoluteUrl(project.path ?? "/projects");

  const data = {
    "@context": "https://schema.org",
    ...projectNode(project),
    "@id": `${pageUrl}#project`,
    inLanguage: siteConfig.locale.replace("_", "-"),
    isPartOf: { "@id": schemaIds.website },
  };

  return <JsonLd data={data} />;
}

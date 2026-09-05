import type { ProjectEntity } from "@/lib/projects";
import { absoluteUrl, schemaIds } from "@/lib/site";

/**
 * One project as a schema.org CreativeWork.
 *
 * CreativeWork rather than SoftwareApplication: the site publishes no
 * applicationCategory or operating system, and none of these is a finished
 * production application — claiming a type whose required properties are
 * unknown would misrepresent them.
 *
 * `creator`/`author` is used only where Kürşat Ürensü actually built the work.
 * For products owned by someone else he is a `contributor`.
 *
 * `url`  -> the project's own live site
 * `mainEntityOfPage` -> the page about it on this site
 * `subjectOf` -> the written case study (a document about the work, which is
 *                why it is not `sameAs` or a code repository property)
 */
export function projectNode(project: ProjectEntity) {
  const person = { "@id": schemaIds.person };

  return {
    "@type": "CreativeWork",
    name: project.name,
    description: project.description,
    creativeWorkStatus: project.status,
    dateCreated: project.year,
    ...(project.authorship === "creator"
      ? { creator: person, author: person }
      : { contributor: person }),
    ...(project.websiteUrl ? { url: project.websiteUrl } : {}),
    ...(project.path ? { mainEntityOfPage: absoluteUrl(project.path) } : {}),
    ...(project.caseStudyUrl
      ? {
          subjectOf: {
            "@type": "CreativeWork",
            name: `${project.name} — case study`,
            url: project.caseStudyUrl,
          },
        }
      : {}),
  };
}

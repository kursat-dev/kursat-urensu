import ProjectsContent from "@/components/pages/ProjectsContent";
import ProjectsJsonLd from "@/components/seo/ProjectsJsonLd";
import { buildMetadata } from "@/lib/seo";

const description =
  "YÖN, ZMovie ve ZMeet — Kürşat Ürensü'nün geliştirdiği ürünler ve DentalPrices'taki profesyonel geliştirici deneyimi.";

export const metadata = buildMetadata({
  title: "Projeler",
  description,
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <ProjectsJsonLd description={description} />
      <ProjectsContent />
    </>
  );
}

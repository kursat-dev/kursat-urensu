import ProjectsContent from "@/components/pages/ProjectsContent";
import ProjectsJsonLd from "@/components/seo/ProjectsJsonLd";
import { buildMetadata } from "@/lib/seo";

const description =
  "YÖN, ZMovie, ZMeet, ZConnect ve DentalPrices — Kürşat Ürensü'nün kurduğu ve geliştirdiği ürünler, rolleri ve her birinden çıkan sonuçlar.";

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

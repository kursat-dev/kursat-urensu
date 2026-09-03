import YonProjectContent from "@/components/pages/YonProjectContent";
import CreativeWorkJsonLd from "@/components/seo/CreativeWorkJsonLd";
import { PROJECTS } from "@/lib/projects";
import { buildMetadata } from "@/lib/seo";

const yon = PROJECTS.find((project) => project.path === "/projects/yon");

export const metadata = buildMetadata({
  title: "YÖN",
  description:
    "YÖN — girişimcilerin girişimlerini değerlendirdiği, geliştirdiği ve birbirine bağlandığı " +
    "girişimcilik platformu. Kürşat Ürensü'nün kurucu ve geliştirici olarak yürüttüğü proje.",
  path: "/projects/yon",
});

export default function YonProjectPage() {
  return (
    <>
      {yon ? <CreativeWorkJsonLd project={yon} /> : null}
      <YonProjectContent />
    </>
  );
}

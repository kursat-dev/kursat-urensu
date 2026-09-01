import ProjectsContent from "@/components/pages/ProjectsContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projeler",
  description: "Beş ürün, iki yıl. Her biri bir öncekinin bıraktığı soruyla başladı.",
  path: "/projects",
});

export default function ProjectsPage() {
  return <ProjectsContent />;
}

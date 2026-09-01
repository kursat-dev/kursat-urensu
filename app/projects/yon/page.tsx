import YonProjectContent from "@/components/pages/YonProjectContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "YÖN",
  description:
    "Girişimcilerin girişimlerini değerlendirdiği, geliştirdiği ve birbirine bağlandığı girişimcilik platformu.",
  path: "/projects/yon",
});

export default function YonProjectPage() {
  return <YonProjectContent />;
}

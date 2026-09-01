import WritingContent from "@/components/pages/WritingContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Yazılar",
  description:
    "Ürün geliştirirken öğrendiklerimi yazıyorum. Aşağıdaki başlıklar planlanan ilk yazılar.",
  path: "/writing",
});

export default function WritingPage() {
  return <WritingContent />;
}

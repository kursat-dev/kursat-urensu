import AchievementsContent from "@/components/pages/AchievementsContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Başarılar",
  description:
    "Proof of work: hackathon dereceleri, konuşmalar ve topluluk etkinliklerinden oluşan katılım geçmişi.",
  path: "/achievements",
});

export default function AchievementsPage() {
  return <AchievementsContent />;
}

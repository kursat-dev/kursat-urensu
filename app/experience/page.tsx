import ExperienceContent from "@/components/pages/ExperienceContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Deneyim",
  description:
    "Gerçek ürün, gerçek ekip: DentalPrices ekosisteminde geliştirici olarak çalışıyorum; " +
    "YÖN ve ZMovie'de araştırma, tasarım ve geliştirme süreçlerini yürütüyorum.",
  path: "/experience",
});

export default function ExperiencePage() {
  return <ExperienceContent />;
}

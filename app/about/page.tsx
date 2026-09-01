import AboutContent from "@/components/pages/AboutContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Hakkında",
  description:
    "Yazılım geliştirmeye ürün tarafından bakarak başladım. Bir şeyi kodlamadan önce neden var " +
    "olması gerektiğini, kimin kullanacağını ve gerçekten bir problemi çözüp çözmediğini anlamaya çalışıyorum.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}

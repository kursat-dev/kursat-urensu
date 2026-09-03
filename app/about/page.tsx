import AboutContent from "@/components/pages/AboutContent";
import ProfilePageJsonLd from "@/components/seo/ProfilePageJsonLd";
import { buildMetadata } from "@/lib/seo";

const description =
  "Kürşat Ürensü, Trabzon merkezli bir yazılım geliştirici ve girişimci. DentalPrices'ta Jr. Developer olarak çalışıyor; YÖN ve ZMovie'yi geliştiriyor.";

export const metadata = buildMetadata({
  title: "Kürşat Ürensü kimdir? — Software Developer · Entrepreneur",
  description,
  path: "/about",
  absoluteTitle: true,
});

export default function AboutPage() {
  return (
    <>
      <ProfilePageJsonLd description={description} />
      <AboutContent />
    </>
  );
}

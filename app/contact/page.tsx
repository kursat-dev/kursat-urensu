import ContactContent from "@/components/pages/ContactContent";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "İletişim",
  description: "Proje, işbirliği veya sadece fikir konuşmak için yazabilirsiniz.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactContent />;
}

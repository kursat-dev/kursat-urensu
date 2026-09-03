/**
 * Project entities for structured data.
 *
 * Every field mirrors copy that is already visible on /projects — nothing here
 * is inferred. If the visible project copy changes, update this file too.
 *
 * `url` is intentionally absent for projects without a public page: no demo or
 * repository links exist on the site yet, and guessing them would be wrong.
 */
export interface ProjectEntity {
  name: string;
  description: string;
  /** Kürşat Ürensü's role, exactly as shown on the page. */
  role: string;
  /** Status badge shown on the card. */
  status: string;
  year: string;
  /** Detail route on this site, when one exists. */
  path?: string;
}

export const PROJECTS: readonly ProjectEntity[] = [
  {
    name: "YÖN",
    description:
      "Girişimcilerin girişimlerini değerlendirmelerine, geliştirmelerine, bilgi edinmelerine ve " +
      "diğer girişimcilerle network kurmalarına yardımcı olan platform.",
    role: "Founder · Developer",
    status: "Building",
    year: "2026",
    path: "/projects/yon",
  },
  {
    name: "ZMovie",
    description:
      "Film festivalleri, film içerikleri, çekim kayıtları, galeriler ve jüri değerlendirme " +
      "süreçleri gibi alanlarda kullanılmak üzere geliştirilen platform.",
    role: "Developer",
    status: "In Development",
    year: "2026",
  },
  {
    name: "ZMeet",
    description:
      "ZConnect fikrinin ardından geliştirilen sanal toplantı ve görüşme platformu.",
    role: "Founder · Developer",
    status: "Eski proje",
    year: "2025",
  },
  {
    name: "ZConnect",
    description:
      "Instagram'ın Türkiye'de erişime kapatılması sonrasında iletişim altyapısına alternatif " +
      "oluşturma fikrinden doğan konsept.",
    role: "Konsept · Araştırma",
    status: "Yolculuğu başlatan fikir",
    year: "2024",
  },
  {
    name: "DentalPrices",
    description:
      "Klinikler ve hastaları bir araya getiren DentalPrices ekosisteminde geliştirici deneyimi.",
    role: "Jr. Developer",
    status: "Active",
    year: "2025",
  },
];

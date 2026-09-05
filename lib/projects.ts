/**
 * Project entities: the single source of truth for both the visible project
 * cards (injected by .design-src/generate.py) and the structured data.
 *
 * Every field mirrors something publicly verifiable. Statuses describe the real
 * maturity of each project — none of these is a finished production product,
 * and the wording deliberately avoids implying otherwise.
 *
 * `caseStudyUrl` is a written case study, NOT product source code, so it is
 * labelled "Case study" everywhere rather than "GitHub" or "Source".
 *
 * DentalPrices has no repository field on purpose: the repo is private under a
 * business account and must never be linked.
 */
export interface ProjectEntity {
  name: string;
  description: string;
  /** Kürşat Ürensü's role, exactly as shown on the card. */
  role: string;
  /** Maturity label shown on the card. */
  status: string;
  year: string;
  /** Public, working URL for the project itself. */
  websiteUrl?: string;
  /** Written case study (not source code). */
  caseStudyUrl?: string;
  /** Detail route on this site, when one exists. */
  path?: string;
  /**
   * How Kürşat Ürensü relates to the work. "creator" for projects he built;
   * "contributor" for products owned by someone else that he worked on —
   * claiming authorship of those would be false.
   */
  authorship: "creator" | "contributor";
}

export const PROJECTS: readonly ProjectEntity[] = [
  {
    name: "YÖN",
    authorship: "creator",
    description:
      "Girişimcilerin girişimlerini değerlendirmelerine, geliştirmelerine, bilgi edinmelerine ve " +
      "diğer girişimcilerle network kurmalarına yardımcı olan platform.",
    role: "Founder · Developer",
    // Not a working production product — a demo shown in investment presentations.
    status: "Concept · Investment Demo",
    year: "2026",
    websiteUrl: "https://yon-dev.vercel.app/",
    caseStudyUrl: "https://github.com/kursat-dev/case-study-yon",
    path: "/projects/yon",
  },
  {
    name: "ZMovie",
    authorship: "creator",
    description:
      "Film festivalleri, film içerikleri, çekim kayıtları, galeriler ve jüri değerlendirme " +
      "süreçleri gibi alanlarda kullanılmak üzere geliştirilen platform.",
    role: "Developer",
    status: "In Development",
    year: "2026",
    websiteUrl: "http://zmovie-omega.vercel.app/",
    caseStudyUrl: "https://github.com/kursat-dev/case-study-zmovie",
  },
  {
    name: "ZMeet",
    authorship: "creator",
    description:
      "ZConnect fikrinin ardından geliştirilen sanal toplantı ve görüşme platformu.",
    role: "Founder · Developer",
    // Site is live (landing + meeting room); not a finished production product.
    status: "Live",
    year: "2025",
    websiteUrl: "https://zmeet.com.tr",
    caseStudyUrl: "https://github.com/kursat-dev/case-study-zmeet",
  },
  {
    name: "DentalPrices",
    authorship: "contributor",
    description:
      "Klinikler ve hastaları bir araya getiren DentalPrices ekosisteminde geliştirici deneyimi.",
    role: "Jr. Developer",
    // Professional work on someone else's product, not a project of his own.
    status: "Professional Experience",
    year: "2025",
    websiteUrl: "https://www.dentalprices.com/tr",
    // No repository: private, business-owned. Never link it.
  },
];

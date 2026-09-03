/** Single source of truth for identity, canonical URLs and social profiles. */

export const siteConfig = {
  name: "Kürşat Ürensü",
  role: "Software Developer · Entrepreneur · Product Builder",
  description:
    "Fikirleri araştırıyor, ürünlere dönüştürüyor ve gerçek dünyada test ediyorum. " +
    "Yazılım geliştiriyor, ürün kuruyor ve gerçek problemleri çözen işler çıkarıyorum.",
  lang: "tr",
  locale: "tr_TR",
  /**
   * Canonical origin. NEXT_PUBLIC_SITE_URL overrides it (set that when a custom
   * domain replaces the Vercel one); the default is the live deployment so
   * canonicals, OG urls and the sitemap are correct even if the env var is missing.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kursat-urensu.vercel.app").replace(/\/$/, ""),
  ogImage: "/assets/kursat.jpeg",
  social: {
    github: "https://github.com/kursat-dev",
    githubUsername: "kursat-dev",
    linkedin: "https://linkedin.com/in/kursat-urensu",
    instagram: "https://instagram.com/kursat.dev",
    email: "urensukursat@gmail.com",
  },
} as const;

/** Verified profiles, used for schema.org `sameAs`. */
export const sameAs: readonly string[] = [
  siteConfig.social.github,
  siteConfig.social.linkedin,
  siteConfig.social.instagram,
];

/** Stable schema.org node ids, so every page points at the same entities. */
export const schemaIds = {
  person: `${siteConfig.url}/#person`,
  website: `${siteConfig.url}/#website`,
} as const;

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

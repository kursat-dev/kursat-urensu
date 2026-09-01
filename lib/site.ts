/** Single source of truth for identity, canonical URLs and social profiles. */

export const siteConfig = {
  name: "Kürşat Ürensü",
  role: "Software Developer · Entrepreneur · Product Builder",
  description:
    "Fikirleri araştırıyor, ürünlere dönüştürüyor ve gerçek dünyada test ediyorum. " +
    "Yazılım geliştiriyor, ürün kuruyor ve gerçek problemleri çözen işler çıkarıyorum.",
  lang: "tr",
  locale: "tr_TR",
  /** Set NEXT_PUBLIC_SITE_URL in production — canonicals and the sitemap depend on it. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
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

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Every indexable route, shared by the sitemap and by route tests. */
export const ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects/yon", priority: 0.7, changeFrequency: "monthly" },
  { path: "/experience", priority: 0.8, changeFrequency: "monthly" },
  { path: "/achievements", priority: 0.7, changeFrequency: "monthly" },
  { path: "/journal", priority: 0.8, changeFrequency: "weekly" },
  { path: "/writing", priority: 0.6, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
] as const;

export type AppRoute = (typeof ROUTES)[number]["path"];

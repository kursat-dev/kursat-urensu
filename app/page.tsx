import PersonJsonLd from "@/components/PersonJsonLd";
import GitHubPanel from "@/components/github/GitHubPanel";
import HomeGoals from "@/components/pages/HomeGoals";
import HomeIntro from "@/components/pages/HomeIntro";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <PersonJsonLd />
      <HomeIntro />
      <GitHubPanel />
      <HomeGoals />
    </>
  );
}

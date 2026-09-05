import GitHubPanel from "@/components/github/GitHubPanel";
import JournalRail from "@/components/journal/JournalRail";
import HomeGoals from "@/components/pages/HomeGoals";
import HomeIntro from "@/components/pages/HomeIntro";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description:
    "Kürşat Ürensü — Trabzon merkezli software developer, entrepreneur ve product builder. " +
    "YÖN, ZMovie, ZMeet ve ZConnect projelerini geliştirdi.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <GitHubPanel />
      <HomeGoals />
      <JournalRail />
    </>
  );
}

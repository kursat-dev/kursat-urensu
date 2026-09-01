import { getContributionGraph, getFeaturedRepos } from "@/lib/github";
import { siteConfig } from "@/lib/site";

import ContributionGrid from "./ContributionGrid";

/**
 * "Kod" section on the home page. A server component: the GitHub data layer is
 * awaited during rendering, so no credentials or fetching reach the browser.
 */
export default async function GitHubPanel() {
  const [graph, repos] = await Promise.all([getContributionGraph(), getFeaturedRepos()]);
  const isPlaceholder = graph.source === "placeholder";

  return (
    <section style={{ borderBottom: "2px solid var(--color-divider)" }} aria-labelledby="github-heading">
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(56px,8vw,104px) clamp(20px,5vw,56px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "16px", marginBottom: "clamp(24px,3vw,40px)" }}>
          <h2 id="github-heading" style={{ fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-0.03em", margin: "0" }}>Kod</h2>
          <a href={siteConfig.social.github} style={{ fontSize: "14px", fontFamily: "var(--font-heading)", fontWeight: "800" }} rel="me noopener noreferrer">github.com/{siteConfig.social.githubUsername} →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "2px", background: "var(--color-divider)", border: "2px solid var(--color-divider)" }}>
          <div style={{ background: "var(--color-bg)", padding: "clamp(20px,2.5vw,28px)" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-700)", margin: "0 0 14px" }}>Katkı grafiği · son 6 ay</p>
            <ContributionGrid cells={graph.cells} />
            {isPlaceholder ? (
              <p style={{ fontSize: "12px", color: "var(--color-neutral-700)", margin: "14px 0 0" }}>Gerçek veri GitHub API ile bağlanacak.</p>
            ) : (
              <p style={{ fontSize: "12px", color: "var(--color-neutral-700)", margin: "14px 0 0" }}>{graph.totalContributions} katkı · son 6 ay</p>
            )}
          </div>
          <div style={{ background: "var(--color-bg)", padding: "clamp(20px,2.5vw,28px)", display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-neutral-700)", margin: "0" }}>Öne çıkan repolar</p>
            {repos.map((repo, index) => (
              <div
                key={repo.name}
                style={
                  index === repos.length - 1
                    ? { display: "flex", justifyContent: "space-between", gap: "12px" }
                    : { display: "flex", justifyContent: "space-between", gap: "12px", paddingBottom: "12px", borderBottom: "1px solid var(--color-divider)" }
                }
              >
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: "800", fontSize: "15px" }}>{repo.name}</span>
                <span style={{ fontSize: "12px", color: "var(--color-neutral-700)" }}>{repo.language ?? "—"} · ★ {repo.stars ?? "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

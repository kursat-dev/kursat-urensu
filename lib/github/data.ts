import "server-only";

import { siteConfig } from "@/lib/site";

import { githubGraphQL, githubRest, hasGitHubToken } from "./client";
import { CONTRIBUTION_CELL_COUNT, FEATURED_REPOS, GITHUB_LOGIN } from "./config";
import {
  CONTRIBUTIONS_QUERY,
  type ContributionsQueryResult,
  type GitHubContributionLevel,
  type RepoResponse,
} from "./queries";
import type { ContributionCell, ContributionGraph, ContributionLevel, RepoSummary } from "./types";

/**
 * Data layer for the GitHub panel.
 *
 * Both readers hit the real API and degrade to the design's placeholder set
 * whenever that is not possible, so the section always renders:
 *
 *  - repositories  REST, works with or without a token (60 req/h unauthenticated)
 *  - contributions GraphQL, which GitHub only serves to authenticated callers,
 *                  so without GITHUB_TOKEN this stays on the placeholder graph
 */

export { CONTRIBUTION_CELL_COUNT };

const LEVEL_BY_NAME: Record<GitHubContributionLevel, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function warn(scope: string, error: unknown): void {
  // Server-side only; the panel still renders via the placeholder fallback.
  console.warn(`[github] ${scope} unavailable, using placeholder:`, error);
}

/* ── contributions ───────────────────────────────────────────────────────── */

/**
 * The design's seeded pseudo-random calendar, reproduced exactly.
 *
 * The multiplication intentionally exceeds Number.MAX_SAFE_INTEGER — the
 * imprecision is part of the sequence, so the rendered pattern stays identical
 * to the approved design. Do not "fix" this arithmetic.
 */
function placeholderContributionCells(): ContributionCell[] {
  const cells: ContributionCell[] = [];
  let seed = 7;

  for (let index = 0; index < CONTRIBUTION_CELL_COUNT; index += 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const r = seed / 2147483648;
    const level: ContributionLevel = r < 0.34 ? 0 : r < 0.58 ? 1 : r < 0.78 ? 2 : r < 0.93 ? 3 : 4;
    cells.push({ index, level });
  }

  return cells;
}

function placeholderGraph(): ContributionGraph {
  return {
    cells: placeholderContributionCells(),
    totalContributions: null,
    source: "placeholder",
  };
}

export async function getContributionGraph(): Promise<ContributionGraph> {
  // GitHub exposes the contribution calendar through GraphQL only, and GraphQL
  // rejects unauthenticated requests outright.
  if (!hasGitHubToken()) return placeholderGraph();

  try {
    const data = await githubGraphQL<ContributionsQueryResult>(CONTRIBUTIONS_QUERY, {
      login: GITHUB_LOGIN,
    });

    const calendar = data.user?.contributionsCollection.contributionCalendar;
    if (!calendar) throw new Error(`no contribution calendar for "${GITHUB_LOGIN}"`);

    const days = calendar.weeks.flatMap((week) => week.contributionDays);
    // The grid is 26 columns x 7 rows by design — roughly six months — so show
    // the most recent 182 days of the 12 months GitHub returns.
    const recent = days.slice(-CONTRIBUTION_CELL_COUNT);
    if (recent.length < CONTRIBUTION_CELL_COUNT) {
      throw new Error(`expected ${CONTRIBUTION_CELL_COUNT} days, received ${recent.length}`);
    }

    // The caption reads "son 6 ay", so total the window actually on screen
    // rather than GitHub's 12-month calendar total.
    const totalContributions = recent.reduce((sum, day) => sum + day.contributionCount, 0);

    return {
      cells: recent.map((day, index) => ({
        index,
        level: LEVEL_BY_NAME[day.contributionLevel] ?? 0,
        date: day.date,
        count: day.contributionCount,
      })),
      totalContributions,
      source: "api",
    };
  } catch (error) {
    warn("contribution calendar", error);
    return placeholderGraph();
  }
}

/* ── repositories ────────────────────────────────────────────────────────── */

const PLACEHOLDER_REPOS: readonly Omit<RepoSummary, "url" | "source">[] = [
  { name: "yon-platform", description: null, language: "TypeScript", stars: null },
  { name: "zmeet", description: null, language: "JavaScript", stars: null },
  { name: "zmovie", description: null, language: "TypeScript", stars: null },
  { name: "zconnect-archive", description: null, language: "JavaScript", stars: null },
];

function placeholderRepos(): RepoSummary[] {
  return PLACEHOLDER_REPOS.map((repo) => ({
    ...repo,
    url: `${siteConfig.social.github}/${repo.name}`,
    source: "placeholder" as const,
  }));
}

/** "name" resolves against GITHUB_LOGIN; "owner/name" is used verbatim. */
function toPath(slug: string): string {
  return slug.includes("/") ? slug : `${GITHUB_LOGIN}/${slug}`;
}

export async function getFeaturedRepos(): Promise<RepoSummary[]> {
  if (FEATURED_REPOS.length === 0) return placeholderRepos();

  // Fetched individually so the configured order is preserved and a single
  // missing or renamed repository cannot take the whole panel down.
  const results = await Promise.allSettled(
    FEATURED_REPOS.map((slug) => githubRest<RepoResponse>(`/repos/${toPath(slug)}`)),
  );

  const repos: RepoSummary[] = [];
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      warn(`repository "${FEATURED_REPOS[index]}"`, result.reason);
      return;
    }
    repos.push({
      name: result.value.name,
      url: result.value.html_url,
      description: result.value.description,
      language: result.value.language,
      stars: result.value.stargazers_count,
      source: "api",
    });
  });

  return repos.length > 0 ? repos : placeholderRepos();
}

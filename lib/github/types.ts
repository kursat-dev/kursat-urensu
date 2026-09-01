/** Shared shapes for the GitHub layer. Safe to import from client or server. */

/** GitHub's five contribution intensity buckets. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionCell {
  /** Sequential index in the rendered grid (0-based). */
  index: number;
  level: ContributionLevel;
  /** ISO date, once the real API is wired up. */
  date?: string;
  count?: number;
}

export interface ContributionGraph {
  cells: ContributionCell[];
  totalContributions: number | null;
  /** Where the data came from — lets the UI label placeholder data honestly. */
  source: "placeholder" | "api";
}

export interface RepoSummary {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number | null;
  source: "placeholder" | "api";
}

export interface GitHubProfile {
  login: string;
  url: string;
}

import { siteConfig } from "@/lib/site";

/** The account all GitHub data is read from. Single source of truth. */
export const GITHUB_LOGIN = siteConfig.social.githubUsername;

/**
 * Repositories shown in the "Öne çıkan repolar" panel, in display order.
 *
 * This is the only place to edit when you want different repositories: a bare
 * name resolves against GITHUB_LOGIN, and "owner/name" points at any other
 * account. Names are matched exactly as GitHub spells them.
 *
 * Anything listed here that cannot be fetched is skipped; if none resolve, the
 * panel falls back to PLACEHOLDER_REPOS so the section never renders empty.
 */
export const FEATURED_REPOS: readonly string[] = [
  "case-study-yon",
  "case-study-zmeet",
  "case-study-zmovie",
  "Universal-Authentication-Backend",
];

/** Cells in the contribution grid — 26 columns x 7 rows, fixed by the design. */
export const CONTRIBUTION_CELL_COUNT = 182;

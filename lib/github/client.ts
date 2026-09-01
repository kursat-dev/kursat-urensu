import "server-only";

/**
 * Server-only GitHub transport.
 *
 * The token is read from `GITHUB_TOKEN` and never leaves the server: this
 * module imports `server-only`, so any accidental client import fails the
 * build rather than shipping the credential to the browser.
 */

const GITHUB_API = "https://api.github.com";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

/** Cache window for GitHub responses, in seconds. */
export const GITHUB_REVALIDATE_SECONDS = 60 * 60;

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

export function hasGitHubToken(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

function anonymousHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    ...anonymousHeaders(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * GET against the GitHub REST API.
 *
 * Repository data is public, so this works with or without a token (60 req/h
 * unauthenticated, 5000 with one). An expired or malformed token makes GitHub
 * reject the request outright rather than treating it as anonymous, which
 * would be worse than sending no token at all — so on 401 we retry once
 * without credentials and keep serving public data.
 */
export async function githubRest<T>(path: string): Promise<T> {
  const request = (headers: HeadersInit) =>
    fetch(`${GITHUB_API}${path}`, {
      headers,
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });

  let response = await request(authHeaders());

  if (response.status === 401 && hasGitHubToken()) {
    console.warn(`[github] token rejected for ${path}; retrying anonymously`);
    response = await request(anonymousHeaders());
  }

  if (!response.ok) {
    throw new GitHubError(`GitHub REST ${path} failed: ${response.statusText}`, response.status);
  }

  return (await response.json()) as T;
}

/** POST against the GitHub GraphQL API (needed for the contribution calendar). */
export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  if (!hasGitHubToken()) {
    throw new GitHubError("GITHUB_TOKEN is required for the GraphQL API");
  }

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: GITHUB_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new GitHubError(`GitHub GraphQL failed: ${response.statusText}`, response.status);
  }

  const payload = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (payload.errors?.length) {
    throw new GitHubError(payload.errors.map((e) => e.message).join("; "));
  }
  if (!payload.data) {
    throw new GitHubError("GitHub GraphQL returned no data");
  }

  return payload.data;
}

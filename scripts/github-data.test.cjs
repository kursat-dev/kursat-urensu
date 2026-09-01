/**
 * Data-layer tests for lib/github: the token path, the anonymous path and
 * every fallback, exercised against a stubbed fetch so no real token or
 * network access is needed.
 *
 *   npm run test:github
 */
const path = require("node:path");
const Module = require("node:module");

const ROOT = path.resolve(__dirname, "..");
const BUILD = path.join(ROOT, ".github-test-build");

// the compiled tree mirrors the project, so resolve the "@/" alias onto it
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) request = path.join(BUILD, request.slice(2));
  // `server-only` throws unless the react-server condition is active
  if (request === "server-only") request = path.join(ROOT, "node_modules/server-only/empty.js");
  return resolveFilename.call(this, request, ...rest);
};

const DATA = path.join(BUILD, "lib/github/data.js");
const CONFIG = path.join(BUILD, "lib/github/config.js");
const CLIENT = path.join(BUILD, "lib/github/client.js");
const LEVELS = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];
const LEVEL_VALUE = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

function calendar() {
  const weeks = [];
  let n = 0;
  for (let w = 0; w < 53; w += 1) {
    const contributionDays = [];
    for (let d = 0; d < 7; d += 1, n += 1) {
      contributionDays.push({
        date: new Date(Date.UTC(2025, 8, 1) + n * 86400000).toISOString().slice(0, 10),
        contributionCount: n % 11,
        contributionLevel: LEVELS[n % 5],
      });
    }
    weeks.push({ contributionDays });
  }
  return { totalContributions: 1234, weeks };
}

const json = (body) => ({ ok: true, status: 200, statusText: "OK", json: async () => body });
const fail = (status, statusText = "Error") => ({ ok: false, status, statusText, json: async () => ({}) });

function mockFetch({ graphql, rest }) {
  globalThis.fetch = async (url, init) =>
    String(url).includes("/graphql") ? graphql(String(url), init) : rest(String(url), init);
}

function reload() {
  delete require.cache[DATA];
  delete require.cache[CLIENT];
  return require(DATA);
}

let passed = 0;
const failures = [];
function check(label, cond, detail) {
  if (cond) { passed += 1; console.log(`  ok    ${label}`); }
  else { failures.push(label); console.log(`  FAIL  ${label}${detail ? `  -> ${detail}` : ""}`); }
}

// keep the fallback warnings from drowning the report
const realWarn = console.warn;
console.warn = () => {};

(async () => {
  console.log("\n[1] contributions — token present");
  process.env.GITHUB_TOKEN = "ghp_fake_token_for_testing";
  let gh = reload();
  const cal = calendar();
  let auth = null, body = null;
  mockFetch({
    graphql: (_u, init) => { auth = init.headers.Authorization; body = JSON.parse(init.body);
      return json({ data: { user: { contributionsCollection: { contributionCalendar: cal } } } }); },
    rest: () => fail(404, "Not Found"),
  });
  const g = await gh.getContributionGraph();
  const expected = cal.weeks.flatMap((w) => w.contributionDays).slice(-182);
  check("source is 'api'", g.source === "api", g.source);
  check("renders exactly 182 cells", g.cells.length === 182, String(g.cells.length));
  const windowTotal = expected.reduce((sum, d) => sum + d.contributionCount, 0);
  check("total covers the displayed 182-day window, not 12 months",
        g.totalContributions === windowTotal && g.totalContributions !== 1234,
        `${g.totalContributions} vs ${windowTotal}`);
  check("Authorization header is sent", auth === "Bearer ghp_fake_token_for_testing");
  check("query is parameterised by login", body.variables.login === "kursat-dev");
  check("window is the most recent 182 days", g.cells[0].date === expected[0].date && g.cells[181].date === expected[181].date);
  check("levels map onto the design's 0-4 ramp", g.cells.every((c, i) => c.level === LEVEL_VALUE[expected[i].contributionLevel]));
  check("daily counts carried through", g.cells.every((c, i) => c.count === expected[i].contributionCount));

  console.log("\n[2] contributions — API failing");
  mockFetch({ graphql: () => { throw new Error("network down"); }, rest: () => fail(500) });
  const gf = await gh.getContributionGraph();
  let seed = 7; const want = [];
  for (let i = 0; i < 182; i += 1) { seed = (seed * 1103515245 + 12345) % 2147483648; const r = seed / 2147483648;
    want.push(r < 0.34 ? 0 : r < 0.58 ? 1 : r < 0.78 ? 2 : r < 0.93 ? 3 : 4); }
  check("falls back to placeholder", gf.source === "placeholder");
  check("still 182 cells", gf.cells.length === 182);
  check("total is null on fallback", gf.totalContributions === null);
  check("placeholder still matches the approved design pattern", gf.cells.every((c, i) => c.level === want[i]));

  console.log("\n[3] contributions — no token");
  delete process.env.GITHUB_TOKEN;
  gh = reload();
  let graphqlCalled = false;
  mockFetch({ graphql: () => { graphqlCalled = true; return fail(401, "Unauthorized"); }, rest: () => fail(404) });
  const gn = await gh.getContributionGraph();
  check("falls back to placeholder", gn.source === "placeholder");
  check("GraphQL is not called at all without a token", graphqlCalled === false);

  console.log("\n[4] featured repositories — config order, one missing");
  const seen = [];
  mockFetch({
    graphql: () => fail(401),
    rest: (u) => {
      seen.push(u.replace("https://api.github.com", ""));
      const name = u.split("/").pop();
      if (name === "case-study-zmeet") return fail(404, "Not Found");
      return json({ name, full_name: `kursat-dev/${name}`, html_url: `https://github.com/kursat-dev/${name}`,
                    description: "d", language: "TypeScript", stargazers_count: 7 });
    },
  });
  const { FEATURED_REPOS } = require(CONFIG);
  const survivors = FEATURED_REPOS.filter((n) => n !== "case-study-zmeet");
  const repos = await gh.getFeaturedRepos();
  check("skips the repository that 404s", repos.length === survivors.length,
        `${repos.length} vs ${survivors.length}`);
  check("preserves the configured order",
        repos.map((r) => r.name).join(",") === survivors.join(","),
        repos.map((r) => r.name).join(","));
  check("tagged as live api data", repos.every((r) => r.source === "api"));
  check("language and stars carried through", repos[0].stars === 7 && repos[0].language === "TypeScript");
  check("requests stay scoped to the configured account", seen.every((p) => p.startsWith("/repos/kursat-dev/")));
  check("requests exactly the configured repositories, in order",
        seen.join(",") === FEATURED_REPOS.map((n) => `/repos/kursat-dev/${n}`).join(","), seen.join(","));

  console.log("\n[5] featured repositories — rejected token retries anonymously");
  process.env.GITHUB_TOKEN = "ghp_expired";
  gh = reload();
  const attempts = [];
  mockFetch({
    graphql: () => fail(401, "Unauthorized"),
    rest: (u, init) => {
      const authed = Boolean(init.headers.Authorization);
      attempts.push(authed);
      if (authed) return fail(401, "Unauthorized");
      const name = u.split("/").pop();
      return json({ name, full_name: `kursat-dev/${name}`, html_url: `https://github.com/kursat-dev/${name}`,
                    description: null, language: null, stargazers_count: 0 });
    },
  });
  const retried = await gh.getFeaturedRepos();
  check("still returns live public data",
        retried.length === FEATURED_REPOS.length && retried.every((r) => r.source === "api"),
        `${retried.length} vs ${FEATURED_REPOS.length}`);
  check("retried without the Authorization header", attempts.includes(false));

  console.log("\n[6] featured repositories — everything failing");
  mockFetch({ graphql: () => fail(401), rest: () => { throw new Error("network down"); } });
  const rf = await gh.getFeaturedRepos();
  check("falls back to the design's placeholder repos", rf.every((r) => r.source === "placeholder"));
  check("placeholder keeps the design's four rows", rf.length === 4, String(rf.length));
  check("placeholder stars stay null so the UI shows an em dash", rf.every((r) => r.stars === null));

  console.warn = realWarn;
  console.log(`\n${passed} passed, ${failures.length} failed`);
  if (failures.length) { failures.forEach((f) => console.log(`  - ${f}`)); process.exit(1); }
})();

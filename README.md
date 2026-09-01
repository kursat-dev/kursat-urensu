# Kürşat Ürensü — Portfolyo

Next.js (App Router) + TypeScript portfolio. The UI is an exact port of the
Claude Design project `Kursat Urensu Portfolio.dc.html`.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
npm run typecheck            # tsc --noEmit
npm run lint                 # eslint
```

## Environment

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — canonical origin. **Required in production**;
  canonical tags, Open Graph URLs, `sitemap.xml` and `robots.txt` derive from it.
  Falls back to `http://localhost:3000`.
- `GITHUB_TOKEN` — **optional**, server-only. Without it the site still builds
  and shows live repositories from the public API; the contribution grid falls
  back to the design's placeholder pattern, because GitHub only serves the
  contribution calendar over GraphQL and GraphQL requires authentication.
  Never prefix with `NEXT_PUBLIC_`.

## Design fidelity

`components/pages/*.tsx` are **generated** from the original design markup by
`.design-src/generate.py` — do not hand-edit them. To re-import after a design
change, replace `.design-src/index.html` and run:

```bash
python3 .design-src/generate.py
```

Inline styles and copy are carried over verbatim; the generator only rewrites
tags, routes links and shifts heading levels.

## Styling

- `styles/modernist.css` — the design system (tokens + component classes).
- `app/globals.css` — imports Tailwind (**without Preflight**, so it cannot
  reset the design) plus the design's page-level rules.
- Tailwind utilities lose to the design system's unlayered rules; use the `!`
  modifier when they collide.

## GitHub integration

`lib/github/` reads live data on the server, cached for 1 hour
(`GITHUB_REVALIDATE_SECONDS`), and degrades to the design's placeholder set
whenever the API is unreachable — the section never renders empty.

| file | role |
| --- | --- |
| `config.ts` | **edit this** — which repositories are featured, and in what order |
| `client.ts` | REST + GraphQL transports, `server-only`, auth headers, revalidation |
| `queries.ts` | GraphQL documents and response types |
| `data.ts` | maps API responses onto the UI's types, owns every fallback |

To change the featured repositories, edit `FEATURED_REPOS` in
`lib/github/config.ts`. A bare name resolves against `GITHUB_LOGIN`; use
`"owner/name"` for any other account. Entries that cannot be fetched are
skipped, and if none resolve the panel falls back to the placeholder list.

A rejected token (expired or malformed) makes GitHub reject REST calls that
would have succeeded anonymously, so `githubRest` retries once without
credentials and keeps serving public data.

```bash
npm run test:github   # token path, anonymous path and every fallback (stubbed fetch)
```

# Smart Calculator Tools

Modern calculator library built with Next.js App Router.

The project serves focused calculators across:
- Financial
- Fitness & Health
- Math
- Other utilities
- Crypto
- AI

Production domain: `https://smartcalculatortools.net`

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

Run quality checks:

```bash
npm run lint
npm test
```

## Environment variables

Create `.env.local` and set the values you need:

```env
NEXT_PUBLIC_SITE_URL=https://smartcalculatortools.net
NEXT_PUBLIC_CONTACT_EMAIL=support@smartcalculatortools.net
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_ADSENSE_CLIENT=
NEXT_PUBLIC_ADSENSE_SLOT_HOME=
NEXT_PUBLIC_ADSENSE_SLOT_CALC=
```

Optional deployment tokens used in local automation:

```env
VERCEL_TOKEN=
GITHUB_TOKEN=
CLOUDFLARE_API_TOKEN=
```

## Project notes

- SEO metadata, canonical URLs, sitemap, and robots are generated from `src/lib/site.ts`.
- Google Analytics is optional and disabled when `NEXT_PUBLIC_GA_ID` is missing.
- AdSense placements fail open and render placeholders when ad variables are missing.
- Personalized recommendations use browser-local usage signals only after analytics consent is granted.
- `/ads.txt` is generated from `NEXT_PUBLIC_ADSENSE_CLIENT` when configured.
- For EEA/UK/Switzerland ad traffic, a Google-certified CMP is still required at the account level.

## Publish

Production publish checklist and monetization setup steps are documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Main scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the built app
- `npm run lint` — ESLint checks
- `npm test` — Vitest suite
- `npm run perf:local` — local performance check script


# CodePrompt Blog

A production-ready Next.js blogging website for `blogs.codeprompt.in`.

## Core capabilities

- AI-assisted blog generation from live trending topics
- MDX-first article generation and rendering for better content structure
- Automated publishing to PostgreSQL (Neon)
- Full blog website routes (`/`, `/blogs`, `/blogs/[slug]`, `/about`, `/contact`)
- SEO foundations:
  - Canonical metadata + OpenGraph + Twitter cards
  - JSON-LD (`Organization`, `WebSite`, `BlogPosting`, `ItemList`)
  - `sitemap.xml`, `robots.txt`, `feed.xml`, `llms.txt`
- Scheduled generation endpoint (3 runs/day via Vercel cron)

## Public routes

- `/` Home
- `/blogs` Blog archive
- `/blogs/[slug]` Blog article
- `/about` About page
- `/contact` Contact page
- `/feed.xml` RSS feed
- `/llms.txt` AI crawler discovery document
- `/sitemap.xml` XML sitemap
- `/robots.txt` Robots policy

## Automation route

- `GET /api/automation/generate-post`
- `POST /api/automation/generate-post`

This route:

1. Fetches trending topics
2. Selects the best non-recent topic
3. Generates article content with Gemini
4. Saves the post to PostgreSQL
5. Makes it instantly visible on `/` and `/blogs`

## Required environment variables

- `GEMINI_API_KEY`
- `DATABASE_URL`
- `CRON_SECRET` (recommended for endpoint protection)

Optional:

- `GEMINI_MODEL` (default: `gemini-flash-lite-latest`)
- `TRENDING_RSS_URL`

## Local development

```bash
npm install
npm run dev
```

## Trigger one post manually

```bash
curl -X GET http://localhost:3000/api/automation/generate-post \
  -H "Authorization: Bearer $CRON_SECRET"
```

## Vercel cron schedule

Configured in `vercel.json`:

- `03:00 UTC`
- `11:00 UTC`
- `19:00 UTC`

## Contact

- `info@codeprompt.in`
- `contact@codeprompt.in`

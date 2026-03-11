import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedPostsSafe } from "@/lib/blogs";
import { extractKeywordCandidates } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await listPublishedPostsSafe(80);
  const blogKeywords = extractKeywordCandidates(posts, 50);

  return {
    title: "System Design",
    description: `Complete architecture and implementation flow to build a blog automation platform like ${SITE_NAME}.`,
    keywords: [
      ...blogKeywords,
      "blog automation architecture",
      "system design for AI blogs",
      "MDX publishing pipeline",
      "cron blog generation",
      "nextjs blog architecture",
    ],
    alternates: {
      canonical: "/system-design",
    },
  };
}

const architectureNodes = [
  {
    title: "1. Trend Ingestion",
    body: "Pull trending topics from market/news feeds and normalize topic candidates.",
  },
  {
    title: "2. Topic Selection",
    body: "Remove recently used topics and choose the highest novelty + relevance topic.",
  },
  {
    title: "3. Gemini MDX Generation",
    body: "Generate structured MDX content with consistent sections and SEO-friendly formatting.",
  },
  {
    title: "4. Content Persistence",
    body: "Store slug, topic, excerpt, MDX body, timestamps, and source topics in PostgreSQL.",
  },
  {
    title: "5. SEO Distribution",
    body: "Expose posts through HTML pages, metadata, sitemap, RSS, robots, and llms.txt.",
  },
  {
    title: "6. Scheduled Publishing",
    body: "Run generation endpoint 3x daily via cron for steady content freshness.",
  },
] as const;

const replicationSteps = [
  "Create a Next.js app with App Router and server-side routes.",
  "Create `blog_posts` table in PostgreSQL with slug + published_at indexes.",
  "Add a trend fetcher service (RSS or API provider).",
  "Generate MDX article JSON with Gemini and validate required fields.",
  "Insert article into DB with unique slug generation.",
  "Render archive (`/blogs`) and detail (`/blogs/[slug]`) pages from DB.",
  "Add metadata, JSON-LD, sitemap, RSS, and llms.txt endpoints.",
  "Secure cron endpoint with `CRON_SECRET` and schedule 3 runs daily.",
] as const;

export default function SystemDesignPage() {
  return (
    <div className="space-y-7 pb-8">
      <section className="surface animate-fade-up p-5 sm:p-7 md:p-10">
        <p className="accent-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
          Build Guide
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
          Complete System Design for This Blog Platform
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-[var(--muted)] sm:text-[15px] md:text-lg">
          This page documents the exact architecture and implementation flow used on this website. You can follow it to
          build the same automated MDX blog engine in your own project.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {architectureNodes.map((node, index) => (
          <article
            key={node.title}
            className={`surface interactive-card animate-fade-up p-5 sm:p-6 ${
              index % 3 === 0 ? "delay-1" : index % 3 === 1 ? "delay-2" : "delay-3"
            }`}
          >
            <h2 className="font-display text-xl font-semibold text-white">{node.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{node.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-12">
        <article className="surface animate-fade-up delay-1 overflow-hidden lg:col-span-7">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#060f21] px-4 py-2 text-xs text-[#9fb5d9]">
            <span className="font-mono">flow://runtime/publish</span>
            <span className="font-mono">sequence</span>
          </div>
          <div className="space-y-2 p-4 font-mono text-xs text-[#93c5fd] sm:text-sm">
            <p>
              <span className="text-[var(--accent)]">1.</span> cron -&gt; /api/automation/generate-post
            </p>
            <p>
              <span className="text-[var(--accent)]">2.</span> fetchTrendingTopics() -&gt; [topics]
            </p>
            <p>
              <span className="text-[var(--accent)]">3.</span> selectTopic(topics, recentTopics)
            </p>
            <p>
              <span className="text-[var(--accent)]">4.</span> generateBlogDraftWithGemini(topic) -&gt; title/excerpt/contentMdx
            </p>
            <p>
              <span className="text-[var(--accent)]">5.</span> ensureUniqueSlug(title)
            </p>
            <p>
              <span className="text-[var(--accent)]">6.</span> insertBlogPost(...) -&gt; PostgreSQL
            </p>
            <p>
              <span className="text-[var(--accent)]">7.</span> /blogs and /blogs/[slug] instantly reflect new post
            </p>
          </div>
        </article>

        <article className="surface animate-fade-up delay-2 p-5 sm:p-6 lg:col-span-5">
          <h2 className="font-display text-2xl font-semibold text-white">Database Contract</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            The core storage model is intentionally simple to keep publishing fast and query-friendly.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-[#284470] bg-[#060f21] p-4 text-xs text-[#93c5fd]">
{`CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  topic TEXT NOT NULL,
  source_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`}
          </pre>
        </article>
      </section>

      <section className="surface animate-fade-up delay-2 p-5 sm:p-7 md:p-8">
        <h2 className="font-display text-2xl font-semibold text-white">Replication Steps</h2>
        <ol className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
          {replicationSteps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#2f4873] bg-[#08172f] text-[11px] text-[#93c5fd]">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="surface animate-fade-up delay-3 p-5 sm:p-7 md:p-8">
        <h2 className="font-display text-2xl font-semibold text-white">Ops Checklist</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#284470] bg-[#060f21] p-4 text-sm text-[var(--muted)]">
            <p className="font-semibold text-white">Environment</p>
            <p className="mt-2">Set `GEMINI_API_KEY`, `DATABASE_URL`, `CRON_SECRET`, and `GEMINI_MODEL`.</p>
          </div>
          <div className="rounded-xl border border-[#284470] bg-[#060f21] p-4 text-sm text-[var(--muted)]">
            <p className="font-semibold text-white">Scheduling</p>
            <p className="mt-2">Configure Vercel cron jobs for three daily publish windows.</p>
          </div>
          <div className="rounded-xl border border-[#284470] bg-[#060f21] p-4 text-sm text-[var(--muted)]">
            <p className="font-semibold text-white">SEO</p>
            <p className="mt-2">Keep sitemap, feed.xml, llms.txt, and article schema continuously updated.</p>
          </div>
          <div className="rounded-xl border border-[#284470] bg-[#060f21] p-4 text-sm text-[var(--muted)]">
            <p className="font-semibold text-white">Quality</p>
            <p className="mt-2">Run periodic prompt tuning for better topic relevance and structure quality.</p>
          </div>
        </div>
      </section>

      <section className="surface animate-fade-up delay-3 p-5 text-center sm:p-7">
        <p className="text-sm text-[var(--muted)]">Want to extend this architecture with moderation, search, or multilingual publishing?</p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[#02121f] transition hover:brightness-110"
        >
          Contact the Team
        </Link>
      </section>
    </div>
  );
}

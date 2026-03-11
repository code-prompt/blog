import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedPosts } from "@/lib/blogs";
import { extractKeywordCandidates } from "@/lib/seo";
import { SITE_DESCRIPTION } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await listPublishedPosts(120);
  const blogKeywords = extractKeywordCandidates(posts, 80);

  return {
    title: "Blogs",
    description: `Browse the latest market trend articles on ${SITE_DESCRIPTION}`,
    keywords: [...blogKeywords, "developer blog archive", "market trends blog", "AI business signals"],
    alternates: {
      canonical: "/blogs",
    },
  };
}

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function BlogsPage() {
  const posts = await listPublishedPosts(36);

  const categories = [
    "All",
    ...new Set(posts.map((post) => post.topic).filter((topic) => topic.trim().length > 0)),
  ].slice(0, 12);

  return (
    <div className="space-y-7 pb-8">
      <section className="surface animate-fade-up p-5 sm:p-7 md:p-10">
        <p className="accent-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">Blog Archive</p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
          Discover market trends, business shifts, and AI insights
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-[15px] md:text-lg">
          This archive is refreshed three times daily. Each post is generated from live trend signals and published as
          a fully readable long-form article.
        </p>
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
          {categories.map((category, index) => (
            <span
              key={category}
              className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                index === 0
                  ? "border-[rgba(34,211,238,0.4)] bg-[var(--accent-soft)] text-white"
                  : "border-white/10 bg-white/5 text-[var(--muted)]"
              }`}
            >
              {category}
            </span>
          ))}
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="surface animate-fade-up delay-1 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-white">No articles yet</h2>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Your automation job is configured. Once the first post is generated, the archive will appear here.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <Link key={post.slug} href={`/blogs/${post.slug}`} className="interactive-link group block">
              <article
                className={`surface interactive-card animate-fade-up p-5 sm:p-6 ${
                  index % 3 === 0 ? "delay-1" : index % 3 === 1 ? "delay-2" : "delay-3"
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[var(--muted)]">{post.topic}</span>
                  <span className="text-[var(--subtle)]">{formatDate(post.publishedAt)}</span>
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold leading-7 text-white transition group-hover:text-[var(--accent)]">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--subtle)]">Market Analysis</p>
                  <span className="text-sm font-semibold text-[var(--accent)] transition group-hover:text-[#67e8f9]">Read Article</span>
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedPosts } from "@/lib/blogs";
import { extractKeywordCandidates } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const posts = await listPublishedPosts(60);
  const blogKeywords = extractKeywordCandidates(posts, 40);

  return {
    title: "Home",
    description: SITE_DESCRIPTION,
    keywords: [...blogKeywords, "developer market intelligence", "AI trend analysis", "coding business insights"],
    alternates: {
      canonical: "/",
    },
  };
}

function formatPublishedAt(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function HomePage() {
  const posts = await listPublishedPosts(12);
  const featuredPost = posts[0] ?? null;
  const latestPosts = posts.slice(1, 7);
  const topicChips = [...new Set(posts.map((post) => post.topic))].slice(0, 8);

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest blog posts",
    itemListElement: posts.slice(0, 10).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/blogs/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div className="space-y-6 pb-8 md:space-y-7">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }} />

      <section className="surface animate-fade-up relative overflow-hidden p-5 sm:p-6 md:p-12">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(10,13,18,0.94) 0%, rgba(10,13,18,0.7) 45%, rgba(10,13,18,0.15) 100%), url('https://www.figma.com/api/mcp/asset/d3490ff2-de49-4b7a-bf75-50e018312bef')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-3xl space-y-5 md:space-y-6">
          <span className="accent-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.16em]">
            <span className="pulse-dot size-2 rounded-full bg-[var(--accent)]" />
            Trending market blogs updated 3x daily
          </span>

          <h1 className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-6xl">
            Real-time market stories for founders, builders, and analysts.
          </h1>

          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base md:text-xl md:leading-8">
            {SITE_NAME} publishes structured trend analysis by combining live market signals with AI-assisted editorial
            drafting. Every post is searchable, shareable, and optimized for modern discovery.
          </p>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:pt-2">
            <Link
              href="/blogs"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3 text-sm font-semibold text-white shadow-[0_20px_30px_-18px_rgba(34,211,238,0.8)] transition hover:brightness-110 sm:w-auto"
            >
              Explore Latest Blogs
            </Link>
            <Link
              href="/about"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              About This Publication
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-12">
        <article className="surface interactive-card animate-fade-up delay-1 overflow-hidden md:col-span-8">
          <div className="flex items-center justify-between border-b border-white/10 bg-[#060f21] px-4 py-2 text-xs text-[#9fb5d9]">
            <span className="font-mono">terminal://codeprompt/blog-engine</span>
            <span className="font-mono">status: running</span>
          </div>
          <div className="space-y-2 p-4 font-mono text-xs text-[#93c5fd] sm:text-sm">
            <p>
              <span className="text-[var(--accent)]">$</span> fetch trending-topics --source market-feeds
            </p>
            <p>
              <span className="text-[var(--accent)]">$</span> generate blog --format mdx --quality high
            </p>
            <p>
              <span className="text-[var(--accent)]">$</span> publish --target /blogs --schedule 3x-daily
            </p>
            <p className="pt-1 text-[#7f96b8]">note: optimized for developer readability + search visibility</p>
          </div>
        </article>

        <article className="surface interactive-card animate-fade-up delay-2 p-5 md:col-span-4 sm:p-6">
          <h3 className="font-display text-lg font-semibold text-white">Indexing Signals</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>- Structured data + article schema</li>
            <li>- Sitemap + RSS + llms.txt</li>
            <li>- Keyword-rich titles and topic tags</li>
            <li>- Crawlable blog URL architecture</li>
          </ul>
          <Link href="/system-design" className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] hover:text-[#67e8f9]">
            View full architecture →
          </Link>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-12">
        <article className="surface grid-fade animate-fade-up delay-1 relative overflow-hidden p-5 sm:p-7 lg:col-span-8">
          {featuredPost ? (
            <Link href={`/blogs/${featuredPost.slug}`} className="interactive-link group block">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em]">
                  <span className="rounded bg-[var(--accent-soft)] px-2 py-1 text-[var(--accent)]">Featured Story</span>
                  <span className="rounded bg-[#1d3a61] px-2 py-1 text-[#8db7e8]">{featuredPost.topic}</span>
                </div>
                <h2 className="max-w-2xl font-display text-2xl font-semibold leading-tight text-white transition group-hover:text-[var(--accent)] sm:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">{featuredPost.excerpt}</p>
                <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--subtle)]">
                    Published {formatPublishedAt(featuredPost.publishedAt)}
                  </p>
                  <span className="text-sm font-semibold text-[var(--accent)] transition group-hover:text-[#67e8f9]">
                    Read Full Story →
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="space-y-5">
              <h2 className="font-display text-3xl font-semibold text-white">First articles are on the way</h2>
              <p className="max-w-xl text-[15px] leading-7 text-[var(--muted)]">
                Your automated pipeline is active. Once new posts are published, this featured block will update
                automatically.
              </p>
            </div>
          )}
        </article>

        <aside className="space-y-5 lg:col-span-4">
          <div className="surface interactive-card animate-fade-up delay-2 p-5 sm:p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {(topicChips.length > 0 ? topicChips : ["AI Markets", "Startup Trends", "Business Intelligence"]).map(
                (topic) => (
                  <span
                    key={topic}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[var(--muted)]"
                  >
                    #{topic.replace(/\s+/g, "")}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="surface interactive-card animate-fade-up delay-3 p-5 sm:p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">Contact Editorial Team</h3>
            <p className="text-sm leading-7 text-[var(--muted)]">
              Story ideas, partnerships, and corrections can be shared directly with our editorial inbox.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="mailto:info@codeprompt.in" className="block text-[var(--accent)] hover:text-[#67e8f9]">
                info@codeprompt.in
              </a>
              <a href="mailto:contact@codeprompt.in" className="block text-[var(--accent)] hover:text-[#67e8f9]">
                contact@codeprompt.in
              </a>
            </div>
          </div>
        </aside>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl md:text-3xl">Latest from CodePrompt Blog</h2>
          <Link href="/blogs" className="text-sm font-semibold text-[var(--accent)] hover:text-[#67e8f9]">
            View all posts
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {latestPosts.map((post, index) => (
              <Link key={post.slug} href={`/blogs/${post.slug}`} className="interactive-link group block">
                <article
                  className={`surface interactive-card animate-fade-up p-5 sm:p-6 ${
                    index % 3 === 0 ? "delay-1" : index % 3 === 1 ? "delay-2" : "delay-3"
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--subtle)]">{post.topic}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-7 text-white transition group-hover:text-[var(--accent)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-[var(--subtle)]">
                    <span>{formatPublishedAt(post.publishedAt)}</span>
                    <span className="text-sm font-semibold text-[var(--accent)] transition group-hover:text-[#67e8f9]">Read →</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="surface p-8 text-center text-sm text-[var(--muted)]">No posts published yet.</div>
        )}
      </section>
    </div>
  );
}

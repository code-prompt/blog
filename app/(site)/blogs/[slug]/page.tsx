import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/app/components/mdx-components";
import { getPublishedPostBySlug } from "@/lib/blogs";
import { postKeywords } from "@/lib/seo";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: postKeywords(post),
    alternates: {
      canonical: `/blogs/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blogs/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: post.topic,
    inLanguage: "en",
    url: `${SITE_URL}/blogs/${post.slug}`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <article className="surface mx-auto max-w-4xl animate-fade-up p-5 sm:p-7 md:p-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <p className="accent-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">{post.topic}</p>
      <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">{post.title}</h1>
      <p className="mt-4 text-base leading-8 text-[var(--muted)] md:text-lg">{post.excerpt}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--subtle)]">Published {formatDate(post.publishedAt)}</p>

      <div className="mt-8 border-t border-white/10 pt-4">
        <MDXRemote source={post.contentMdx} components={mdxComponents} />
      </div>

      <div className="mt-12 border-t border-white/10 pt-6">
        <Link href="/blogs" className="text-sm font-semibold text-[var(--accent)] transition hover:text-[#67e8f9]">
          ← Back to all blogs
        </Link>
      </div>
    </article>
  );
}

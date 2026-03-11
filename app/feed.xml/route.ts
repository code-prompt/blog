import { listPublishedPosts } from "@/lib/blogs";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await listPublishedPosts(100);

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blogs/${post.slug}`;

      return `
        <item>
          <title>${xmlEscape(post.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
          <description>${xmlEscape(post.excerpt)}</description>
          <category>${xmlEscape(post.topic)}</category>
        </item>
      `;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>${xmlEscape(SITE_NAME)}</title>
        <link>${SITE_URL}</link>
        <description>${xmlEscape(SITE_DESCRIPTION)}</description>
        <language>en-us</language>
        ${items}
      </channel>
    </rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}

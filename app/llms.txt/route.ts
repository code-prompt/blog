import { listPublishedPosts } from "@/lib/blogs";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await listPublishedPosts(30);

  const lines = [
    `# ${SITE_NAME}`,
    "",
    SITE_DESCRIPTION,
    "",
    "## Primary URLs",
    `${SITE_URL}/`,
    `${SITE_URL}/blogs`,
    `${SITE_URL}/system-design`,
    `${SITE_URL}/about`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/feed.xml`,
    `${SITE_URL}/sitemap.xml`,
    "",
    "## Recent articles",
    ...posts.map((post) => `- ${post.title}: ${SITE_URL}/blogs/${post.slug}`),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}

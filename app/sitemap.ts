import type { MetadataRoute } from "next";
import { listPublishedPosts } from "@/lib/blogs";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/system-design`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let postRoutes: MetadataRoute.Sitemap = [];

  try {
    const posts = await listPublishedPosts(1000);
    postRoutes = posts.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly",
      priority: 0.85,
    }));
  } catch (error) {
    console.error("Sitemap generation fallback: unable to load blog posts.", error);
  }

  return [...staticRoutes, ...postRoutes];
}

import { getDbPool, isDatabaseConfigured } from "@/lib/db";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  topic: string;
  sourceTopics: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type NewBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  contentMdx: string;
  topic: string;
  sourceTopics: string[];
};

let tableReady = false;

function mapBlogRow(row: {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  topic: string;
  source_topics: string[] | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    contentMdx: row.content_markdown,
    topic: row.topic,
    sourceTopics: row.source_topics ?? [],
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function slugifyTitle(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

export async function ensureBlogTable() {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (tableReady) {
    return;
  }

  const pool = getDbPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
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
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
      ON blog_posts (published_at DESC)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_blog_posts_topic
      ON blog_posts (topic)
  `);

  tableReady = true;
}

export async function listPublishedPosts(limit = 12): Promise<BlogPost[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureBlogTable();
  const pool = getDbPool();
  const result = await pool.query<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content_markdown: string;
    topic: string;
    source_topics: string[] | null;
    published_at: string;
    created_at: string;
    updated_at: string;
  }>(
    `
    SELECT id, slug, title, excerpt, content_markdown, topic, source_topics, published_at, created_at, updated_at
    FROM blog_posts
    ORDER BY published_at DESC
    LIMIT $1
  `,
    [limit],
  );

  return result.rows.map(mapBlogRow);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  await ensureBlogTable();
  const pool = getDbPool();
  const result = await pool.query<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content_markdown: string;
    topic: string;
    source_topics: string[] | null;
    published_at: string;
    created_at: string;
    updated_at: string;
  }>(
    `
    SELECT id, slug, title, excerpt, content_markdown, topic, source_topics, published_at, created_at, updated_at
    FROM blog_posts
    WHERE slug = $1
    LIMIT 1
  `,
    [slug],
  );

  if (!result.rows[0]) {
    return null;
  }

  return mapBlogRow(result.rows[0]);
}

export async function listRecentTopics(limit = 10): Promise<string[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureBlogTable();
  const pool = getDbPool();
  const result = await pool.query<{ topic: string }>(
    `
    SELECT topic
    FROM blog_posts
    ORDER BY published_at DESC
    LIMIT $1
  `,
    [limit],
  );

  return result.rows.map((row) => row.topic);
}

export async function ensureUniqueSlug(baseSlug: string) {
  await ensureBlogTable();

  const normalizedBase = baseSlug || `market-update-${Date.now()}`;
  const pool = getDbPool();

  for (let counter = 0; counter < 30; counter += 1) {
    const candidate = counter === 0 ? normalizedBase : `${normalizedBase}-${counter + 1}`;

    const existing = await pool.query<{ slug: string }>("SELECT slug FROM blog_posts WHERE slug = $1 LIMIT 1", [candidate]);

    if (!existing.rows[0]) {
      return candidate;
    }
  }

  return `${normalizedBase}-${Date.now()}`;
}

export async function insertBlogPost(input: NewBlogPost): Promise<BlogPost> {
  await ensureBlogTable();

  const pool = getDbPool();

  const result = await pool.query<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content_markdown: string;
    topic: string;
    source_topics: string[] | null;
    published_at: string;
    created_at: string;
    updated_at: string;
  }>(
    `
    INSERT INTO blog_posts (slug, title, excerpt, content_markdown, topic, source_topics)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb)
    RETURNING id, slug, title, excerpt, content_markdown, topic, source_topics, published_at, created_at, updated_at
  `,
    [
      input.slug,
      input.title,
      input.excerpt,
      input.contentMdx,
      input.topic,
      JSON.stringify(input.sourceTopics),
    ],
  );

  return mapBlogRow(result.rows[0]);
}

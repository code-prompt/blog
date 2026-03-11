import { ensureUniqueSlug, insertBlogPost, listRecentTopics, slugifyTitle } from "@/lib/blogs";
import { generateBlogDraftWithGemini } from "@/lib/gemini";
import { fetchTrendingTopics } from "@/lib/trending";

export type BlogAutomationResult = {
  selectedTopic: string;
  trendingTopics: string[];
  slug: string;
  title: string;
};

function selectTopic(trendingTopics: string[], recentTopics: string[]) {
  const recentlyUsed = new Set(recentTopics.map((topic) => topic.toLowerCase()));
  const candidate = trendingTopics.find((topic) => !recentlyUsed.has(topic.toLowerCase()));

  return candidate ?? trendingTopics[0] ?? "Artificial Intelligence Market Trends";
}

export async function runAutomatedBlogFlow(): Promise<BlogAutomationResult> {
  const trendingTopics = await fetchTrendingTopics(10);
  const recentTopics = await listRecentTopics(20);

  const selectedTopic = selectTopic(trendingTopics, recentTopics);
  const draft = await generateBlogDraftWithGemini(selectedTopic, trendingTopics.slice(0, 6));

  const baseSlug = slugifyTitle(draft.title);
  const slug = await ensureUniqueSlug(baseSlug);

  const post = await insertBlogPost({
    slug,
    title: draft.title,
    excerpt: draft.excerpt,
    contentMdx: draft.contentMdx,
    topic: selectedTopic,
    sourceTopics: trendingTopics,
  });

  return {
    selectedTopic,
    trendingTopics,
    slug: post.slug,
    title: post.title,
  };
}

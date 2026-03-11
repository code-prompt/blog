import type { BlogPost } from "@/lib/blogs";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "your",
  "into",
  "about",
  "are",
  "was",
  "were",
  "will",
  "have",
  "has",
  "had",
  "its",
  "you",
  "our",
  "how",
  "why",
  "what",
  "when",
  "where",
  "their",
  "they",
  "them",
  "while",
  "through",
  "using",
  "used",
  "over",
  "under",
  "than",
  "can",
  "all",
  "new",
  "now",
]);

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 3)
    .filter((word) => !STOP_WORDS.has(word));
}

export function extractKeywordCandidates(posts: BlogPost[], limit = 40) {
  const frequency = new Map<string, number>();

  for (const post of posts) {
    const topic = post.topic.trim();

    if (topic.length > 0) {
      frequency.set(topic, (frequency.get(topic) ?? 0) + 3);
    }

    for (const token of tokenize(`${post.title} ${post.excerpt}`)) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1);
    }
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword)
    .slice(0, limit);
}

export function postKeywords(post: BlogPost) {
  const base = [post.topic, ...tokenize(post.title), ...tokenize(post.excerpt)];
  return [...new Set(base)].slice(0, 20);
}

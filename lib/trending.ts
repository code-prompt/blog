const DEFAULT_RSS_URL = "https://trends.google.com/trending/rss?geo=US";

function decodeHtml(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .trim();
}

function extractItemTitles(rssXml: string) {
  const itemBlocks = [...rssXml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];

  return itemBlocks
    .map((match) => match[1])
    .map((itemXml) => itemXml.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "")
    .map((rawTitle) => rawTitle.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, ""))
    .map((rawTitle) => rawTitle.replace(/<[^>]+>/g, ""))
    .map((rawTitle) => decodeHtml(rawTitle))
    .filter(Boolean)
    .filter((title) => !/daily search trends/i.test(title));
}

export async function fetchTrendingTopics(limit = 10): Promise<string[]> {
  const rssUrl = process.env.TRENDING_RSS_URL || DEFAULT_RSS_URL;

  try {
    const response = await fetch(rssUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "CodePromptDailyBot/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trends feed: ${response.status}`);
    }

    const xml = await response.text();
    const titles = extractItemTitles(xml);

    const deduped = [...new Set(titles.map((title) => title.trim()))].filter((title) => title.length > 2);

    return deduped.slice(0, limit);
  } catch (error) {
    console.error("Unable to fetch live trending topics, using fallback topics.", error);

    return [
      "Generative AI in Product Development",
      "AI Agent Automation in Software Teams",
      "Cloud Cost Optimization for LLM Apps",
      "Retail Market AI Forecasting",
      "Cybersecurity Threat Intelligence with AI",
      "Startup Funding Trends in AI",
    ].slice(0, limit);
  }
}

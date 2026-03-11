export type GeneratedBlogDraft = {
  title: string;
  excerpt: string;
  contentMdx: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

function extractTextPayload(response: GeminiResponse) {
  const raw = response.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();

  if (!raw) {
    throw new Error("Gemini response did not contain text payload");
  }

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  return (fenced ?? raw).trim();
}

function parseGeneratedDraft(rawText: string): GeneratedBlogDraft {
  const parsed = JSON.parse(rawText) as Partial<{ title: string; excerpt: string; contentMdx: string; contentMarkdown: string }>;

  const title = parsed.title?.trim();
  const excerpt = parsed.excerpt?.trim();
  const contentMdx = (parsed.contentMdx ?? parsed.contentMarkdown)?.trim();

  if (!title || !excerpt || !contentMdx) {
    throw new Error("Gemini draft is missing required fields");
  }

  return {
    title,
    excerpt,
    contentMdx,
  };
}

export async function generateBlogDraftWithGemini(topic: string, trendContext: string[]) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";

  const prompt = [
    "You are a senior market analyst and technical blog editor.",
    "Write one organized, reader-friendly blog post in valid MDX (Markdown-compatible, no imports or exports).",
    "The post should be practical, current, and data-informed without inventing fake citations.",
    `Primary topic: ${topic}`,
    `Market trend context: ${trendContext.join(", ")}`,
    "Return ONLY valid JSON with this exact shape:",
    '{"title":"string","excerpt":"string","contentMdx":"string"}',
    "Requirements:",
    "- Title: 55-75 characters",
    "- Excerpt: 120-180 characters",
    "- contentMdx: 700-1100 words",
    "- Use clear section headings and ordered structure",
    "- Include these sections exactly as headings:",
    "  - ## Quick Summary",
    "  - ## Why this trend matters",
    "  - ## What this means for businesses",
    "  - ## Action plan for this week",
    "  - ## FAQ",
    "- Use bullet lists and numbered steps where helpful",
    "- No code fences and no JSX component imports",
  ].join("\n");

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.75,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const failureBody = await response.text();
    throw new Error(`Gemini request failed: ${response.status} ${failureBody}`);
  }

  const payload = (await response.json()) as GeminiResponse;
  const rawText = extractTextPayload(payload);

  return parseGeneratedDraft(rawText);
}

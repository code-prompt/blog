import { NextResponse } from "next/server";
import { runAutomatedBlogFlow } from "@/lib/blog-automation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeSecret(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  const hasDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
  const hasSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'");

  if ((hasDoubleQuotes || hasSingleQuotes) && trimmed.length >= 2) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function tokenFromAuthorizationHeader(authorization: string | null) {
  if (!authorization) {
    return "";
  }

  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return normalizeSecret(match?.[1] ?? "");
}

function isAuthorized(request: Request) {
  const expectedSecret = normalizeSecret(process.env.CRON_SECRET);

  if (!expectedSecret) {
    return true;
  }

  const url = new URL(request.url);
  const providedSecrets = [
    tokenFromAuthorizationHeader(request.headers.get("authorization")),
    normalizeSecret(request.headers.get("x-cron-secret")),
    normalizeSecret(url.searchParams.get("secret")),
  ].filter((value) => value.length > 0);

  return providedSecrets.some((value) => value === expectedSecret);
}

async function handleRequest(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAutomatedBlogFlow();

    return NextResponse.json({
      ok: true,
      message: "Blog post generated and stored",
      post: result,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  return handleRequest(request);
}

export async function POST(request: Request) {
  return handleRequest(request);
}

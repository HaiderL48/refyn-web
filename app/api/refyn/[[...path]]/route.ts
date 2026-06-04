import { NextRequest, NextResponse } from "next/server";

function upstreamBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_REFYN_URL?.trim();
  if (!raw) {
    throw new Error("NEXT_PUBLIC_API_REFYN_URL is not configured");
  }
  return raw.replace(/\/$/, "");
}

async function proxy(request: NextRequest, pathSegments: string[]) {
  const suffix = pathSegments.join("/");
  const incoming = new URL(request.url);
  const target = `${upstreamBase()}/${suffix}${incoming.search}`;

  const headers = new Headers();
  const auth = request.headers.get("authorization");
  if (auth) headers.set("authorization", auth);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const upstream = await fetch(target, init);
  const text = await upstream.text();
  const outHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) outHeaders.set("content-type", upstreamType);

  return new NextResponse(text, {
    status: upstream.status,
    headers: outHeaders,
  });
}

type RouteContext = { params: Promise<{ path?: string[] }> };

async function resolvePath(context: RouteContext): Promise<string[]> {
  const { path } = await context.params;
  return path ?? [];
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    return await proxy(request, await resolvePath(context));
  } catch (e) {
    return NextResponse.json(
      { error: "proxy_failed", message: String((e as Error)?.message || e) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    return await proxy(request, await resolvePath(context));
  } catch (e) {
    return NextResponse.json(
      { error: "proxy_failed", message: String((e as Error)?.message || e) },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    return await proxy(request, await resolvePath(context));
  } catch (e) {
    return NextResponse.json(
      { error: "proxy_failed", message: String((e as Error)?.message || e) },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    return await proxy(request, await resolvePath(context));
  } catch (e) {
    return NextResponse.json(
      { error: "proxy_failed", message: String((e as Error)?.message || e) },
      { status: 500 },
    );
  }
}

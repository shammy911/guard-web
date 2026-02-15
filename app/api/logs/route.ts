import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

function baseUrl() {
  const base = process.env.GUARD_API_URL;
  if (!base) throw new Error("GUARD_API_URL_MISSING");
  return base.replace(/\/+$/, "");
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const apiKey = req.headers.get("x-api-key");
  const limit = new URL(req.url).searchParams.get("limit") || "50";

  if (!apiKey) {
    return NextResponse.json({ error: "API_KEY_REQUIRED" }, { status: 400 });
  }

  if (!baseUrl()) {
    return NextResponse.json(
      { error: "GUARD_API_URL_MISSING" },
      { status: 500 },
    );
  }

  const upstream = await fetch(
    `${baseUrl()}/logs?limit=${encodeURIComponent(limit)}`,
    { headers: { "x-api-key": apiKey } },
  );

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

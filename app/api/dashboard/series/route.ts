import { NextResponse } from "next/server";

function baseUrl() {
  const base = process.env.GUARD_API_URL;
  if (!base) throw new Error("GUARD_API_URL_MISSING");
  return base.replace(/\/+$/, "");
}

export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ error: "API_KEY_REQUIRED" }, { status: 400 });
  }

  const url = new URL(req.url);
  const days = url.searchParams.get("days") || "7";

  const res = await fetch(`${baseUrl()}/dashboard/series?days=${days}`, {
    headers: { "x-api-key": apiKey },
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

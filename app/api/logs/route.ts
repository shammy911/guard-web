import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { error } from "console";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const apiKey = new URL(req.url).searchParams.get("apiKey");
  const limit = new URL(req.url).searchParams.get("limit") || "20";

  if (!apiKey) {
    return NextResponse.json({ error: "API_KEY_REQUIRED" }, { status: 400 });
  }

  const base = process.env.GUARD_API_URL;

  if (!base) {
    return NextResponse.json(
      { error: "GUARD_API_URL_MISSING" },
      { status: 500 },
    );
  }

  const upstream = await fetch(
    `${base.replace(/\/+$/, "")}/logs?limit=${encodeURIComponent(limit)}`,
    { headers: { "x-api-key": apiKey } },
  );

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

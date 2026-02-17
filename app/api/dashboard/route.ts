import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { masterKeyHeader } from "@/lib/guardProxy";

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
  if (!apiKey) {
    return NextResponse.json({ error: "API_KEY_REQUIRED" }, { status: 400 });
  }

  const res = await fetch(`${baseUrl()}/dashboard`, {
    headers: {
      "x-guard-key": masterKeyHeader(),
      "x-api-key": apiKey,
    },
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

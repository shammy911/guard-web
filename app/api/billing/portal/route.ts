import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

function baseUrl() {
  const base = process.env.GUARD_API_URL;
  if (!base) throw new Error("GUARD_API_URL_MISSING");
  return base.replace(/\/+$/, "");
}

function masterKey() {
  const k = process.env.GUARD_MASTER_KEY;
  if (!k) throw new Error("GUARD_MASTER_KEY_MISSING");
  return k;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const apiKey = req.headers.get("x-api-key") || "";
  if (!apiKey) {
    return NextResponse.json({ error: "API_KEY_REQUIRED" }, { status: 400 });
  }

  try {
    const body = await req.json().catch(() => ({}));

    const res = await fetch(`${baseUrl()}/billing/portal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-guard-key": masterKey(),
        "x-api-key": apiKey,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

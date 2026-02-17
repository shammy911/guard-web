import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { masterKeyHeader } from "@/lib/guardProxy";

function baseUrl() {
  const base = process.env.GUARD_API_URL;
  if (!base) throw new Error("GUARD_API_URL_MISSING");
  return base.replace(/\/+$/, "");
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${baseUrl()}/keys?userId=${encodeURIComponent(session.user.id)}`,
      {
        headers: { "x-guard-key": masterKeyHeader() },
      },
    );
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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const { name } = await req.json().catch(() => ({ name: "" }));

    const res = await fetch(`${baseUrl()}/keys`, {
      method: "POST",
      headers: {
        "x-guard-key": masterKeyHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.user.id, name }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to create key" },
        { status: res.status },
      );
    }

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

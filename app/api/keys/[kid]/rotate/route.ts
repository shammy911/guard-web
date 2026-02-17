import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { masterKeyHeader } from "@/lib/guardProxy";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ kid: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = typeof body?.name === "string" ? body.name : "";

  const base = process.env.GUARD_API_URL?.replace(/\/+$/, "");
  if (!base)
    return NextResponse.json(
      { error: "GUARD_API_URL_MISSING" },
      { status: 500 },
    );

  const params = await ctx.params;
  const res = await fetch(
    `${base}/keys/${encodeURIComponent(params.kid)}/rotate`,
    {
      method: "POST",
      headers: {
        "x-guard-key": masterKeyHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: session.user.id, name }),
    },
  );

  const text = await res.text();

  // If backend returns an error, wrap it appropriately
  if (!res.ok) {
    try {
      const errorData = JSON.parse(text);
      return NextResponse.json(errorData, { status: res.status });
    } catch {
      return NextResponse.json(
        { error: `Failed to rotate key: ${text}` },
        { status: res.status },
      );
    }
  }

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

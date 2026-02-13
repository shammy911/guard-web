import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(
  _: Request,
  ctx: { params: Promise<{ kid: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const base = process.env.GUARD_API_URL?.replace(/\/+$/, "");
  if (!base)
    return NextResponse.json(
      { error: "GUARD_API_URL_MISSING" },
      { status: 500 },
    );

  const params = await ctx.params;
  const res = await fetch(
    `${base}/keys/${encodeURIComponent(params.kid)}/disable`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id }),
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
        { error: `Failed to disable key: ${text}` },
        { status: res.status },
      );
    }
  }

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

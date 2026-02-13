import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request, ctx: { params: { kid: string } }) {
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

  const res = await fetch(
    `${base}/keys/${encodeURIComponent(ctx.params.kid)}/rotate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id, name }),
    },
  );

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

import { pool } from "@/lib/db";
import { ok } from "assert";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || typeof name !== "string") {
    return new Response(JSON.stringify({ error: "NAME_REQUIRED" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!email || typeof email !== "string") {
    return new Response(JSON.stringify({ error: "EMAIL_REQUIRED" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!password || typeof password !== "string") {
    return new Response(JSON.stringify({ error: "PASSWORD_REQUIRED" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
    [name.trim(), email.toLowerCase().trim(), hash],
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

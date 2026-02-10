import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const hash = await bcrypt.hash(password, 10);

  await pool.query("INSERT INTO users (email, password_hash) VALUES ($1, $2)", [
    email,
    hash,
  ]);

  return new Response(null, { status: 201 });
}

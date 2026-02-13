import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
    [name, email, hash],
  );

  return new Response(null, { status: 201 });
}

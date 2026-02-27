import { pool } from "@/lib/db";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

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

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "INVALID_EMAIL_FORMAT" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sanitizedEmail = email.toLowerCase().trim();
  const sanitizedName = name.trim();

  try {
    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [sanitizedEmail],
    );

    if (existingUser.rows.length > 0) {
      return new Response(JSON.stringify({ error: "EMAIL_ALREADY_EXISTS" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash password
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Create user (unverified)
    const userResult = await pool.query(
      "INSERT INTO users (name, email, password_hash, is_verified) VALUES ($1, $2, $3, $4) RETURNING id",
      [sanitizedName, sanitizedEmail, hash, false],
    );

    const userId = userResult.rows[0].id;

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    await pool.query(
      "INSERT INTO email_verifications (user_id, token, email, expires_at) VALUES ($1, $2, $3, $4)",
      [userId, verificationToken, sanitizedEmail, expiresAt],
    );

    // Send verification email
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@yourdomain.com",
      to: sanitizedEmail,
      subject: "Verify your email address",
      html: `
        <h2>Welcome to Guard!</h2>
        <p>Thank you for signing up, ${sanitizedName}.</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="display:inline-block; padding:10px 20px; background-color:#10b981; color:white; text-decoration:none; border-radius:5px;">
          Verify Email
        </a>
        <p>This link expires in 24 hours.</p>
        <p>If you didn't sign up, you can ignore this email.</p>
      `,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message:
          "Registration successful. Please check your email to verify your account.",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "REGISTRATION_FAILED" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

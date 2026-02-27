import Link from "next/link";
import { CheckCircle2, AlertTriangle, MailCheck } from "lucide-react";
import { pool } from "@/lib/db";

type VerifyState = "success" | "invalid" | "expired" | "error";

async function verifyEmailToken(token: string): Promise<VerifyState> {
  try {
    const verificationResult = await pool.query(
      "SELECT user_id, expires_at FROM email_verifications WHERE token = $1 LIMIT 1",
      [token],
    );

    if (verificationResult.rows.length === 0) {
      return "invalid";
    }

    const verification = verificationResult.rows[0] as {
      user_id: string;
      expires_at: Date;
    };

    if (new Date(verification.expires_at).getTime() < Date.now()) {
      await pool.query("DELETE FROM email_verifications WHERE token = $1", [
        token,
      ]);
      return "expired";
    }

    await pool.query("UPDATE users SET is_verified = true WHERE id = $1", [
      verification.user_id,
    ]);
    await pool.query("DELETE FROM email_verifications WHERE user_id = $1", [
      verification.user_id,
    ]);

    return "success";
  } catch {
    return "error";
  }
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const state = token ? await verifyEmailToken(token) : "invalid";

  const config = {
    success: {
      title: "Email verified",
      description:
        "Your email has been verified successfully. You can now sign in to your account.",
      icon: <CheckCircle2 className="h-12 w-12 text-emerald-500" />,
      ctaHref: "/login",
      ctaLabel: "Go to login",
    },
    invalid: {
      title: "Invalid verification link",
      description:
        "This verification link is not valid. Please request a new verification email.",
      icon: <AlertTriangle className="h-12 w-12 text-amber-500" />,
      ctaHref: "/register",
      ctaLabel: "Back to register",
    },
    expired: {
      title: "Verification link expired",
      description:
        "This verification link has expired. Please register again or request a new verification email.",
      icon: <MailCheck className="h-12 w-12 text-amber-500" />,
      ctaHref: "/register",
      ctaLabel: "Register again",
    },
    error: {
      title: "Something went wrong",
      description:
        "We couldn't verify your email right now. Please try again in a moment.",
      icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
      ctaHref: "/register",
      ctaLabel: "Back to register",
    },
  }[state];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
        <div className="mx-auto mb-5 w-fit">{config.icon}</div>
        <h1 className="text-2xl font-bold text-white">{config.title}</h1>
        <p className="mt-3 text-sm text-gray-400">{config.description}</p>

        <Link
          href={config.ctaHref}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
        >
          {config.ctaLabel}
        </Link>
      </div>
    </div>
  );
}

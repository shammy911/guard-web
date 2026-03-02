"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">
      <div className="text-center">
        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-lg text-slate-400 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-200 cursor-pointer"
          >
            ← Go Back
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-200"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

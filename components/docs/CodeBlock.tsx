"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function copy() {
    setError(null);

    try {
      if (!navigator?.clipboard?.writeText) {
        throw new Error("Clipboard not supported");
      }

      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Copy failed. Please copy manually.");
      window.setTimeout(() => setError(null), 2000);
    }
  }

  return (
    <div className="relative rounded-lg bg-gray-900 border border-gray-800 p-4 font-mono text-sm overflow-x-auto">
      <pre className="text-gray-300 whitespace-pre">{code}</pre>

      <button
        type="button"
        onClick={copy}
        className="absolute top-3 right-3 text-gray-500 hover:text-white"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>

      {error ? <div className="mt-2 text-xs text-red-400">{error}</div> : null}
    </div>
  );
}

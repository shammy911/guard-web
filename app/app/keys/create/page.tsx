"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function CreateKeysPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  async function createKey() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/keys", { method: "POST" });

      if (!res.ok) {
        throw new Error(
          res.status === 401 ? "Unauthorized" : "Failed to create key",
        );
      }

      const data = await res.json();
      setApiKey(data.apiKey);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <p className="text-slate-400 text-sm">
        Logged in as {session?.user?.email}
      </p>
      <h1 className="text-2xl font-bold mb-4">API Keys</h1>

      <button
        onClick={createKey}
        disabled={loading}
        className="bg-indigo-600 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create API Key"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {apiKey && (
        <div className="mt-4 bg-slate-800 p-4 rounded">
          <p className="text-sm text-slate-400">
            Copy this key now. You won’t see it again.
          </p>
          <code className="block mt-2">{apiKey}</code>
        </div>
      )}
    </div>
  );
}

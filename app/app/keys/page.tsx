"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Copy, Trash2, RotateCw, Eye, EyeOff } from "lucide-react";

type KeyRow = {
  kid: string | null;
  name: string;
  apiKeyMasked: string;
  apiKeyPrefix: string;
  enabled: boolean;
  plan: string;
  createdAt: number | null;
  lastSeen: number | null;
};

function timeAgo(ms: number | null) {
  if (!ms) return "Never";
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

function formatDate(ms: number | null) {
  if (!ms) return "-";
  return new Date(ms).toLocaleDateString();
}

export default function KeysPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // reveal modal
  const [revealKey, setRevealKey] = useState<string>("");
  const [revealKid, setRevealKid] = useState<string>("");
  const [revealOpen, setRevealOpen] = useState(false);

  const selectedKey = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("apiKey") || "";
  }, []);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load keys");
      setKeys(data.keys || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load keys");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createKey() {
    setError("");
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create key");

      // show full key ONCE
      setRevealKey(data.apiKey);
      setRevealKid(data.kid);
      setRevealOpen(true);

      setIsModalOpen(false);
      setNameInput("");
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to create key");
    }
  }

  async function rotate(kid: string, currentName: string) {
    setError("");
    try {
      const res = await fetch(`/api/keys/${encodeURIComponent(kid)}/rotate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: currentName || "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to rotate key");

      setRevealKey(data.apiKey);
      setRevealKid(data.kid);
      setRevealOpen(true);

      await refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to rotate key");
    }
  }

  async function disable(kid: string) {
    setError("");
    try {
      const res = await fetch(`/api/keys/${encodeURIComponent(kid)}/disable`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to revoke key");
      await refresh();
    } catch (e: any) {
      setError(e?.message || "Failed to revoke key");
    }
  }

  function useKey(key: string) {
    localStorage.setItem("apiKey", key);
    window.location.href = "/app/dashboard";
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400">
            Manage your API keys for authentication.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create New Key
        </button>
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-950/50 text-gray-400">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Key Token</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Last Used</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td className="px-6 py-4 text-gray-400" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : keys.length === 0 ? (
              <tr>
                <td className="px-6 py-4 text-gray-400" colSpan={6}>
                  No keys yet. Create your first key.
                </td>
              </tr>
            ) : (
              keys.map((k) => (
                <tr
                  key={k.kid ?? k.apiKeyMasked}
                  className="hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {k.name || "Untitled Key"}
                  </td>

                  <td className="px-6 py-4 font-mono text-gray-400">
                    {k.apiKeyMasked}
                    {selectedKey && selectedKey.startsWith(k.apiKeyPrefix) ? (
                      <span className="ml-2 text-xs text-emerald-400">
                        (selected)
                      </span>
                    ) : null}
                  </td>

                  <td className="px-6 py-4">
                    {k.enabled ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
                        Disabled
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-300">
                    {timeAgo(k.lastSeen)}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {formatDate(k.createdAt)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Copy masked token"
                        onClick={() => copy(k.apiKeyMasked)}
                      >
                        <Copy className="h-4 w-4" />
                      </button>

                      <button
                        className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                        title="Rotate Key (reveals new key once)"
                        disabled={!k.enabled || !k.kid}
                        onClick={() => k.kid && rotate(k.kid, k.name)}
                      >
                        <RotateCw className="h-4 w-4" />
                      </button>

                      <button
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-40"
                        title="Revoke (disable) Key"
                        disabled={!k.enabled || !k.kid}
                        onClick={() => k.kid && disable(k.kid)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Key Modal Mockup */}
      {/* Create Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              Create New API Key
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Key Name (optional)
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Production Server"
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createKey}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reveal Key Modal (shows full key ONCE) */}
      {revealOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Your API Key</h3>
            <p className="text-sm text-gray-400 mb-4">
              Copy this key now. You won’t be able to see the full token again.
            </p>

            <div className="rounded-lg border border-gray-700 bg-gray-950 p-4 font-mono text-sm text-gray-200 break-all">
              {revealKey}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => copy(revealKey)}
                className="flex-1 rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Copy
              </button>

              <button
                onClick={() => useKey(revealKey)}
                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
              >
                Use this key
              </button>

              <button
                onClick={() => {
                  setRevealOpen(false);
                  setRevealKey("");
                  setRevealKid("");
                }}
                className="flex-1 rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Done
              </button>
            </div>

            {/* (debug optional) */}
            <div className="mt-3 text-xs text-gray-500">kid: {revealKid}</div>
          </div>
        </div>
      )}
    </div>
  );
}

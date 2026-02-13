"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Copy, Trash2, RotateCw, Check } from "lucide-react";
import toast from "react-hot-toast";

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

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revealCopied, setRevealCopied] = useState(false);
  const copiedKeyTimer = useRef<number | null>(null);
  const revealCopyTimer = useRef<number | null>(null);

  // reveal modal
  const [revealKey, setRevealKey] = useState<string>("");
  const [revealKid, setRevealKid] = useState<string>("");
  const [revealOpen, setRevealOpen] = useState(false);

  const [selectedKid, setSelectedKid] = useState<string>("");

  const [selectOpen, setSelectOpen] = useState(false);
  const [selectKid, setSelectKid] = useState<string>("");
  const [selectName, setSelectName] = useState<string>("");
  const [selectMasked, setSelectMasked] = useState<string>("");
  const [selectToken, setSelectToken] = useState<string>("");

  useEffect(() => {
    const kid = localStorage.getItem("selectedKid") || "";
    setSelectedKid(kid);
  }, []);

  function looksLikeGuardKey(token: string) {
    return token.startsWith("guard_") && token.length >= 20;
  }

  function saveSelection() {
    setError("");

    if (!selectKid) {
      setError("Missing key id");
      return;
    }

    if (!looksLikeGuardKey(selectToken)) {
      setError("Please paste a valid Guard API key token (starts with guard_)");
      return;
    }

    localStorage.setItem("apiKey", selectToken.trim());
    localStorage.setItem("selectedKid", selectKid);

    setSelectedKid(selectKid);
    setSelectOpen(false);

    toast.success("Key selected for dashboard/logs", { duration: 2000 });
  }

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

  useEffect(() => {
    return () => {
      if (copiedKeyTimer.current) window.clearTimeout(copiedKeyTimer.current);
      if (revealCopyTimer.current) window.clearTimeout(revealCopyTimer.current);
    };
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

  async function copy(text: string, keyId?: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", { duration: 2000 });

      if (keyId) {
        setCopiedKeyId(keyId);
        if (copiedKeyTimer.current) {
          window.clearTimeout(copiedKeyTimer.current);
        }
        copiedKeyTimer.current = window.setTimeout(() => {
          setCopiedKeyId(null);
          copiedKeyTimer.current = null;
        }, 1500);
      }

      if (!keyId) {
        setRevealCopied(true);
        if (revealCopyTimer.current) {
          window.clearTimeout(revealCopyTimer.current);
        }
        revealCopyTimer.current = window.setTimeout(() => {
          setRevealCopied(false);
          revealCopyTimer.current = null;
        }, 1500);
      }
    } catch (e: any) {
      setError("Failed to copy to clipboard. Please try copying manually.");
    }
  }

  function useKey(key: string) {
    localStorage.setItem("apiKey", key);
    if (revealKid) {
      localStorage.setItem("selectedKid", revealKid);
      setSelectedKid(revealKid);
    }
    window.location.href = "/app/dashboard";
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
                    {/* {selectedKey && selectedKey.startsWith(k.apiKeyPrefix) ? (
                      <span className="ml-2 text-xs text-emerald-400">
                        (selected)
                      </span>
                    ) : null} */}
                    {selectedKid && k.kid && selectedKid === k.kid ? (
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
                        className="rounded-md border border-gray-700 px-2 py-1 text-xs text-gray-300 hover:bg-gray-800 disabled:opacity-40"
                        title="Select this key for dashboard/logs"
                        disabled={
                          !k.enabled ||
                          !k.kid ||
                          (selectedKid && k.kid === selectedKid)
                        }
                        onClick={() => {
                          setSelectKid(k.kid!);
                          setSelectName(k.name || "Untitled Key");
                          setSelectMasked(k.apiKeyMasked);
                          setSelectToken("");
                          setSelectOpen(true);
                        }}
                      >
                        {selectedKid && k.kid === selectedKid
                          ? "Selected"
                          : "Select"}
                      </button>

                      <button
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Copy masked token"
                        onClick={() =>
                          copy(k.apiKeyMasked, k.kid ?? k.apiKeyMasked)
                        }
                      >
                        {copiedKeyId === (k.kid ?? k.apiKeyMasked) ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
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
                {revealCopied ? "Copied" : "Copy"}
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

      {/* // Select Key Modal */}
      {selectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              Select API Key
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              For security, we don’t store your full key token on the server.
              Paste the token to use this key in Dashboard/Logs.
            </p>

            <div className="space-y-3">
              <div className="text-sm text-gray-300">
                <div className="font-medium text-white">{selectName}</div>
                <div className="font-mono text-gray-400">{selectMasked}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Paste full key token
                </label>
                <input
                  type="text"
                  value={selectToken}
                  onChange={(e) => setSelectToken(e.target.value)}
                  placeholder="guard_..."
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Tip: You can get a new token by rotating the key (Rotate
                  icon).
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectOpen(false)}
                  className="flex-1 rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSelection}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
                >
                  Save Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

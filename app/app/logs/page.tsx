"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Calendar } from "lucide-react";

type LogRow = {
  clientKey?: string;
  ip?: string;
  route?: string;
  method?: string;
  allowed?: boolean;
  reason?: string;
  timestamp?: number | string; // backend uses timestamp
  ts?: number | string; // legacy
  latencyMs?: number; // optional (only if you start recording later)
};

function maskKey(k: string) {
  if (!k) return "-";
  if (k.length <= 10) return k;
  return `${k.slice(0, 6)}…${k.slice(-4)}`;
}

function toNumber(ts?: number | string) {
  if (ts === undefined || ts === null) return null;
  const n = typeof ts === "string" ? Number(ts) : ts;
  return Number.isFinite(n) ? n : null;
}

function formatTime(value?: number | string) {
  if (!value) return "-";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return String(value);
  return new Date(n).toLocaleString();
}

function getTimestampValue(row: LogRow) {
  return row.timestamp ?? row.ts;
}

export default function LogsPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [limit, setLimit] = useState<number>(50);
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "allowed" | "blocked">("all");
  const [last24h, setLast24h] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("apiKey") || "";
    setApiKey(saved);
  }, []);

  async function load() {
    if (!apiKey) {
      setError("Set an API key first (go to Keys and select one).");
      setRows([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/logs?limit=${encodeURIComponent(String(limit))}`,
        {
          headers: { "x-api-key": apiKey },
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError((data as any)?.error || "Failed to load logs");
        setRows([]);
        return;
      }

      // backend returns array
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load logs");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (apiKey) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, limit]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    return rows
      .slice()
      .sort(
        (a, b) =>
          (toNumber(getTimestampValue(b)) ?? 0) -
          (toNumber(getTimestampValue(a)) ?? 0),
      )
      .filter((r) => {
        // status filter
        if (status === "allowed" && r.allowed !== true) return false;
        if (status === "blocked" && r.allowed !== false) return false;

        // last 24h filter
        if (last24h) {
          const t = toNumber(getTimestampValue(r));
          if (!t || t < cutoff) return false;
        }

        // search filter (path/ip/method/reason/key)
        if (q) {
          const hay =
            `${r.route || ""} ${r.ip || ""} ${r.method || ""} ${r.reason || ""} ${r.clientKey || ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }

        return true;
      });
  }, [rows, search, status, last24h]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Request Logs</h1>
        <p className="text-gray-400">
          Real-time logs of your API traffic decisions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by path, IP, method, reason..."
            className="w-full rounded-lg border border-gray-800 bg-gray-900 pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-4">
          <select
            className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="allowed">Allowed</option>
            <option value="blocked">Blocked</option>
          </select>

          <button
            onClick={() => setLast24h((v) => !v)}
            className={`flex items-center gap-2 rounded-lg border border-gray-800 px-4 py-2 text-sm transition-colors ${
              last24h
                ? "bg-gray-800 text-white"
                : "bg-gray-900 text-gray-300 hover:bg-gray-800"
            }`}
            title="Toggle last 24 hours"
          >
            <Calendar className="h-4 w-4" />
            Last 24h
          </button>

          <button
            onClick={load}
            className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            disabled={loading}
          >
            {loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {/* Logs Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950/50 text-gray-400">
              <tr>
                {/* column names */}
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Method</th>
                <th className="px-6 py-3 font-medium">Path</th>
                <th className="px-6 py-3 font-medium">IP Address</th>
                <th className="px-6 py-3 font-medium">Latency</th>
                <th className="px-6 py-3 font-medium">Decision</th>
                <th className="px-6 py-3 font-medium">Reason</th>
                <th className="px-6 py-3 font-medium">Key</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td className="p-3 text-slate-400" colSpan={8}>
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-400" colSpan={8}>
                    No logs match your filters. Trigger a few /check calls and
                    refresh.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-300">
                      {formatTime(getTimestampValue(r))}
                    </td>

                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {(r.method || "-").toUpperCase()}
                    </td>

                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {r.route || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {r.ip || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {typeof r.latencyMs === "number"
                        ? `${r.latencyMs}ms`
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          r.allowed
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {r.allowed ? "Allowed" : "Blocked"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {r.reason || "-"}
                    </td>

                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {r.clientKey ? maskKey(r.clientKey) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="border-t border-gray-800 p-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing latest{" "}
            <span className="text-gray-300">{filtered.length}</span> results
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Limit</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1 text-sm text-gray-300"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

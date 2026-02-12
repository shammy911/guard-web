"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";

type LogRow = {
  clientKey?: string;
  ip?: string;
  route?: string;
  allowed?: boolean;
  reason?: string;
  timestamp?: number | string;
};

function maskKey(k: string) {
  if (k.length <= 10) return k;
  return `${k.slice(0, 6)}…${k.slice(-4)}`;
}

function formatTime(ts?: number | string) {
  if (!ts) return "-";
  const n = typeof ts === "string" ? Number(ts) : ts;
  if (!Number.isFinite(n)) return String(ts);
  return new Date(n).toLocaleString();
}

export default function Page() {
  const [filter, setFilter] = useState("all");

  const [apiKey, setApiKey] = useState<string>("");
  const [limit, setLimit] = useState<number>(50);
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // filters
  const [routeFilter, setRouteFilter] = useState("");
  const [allowedFilter, setAllowedFilter] = useState<
    "all" | "allowed" | "blocked"
  >("all");

  useEffect(() => {
    const saved = localStorage.getItem("apiKey") || "";
    setApiKey(saved);
  }, []);

  async function load() {
    if (!apiKey) {
      setError("Set an API key first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/logs?apiKey=${encodeURIComponent(apiKey)}&limit=${encodeURIComponent(String(limit))}`,
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to load logs");
        setRows([]);
        return;
      }

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
  }, [apiKey]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (routeFilter && !(r.route || "").includes(routeFilter)) return false;

      if (allowedFilter === "allowed" && r.allowed !== true) return false;
      if (allowedFilter === "blocked" && r.allowed !== false) return false;

      return true;
    });
  }, [rows, routeFilter, allowedFilter]);

  function saveKey() {
    localStorage.setItem("apiKey", apiKey);
    load();
  }
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
            placeholder="Search by path, IP, or method..."
            className="w-full rounded-lg border border-gray-800 bg-gray-900 pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-4">
          <select
            className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="allowed">Allowed</option>
            <option value="blocked">Blocked</option>
          </select>
          <button className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
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

      <div className="border border-slate-800 rounded-lg p-4 space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label htmlFor="apiKey" className="text-sm text-slate-400">
              API Key
            </label>
            <div className="flex gap-2">
              <input
                id="apiKey"
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="guard_…"
              />
              <button
                onClick={saveKey}
                className="bg-indigo-600 px-4 py-2 rounded"
              >
                Use
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="limit" className="text-sm text-slate-400">
              Limit
            </label>
            <input
              id="limit"
              type="number"
              min={1}
              max={200}
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              onBlur={load}
            />
          </div>

          <div>
            <label htmlFor="allowed" className="text-sm text-slate-400">
              Allowed
            </label>
            <select
              id="allowed"
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2"
              value={allowedFilter}
              onChange={(e) =>
                setAllowedFilter(
                  e.target.value as "all" | "allowed" | "blocked",
                )
              }
            >
              <option value="all">All</option>
              <option value="allowed">Allowed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="route" className="text-sm text-slate-400">
              Route contains
            </label>
            <input
              id="route"
              className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2"
              value={routeFilter}
              onChange={(e) => setRouteFilter(e.target.value)}
              placeholder="/api/login"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setRouteFilter("");
                setAllowedFilter("all");
              }}
              className="border border-slate-700 px-4 py-2 rounded"
            >
              Clear filters
            </button>
          </div>
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950/50 text-gray-400">
              <tr>
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
              {filtered.length === 0 ? (
                <tr>
                  <td className="p-3 text-slate-400" colSpan={8}>
                    No logs yet. Trigger a few /check calls and refresh.
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-300">
                      {formatTime(r.timestamp)}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {["GET", "POST", "PUT", "DELETE"][idx % 4]}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {r.route || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {r.ip || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {20 + (idx % 30)}ms
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${r.allowed ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
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

        {/* Pagination */}
        <div className="border-t border-gray-800 p-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing 1-15 of 2,450 results</p>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="rounded-lg border border-gray-800 bg-gray-900 px-3 py-1 text-sm text-gray-400 hover:text-white">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function LogsPage() {
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
    <div className="p-8 space-y-6 text-white bg-slate-950 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Logs</h1>
        <button
          onClick={load}
          className="border border-slate-700 px-3 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
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

      <div className="border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="text-left p-3">Time</th>
              <th className="text-left p-3">Route</th>
              <th className="text-left p-3">IP</th>
              <th className="text-left p-3">Result</th>
              <th className="text-left p-3">Reason</th>
              <th className="text-left p-3">Key</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className="p-3 text-slate-400" colSpan={6}>
                  No logs yet. Trigger a few /check calls and refresh.
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => (
                <tr key={idx} className="border-t border-slate-800">
                  <td className="p-3">{formatTime(r.timestamp)}</td>
                  <td className="p-3">{r.route || "-"}</td>
                  <td className="p-3">{r.ip || "-"}</td>
                  <td className="p-3">
                    {r.allowed === true ? (
                      <span className="text-green-400">ALLOWED</span>
                    ) : r.allowed === false ? (
                      <span className="text-yellow-400">BLOCKED</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3">{r.reason || "-"}</td>
                  <td className="p-3">
                    {r.clientKey ? maskKey(r.clientKey) : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

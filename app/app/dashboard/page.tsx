"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  BarChart3,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import toast from "react-hot-toast";

type SelectedKey = {
  apiKey: string;
  kid: string;
  name: string;
  masked: string;
  plan: string;
};

type DashboardResponse = {
  plan: { name: string; rpm: number; monthly: number };
  today: {
    allowed: number;
    blocked: number;
    total: number;
    changePct?: number;
  };
  lastSeen: { route?: string; ts?: number | null };
  recent: Array<{
    ts: number;
    method?: string;
    route?: string;
    ip?: string;
    allowed: boolean;
  }>;
};

function timeAgo(ts?: number | null) {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 5) return "Just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [selected, setSelected] = useState<SelectedKey | null>(null);

  function readSelected(): SelectedKey {
    return {
      apiKey: localStorage.getItem("apiKey") || "",
      kid: localStorage.getItem("selectedKid") || "",
      name: localStorage.getItem("selectedKeyName") || "Untitled Key",
      masked: localStorage.getItem("selectedKeyMasked") || "",
      plan: localStorage.getItem("selectedKeyPlan") || "",
    };
  }

  async function load() {
    setError(null);
    setLoading(true);

    const sel = readSelected();
    setSelected(sel);

    const apiKey = sel.apiKey;
    if (!apiKey) {
      setLoading(false);
      setData(null);
      setError("No API key selected. Go to Keys and select a key.");
      return;
    }

    try {
      const res = await fetch("/api/dashboard", {
        headers: { "x-api-key": apiKey },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load dashboard");

      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to load dashboard");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    setSelected(readSelected());
  }, []);

  const planBadge = data?.plan?.name || selected?.plan || "Plan";
  const rpm = data?.plan?.rpm ?? null;
  const monthly = data?.plan?.monthly ?? null;

  const todayTotal = data?.today?.total ?? 0;
  const todayAllowed = data?.today?.allowed ?? 0;
  const todayBlocked = data?.today?.blocked ?? 0;
  const acceptRate =
    todayTotal > 0 ? ((todayAllowed / todayTotal) * 100).toFixed(1) : "0.0";

  const lastSeenRoute = data?.lastSeen?.route || "-";
  const lastSeenTime = timeAgo(data?.lastSeen?.ts ?? null);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Overview of your API usage and security.
          </p>

          {/* Selected Key Details */}
          <div className="mt-3 text-sm text-gray-400">
            <span className="text-gray-500">Selected key:</span>{" "}
            <span className="text-white font-medium">
              {selected?.name || "—"}
            </span>{" "}
            {selected?.masked ? (
              <span className="font-mono text-gray-500">
                ({selected.masked})
              </span>
            ) : null}
            {!selected?.apiKey ? (
              <span className="ml-2 text-red-400">(not selected)</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Plan badge + details */}
          <div className="inline-flex flex-col items-start ">
            <span className="inline-flex justify-center items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 border border-emerald-500/20">
              {planBadge} |
              <div className="ml-1 mt-1 text-xs text-gray-500 inline-flex items-center relative">
                {rpm !== null && monthly !== null ? (
                  <>
                    {rpm} RPM • {monthly.toLocaleString()} / month
                  </>
                ) : (
                  <>RPM • Monthly</>
                )}
              </div>
            </span>
          </div>

          <Link
            href="/app/keys"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Manage Keys
          </Link>

          <button
            onClick={() => {
              toast.loading("Refreshing…", { id: "dash" });
              load().finally(() => toast.success("Updated", { id: "dash" }));
            }}
            className="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {(error || !selected?.apiKey) && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error || "No API key selected. Go to Keys and select a key."}{" "}
          <Link href="/app/keys" className="underline text-red-200">
            Go to Keys
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">Requests Today</p>
            <BarChart3 className="h-5 w-5 text-gray-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {loading ? "…" : todayTotal.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-sm text-emerald-400">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>
              {data?.today?.changePct
                ? `${data.today.changePct}% from yesterday`
                : "—"}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">Allowed</p>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {loading ? "…" : todayAllowed.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>{acceptRate}% acceptance rate</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">Blocked</p>
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {loading ? "…" : todayBlocked.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center text-sm text-red-400">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>Rate limits hit</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">Last Seen</p>
            <Clock className="h-5 w-5 text-gray-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {loading ? "…" : lastSeenTime}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span className="font-mono">{lastSeenRoute}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Recent Decisions</h3>
          <Link
            href="/app/logs"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-950/50 text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Timestamp</th>
                <th className="px-6 py-3 font-medium">Method</th>
                <th className="px-6 py-3 font-medium">Path</th>
                <th className="px-6 py-3 font-medium">IP Address</th>
                <th className="px-6 py-3 font-medium">Decision</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td className="px-6 py-4 text-gray-400" colSpan={5}>
                    Loading…
                  </td>
                </tr>
              ) : (data?.recent?.length ?? 0) === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-gray-400" colSpan={5}>
                    No recent decisions yet.
                  </td>
                </tr>
              ) : (
                data!.recent.slice(0, 8).map((log, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-300">
                      {timeAgo(log.ts)}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {log.method || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {log.route || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 font-mono">
                      {log.ip || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          log.allowed
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {log.allowed ? "Allowed" : "Blocked"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

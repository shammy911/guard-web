"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = localStorage.getItem("apiKey");
    if (!key) return;

    fetch("/api/dashboard", {
      headers: { "x-api-key": key },
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            r.status === 401
              ? "Unauthorized - please log in"
              : "Failed to load dashboard",
          );
        }
        return r.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-8">Select an API key…</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Overview of your API usage and security.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 border border-emerald-500/20">
            {data?.plan ?? "N/A"} : {data.limits?.rpm ?? "N/A"} RPM /{"   "}
            {data.limits?.monthly ?? "N/A"} monthly
          </span>
          <Link
            href="/app/keys"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Manage Keys
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">Requests Today</p>
            <BarChart3 className="h-5 w-5 text-gray-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {(data.usage?.today?.allowed ?? 0) + (data.usage?.today?.blocked ?? 0)}
          </p>
          <div className="mt-2 flex items-center text-sm text-emerald-400">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>12% from yesterday</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">Allowed</p>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {data.usage?.today?.allowed ?? 0}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>99.7% acceptance rate</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-400">Blocked</p>
            <ShieldAlert className="h-5 w-5 text-red-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {data.usage?.today?.blocked ?? 0}
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
            {data.usage?.today?.lastSeen ?? "N/A"}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <span>/api/v1/users</span>
          </div>
        </div>
      </div>

      {/* Usage Chart Mockup */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <h3 className="text-lg font-medium text-white mb-6">
          Request Volume (Last 7 Days)
        </h3>
        <div className="flex h-64 items-end justify-between gap-2">
          {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
            <div
              key={i}
              className="group relative flex-1 flex flex-col justify-end gap-2"
            >
              <div
                className="w-full rounded-t bg-emerald-500/20 hover:bg-emerald-500/40 transition-colors"
                style={{
                  height: `${height}%`,
                }}
              ></div>
              <span className="text-center text-xs text-gray-500">
                {new Date(
                  Date.now() - (6 - i) * 24 * 60 * 60 * 1000,
                ).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </span>
            </div>
          ))}
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
              {[
                {
                  time: "2s ago",
                  method: "GET",
                  path: "/api/v1/users",
                  ip: "192.168.1.42",
                  status: "allowed",
                },
                {
                  time: "5s ago",
                  method: "POST",
                  path: "/api/v1/auth",
                  ip: "10.0.0.15",
                  status: "allowed",
                },
                {
                  time: "12s ago",
                  method: "GET",
                  path: "/api/v1/products",
                  ip: "172.16.0.8",
                  status: "blocked",
                },
                {
                  time: "45s ago",
                  method: "GET",
                  path: "/api/v1/users",
                  ip: "192.168.1.42",
                  status: "allowed",
                },
                {
                  time: "1m ago",
                  method: "PUT",
                  path: "/api/v1/settings",
                  ip: "10.0.0.15",
                  status: "allowed",
                },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-gray-300">{log.time}</td>
                  <td className="px-6 py-4 text-gray-300 font-mono">
                    {log.method}
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono">
                    {log.path}
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${log.status === "allowed" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                    >
                      {log.status === "allowed" ? "Allowed" : "Blocked"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

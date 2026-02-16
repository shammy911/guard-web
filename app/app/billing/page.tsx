"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

type BillingStatusResponse = {
  plan: string; // "free" | "pro"
  billing_status?: string; // "active" | "canceled" | "none" | ...
  limits?: { rpm: number; monthly: number };
  // optional extras if you return them
  currentPeriodEnd?: string | null; // ISO string
};

function prettyPlanName(plan: string) {
  const p = (plan || "").toLowerCase();
  if (p === "pro") return "Pro";
  return "Free";
}

function prettyBillingStatus(s?: string) {
  const v = (s || "").toLowerCase();
  if (v === "active") return { label: "Active", tone: "emerald" as const };
  if (v === "canceled") return { label: "Canceled", tone: "red" as const };
  if (v) return { label: v, tone: "gray" as const };
  return { label: "Not Subscribed", tone: "gray" as const };
}

export default function BillingPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<BillingStatusResponse | null>(null);
  const [error, setError] = useState<string>("");

  // Selected key token is used by your API routes (they usually forward x-api-key)
  const selectedApiKey = useMemo(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("apiKey") || "";
  }, []);

  async function loadStatus() {
    setError("");
    setLoading(true);

    if (!selectedApiKey) {
      setLoading(false);
      setData(null);
      setError("No API key selected. Go to Keys and select a key.");
      return;
    }

    try {
      const res = await fetch("/api/billing/status", {
        headers: { "x-api-key": selectedApiKey },
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.error || "Failed to load billing status");
      setData(json);
    } catch (e: any) {
      setError(e?.message || "Failed to load billing status");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function goCheckout() {
    if (!selectedApiKey) return toast.error("Select an API key first.");
    const t = toast.loading("Opening checkout…");

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": selectedApiKey,
        },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Checkout failed");

      toast.success("Redirecting…", { id: t });
      window.location.href = json.url;
    } catch (e: any) {
      toast.error(e?.message || "Checkout failed", { id: t });
    }
  }

  async function openPortal() {
    if (!selectedApiKey) return toast.error("Select an API key first.");
    const t = toast.loading("Opening portal…");

    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": selectedApiKey,
        },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Portal failed");

      toast.success("Redirecting…", { id: t });
      window.location.href = json.url;
    } catch (e: any) {
      toast.error(e?.message || "Portal failed", { id: t });
    }
  }

  const planName = prettyPlanName(data?.plan || "free");
  const { label: statusLabel, tone } = prettyBillingStatus(
    data?.billing_status,
  );

  const rpm = data?.limits?.rpm ?? null;
  const monthly = data?.limits?.monthly ?? null;

  const isPro = (data?.plan || "").toLowerCase() === "pro";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-gray-400">
          Manage your subscription and payment methods.
        </p>
        {!selectedApiKey ? (
          <div className="mt-3 text-sm text-red-400">
            No API key selected.{" "}
            <Link className="underline" href="/app/keys">
              Go select a key
            </Link>
            .
          </div>
        ) : null}
      </div>

      {error ? <div className="text-sm text-red-400">{error}</div> : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {loading ? "…" : `${planName} Plan`}
                </h3>

                <p className="text-emerald-400 text-sm mt-1">
                  {loading
                    ? "Loading…"
                    : data?.currentPeriodEnd
                      ? `Renews until ${new Date(data.currentPeriodEnd).toLocaleDateString()}`
                      : isPro
                        ? "Subscription active"
                        : "No active subscription"}
                </p>
              </div>

              <span
                className={[
                  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
                  tone === "emerald"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "",
                  tone === "red" ? "bg-red-500/20 text-red-300" : "",
                  tone === "gray" ? "bg-gray-500/20 text-gray-300" : "",
                ].join(" ")}
              >
                {loading ? "…" : statusLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Monthly Requests</p>
                <p className="text-xl font-bold text-white">
                  {loading
                    ? "…"
                    : monthly !== null
                      ? `${monthly.toLocaleString()} / month`
                      : "—"}
                </p>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                  {/* this is a visual-only bar; true usage % can be added later */}
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{ width: "20%" }}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Rate Limit</p>
                <p className="text-xl font-bold text-white">
                  {loading ? "…" : rpm !== null ? `${rpm} RPM` : "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Log Retention</p>
                <p className="text-xl font-bold text-white">
                  {loading ? "…" : isPro ? "30 Days" : "24 Hours"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* If Pro: manage in portal. If Free: upgrade */}
              {isPro ? (
                <>
                  <button
                    onClick={openPortal}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors"
                  >
                    Manage Subscription / Payment
                  </button>
                  <button
                    onClick={loadStatus}
                    className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                  >
                    Refresh
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={goCheckout}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors disabled:opacity-40"
                    disabled={!selectedApiKey}
                  >
                    Upgrade to Pro
                  </button>
                  <Link
                    href="/pricing"
                    className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                  >
                    View pricing <ExternalLink className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Payment History: not supported in Guard API v1 unless you store invoices yourself */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h3 className="text-lg font-medium text-white">Payment History</h3>
            <p className="text-sm text-gray-400 mt-2">
              Coming soon. For now, manage invoices in the Lemon Squeezy
              customer portal.
            </p>

            <button
              onClick={openPortal}
              className="mt-4 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-40"
              disabled={!selectedApiKey}
            >
              Open Customer Portal
            </button>
          </div>
        </div>

        {/* Features Card (plan-aware) */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">
            Plan Features
          </h3>

          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>
                {isPro ? "300 RPM rate limiting" : "30 RPM rate limiting"}
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>
                {isPro ? "300,000 requests/month" : "10,000 requests/month"}
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>
                {isPro ? "30-day logs retention" : "24-hour logs retention"}
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Usage tracking</span>
            </li>
            {isPro ? (
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>Priority limits</span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}

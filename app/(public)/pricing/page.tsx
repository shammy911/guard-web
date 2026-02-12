import React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-gray-400">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-8 flex flex-col hover:border-emerald-500/30 transition-colors">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Free</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  Perfect for side projects and hobbyists.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  30 requests/minute
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  10,000 requests/month
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Basic Logs (24h retention)
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Usage tracking
                </li>
              </ul>

              <Link
                href="/register"
                className="block w-full rounded-lg border border-emerald-500 text-emerald-500 px-6 py-3 text-center text-sm font-semibold hover:bg-emerald-500 hover:text-white transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="relative rounded-2xl border border-emerald-500 bg-gray-900 p-8 flex flex-col shadow-2xl shadow-emerald-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">$5</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  For growing startups and production apps.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  300 requests/minute
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  300,000 requests/month
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Full Logs & Analytics (30d retention)
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Priority limits
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Dashboard access
                </li>
              </ul>

              <Link
                href="/register?plan=pro"
                className="block w-full rounded-lg bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
              >
                Start Pro
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-24 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  What happens if I exceed my limit?
                </h3>
                <p className="text-gray-400">
                  On the Free plan, requests will be denied with a 429 status.
                  On Pro, we'll email you before hard-capping, and you can
                  enable overage billing if needed.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Can I use Guard with any backend?
                </h3>
                <p className="text-gray-400">
                  Yes! Guard is a REST API that works with any language or
                  framework. We have SDKs for Node.js, Python, and Go, but you
                  can use simple HTTP calls too.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Is there a latency impact?
                </h3>
                <p className="text-gray-400">
                  Guard is distributed globally on the edge. Average latency is
                  under 30ms for most regions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  // Keep these in sync with Guard API PLANS
  const FREE = { rpm: 30, monthly: 10_000, price: 0 };
  const PRO = { rpm: 300, monthly: 300_000, price: 5 };

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
                  <span className="text-4xl font-bold text-white">
                    ${FREE.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  Perfect for side projects and hobbyists.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {FREE.rpm} requests/minute
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {FREE.monthly.toLocaleString()} requests/month
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
                  <span className="text-4xl font-bold text-white">
                    ${PRO.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm">
                  For production apps and teams.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {PRO.rpm} requests/minute
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {PRO.monthly.toLocaleString()} requests/month
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-5 w-5 text-emerald-500" />
                  Full Logs (30d retention)
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

              {/* Primary CTA for new users */}
              <Link
                href="/register?plan=pro"
                className="block w-full rounded-lg bg-emerald-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
              >
                Get Pro
              </Link>

              {/* Secondary CTA for existing users */}
              <Link
                href="/app/billing"
                className="mt-3 block w-full rounded-lg border border-gray-700 bg-transparent px-6 py-3 text-center text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-all"
              >
                Already have an account? Upgrade in dashboard
              </Link>
            </div>
          </div>

          <div className="mt-10 text-center text-sm text-gray-500">
            Billing is handled via Lemon Squeezy. Upgrade is applied to your
            selected API key.
          </div>
        </div>
      </main>
    </div>
  );
}

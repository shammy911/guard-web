import Link from "next/link";
import { Check, CreditCard, ExternalLink } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-gray-400">
          Manage your subscription and payment methods.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Plan */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Pro Plan</h3>
                <p className="text-emerald-400 text-sm mt-1">
                  Active until Dec 31, 2025
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Monthly Requests</p>
                <p className="text-xl font-bold text-white">142k / Unlimited</p>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full"
                    style={{
                      width: "15%",
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">API Keys</p>
                <p className="text-xl font-bold text-white">2 / Unlimited</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Log Retention</p>
                <p className="text-xl font-bold text-white">30 Days</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                Cancel Subscription
              </button>
              <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition-colors">
                Update Payment Method
              </button>
            </div>
          </div>

          {/* Payment History */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-lg font-medium text-white">
                Payment History
              </h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950/50 text-gray-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  {
                    date: "Oct 1, 2023",
                    amount: "$19.00",
                    status: "Paid",
                  },
                  {
                    date: "Sep 1, 2023",
                    amount: "$19.00",
                    status: "Paid",
                  },
                  {
                    date: "Aug 1, 2023",
                    amount: "$19.00",
                    status: "Paid",
                  },
                ].map((invoice, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-300">{invoice.date}</td>
                    <td className="px-6 py-4 text-white font-medium">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-white inline-flex items-center gap-1">
                        PDF <ExternalLink className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upgrade/Features Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">
            Plan Features
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Unlimited requests per month</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Unlimited API keys</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>30-day log retention</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Priority email support</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-emerald-500 shrink-0" />
              <span>Custom rate limit rules</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

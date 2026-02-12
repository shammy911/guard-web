import Link from "next/link";
import { Shield, Zap, Code, CheckCircle, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-emerald-500/30">
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 sm:pt-32">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              v1.0 is now live
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
              Guard API
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-400 mb-10">
              A lightweight rate limiting and abuse protection API for backend
              services. Protect your resources with a single line of code.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-lg bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/30"
              >
                Get Started
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto rounded-lg border border-gray-700 bg-gray-900/50 px-8 py-3 text-base font-semibold text-gray-300 transition-colors hover:border-emerald-500 hover:text-emerald-400"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-gray-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 transition-all hover:border-emerald-500/30">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Decision-based security
                </h3>
                <p className="text-gray-400">
                  Guard never blocks traffic for you. It tells you whether to
                  allow or deny, giving you full control over the response.
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 transition-all hover:border-emerald-500/30">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Usage-aware
                </h3>
                <p className="text-gray-400">
                  Daily and monthly usage tracking per API key. Set limits and
                  let Guard handle the counting and resetting.
                </p>
              </div>

              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 transition-all hover:border-emerald-500/30">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Code className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Built for developers
                </h3>
                <p className="text-gray-400">
                  Simple API, typed SDK, no heavy integrations. Drop it into
                  your existing middleware in minutes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 border-t border-gray-800 bg-gray-900/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                Three simple steps to secure your API.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Create an API Key
                    </h3>
                    <p className="text-gray-400">
                      Generate a secure API key in your dashboard to identify
                      your application.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Call Guard
                    </h3>
                    <p className="text-gray-400">
                      Make a request to Guard before processing your API
                      traffic.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Get Decision
                    </h3>
                    <p className="text-gray-400">
                      Receive an immediate allow/deny decision along with
                      current usage stats.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="ml-2 text-xs text-gray-500 font-mono">
                    api-check.ts
                  </span>
                </div>
                <pre className="font-mono text-sm text-gray-300 overflow-x-auto">
                  <code>
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-400">decision</span> ={" "}
                    <span className="text-purple-400">await</span> guard.
                    <span className="text-yellow-300">check</span>({"{"}
                    <span className="text-emerald-400">apiKey</span>:{" "}
                    <span className="text-orange-300">"grd_live_..."</span>,
                    <span className="text-emerald-400">ip</span>:{" "}
                    <span className="text-orange-300">"192.168.1.1"</span>,
                    <span className="text-emerald-400">path</span>:{" "}
                    <span className="text-orange-300">"/api/v1/users"</span>
                    {"}"});
                    <span className="text-purple-400">if</span>{" "}
                    (!decision.allowed) {"{"}
                    <span className="text-purple-400">return</span> res.
                    <span className="text-yellow-300">status</span>(429).
                    <span className="text-yellow-300">json</span>({"{"}
                    <span className="text-emerald-400">error</span>:{" "}
                    <span className="text-orange-300">
                      "Rate limit exceeded"
                    </span>
                    {"}"});
                    {"}"}
                    <span className="text-gray-500">
                      {" "}
                      // Continue processing...
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
              Ready to secure your API?
            </h2>
            <p className="text-lg text-gray-400 mb-10">
              Join thousands of developers who trust Guard for their rate
              limiting needs. Start for free, upgrade when you scale.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-emerald-500 hover:scale-105"
            >
              Start Building Now <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

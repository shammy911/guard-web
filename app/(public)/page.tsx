import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-4">Guard API</h1>

        <p className="text-lg text-slate-300 mb-8">
          A lightweight rate limiting and abuse protection API for backend
          services.
        </p>

        <div className="flex gap-4">
          <Link
            href="/docs/quickstart"
            className="bg-indigo-600 px-6 py-3 rounded-md font-medium"
          >
            Get Started
          </Link>

          <Link
            href="/pricing"
            className="border border-slate-700 px-6 py-3 rounded-md"
          >
            View Pricing
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            title="Decision-based security"
            desc="Guard never blocks traffic for you. It tells you whether to allow or deny."
          />
          <Feature
            title="Usage-aware"
            desc="Daily and monthly usage tracking per API key."
          />
          <Feature
            title="Built for developers"
            desc="Simple API, typed SDK, no heavy integrations."
          />
        </div>
      </div>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-slate-800 rounded-lg p-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}

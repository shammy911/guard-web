import CodeBlock from "@/components/docs/CodeBlock";

export default function QuickstartPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Quickstart Guide</h1>
        <p className="text-gray-400 text-lg">
          Protect sensitive endpoints with Guard in minutes.
        </p>
      </div>

      {/* Important note */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-200">
        <b>Server-only:</b> The SDK requires <code>x-guard-key</code>{" "}
        (MASTER_KEY). Never expose it in the browser.
      </div>

      <div className="space-y-6">
        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white">1. Get your keys</h3>
          <p className="text-gray-400 mt-1">
            Create an API key in your dashboard. You’ll also need a{" "}
            <b>MASTER_KEY</b> for Guard auth.
          </p>
        </div>

        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white">2. Install SDK</h3>
          <p className="text-gray-400 mt-1 mb-3">
            Not published yet — use local workspace / file install for now.
          </p>
          <CodeBlock
            code={`# examples (pick one)
pnpm add @guard/sdk
# or
npm i ../guard-sdk`}
          />
        </div>

        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white">3. Configure env</h3>
          <p className="text-gray-400 mt-1 mb-3">
            Keep secrets on the server only.
          </p>
          <CodeBlock
            code={`GUARD_BASE_URL=https://guard-api-production-490e.up.railway.app
GUARD_MASTER_KEY=guard_master_prod_key
GUARD_API_KEY=guard_********************************`}
          />
        </div>

        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white">
            4. Protect a route
          </h3>
          <p className="text-gray-400 mt-1 mb-3">
            Call Guard before your business logic.
          </p>
          <CodeBlock
            code={`import { GuardClient } from "@guard/sdk";

const guard = new GuardClient({
  baseUrl: process.env.GUARD_BASE_URL!,
  masterKey: process.env.GUARD_MASTER_KEY!,
  apiKey: process.env.GUARD_API_KEY!,
  timeoutMs: 800,
  failClosed: true,
});

export async function POST() {
  const decision = await guard.check("/api/login", "POST");

  if (!decision.allowed) {
    return new Response("Too Many Requests", { status: 429 });
  }

  return new Response("ok");
}`}
          />
        </div>

        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white">5. No SDK (curl)</h3>
          <CodeBlock
            code={`curl -X POST "$GUARD_BASE_URL/check" \\
  -H "Content-Type: application/json" \\
  -H "x-guard-key: $GUARD_MASTER_KEY" \\
  -H "x-api-key: $GUARD_API_KEY" \\
  -d '{"route":"/api/login","method":"POST"}'`}
          />
        </div>
      </div>
    </div>
  );
}

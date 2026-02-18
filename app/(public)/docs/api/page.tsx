import CodeBlock from "@/components/docs/CodeBlock";

export default function ApiPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">API Reference</h1>
        <p className="text-gray-400 text-lg">
          Call Guard directly over HTTP if you prefer not to use the SDK.
        </p>
      </div>

      {/* AUTH */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Authentication</h2>
        <p className="text-gray-400">Customer-facing endpoints use only:</p>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-4 font-mono text-sm text-gray-200 whitespace-pre-wrap">
          {`x-api-key: guard_***************
GUARD_URL=https://guard-api-production-490e.up.railway.app  # Our Guard API website URL`}
        </div>

        <p className="text-sm text-gray-400">
          Keep the API key server-side. If you build a public frontend, call
          Guard through your own backend (or Next.js API routes).
        </p>
      </section>

      <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
        <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-4 flex items-center gap-3">
          <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold">
            POST
          </span>
          <code className="text-sm font-mono text-white">/check</code>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-400">
            Decide whether a request should be allowed.
          </p>

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Headers</h4>
            <CodeBlock
              code={`x-api-key: <API_KEY>
Content-Type: application/json`}
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Body</h4>
            <CodeBlock
              code={`{
  "route": "/api/login",
  "method": "POST" // optional
}`}
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Response</h4>
            <CodeBlock
              code={`// allowed
{ "allowed": true }

// blocked
{ "allowed": false, "reason": "RATE_LIMIT" }`}
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Reasons</h4>
            <CodeBlock
              code={`RATE_LIMIT
MONTHLY_QUOTA_EXCEEDED
GUARD_RATE_LIMIT
SERVICE_UNAVAILABLE
UNAUTHORIZED
INVALID_API_KEY
API_KEY_DISABLED
ROUTE_REQUIRED`}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
        <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-4 flex items-center gap-3">
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">
            GET
          </span>
          <code className="text-sm font-mono text-white">/usage</code>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-400">Usage for your API key (monthly).</p>
          <CodeBlock
            code={`curl "$GUARD_URL/usage" \\
  -H "x-api-key: $GUARD_API_KEY"`}
          />
        </div>
      </div>

      {/* <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
        <div className="bg-gray-900/80 border-b border-gray-800 px-6 py-4 flex items-center gap-3">
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold">
            GET
          </span>
          <code className="text-sm font-mono text-white">/logs?limit=50</code>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-gray-400">
            Recent decisions (useful for debugging).
          </p>
          <CodeBlock
            code={`curl "$GUARD_URL/logs?limit=50" \\
  -H "x-guard-key: $GUARD_MASTER_KEY" \\
  -H "x-api-key: $GUARD_API_KEY"`}
          />
        </div>
      </div> */}
    </div>
  );
}

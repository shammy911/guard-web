export default function Quickstart() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-6">Quickstart</h1>

        <p className="text-slate-300 mb-6">
          Guard API helps you decide whether to allow or block incoming requests
          based on rate limits and usage.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">1. Get an API key</h2>
        <p className="text-slate-400">
          Sign up and create an API key from the dashboard.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          2. Call Guard before sensitive endpoints
        </h2>

        <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto">
          {`POST /check
x-guard-key: <MASTER_KEY>
x-api-key: <API_KEY>

{ "route": "/api/login" }`}
        </pre>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          3. Act on the decision
        </h2>

        <pre className="bg-slate-900 p-4 rounded-md overflow-x-auto">
          {`if (!decision.allowed) {
  return 429;
}`}
        </pre>
      </div>
    </main>
  );
}

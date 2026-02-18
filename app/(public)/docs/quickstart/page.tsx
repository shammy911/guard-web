import CodeBlock from "@/components/docs/CodeBlock";
import { Lightbulb } from "lucide-react";

export default function QuickstartPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Quickstart Guide</h1>
        <p className="text-gray-400 text-lg">
          Add Guard to your app in minutes. You’ll create an API key, install
          the SDK, and protect routes using{" "}
          <span className="font-mono font-bold text-gray-100 text-xl">
            /check
          </span>
          .
        </p>
      </div>

      <div className="space-y-6">
        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white">
            1. Create an API key
          </h3>
          <p className="text-gray-400 mt-1">
            In the Guard dashboard, go to <b>Keys</b> → <b>Create New Key</b>.
            Copy the full token (you'll only see it once).
          </p>
          <div
            className="rounded-xl border border-gray-800 bg-gray-950 p-4 mt-3 
          "
          >
            <p className="text-sm text-gray-400">
              Keep this key <b>server-side</b>. Don't expose it in client-side
              code.
            </p>
          </div>
          <h4 className="text-lg font-semibold text-white mb-2 mt-3">
            Guard API Base URL
          </h4>
          <p className="text-gray-400 mb-3">
            This is the URL your SDK will communicate with:
          </p>
          <CodeBlock code={process.env.GUARD_API_URL || ""} />
        </div>

        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            2. Install the SDK
          </h3>
          <CodeBlock code={`npm i @shammy911/guard-sdk`} />
        </div>

        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white">
            3. Use it in your backend
          </h3>
          <p className="text-gray-400 mt-1 mb-3">
            The SDK calls your hosted Guard API. Since{" "}
            <span className="font-mono">/check</span> is public now, you only
            send
            <span className="font-mono"> x-api-key</span>.
          </p>
          <CodeBlock
            code={`import { GuardClient } from "@shammy911/guard-sdk";

const guard = new GuardClient({
  baseUrl: process.env.GUARD_URL!,     // e.g. https://guard-api....up.railway.app
  apiKey: process.env.GUARD_API_KEY!,  // your Guard key (store server-side)
  timeoutMs: 800,
  failClosed: true, // recommended for security endpoints
});

export async function protectRequest(route: string, method?: string) {
  const decision = await guard.check(route, method);
  if (!decision.allowed) {
    // block request
    return { ok: false, reason: decision.reason };
  }
  return { ok: true };
}`}
          />
        </div>

        <div className="border-l-2 border-emerald-500 pl-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            4. Example: Next.js API route
          </h3>
          <CodeBlock
            code={`import { NextResponse } from "next/server";
import { GuardClient } from "@shammy911/guard-sdk";

const guard = new GuardClient({
  baseUrl: process.env.GUARD_URL!,
  apiKey: process.env.GUARD_API_KEY!,
  failClosed: true,
});

export async function POST(req: Request) {
  const decision = await guard.check("/api/login", "POST");
  if (!decision.allowed) {
    return NextResponse.json(
      { error: "Blocked", reason: decision.reason },
      { status: 429 }
    );
  }

  // continue login...
  return NextResponse.json({ ok: true });
}`}
          />
        </div>

        <div className="border-l-2 border-emerald-500 pl-4">
          <p className="text-md text-gray-400">
            <Lightbulb className="inline mr-2 text-amber-400" />
            <span className="font-semibold text-green-400">Tip:</span> Call
            Guard on security-sensitive endpoints first: login, signup, password
            reset, OTP verify, payment endpoints, etc.
          </p>
        </div>
      </div>
    </div>
  );
}

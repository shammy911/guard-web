import CodeBlock from "@/components/docs/CodeBlock";

export default function ExamplesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Examples</h1>
        <p className="text-gray-400 text-lg">
          Common patterns and integrations.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <h3 className="text-xl font-semibold text-white mb-3">
            Express: protect login only
          </h3>
          <p className="text-gray-400 mb-4">
            Call Guard before heavy auth/db work.
          </p>
          <CodeBlock
            code={`import express from "express";
import { GuardClient } from "@guard/sdk";

const app = express();

const guard = new GuardClient({
  baseUrl: process.env.GUARD_BASE_URL!,
  masterKey: process.env.GUARD_MASTER_KEY!,
  apiKey: process.env.GUARD_API_KEY!,
});

app.post("/api/login", async (req, res, next) => {
  const decision = await guard.check("/api/login", "POST");
  if (!decision.allowed) return res.status(429).json(decision);
  next();
});

app.listen(3000);`}
          />
        </section>

        <section>
          <h3 className="text-xl font-semibold text-white mb-3">
            Next.js: protect a route handler
          </h3>
          <CodeBlock
            code={`import { GuardClient } from "@guard/sdk";

const guard = new GuardClient({
  baseUrl: process.env.GUARD_BASE_URL!,
  masterKey: process.env.GUARD_MASTER_KEY!,
  apiKey: process.env.GUARD_API_KEY!,
  failClosed: true,
});

export async function POST() {
  const decision = await guard.check("/api/register", "POST");
  if (!decision.allowed) return new Response("Blocked", { status: 429 });
  return new Response("ok");
}`}
          />
        </section>

        <section>
          <h3 className="text-xl font-semibold text-white mb-3">
            Fail-open vs fail-closed
          </h3>
          <p className="text-gray-400 mb-4">
            For login/auth endpoints, fail-closed is safer.
          </p>
          <CodeBlock
            code={`// fail-closed (recommended)
new GuardClient({ baseUrl, masterKey, apiKey, failClosed: true });

// fail-open (availability-first)
new GuardClient({ baseUrl, masterKey, apiKey, failClosed: false });`}
          />
        </section>
      </div>
    </div>
  );
}

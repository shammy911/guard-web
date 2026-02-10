import { useSession } from "next-auth/react";
import { useState } from "react";

export default function KeysPage() {
  const { data: session } = useSession();
  const [apiKey, setApiKey] = useState<string | null>(null);

  async function createKey() {
    const res = await fetch("api/keys", { method: "POST" });
    const data = await res.json();
    setApiKey(data.key);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Keys</h1>

      <button onClick={createKey} className="bg-indigo-600 px-4 py-2 rounded">
        Create API Key
      </button>

      {apiKey && (
        <div className="mt-4 bg-slate-800 p-4 rounded">
          <p className="text-sm text-slate-400">
            Copy this key now. You won’t see it again.
          </p>
          <code className="block mt-2">{apiKey}</code>
        </div>
      )}
    </div>
  );
}

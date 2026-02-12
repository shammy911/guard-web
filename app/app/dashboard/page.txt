"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = localStorage.getItem("apiKey");
    if (!key) return;

    fetch("/api/dashboard", {
      headers: { "x-api-key": key },
      credentials: "include",
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            r.status === 401
              ? "Unauthorized - please log in"
              : "Failed to load dashboard",
          );
        }
        return r.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-8">Select an API key…</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <Card title="Plan">
        {data.plan} — {data.limits?.rpm ?? "N/A"} RPM /{"   "}
        {data.limits?.monthly ?? "N/A"} monthly
      </Card>

      <Card title="Today">
        Allowed: {data.usage?.today?.allowed ?? 0} <br />
        Blocked: {data.usage?.today?.blocked ?? 0}
      </Card>

      <Card title="This Month">Total used: {data.usage?.month ?? 0}</Card>

      <Card title="Last Seen">{data.lastSeen ?? "Never"}</Card>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="border border-slate-800 rounded-lg p-4">
      <h2 className="font-semibold mb-2">{title}</h2>
      {children}
    </div>
  );
}

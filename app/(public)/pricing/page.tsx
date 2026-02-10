export default function Pricing() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-10">Pricing</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Plan
            name="Free"
            price="$0"
            features={[
              "30 requests/minute",
              "10,000 requests/month",
              "Usage tracking",
            ]}
          />

          <Plan
            name="Pro"
            price="$10 / month"
            highlight
            features={[
              "300 requests/minute",
              "300,000 requests/month",
              "Priority limits",
              "Dashboard access",
            ]}
          />
        </div>
      </div>
    </main>
  );
}

function Plan({
  name,
  price,
  features,
  highlight,
}: {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-6 border ${
        highlight ? "border-indigo-600" : "border-slate-800"
      }`}
    >
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-3xl font-bold my-4">{price}</p>

      <ul className="space-y-2 text-slate-300">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
    </div>
  );
}

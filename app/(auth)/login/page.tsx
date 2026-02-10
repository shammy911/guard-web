"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/app/dashboard",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <input
          value={email}
          className="w-full p-2 bg-slate-800"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          value={password}
          className="w-full p-2 bg-slate-800"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-indigo-600 w-full p-2 rounded">
          Login
        </button>
      </form>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiRequestError } from "@/lib/auth-context";

export default function ProviderLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "PROVIDER" && user.role !== "ADMIN") {
        setError("This account is not registered as a provider.");
        setLoading(false);
        return;
      }
      router.push("/provider");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900">Provider Login</h1>
      <p className="mt-1 text-stone-500">Sign in to manage your listings, reservations, and donations.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <Field label="Email">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </Field>
        <Field label="Password">
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-stone-500">
        New provider?{" "}
        <Link href="/provider/register" className="font-semibold text-brand-600 underline">
          Register your business
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-stone-400">
        Not a provider?{" "}
        <Link href="/login" className="underline">
          Customer login
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}

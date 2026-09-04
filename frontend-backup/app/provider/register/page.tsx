"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiRequestError } from "@/lib/auth-context";

const BUSINESS_TYPES = ["Restaurant", "Hotel", "Bakery", "Cafe", "Supermarket", "Event Organizer", "Other"];

export default function ProviderRegisterPage() {
  const router = useRouter();
  const { registerProvider } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerProvider({ name, email, password, businessName, businessType, location, phone });
      router.push("/provider");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900">List Surplus Food</h1>
      <p className="mt-1 text-stone-500">Register your business to start listing surplus food on RiceShare.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <Field label="Your name">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </Field>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </Field>
        <Field label="Business name">
          <input
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. ABC Restaurant"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </Field>
        <Field label="Business type">
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location">
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Malabe"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </Field>
        <Field label="Contact phone">
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 077 123 4567"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
          <span className="mt-1 block text-xs text-stone-400">
            Customers will call this number directly to reserve or request food — no accounts needed.
          </span>
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Create provider account"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-stone-500">
        Already registered?{" "}
        <Link href="/provider/login" className="font-semibold text-brand-600 underline">
          Sign in
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

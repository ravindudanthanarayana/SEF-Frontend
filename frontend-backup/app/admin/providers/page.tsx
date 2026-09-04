"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { adminNavItems } from "@/lib/nav-items";
import { apiFetch } from "@/lib/api-client";

type AdminProvider = {
  id: string;
  businessName: string;
  businessType: string;
  location: string;
  user: { name: string; email: string };
  _count: { listings: number };
};

export default function AdminProvidersPage() {
  return (
    <RequireRole role="ADMIN">
      <DashboardShell title="Admin" items={adminNavItems()}>
        <ProvidersList />
      </DashboardShell>
    </RequireRole>
  );
}

function ProvidersList() {
  const [providers, setProviders] = useState<AdminProvider[] | null>(null);

  useEffect(() => {
    apiFetch<{ providers: AdminProvider[] }>("/api/admin/providers").then((d) => setProviders(d.providers));
  }, []);

  if (!providers) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Providers</h1>
      {providers.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No providers yet" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Listings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {providers.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-stone-800">{p.businessName}</td>
                  <td className="px-4 py-3">{p.businessType}</td>
                  <td className="px-4 py-3">{p.location}</td>
                  <td className="px-4 py-3">{p.user.email}</td>
                  <td className="px-4 py-3">{p._count.listings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

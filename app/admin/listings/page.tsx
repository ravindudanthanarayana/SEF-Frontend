"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { adminNavItems } from "@/lib/nav-items";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";
import type { ListingDTO } from "@/types";

type AdminListing = ListingDTO & { reportCount: number };

export default function AdminListingsPage() {
  return (
    <RequireRole role="ADMIN">
      <DashboardShell title="Admin" items={adminNavItems()}>
        <ListingsList />
      </DashboardShell>
    </RequireRole>
  );
}

function ListingsList() {
  const [listings, setListings] = useState<AdminListing[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch<{ listings: AdminListing[] }>("/api/admin/listings").then((d) => setListings(d.listings));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function removeListing(id: string) {
    setBusyId(id);
    try {
      await apiFetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't remove this listing.");
    } finally {
      setBusyId(null);
    }
  }

  if (!listings) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Listings</h1>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {listings.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No listings yet" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Food</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Reports</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {listings.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-medium text-stone-800">{l.foodName}</td>
                  <td className="px-4 py-3">{l.providerName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.listingType} />
                  </td>
                  <td className="px-4 py-3">{l.listingType === "DONATION" ? "Free" : formatCurrency(l.sellingPrice)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-4 py-3">{l.reportCount}</td>
                  <td className="px-4 py-3">
                    {l.status !== "REMOVED" && (
                      <button
                        onClick={() => removeListing(l.id)}
                        disabled={busyId === l.id}
                        className="font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { providerNavItems } from "@/lib/nav-items";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { ListingDTO } from "@/types";

export default function MyListingsPage() {
  return (
    <RequireRole role="PROVIDER">
      <DashboardShell title="Provider" items={providerNavItems()}>
        <MyListings />
      </DashboardShell>
    </RequireRole>
  );
}

function MyListings() {
  const [listings, setListings] = useState<ListingDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closingId, setClosingId] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch<{ listings: ListingDTO[] }>("/api/listings?mine=true")
      .then((d) => setListings(d.listings))
      .catch(() => setError("Couldn't load your listings."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function closeListing(id: string) {
    setClosingId(id);
    try {
      await apiFetch(`/api/listings/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't close this listing.");
    } finally {
      setClosingId(null);
    }
  }

  if (error) return <EmptyState title="Something went wrong" description={error} />;
  if (!listings) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">My Listings</h1>
        <Link href="/provider/listings/new" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          + Add Food
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No listings yet"
            description="Create your first listing to start selling or donating surplus food."
            action={
              <Link href="/provider/listings/new" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
                Add Food
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Food</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Remaining</th>
                <th className="px-4 py-3">Pickup until</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {listings.map((l) => {
                const closable = !["CLOSED", "REMOVED", "EXPIRED"].includes(l.status);
                return (
                  <tr key={l.id}>
                    <td className="px-4 py-3 font-medium text-stone-800">{l.foodName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={l.listingType} />
                    </td>
                    <td className="px-4 py-3">
                      {l.listingType === "DONATION" ? "Free" : formatCurrency(l.sellingPrice)}
                    </td>
                    <td className="px-4 py-3">
                      {l.quantityRemaining} / {l.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(l.pickupEnd)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={l.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link href={`/provider/listings/${l.id}/edit`} className="font-medium text-brand-600 hover:underline">
                          Edit
                        </Link>
                        {closable && (
                          <button
                            onClick={() => closeListing(l.id)}
                            disabled={closingId === l.id}
                            className="font-medium text-red-600 hover:underline disabled:opacity-50"
                          >
                            {closingId === l.id ? "Closing..." : "Close"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

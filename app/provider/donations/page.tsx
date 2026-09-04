"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { providerNavItems } from "@/lib/nav-items";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import { formatDateTime } from "@/lib/format";
import type { DonationRequestDTO } from "@/types";

export default function ProviderDonationsPage() {
  return (
    <RequireRole role="PROVIDER">
      <DashboardShell title="Provider" items={providerNavItems()}>
        <DonationsList />
      </DashboardShell>
    </RequireRole>
  );
}

function DonationsList() {
  const [requests, setRequests] = useState<DonationRequestDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch<{ donationRequests: DonationRequestDTO[] }>("/api/donation-requests?scope=provider")
      .then((d) => setRequests(d.donationRequests))
      .catch(() => setError("Couldn't load donation requests."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: "ACCEPTED" | "REJECTED" | "COLLECTED") {
    setBusyId(id);
    setError(null);
    try {
      await apiFetch(`/api/donation-requests/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't update this request.");
    } finally {
      setBusyId(null);
    }
  }

  if (!requests) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Donation Requests</h1>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {requests.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No donation requests yet" description="Requests for your donated food will appear here." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Food</th>
                <th className="px-4 py-3">Requester</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Pickup by</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-stone-800">{r.listing.foodName}</td>
                  <td className="px-4 py-3">
                    {r.name}
                    <div className="text-xs text-stone-400">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3">{r.quantity}</td>
                  <td className="px-4 py-3 max-w-[220px] truncate" title={r.reason}>
                    {r.reason}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(r.listing.pickupEnd)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "PENDING" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateStatus(r.id, "ACCEPTED")}
                          disabled={busyId === r.id}
                          className="font-medium text-emerald-600 hover:underline disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "REJECTED")}
                          disabled={busyId === r.id}
                          className="font-medium text-red-600 hover:underline disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {r.status === "ACCEPTED" && (
                      <button
                        onClick={() => updateStatus(r.id, "COLLECTED")}
                        disabled={busyId === r.id}
                        className="font-medium text-sky-600 hover:underline disabled:opacity-50"
                      >
                        Mark collected
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

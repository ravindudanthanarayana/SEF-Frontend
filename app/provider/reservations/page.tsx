"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { providerNavItems } from "@/lib/nav-items";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { ReservationDTO } from "@/types";

export default function ProviderReservationsPage() {
  return (
    <RequireRole role="PROVIDER">
      <DashboardShell title="Provider" items={providerNavItems()}>
        <ReservationsList />
      </DashboardShell>
    </RequireRole>
  );
}

function ReservationsList() {
  const [reservations, setReservations] = useState<ReservationDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch<{ reservations: ReservationDTO[] }>("/api/reservations?scope=provider")
      .then((d) => setReservations(d.reservations))
      .catch(() => setError("Couldn't load reservations."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: "COLLECTED" | "CANCELLED") {
    setBusyId(id);
    try {
      await apiFetch(`/api/reservations/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't update reservation.");
    } finally {
      setBusyId(null);
    }
  }

  if (error) return <EmptyState title="Something went wrong" description={error} />;
  if (!reservations) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Reservations</h1>
      {reservations.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No reservations yet" description="Reservations for your sale listings will appear here." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Food</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Pickup by</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-stone-800">{r.listing.foodName}</td>
                  <td className="px-4 py-3">
                    {r.name}
                    <div className="text-xs text-stone-400">{r.phone}</div>
                  </td>
                  <td className="px-4 py-3">{r.quantity}</td>
                  <td className="px-4 py-3">{formatCurrency(r.totalAmount)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(r.listing.pickupEnd)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "CONFIRMED" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateStatus(r.id, "COLLECTED")}
                          disabled={busyId === r.id}
                          className="font-medium text-emerald-600 hover:underline disabled:opacity-50"
                        >
                          Mark collected
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "CANCELLED")}
                          disabled={busyId === r.id}
                          className="font-medium text-red-600 hover:underline disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
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

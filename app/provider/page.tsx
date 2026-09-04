"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import StatCard from "@/components/StatCard";
import LoadingState from "@/components/LoadingState";
import { providerNavItems } from "@/lib/nav-items";
import { apiFetch } from "@/lib/api-client";
import type { DonationRequestDTO, ListingDTO, ReservationDTO } from "@/types";

export default function ProviderDashboardPage() {
  return (
    <RequireRole role="PROVIDER">
      <DashboardShell title="Provider" items={providerNavItems()}>
        <ProviderOverview />
      </DashboardShell>
    </RequireRole>
  );
}

function ProviderOverview() {
  const [listings, setListings] = useState<ListingDTO[] | null>(null);
  const [reservations, setReservations] = useState<ReservationDTO[] | null>(null);
  const [donations, setDonations] = useState<DonationRequestDTO[] | null>(null);

  useEffect(() => {
    apiFetch<{ listings: ListingDTO[] }>("/api/listings?mine=true").then((d) => setListings(d.listings));
    apiFetch<{ reservations: ReservationDTO[] }>("/api/reservations?scope=provider").then((d) =>
      setReservations(d.reservations),
    );
    apiFetch<{ donationRequests: DonationRequestDTO[] }>("/api/donation-requests?scope=provider").then((d) =>
      setDonations(d.donationRequests),
    );
  }, []);

  if (!listings || !reservations || !donations) return <LoadingState />;

  const activeListings = listings.filter((l) => !["CLOSED", "REMOVED", "EXPIRED"].includes(l.status));
  const totalPortions = listings.reduce((sum, l) => sum + l.quantity, 0);
  const mealsRescued =
    reservations.filter((r) => r.status !== "CANCELLED").reduce((sum, r) => sum + r.quantity, 0) +
    donations.filter((d) => d.status === "ACCEPTED" || d.status === "COLLECTED").reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Provider Dashboard</h1>
        <Link href="/provider/listings/new" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white">
          + Add Food
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Active Listings" value={activeListings.length} />
        <StatCard label="Total Portions Listed" value={totalPortions} />
        <StatCard label="Reservations" value={reservations.length} />
        <StatCard label="Donation Requests" value={donations.length} />
        <StatCard label="Meals Rescued" value={mealsRescued} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-stone-800">Recent listings</h2>
          <ul className="mt-3 divide-y divide-stone-100 text-sm">
            {listings.slice(0, 5).map((l) => (
              <li key={l.id} className="flex justify-between py-2">
                <span className="truncate">{l.foodName}</span>
                <span className="text-stone-400">{l.quantityRemaining} left</span>
              </li>
            ))}
            {listings.length === 0 && <p className="py-2 text-stone-400">No listings yet.</p>}
          </ul>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="font-semibold text-stone-800">Recent reservations</h2>
          <ul className="mt-3 divide-y divide-stone-100 text-sm">
            {reservations.slice(0, 5).map((r) => (
              <li key={r.id} className="flex justify-between py-2">
                <span className="truncate">{r.listing.foodName}</span>
                <span className="text-stone-400">{r.quantity} portion(s)</span>
              </li>
            ))}
            {reservations.length === 0 && <p className="py-2 text-stone-400">No reservations yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import StatCard from "@/components/StatCard";
import LoadingState from "@/components/LoadingState";
import { providerNavItems } from "@/lib/nav-items";
import { apiFetch } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";
import type { DonationRequestDTO, ListingDTO, ReservationDTO } from "@/types";

export default function ProviderImpactPage() {
  return (
    <RequireRole role="PROVIDER">
      <DashboardShell title="Provider" items={providerNavItems()}>
        <ImpactContent />
      </DashboardShell>
    </RequireRole>
  );
}

function ImpactContent() {
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

  const completedReservations = reservations.filter((r) => r.status !== "CANCELLED");
  const mealsSold = completedReservations.reduce((sum, r) => sum + r.quantity, 0);
  const completedDonations = donations.filter((d) => d.status === "ACCEPTED" || d.status === "COLLECTED");
  const mealsDonated = completedDonations.reduce((sum, d) => sum + d.quantity, 0);
  const moneySaved = completedReservations.reduce(
    (sum, r) => sum + (r.listing.originalPrice - r.listing.sellingPrice) * r.quantity,
    0,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Your Impact</h1>
      <p className="mt-1 text-stone-500">See the difference your surplus food listings have made.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Listings Created" value={listings.length} />
        <StatCard label="Meals Sold" value={mealsSold} />
        <StatCard label="Meals Donated" value={mealsDonated} />
        <StatCard label="Customer Savings" value={formatCurrency(Math.round(moneySaved))} />
      </div>
    </div>
  );
}

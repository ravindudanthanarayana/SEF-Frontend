"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import StatCard from "@/components/StatCard";
import LoadingState from "@/components/LoadingState";
import { adminNavItems } from "@/lib/nav-items";
import { apiFetch } from "@/lib/api-client";

type AdminUser = { role: string };
type AdminProvider = { id: string };
type AdminListing = { status: string };

export default function AdminDashboardPage() {
  return (
    <RequireRole role="ADMIN">
      <DashboardShell title="Admin" items={adminNavItems()}>
        <AdminOverview />
      </DashboardShell>
    </RequireRole>
  );
}

function AdminOverview() {
  const [data, setData] = useState<{
    users: AdminUser[];
    providers: AdminProvider[];
    listings: AdminListing[];
    reservations: number;
    donations: number;
    mealsRescued: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<{ users: AdminUser[] }>("/api/admin/users"),
      apiFetch<{ providers: AdminProvider[] }>("/api/admin/providers"),
      apiFetch<{ listings: AdminListing[] }>("/api/admin/listings"),
      apiFetch<{ mealsRescued: number; mealsDonated: number }>("/api/stats"),
    ]).then(([users, providers, listings, stats]) => {
      setData({
        users: users.users,
        providers: providers.providers,
        listings: listings.listings,
        reservations: 0,
        donations: stats.mealsDonated,
        mealsRescued: stats.mealsRescued,
      });
    });
  }, []);

  if (!data) return <LoadingState />;

  const activeListings = data.listings.filter((l) => !["CLOSED", "REMOVED", "EXPIRED"].includes(l.status)).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Users" value={data.users.length} />
        <StatCard label="Total Providers" value={data.providers.length} />
        <StatCard label="Active Listings" value={activeListings} />
        <StatCard label="Total Listings" value={data.listings.length} />
        <StatCard label="Meals Donated" value={data.donations} />
        <StatCard label="Meals Rescued" value={data.mealsRescued} />
      </div>
    </div>
  );
}

"use client";

import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import ListingForm from "@/components/ListingForm";
import { providerNavItems } from "@/lib/nav-items";

export default function NewListingPage() {
  return (
    <RequireRole role="PROVIDER">
      <DashboardShell title="Provider" items={providerNavItems()}>
        <h1 className="mb-6 text-2xl font-bold text-stone-900">Add Food</h1>
        <ListingForm />
      </DashboardShell>
    </RequireRole>
  );
}

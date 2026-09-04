"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import ListingForm from "@/components/ListingForm";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { providerNavItems } from "@/lib/nav-items";
import { apiFetch } from "@/lib/api-client";
import type { ListingDTO } from "@/types";

export default function EditListingPage() {
  return (
    <RequireRole role="PROVIDER">
      <DashboardShell title="Provider" items={providerNavItems()}>
        <EditListingContent />
      </DashboardShell>
    </RequireRole>
  );
}

function EditListingContent() {
  const params = useParams<{ id: string }>();
  const [listing, setListing] = useState<ListingDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ listing: ListingDTO }>(`/api/listings/${params.id}`)
      .then((d) => setListing(d.listing))
      .catch(() => setError("Couldn't load this listing."));
  }, [params.id]);

  if (error) return <EmptyState title="Something went wrong" description={error} />;
  if (!listing) return <LoadingState />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Edit Listing</h1>
      <ListingForm listing={listing} />
    </div>
  );
}

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import FoodCard from "@/components/FoodCard";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import { apiFetch } from "@/lib/api-client";
import { CATEGORIES, type ListingDTO } from "@/types";

export default function BrowsePage() {
  return (
    <Suspense fallback={<LoadingState label="Loading..." />}>
      <BrowseContent />
    </Suspense>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");
  const [listings, setListings] = useState<ListingDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (sort) params.set("sort", sort);
    return params.toString();
  }, [q, category, location, type, sort]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setError(null);
      apiFetch<{ listings: ListingDTO[] }>(`/api/listings?${query}`)
        .then((data) => setListings(data.listings))
        .catch(() => setError("Couldn't load listings right now. Please try again."));
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-stone-900">Find Food</h1>
      <p className="mt-1 text-stone-500">Search discounted meals or free donations near you.</p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search food or provider..."
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none lg:col-span-2"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g. Malabe)"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Sale &amp; Donation</option>
          <option value="SALE">Sale only</option>
          <option value="DONATION">Donation only</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none sm:col-span-2 lg:col-span-5"
        >
          <option value="">Newest first</option>
          <option value="pickup-soon">Pickup ending soonest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="mt-8">
        {error && <EmptyState title="Something went wrong" description={error} />}
        {!error && listings === null && <LoadingState label="Finding food near you..." />}
        {!error && listings !== null && listings.length === 0 && (
          <EmptyState
            title="No food found matching your filters."
            description="Try a different search term, category, or location."
          />
        )}
        {!error && listings !== null && listings.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <FoodCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

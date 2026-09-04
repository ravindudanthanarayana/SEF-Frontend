import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import type { ListingDTO } from "@/types";
import { formatPickupWindow } from "@/lib/format";

export default function FoodCard({ listing }: { listing: ListingDTO }) {
  const isDonation = listing.listingType === "DONATION";
  const discountPct =
    !isDonation && listing.originalPrice > 0
      ? Math.round((1 - listing.sellingPrice / listing.originalPrice) * 100)
      : 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={listing.imageUrl || `https://picsum.photos/seed/${listing.id}/640/420`}
        alt={listing.foodName}
        className="h-36 w-full object-cover"
      />
      <div className="flex items-start justify-between gap-2 border-b border-stone-100 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-stone-900">{listing.foodName}</h3>
          <p className="truncate text-sm text-stone-500">{listing.providerName}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <StatusBadge status={listing.listingType} />
          <StatusBadge status={listing.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          {isDonation ? (
            <p className="text-xl font-bold text-emerald-600">FREE</p>
          ) : (
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-brand-700">Rs. {listing.sellingPrice.toLocaleString()}</p>
              {listing.originalPrice > listing.sellingPrice && (
                <>
                  <p className="text-sm text-stone-400 line-through">
                    Rs. {listing.originalPrice.toLocaleString()}
                  </p>
                  <span className="text-xs font-semibold text-emerald-600">{discountPct}% off</span>
                </>
              )}
            </div>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm text-stone-600">
          <dt className="text-stone-400">Quantity</dt>
          <dd>{listing.quantityRemaining} portions</dd>
          <dt className="text-stone-400">Location</dt>
          <dd className="truncate">{listing.location}</dd>
          <dt className="text-stone-400">Pickup until</dt>
          <dd className="col-span-1">{formatPickupWindow(listing.pickupEnd)}</dd>
        </dl>

        <div className="mt-auto pt-2">
          <Link
            href={`/food/${listing.id}`}
            className="block w-full rounded-lg bg-stone-900 py-2 text-center text-sm font-semibold text-white hover:bg-stone-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { formatCurrency, formatDateTime } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import ContactProviderCard from "@/components/ContactProviderCard";
import type { ListingDTO } from "@/types";

export const dynamic = "force-dynamic";

async function getListing(id: string): Promise<ListingDTO | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const res = await fetch(`${base}/api/listings/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load listing");
  const data = await res.json();
  return data.listing;
}

export default async function FoodDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dto = await getListing(id);
  if (!dto) notFound();

  const isDonation = dto.listingType === "DONATION";
  const discountPct =
    !isDonation && dto.originalPrice > 0 ? Math.round((1 - dto.sellingPrice / dto.originalPrice) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dto.imageUrl || `https://picsum.photos/seed/${dto.id}/640/420`}
            alt={dto.foodName}
            className="mb-4 h-56 w-full rounded-2xl object-cover"
          />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={dto.listingType} />
            <StatusBadge status={dto.status} />
          </div>
          <h1 className="mt-3 text-3xl font-bold text-stone-900">{dto.foodName}</h1>
          <p className="mt-1 text-stone-500">{dto.providerName}</p>

          <div className="mt-4">
            {isDonation ? (
              <p className="text-3xl font-extrabold text-emerald-600">FREE</p>
            ) : (
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-extrabold text-brand-700">{formatCurrency(dto.sellingPrice)}</p>
                {dto.originalPrice > dto.sellingPrice && (
                  <>
                    <p className="text-lg text-stone-400 line-through">{formatCurrency(dto.originalPrice)}</p>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-sm font-semibold text-emerald-700">
                      {discountPct}% off
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="mt-5 text-stone-600">{dto.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-y-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm">
            <Detail label="Category" value={dto.category} />
            <Detail label="Quantity remaining" value={`${dto.quantityRemaining} of ${dto.quantity}`} />
            <Detail label="Location" value={dto.location} />
            <Detail label="Pickup window" value={`${formatDateTime(dto.pickupStart)} – ${formatDateTime(dto.pickupEnd)}`} />
          </dl>
        </div>

        <div>
          <ContactProviderCard listing={dto} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="col-span-2 flex justify-between gap-4 border-b border-stone-100 pb-2 last:border-0 sm:col-span-1">
      <dt className="text-stone-400">{label}</dt>
      <dd className="text-right font-medium text-stone-700">{value}</dd>
    </div>
  );
}

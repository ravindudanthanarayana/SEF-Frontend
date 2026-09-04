import type { ListingDTO } from "@/types";

export default function ContactProviderCard({ listing }: { listing: ListingDTO }) {
  const isDonation = listing.listingType === "DONATION";
  const disabled = listing.quantityRemaining <= 0 || !["AVAILABLE", "ENDING_SOON"].includes(listing.status);
  const phone = listing.providerPhone;

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-stone-900">
        {isDonation ? "Request this donation" : "Reserve this food"}
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        No account needed — just contact {listing.providerName} directly to{" "}
        {isDonation ? "arrange your donation pickup" : "reserve and pay at pickup"}.
      </p>

      {disabled ? (
        <p className="mt-4 rounded-lg bg-stone-100 p-4 text-sm text-stone-500">
          This listing is no longer available.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-stone-50 p-4">
            <p className="text-xs font-medium text-stone-400">Provider</p>
            <p className="font-semibold text-stone-800">{listing.providerName}</p>
            <p className="text-sm text-stone-500">{listing.location}</p>
          </div>

          {phone ? (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className={`block w-full rounded-lg py-2.5 text-center text-sm font-semibold text-white ${
                isDonation ? "bg-emerald-600 hover:bg-emerald-700" : "bg-brand-600 hover:bg-brand-700"
              }`}
            >
              📞 Call {phone}
            </a>
          ) : (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              This provider hasn&apos;t added a contact number yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import { toDatetimeLocalValue } from "@/lib/format";
import { CATEGORIES, type ListingDTO, type ListingType } from "@/types";

type FormState = {
  foodName: string;
  category: string;
  quantity: string;
  listingType: ListingType;
  originalPrice: string;
  sellingPrice: string;
  location: string;
  pickupStart: string;
  pickupEnd: string;
  description: string;
  imageUrl: string;
};

function initialState(listing?: ListingDTO): FormState {
  const now = new Date();
  const later = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  return {
    foodName: listing?.foodName ?? "",
    category: listing?.category ?? CATEGORIES[0],
    quantity: listing ? String(listing.quantity) : "",
    listingType: listing?.listingType ?? "SALE",
    originalPrice: listing ? String(listing.originalPrice) : "",
    sellingPrice: listing ? String(listing.sellingPrice) : "",
    location: listing?.location ?? "",
    pickupStart: listing ? toDatetimeLocalValue(new Date(listing.pickupStart)) : toDatetimeLocalValue(now),
    pickupEnd: listing ? toDatetimeLocalValue(new Date(listing.pickupEnd)) : toDatetimeLocalValue(later),
    description: listing?.description ?? "",
    imageUrl: listing?.imageUrl ?? "",
  };
}

export default function ListingForm({ listing }: { listing?: ListingDTO }) {
  const router = useRouter();
  const isEdit = !!listing;
  const [form, setForm] = useState<FormState>(initialState(listing));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string | null {
    const errors: Record<string, string> = {};
    if (form.foodName.trim().length < 2) errors.foodName = "Food name must be at least 2 characters";
    const quantity = Number(form.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) errors.quantity = "Quantity must be greater than 0";
    const originalPrice = Number(form.originalPrice || 0);
    const sellingPrice = form.listingType === "DONATION" ? 0 : Number(form.sellingPrice || 0);
    if (originalPrice < 0) errors.originalPrice = "Price cannot be negative";
    if (sellingPrice < 0) errors.sellingPrice = "Price cannot be negative";
    if (form.listingType === "SALE" && originalPrice <= 0) errors.originalPrice = "Original price must be greater than 0";
    if (form.listingType === "SALE" && sellingPrice > originalPrice) {
      errors.sellingPrice = "Selling price cannot exceed original price";
    }
    if (!form.location.trim()) errors.location = "Location is required";
    if (form.description.trim().length < 10) errors.description = "Description must be at least 10 characters";
    const start = new Date(form.pickupStart);
    const end = new Date(form.pickupEnd);
    if (end <= start) errors.pickupEnd = "Pickup end must be after pickup start";
    if (end < new Date()) errors.pickupEnd = "Pickup end must be in the future";

    setFieldErrors(errors);
    return Object.keys(errors).length > 0 ? "Please fix the highlighted fields." : null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    const payload = {
      foodName: form.foodName,
      category: form.category,
      quantity: Number(form.quantity),
      listingType: form.listingType,
      originalPrice: Number(form.originalPrice || 0),
      sellingPrice: form.listingType === "DONATION" ? 0 : Number(form.sellingPrice || 0),
      location: form.location,
      pickupStart: new Date(form.pickupStart).toISOString(),
      pickupEnd: new Date(form.pickupEnd).toISOString(),
      description: form.description,
      imageUrl: form.imageUrl.trim(),
    };

    try {
      if (isEdit) {
        await apiFetch(`/api/listings/${listing!.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/api/listings", { method: "POST", body: JSON.stringify(payload) });
      }
      router.push("/provider/listings");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Food name" error={fieldErrors.foodName}>
          <input
            value={form.foodName}
            onChange={(e) => update("foodName", e.target.value)}
            className={inputClass(!!fieldErrors.foodName)}
            placeholder="e.g. Chicken Rice"
          />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={(e) => update("category", e.target.value)} className={inputClass(false)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Listing type">
        <div className="flex gap-3">
          {(["SALE", "DONATION"] as const).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => update("listingType", type)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                form.listingType === type
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "border-stone-300 text-stone-600"
              }`}
            >
              {type === "SALE" ? "Sell at a discount" : "Donate for free"}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Quantity (portions)" error={fieldErrors.quantity}>
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className={inputClass(!!fieldErrors.quantity)}
          />
        </Field>
        <Field label="Original price (Rs.)" error={fieldErrors.originalPrice}>
          <input
            type="number"
            min={0}
            value={form.originalPrice}
            onChange={(e) => update("originalPrice", e.target.value)}
            className={inputClass(!!fieldErrors.originalPrice)}
          />
        </Field>
        <Field label="Selling price (Rs.)" error={fieldErrors.sellingPrice}>
          <input
            type="number"
            min={0}
            disabled={form.listingType === "DONATION"}
            value={form.listingType === "DONATION" ? 0 : form.sellingPrice}
            onChange={(e) => update("sellingPrice", e.target.value)}
            className={inputClass(!!fieldErrors.sellingPrice) + " disabled:bg-stone-100"}
          />
        </Field>
      </div>

      <Field label="Location" error={fieldErrors.location}>
        <input
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          className={inputClass(!!fieldErrors.location)}
          placeholder="e.g. Malabe"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pickup start">
          <input
            type="datetime-local"
            value={form.pickupStart}
            onChange={(e) => update("pickupStart", e.target.value)}
            className={inputClass(false)}
          />
        </Field>
        <Field label="Pickup end" error={fieldErrors.pickupEnd}>
          <input
            type="datetime-local"
            value={form.pickupEnd}
            onChange={(e) => update("pickupEnd", e.target.value)}
            className={inputClass(!!fieldErrors.pickupEnd)}
          />
        </Field>
      </div>

      <Field label="Image URL (optional)">
        <input
          type="url"
          value={form.imageUrl}
          onChange={(e) => update("imageUrl", e.target.value)}
          className={inputClass(false)}
          placeholder="https://... (leave blank to use a placeholder photo)"
        />
      </Field>

      <Field label="Description" error={fieldErrors.description}>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className={inputClass(!!fieldErrors.description)}
          placeholder="Describe the food, how it was prepared, and any allergens."
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {loading ? "Saving..." : isEdit ? "Save changes" : "Create listing"}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
    hasError ? "border-red-400 focus:border-red-500" : "border-stone-300 focus:border-brand-500"
  }`;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-stone-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

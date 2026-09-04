export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type ListingType = "SALE" | "DONATION";
export type ListingStatus = "AVAILABLE" | "ENDING_SOON" | "SOLD_OUT" | "EXPIRED" | "CLOSED" | "REMOVED";
export type ReservationStatus = "PENDING" | "CONFIRMED" | "COLLECTED" | "CANCELLED";
export type DonationRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COLLECTED" | "CANCELLED";
export type ReportStatus = "OPEN" | "REVIEWED" | "DISMISSED";

export const CATEGORIES = [
  "Rice & Curry",
  "Prepared Meals",
  "Bakery",
  "Snacks",
  "Desserts",
  "Beverages",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type ApiError = {
  error: string;
};

export type ListingDTO = {
  id: string;
  providerId: string;
  providerName: string;
  providerPhone: string | null;
  foodName: string;
  category: string;
  quantity: number;
  quantityRemaining: number;
  originalPrice: number;
  sellingPrice: number;
  listingType: ListingType;
  location: string;
  pickupStart: string;
  pickupEnd: string;
  description: string;
  imageUrl: string | null;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
};

export type ReservationDTO = {
  id: string;
  listingId: string;
  userId: string;
  name: string;
  phone: string;
  quantity: number;
  totalAmount: number;
  status: ReservationStatus;
  createdAt: string;
  listing: ListingDTO & { providerName: string };
};

export type DonationRequestDTO = {
  id: string;
  listingId: string;
  userId: string;
  name: string;
  phone: string;
  quantity: number;
  reason: string;
  status: DonationRequestStatus;
  createdAt: string;
  listing: ListingDTO & { providerName: string };
};

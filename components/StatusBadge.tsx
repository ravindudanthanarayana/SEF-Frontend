import clsx from "clsx";

const STYLES: Record<string, string> = {
  SALE: "bg-brand-100 text-brand-700",
  DONATION: "bg-emerald-100 text-emerald-700",
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  ENDING_SOON: "bg-amber-100 text-amber-700",
  SOLD_OUT: "bg-stone-200 text-stone-600",
  EXPIRED: "bg-stone-200 text-stone-500",
  CLOSED: "bg-stone-200 text-stone-500",
  REMOVED: "bg-red-100 text-red-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-amber-100 text-amber-700",
  COLLECTED: "bg-sky-100 text-sky-700",
  CANCELLED: "bg-stone-200 text-stone-500",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
  OPEN: "bg-amber-100 text-amber-700",
  REVIEWED: "bg-sky-100 text-sky-700",
  DISMISSED: "bg-stone-200 text-stone-500",
};

const LABELS: Record<string, string> = {
  ENDING_SOON: "Ending soon",
  SOLD_OUT: "Sold out",
};

export default function StatusBadge({ status, className }: { status: string; className?: string }) {
  const label = LABELS[status] ?? status.charAt(0) + status.slice(1).toLowerCase();
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        STYLES[status] ?? "bg-stone-100 text-stone-600",
        className,
      )}
    >
      {label}
    </span>
  );
}

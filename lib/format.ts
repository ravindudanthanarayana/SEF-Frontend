export function formatPickupWindow(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("en-LK", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("en-LK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
}

export function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

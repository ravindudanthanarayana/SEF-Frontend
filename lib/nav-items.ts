import type { NavItem } from "@/components/DashboardShell";

function openAiChat() {
  window.dispatchEvent(new Event("riceshare:open-ai-chat"));
}

export function providerNavItems(): NavItem[] {
  return [
    { label: "Dashboard", href: "/provider", icon: "📊" },
    { label: "My Listings", href: "/provider/listings", icon: "📋" },
    { label: "Add Food", href: "/provider/listings/new", icon: "➕" },
    { label: "Reservations", href: "/provider/reservations", icon: "🧾" },
    { label: "Donation Requests", href: "/provider/donations", icon: "🤝" },
    { label: "AI Assistant", onClick: openAiChat, icon: "🤖" },
    { label: "Impact", href: "/provider/impact", icon: "🌱" },
    { label: "Profile", href: "/provider/profile", icon: "👤" },
  ];
}

export function adminNavItems(): NavItem[] {
  return [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Users", href: "/admin/users", icon: "👥" },
    { label: "Providers", href: "/admin/providers", icon: "🏪" },
    { label: "Listings", href: "/admin/listings", icon: "📋" },
    { label: "Reports", href: "/admin/reports", icon: "🚩" },
  ];
}

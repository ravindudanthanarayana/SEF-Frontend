"use client";

import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import LoadingState from "@/components/LoadingState";
import { providerNavItems } from "@/lib/nav-items";
import { useAuth } from "@/lib/auth-context";

export default function ProviderProfilePage() {
  return (
    <RequireRole role="PROVIDER">
      <DashboardShell title="Provider" items={providerNavItems()}>
        <ProfileContent />
      </DashboardShell>
    </RequireRole>
  );
}

function ProfileContent() {
  const { user, provider, logout } = useAuth();

  if (!user || !provider) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Profile</h1>
      <div className="mt-6 max-w-lg space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <Row label="Name" value={user.name} />
        <Row label="Email" value={user.email} />
        <Row label="Role" value="Provider" />
        <hr className="border-stone-100" />
        <Row label="Business name" value={provider.businessName} />
        <Row label="Business type" value={provider.businessType} />
        <Row label="Location" value={provider.location} />
        <Row label="Contact phone" value={provider.phone ?? "Not set"} />
        <button onClick={logout} className="pt-2 text-sm font-medium text-red-600 hover:underline">
          Log out
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-stone-500">{label}</span>
      <span className="font-medium text-stone-800">{value}</span>
    </div>
  );
}

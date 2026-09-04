"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { adminNavItems } from "@/lib/nav-items";
import { apiFetch, ApiRequestError } from "@/lib/api-client";
import { formatDateTime } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  provider: { businessName: string } | null;
};

export default function AdminUsersPage() {
  return (
    <RequireRole role="ADMIN">
      <DashboardShell title="Admin" items={adminNavItems()}>
        <UsersList />
      </DashboardShell>
    </RequireRole>
  );
}

function UsersList() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch<{ users: AdminUser[] }>("/api/admin/users").then((d) => setUsers(d.users));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function removeUser(id: string) {
    if (!confirm("Remove this user and all their data (listings, reservations, donations)? This cannot be undone.")) {
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't remove this user.");
    } finally {
      setBusyId(null);
    }
  }

  if (!users) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Users</h1>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {users.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No users yet" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-stone-800">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.role} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatDateTime(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => removeUser(u.id)}
                        disabled={busyId === u.id}
                        className="font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        {busyId === u.id ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

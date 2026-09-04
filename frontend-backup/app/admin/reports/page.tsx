"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";
import RequireRole from "@/components/RequireRole";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { adminNavItems } from "@/lib/nav-items";
import { apiFetch } from "@/lib/api-client";
import { formatDateTime } from "@/lib/format";

type AdminReport = {
  id: string;
  reason: string;
  description: string;
  status: string;
  createdAt: string;
  listing: { foodName: string; provider: { businessName: string } };
  reporter: { name: string };
};

export default function AdminReportsPage() {
  return (
    <RequireRole role="ADMIN">
      <DashboardShell title="Admin" items={adminNavItems()}>
        <ReportsList />
      </DashboardShell>
    </RequireRole>
  );
}

function ReportsList() {
  const [reports, setReports] = useState<AdminReport[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch<{ reports: AdminReport[] }>("/api/admin/reports").then((d) => setReports(d.reports));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: "REVIEWED" | "DISMISSED") {
    setBusyId(id);
    try {
      await apiFetch("/api/admin/reports", { method: "PUT", body: JSON.stringify({ id, status }) });
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (!reports) return <LoadingState />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900">Reports</h1>
      {reports.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No reports" description="Reported listings will appear here for review." />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-stone-900">
                    {r.listing.foodName} <span className="text-stone-400">— {r.listing.provider.businessName}</span>
                  </p>
                  <p className="text-sm text-stone-500">Reported by {r.reporter.name}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-2 text-sm font-medium text-stone-700">{r.reason}</p>
              <p className="text-sm text-stone-500">{r.description}</p>
              <p className="mt-1 text-xs text-stone-400">{formatDateTime(r.createdAt)}</p>
              {r.status === "OPEN" && (
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => updateStatus(r.id, "REVIEWED")}
                    disabled={busyId === r.id}
                    className="text-sm font-medium text-sky-600 hover:underline disabled:opacity-50"
                  >
                    Mark reviewed
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "DISMISSED")}
                    disabled={busyId === r.id}
                    className="text-sm font-medium text-stone-500 hover:underline disabled:opacity-50"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

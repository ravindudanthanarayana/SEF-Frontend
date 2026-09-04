"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/lib/auth-context";

const LOGIN_PATH = {
  PROVIDER: "/provider/login",
  ADMIN: "/admin/login",
} as const;

export default function RequireRole({
  role,
  children,
}: {
  role: "PROVIDER" | "ADMIN";
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(LOGIN_PATH[role]);
      return;
    }
    if (role === "PROVIDER" && user.role !== "PROVIDER" && user.role !== "ADMIN") {
      router.replace("/provider/login");
      return;
    }
    if (role === "ADMIN" && user.role !== "ADMIN") {
      router.replace("/admin/login");
    }
  }, [loading, user, role, router]);

  if (loading || !user) return <LoadingState label="Loading..." />;

  if (role === "PROVIDER" && user.role !== "PROVIDER" && user.role !== "ADMIN") {
    return <EmptyState title="Not authorized" description="This account doesn't have provider access." />;
  }
  if (role === "ADMIN" && user.role !== "ADMIN") {
    return <EmptyState title="Not authorized" description="This account doesn't have admin access." />;
  }

  return <>{children}</>;
}

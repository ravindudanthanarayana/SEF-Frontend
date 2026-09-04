"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch, ApiRequestError, setAuthToken } from "@/lib/api-client";
import type { Role } from "@/types";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type AppProvider = {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  location: string;
  phone: string | null;
};

type AuthResponse = { token: string; user: AppUser; provider?: AppProvider | null };

type AuthContextValue = {
  user: AppUser | null;
  provider: AppProvider | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  registerProvider: (data: {
    name: string;
    email: string;
    password: string;
    businessName: string;
    businessType: string;
    location: string;
    phone: string;
  }) => Promise<AppUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "riceshare_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [provider, setProvider] = useState<AppProvider | null>(null);
  const [loading, setLoading] = useState(
    () => typeof window !== "undefined" && !!localStorage.getItem(STORAGE_KEY),
  );

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!token) return;
    setAuthToken(token);
    apiFetch<{ user: AppUser; provider: AppProvider | null }>("/api/auth/me")
      .then((data) => {
        setUser(data.user);
        setProvider(data.provider);
      })
      .catch(() => {
        setAuthToken(null);
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const applyAuth = useCallback((data: AuthResponse) => {
    localStorage.setItem(STORAGE_KEY, data.token);
    setAuthToken(data.token);
    setUser(data.user);
    setProvider(data.provider ?? null);
    return data.user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      return applyAuth(data);
    },
    [applyAuth],
  );

  const registerProvider = useCallback(
    async (payload: {
      name: string;
      email: string;
      password: string;
      businessName: string;
      businessType: string;
      location: string;
      phone: string;
    }) => {
      const data = await apiFetch<AuthResponse>("/api/auth/provider-register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return applyAuth(data);
    },
    [applyAuth],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
    setUser(null);
    setProvider(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, provider, loading, login, registerProvider, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ApiRequestError };

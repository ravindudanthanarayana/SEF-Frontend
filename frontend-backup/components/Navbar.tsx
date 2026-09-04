"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/provider";

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-stone-900">
          <span className="text-2xl" aria-hidden>
            🍚
          </span>
          RiceShare
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium text-stone-600 md:flex">
          <Link href="/browse" className="hover:text-brand-600">
            Find Food
          </Link>
          {user && (
            <Link href={dashboardHref} className="hover:text-brand-600">
              Dashboard
            </Link>
          )}
          <Link href="/#how-it-works" className="hover:text-brand-600">
            How it works
          </Link>
          {!user && (
            <Link href="/provider/register" className="hover:text-brand-600">
              List Surplus Food
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!user && (
            <Link
              href="/provider/register"
              className="hidden rounded-full border border-brand-600 px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 sm:block"
            >
              List Surplus Food
            </Link>
          )}
          <Link
            href="/browse"
            className="hidden rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:block"
          >
            Find Food
          </Link>
          {user && (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-stone-600">Hi, {user.name.split(" ")[0]}</span>
              <button onClick={handleLogout} className="text-sm font-medium text-stone-500 hover:text-stone-800">
                Log out
              </button>
            </div>
          )}
          <button
            className="rounded-md p-2 text-stone-600 hover:bg-stone-100 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-medium text-stone-700">
            <Link href="/browse" onClick={closeMenu}>
              Find Food
            </Link>
            {user && (
              <Link href={dashboardHref} onClick={closeMenu}>
                Dashboard
              </Link>
            )}
            <Link href="/#how-it-works" onClick={closeMenu}>
              How it works
            </Link>
            {!user && (
              <Link href="/provider/register" onClick={closeMenu} className="font-semibold text-brand-600">
                List Surplus Food
              </Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="text-left text-stone-500">
                Log out ({user.name.split(" ")[0]})
              </button>
            ) : (
              <Link href="/provider/login" onClick={closeMenu} className="text-stone-500">
                Provider login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

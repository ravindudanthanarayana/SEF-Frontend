"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export type NavItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: string;
};

export default function DashboardShell({
  title,
  items,
  children,
}: {
  title: string;
  items: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row">
      <aside className="shrink-0 md:w-56">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wide text-stone-400">{title}</p>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {items.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap",
                  pathname === item.href
                    ? "bg-brand-600 text-white"
                    : "text-stone-600 hover:bg-stone-100",
                )}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap text-stone-600 hover:bg-stone-100"
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </button>
            ),
          )}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

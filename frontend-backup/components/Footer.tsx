import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-stone-500 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="flex items-center gap-2 font-semibold text-stone-700">
            <span aria-hidden>🍚</span> RiceShare
          </p>
          <p>Sell it. Share it. Save it.</p>
          <div className="flex gap-4 text-xs text-stone-400">
            <Link href="/provider/login" className="hover:text-stone-600">
              Provider Login
            </Link>
            <Link href="/admin/login" className="hover:text-stone-600">
              Admin Login
            </Link>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} RiceShare. Built for a hackathon in Sri Lanka.
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
type ImpactStats = { mealsRescued: number; mealsDonated: number; moneySaved: number; foodProviders: number };

async function getImpactStats(): Promise<ImpactStats> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  try {
    const res = await fetch(`${base}/api/stats`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error("Failed to load stats");
    return res.json();
  } catch {
    return { mealsRescued: 0, mealsDonated: 0, moneySaved: 0, foodProviders: 0 };
  }
}
import { formatCurrency } from "@/lib/format";

export const revalidate = 30;

export default async function HomePage() {
  const stats = await getImpactStats();

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-brand-50 to-emerald-50">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100">
              🍚 RiceShare · Sri Lanka
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Good food<br className="hidden md:block" /> shouldn&apos;t become{" "}
              <span className="text-brand-600">waste.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-stone-600 md:mx-0">
              Connect surplus food with people who need it. Sell it at a discount or donate it for free —
              no accounts needed, just browse and call the provider directly.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
              <Link
                href="/browse"
                className="w-full rounded-full bg-brand-600 px-7 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 hover:shadow-xl sm:w-auto"
              >
                Find Food Near You
              </Link>
              <Link
                href="/provider/register"
                className="w-full rounded-full border border-stone-300 bg-white px-7 py-3.5 text-center text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50 sm:w-auto"
              >
                List Surplus Food
              </Link>
            </div>
          </div>

          <div className="relative mx-auto grid max-w-md grid-cols-2 gap-4 sm:max-w-lg">
            <HeroImage src="https://loremflickr.com/400/500/chicken,rice?lock=101" className="mt-8" alt="Chicken rice" />
            <HeroImage src="https://loremflickr.com/400/500/bakery,pastries?lock=102" alt="Bakery pastries" />
            <HeroImage src="https://loremflickr.com/400/400/dessert,sweets?lock=103" alt="Desserts" />
            <HeroImage
              src="https://loremflickr.com/400/460/vegetables,curry?lock=104"
              className="-mt-6"
              alt="Vegetable curry"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <ImpactStat label="Meals Rescued" value={stats.mealsRescued.toLocaleString()} />
          <ImpactStat label="Meals Donated" value={stats.mealsDonated.toLocaleString()} />
          <ImpactStat label="Money Saved" value={formatCurrency(stats.moneySaved)} />
          <ImpactStat label="Food Providers" value={stats.foodProviders.toLocaleString()} />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">The problem</h2>
            <p className="mt-3 text-stone-600">
              Every day, restaurants, hotels, bakeries and event organizers across Sri Lanka end up with
              safe, unsold food. Without a way to move it quickly, it goes to waste — while many people
              nearby could use an affordable or free meal.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-900">The solution</h2>
            <p className="mt-3 text-stone-600">
              RiceShare lets providers list that surplus food in minutes — for a discounted sale or a free
              donation — so anyone can browse and call the provider directly to arrange pickup. No accounts,
              no sign-ups, just a phone call.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-stone-900">How it works</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-5 sm:items-center">
          <Step emoji="📋" label="Provider lists food" />
          <Arrow />
          <Step emoji="🏷️" label="Sell or donate" />
          <Arrow />
          <Step emoji="🔎" label="Customer discovers food" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-5 sm:items-center">
          <Step emoji="📞" label="Call the provider" />
          <Arrow />
          <Step emoji="🥡" label="Pickup" />
          <div className="hidden sm:col-span-3 sm:block" />
        </div>
      </section>

      <section className="bg-brand-600">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center text-white sm:px-6">
          <h2 className="text-2xl font-bold">Ready to reduce food waste today?</h2>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/browse"
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 sm:w-auto"
            >
              Browse available food
            </Link>
            <Link
              href="/provider/register"
              className="w-full rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 sm:w-auto"
            >
              Become a provider
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`h-full w-full rounded-3xl object-cover shadow-xl ring-4 ring-white ${className ?? ""}`}
    />
  );
}

function ImpactStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm">
      <p className="text-2xl font-extrabold text-brand-700 sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium text-stone-500 sm:text-sm">{label}</p>
    </div>
  );
}

function Step({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm">
      <span className="text-3xl" aria-hidden>
        {emoji}
      </span>
      <p className="text-sm font-semibold text-stone-700">{label}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex justify-center text-stone-300">
      <span className="hidden text-2xl sm:block" aria-hidden>
        →
      </span>
      <span className="text-2xl sm:hidden" aria-hidden>
        ↓
      </span>
    </div>
  );
}

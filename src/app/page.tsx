import type { Metadata } from "next";
import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import CalculatorCard from "@/components/CalculatorCard";
import CalculatorSearch from "@/components/CalculatorSearch";
import { AdSlot } from "@/components/Ads";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import ScientificCalculator from "@/components/calculators/ScientificCalculator";
import { adSlots } from "@/lib/ads";
import { categories, calculators, getCalculatorsByCategory } from "@/lib/data/calculators";
import { getSiteUrl, siteDescription, siteLocale, siteName } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: { absolute: siteName },
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: siteLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function Home() {
  const featured = calculators.slice(0, 8);
  const financialCount = getCalculatorsByCategory("financial").length;
  const fitnessCount = getCalculatorsByCategory("fitness").length;
  const mathCount = getCalculatorsByCategory("math").length;
  const otherCount = getCalculatorsByCategory("other").length;
  const cryptoCount = getCalculatorsByCategory("crypto").length;
  const aiCount = getCalculatorsByCategory("ai").length;

  const categoryCounts = new Map([
    ["financial", financialCount],
    ["fitness", fitnessCount],
    ["math", mathCount],
    ["other", otherCount],
    ["crypto", cryptoCount],
    ["ai", aiCount],
  ]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="section-pad pt-6 sm:pt-10">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <CalculatorSearch />
            <div className="rounded-[32px] border border-stroke bg-surface p-6 shadow-soft">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted">
                    Scientific
                  </p>
                  <h2 className="font-display text-3xl text-ink">
                    Calculator, right on the homepage
                  </h2>
                </div>
                <p className="max-w-md text-sm text-muted">
                  Full scientific layout with keyboard support.
                </p>
              </div>
              <div className="mt-6">
                <ScientificCalculator />
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-muted">
                Smart Calculator Tools
              </p>
              <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
                Calculators that feel designed, not just assembled.
              </h1>
              <p className="text-lg text-muted">
                Finance, health, math, crypto, and AI calculators engineered for speed,
                clarity, and modern decision-making.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/category/financial"
                  className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  Explore the calculators
                </Link>
                <Link
                  href="#categories"
                  className="rounded-full border border-stroke px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink"
                >
                  View categories
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-stroke bg-surface px-4 py-3">
                  <p className="text-sm text-muted">Launch scope</p>
                  <p className="text-xl font-semibold text-ink">20 calculators</p>
                </div>
                <div className="rounded-2xl border border-stroke bg-surface px-4 py-3">
                  <p className="text-sm text-muted">New sections</p>
                  <p className="text-xl font-semibold text-ink">Crypto + AI</p>
                </div>
                <div className="rounded-2xl border border-stroke bg-surface px-4 py-3">
                  <p className="text-sm text-muted">Design focus</p>
                  <p className="text-xl font-semibold text-ink">Clarity first</p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-stroke bg-surface p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-muted">Top picks</p>
                <span className="rounded-full bg-accent-2/20 px-3 py-1 text-xs text-ink">
                  Beta
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl text-ink">
                Start with the essentials
              </h2>
              <p className="mt-3 text-sm text-muted">
                A quick selection of high-traffic calculators.
              </p>
              <div className="mt-6 space-y-3">
                {featured.slice(0, 4).map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/calc/${calc.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-stroke/80 bg-white/70 px-4 py-3 text-sm text-ink transition hover:-translate-y-0.5"
                  >
                    <span>{calc.name}</span>
                    <span className="text-xs text-muted">Open</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad cv-auto">
          <div className="mx-auto w-full max-w-6xl">
            <AdSlot slot={adSlots.home} minHeight={280} />
          </div>
        </section>

        <section id="categories" className="section-pad cv-auto">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">Categories</p>
                <h2 className="font-display text-3xl text-ink">Six focused domains</h2>
              </div>
              <p className="max-w-md text-sm text-muted">
                Build your flow by category or jump into the calculator you need.
              </p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  count={categoryCounts.get(category.id) ?? 0}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad cv-auto">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">Featured</p>
                <h2 className="font-display text-3xl text-ink">Popular calculators</h2>
              </div>
              <Link href="/category/financial" className="text-sm text-ink underline">
                View all calculators
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featured.map((calc) => (
                <CalculatorCard key={calc.slug} calculator={calc} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad cv-auto-large">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-stroke bg-surface p-8 shadow-soft">
              <p className="text-xs uppercase tracking-[0.4em] text-muted">Why this build</p>
              <h3 className="mt-3 font-display text-3xl text-ink">
                Built to outperform generic calculators
              </h3>
              <p className="mt-4 text-sm text-muted">
                Every calculator is scoped, tested, and presented to reduce friction.
                No clutter, no endless scrolling, just the answers that matter.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-stroke bg-white/70 p-4">
                  <p className="text-sm font-semibold text-ink">Design clarity</p>
                  <p className="mt-2 text-xs text-muted">
                    Balanced layouts with visible logic and outputs.
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-white/70 p-4">
                  <p className="text-sm font-semibold text-ink">Data confidence</p>
                  <p className="mt-2 text-xs text-muted">
                    Every calculator backed by validation cases.
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-white/70 p-4">
                  <p className="text-sm font-semibold text-ink">Speed first</p>
                  <p className="mt-2 text-xs text-muted">
                    Performance budgets baked into the build.
                  </p>
                </div>
                <div className="rounded-2xl border border-stroke bg-white/70 p-4">
                  <p className="text-sm font-semibold text-ink">Modern domains</p>
                  <p className="mt-2 text-xs text-muted">
                    Crypto and AI calculators built from day one.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-stroke bg-surface-2 p-8 shadow-soft">
              <p className="text-xs uppercase tracking-[0.4em] text-muted">Launch plan</p>
              <h3 className="mt-3 font-display text-2xl text-ink">20-calculator MVP</h3>
              <p className="mt-4 text-sm text-muted">
                Designed for speed, ready to scale fast. We build the core set and
                expand in waves.
              </p>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
                  Week 1-2: Core engine + templates
                </div>
                <div className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
                  Week 3-4: 20 calculators delivered
                </div>
                <div className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
                  Week 5-6: QA + launch polish
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}


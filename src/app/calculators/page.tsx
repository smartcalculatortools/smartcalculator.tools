import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  categories,
  getCalculatorsByCategory,
} from "@/lib/data/calculators";
import { getLearningGuide } from "@/lib/data/learningGuides";
import { buildMetadata } from "@/lib/seo";
import { getSiteUrl, siteName } from "@/lib/site";

export const metadata = buildMetadata({
  title: "All Calculators",
  description:
    "Browse every calculator on Smart Calculator Tools, grouped by category with direct links to each calculator page.",
  path: "/calculators",
});

const siteUrl = getSiteUrl();

export default function CalculatorsIndexPage() {
  const categorySections = categories.map((category) => ({
    category,
    calculators: getCalculatorsByCategory(category.id),
    guide: getLearningGuide(category.id),
  }));
  const totalCalculators = categorySections.reduce(
    (sum, section) => sum + section.calculators.length,
    0
  );

  const listedCalculators = categorySections.flatMap((section) =>
    section.calculators.map((calculator) => calculator)
  );
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: listedCalculators.map((calculator, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: calculator.name,
      url: `${siteUrl}/calc/${calculator.slug}`,
    })),
  };
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "All Calculators",
    description:
      "Browse every calculator on Smart Calculator Tools by category and open the exact calculator you need.",
    url: `${siteUrl}/calculators`,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: `${siteUrl}/calculators`,
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <main>
        <section className="section-pad">
          <div className="mx-auto w-full max-w-6xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Calculators" },
              ]}
            />
            <p className="text-xs uppercase tracking-[0.4em] text-muted">
              All calculators
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink">
              Every calculator in one place
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-muted">
              Use this page as the fastest path to the exact calculator you need.
              Browse by category, jump into a guide, or open a calculator directly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-stroke bg-surface px-4 py-2 text-sm text-ink">
                {totalCalculators} calculators
              </span>
              <span className="rounded-full border border-stroke bg-surface px-4 py-2 text-sm text-ink">
                {categories.length} categories
              </span>
              <Link
                href="/learn"
                className="rounded-full border border-stroke bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink"
              >
                Open learning guides
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {categorySections.map(({ category, calculators }) => (
                <a
                  key={category.id}
                  href={`#category-${category.id}`}
                  className="rounded-full border border-stroke bg-white/70 px-4 py-2 text-sm text-ink transition hover:border-ink"
                >
                  {category.name}
                  <span className="ml-2 text-xs text-muted">
                    {calculators.length}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {categorySections.map(({ category, calculators, guide }) => (
          <section
            key={category.id}
            id={`category-${category.id}`}
            className="section-pad pt-0"
          >
            <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-stroke bg-surface p-6 shadow-soft">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted">
                    {category.name}
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-ink">
                    {category.name} calculators
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm text-muted">
                    {category.blurb}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/category/${category.id}`}
                    className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Open category
                  </Link>
                  {guide ? (
                    <Link
                      href={`/learn/${category.id}`}
                      className="rounded-full border border-stroke px-5 py-2.5 text-sm text-ink"
                    >
                      Read guide
                    </Link>
                  ) : null}
                </div>
              </div>
              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {calculators.map((calculator) => (
                  <Link
                    key={calculator.slug}
                    href={`/calc/${calculator.slug}`}
                    className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 transition hover:-translate-y-0.5"
                  >
                    <p className="text-sm font-semibold text-ink">
                      {calculator.name}
                    </p>
                    <p className="mt-2 text-sm text-muted">{calculator.blurb}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      Open calculator
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}

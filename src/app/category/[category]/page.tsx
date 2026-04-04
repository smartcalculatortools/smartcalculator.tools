import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorCard from "@/components/CalculatorCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CalculatorSearch from "@/components/CalculatorSearch";
import LearnArticleCard from "@/components/LearnArticleCard";
import UsageHighlights from "@/components/UsageHighlights";
import {
  categories,
  getCalculatorsByCategory,
  getCategoryStaticParams,
} from "@/lib/data/calculators";
import { getLearnArticlesByCategory } from "@/lib/data/learnArticles";
import { getLearningGuide } from "@/lib/data/learningGuides";
import { getSiteUrl, siteLocale, siteName } from "@/lib/site";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

const siteUrl = getSiteUrl();
export const dynamicParams = false;

export function generateStaticParams() {
  return getCategoryStaticParams();
}

export async function generateMetadata(
  { params }: CategoryPageProps
): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = categories.find((item) => item.id === categoryId);
  if (!category) {
    return {
      title: "Category not found",
    };
  }

  const pageTitle = `${category.name} Calculators`;
  const fullTitle = `${pageTitle} | ${siteName}`;
  const calculatorCount = getCalculatorsByCategory(category.id).length;
  const description = `${category.blurb} Browse ${calculatorCount} ${category.name.toLowerCase()} calculators with direct links to the full tools and supporting guides.`;
  const url = `${siteUrl}/category/${category.id}`;

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale: siteLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params;
  const category = categories.find((item) => item.id === categoryId);
  if (!category) {
    notFound();
  }

  const calculators = getCalculatorsByCategory(category.id);
  const guide = getLearningGuide(category.id);
  const categoryArticles = getLearnArticlesByCategory(category.id);
  const starterCalculators = (guide?.starterSlugs ?? [])
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter(
      (calculator): calculator is (typeof calculators)[number] => calculator !== undefined
    );

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
      {
        "@type": "ListItem",
        position: 3,
        name: `${category.name} Calculators`,
        item: `${siteUrl}/category/${category.id}`,
      },
    ],
  };
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Calculators`,
    description: `${category.blurb} Browse ${calculators.length} ${category.name.toLowerCase()} calculators and supporting guides in one category hub.`,
    url: `${siteUrl}/category/${category.id}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
  };
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: calculators.map((calculator, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: calculator.name,
      url: `${siteUrl}/calc/${calculator.slug}`,
    })),
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
                { label: "Calculators", href: "/calculators" },
                { label: `${category.name} Calculators` },
              ]}
            />
            <p className="text-xs uppercase tracking-[0.4em] text-muted">
              {category.name}
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink">
              {category.name} calculators
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-muted">
              {category.blurb}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-stroke bg-surface px-4 py-2 text-sm text-ink">
                {calculators.length} calculators
              </span>
              {guide ? (
                <Link
                  href={`/learn/${category.id}`}
                  className="rounded-full border border-stroke bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink"
                >
                  Category guide
                </Link>
              ) : null}
              {categoryArticles.length > 0 ? (
                <Link
                  href={`/learn/${category.id}`}
                  className="rounded-full border border-stroke bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink"
                >
                  {categoryArticles.length} learn articles
                </Link>
              ) : null}
              <Link
                href="/calculators"
                className="rounded-full border border-stroke bg-surface px-4 py-2 text-sm text-ink transition hover:border-ink"
              >
                All calculators
              </Link>
            </div>
            {guide ? (
              <div className="mt-6 rounded-3xl border border-stroke bg-surface p-5 shadow-soft">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  Learn the category
                </p>
                <h2 className="mt-2 font-display text-2xl text-ink">
                  {guide.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm text-muted">
                  {guide.summary}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/learn/${category.id}`}
                    className="rounded-full border border-stroke px-4 py-2 text-sm text-ink"
                  >
                    Read the guide
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </section>
        <UsageHighlights categoryId={category.id} />
        {starterCalculators.length > 0 && (
          <section className="section-pad pt-0">
            <div className="mx-auto w-full max-w-6xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted">
                    Popular starting points
                  </p>
                  <h2 className="font-display text-3xl text-ink">
                    Priority calculators in {category.name.toLowerCase()}
                  </h2>
                </div>
                <Link href={`/learn/${category.id}`} className="text-sm text-ink underline">
                  Read the full guide
                </Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {starterCalculators.map((calculator) => (
                  <CalculatorCard key={calculator.slug} calculator={calculator} />
                ))}
              </div>
            </div>
          </section>
        )}
        {categoryArticles.length > 0 && (
          <section className="section-pad pt-0">
            <div className="mx-auto w-full max-w-6xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted">
                    Learn articles
                  </p>
                  <h2 className="font-display text-3xl text-ink">
                    Long-tail guides for {category.name.toLowerCase()} readers
                  </h2>
                </div>
                <Link href="/learn" className="text-sm text-ink underline">
                  Browse all learn content
                </Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categoryArticles.map((article) => (
                  <LearnArticleCard
                    key={`${article.categoryId}-${article.slug}`}
                    article={article}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
        <section className="section-pad pt-0">
          <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-stroke bg-surface p-6 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">
                  Browse all
                </p>
                <h2 className="font-display text-3xl text-ink">
                  Every {category.name.toLowerCase()} calculator page
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-muted">
                  Use this static list when you want the full category at a glance.
                  These direct links make it easy to jump straight into the exact
                  calculator or let search engines discover the whole cluster from one hub.
                </p>
              </div>
              {guide ? (
                <Link
                  href={`/learn/${category.id}`}
                  className="text-sm text-ink underline"
                >
                  Read the category guide
                </Link>
              ) : null}
            </div>
            <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {calculators.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={`/calc/${calculator.slug}`}
                  className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 transition hover:-translate-y-0.5"
                >
                  <p className="text-sm font-semibold text-ink">{calculator.name}</p>
                  <p className="mt-2 text-sm text-muted">{calculator.blurb}</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Open calculator
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="section-pad pt-0">
          <div className="mx-auto w-full max-w-6xl">
            <CalculatorSearch
              calculators={calculators}
              layout="grid"
              lockedCategoryId={category.id}
              title={`Find a ${category.name} calculator`}
              description="Search by keyword or narrow the list with the tags used in this category."
              placeholder={`Search ${category.name.toLowerCase()} calculators`}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

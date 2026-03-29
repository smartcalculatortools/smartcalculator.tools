import type { Metadata } from "next";
import Link from "next/link";
import LearnArticleCard from "@/components/LearnArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { categories, getCalculatorsByCategory } from "@/lib/data/calculators";
import { learnArticles } from "@/lib/data/learnArticles";
import { getLearningGuide } from "@/lib/data/learningGuides";
import { getSiteUrl, siteLocale, siteName } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Learning Guides",
  description:
    "Short guides for financial, fitness, math, crypto, AI, and everyday utility calculators.",
  alternates: {
    canonical: `${siteUrl}/learn`,
  },
  openGraph: {
    title: `Learning Guides | ${siteName}`,
    description:
      "Short guides for financial, fitness, math, crypto, AI, and everyday utility calculators.",
    url: `${siteUrl}/learn`,
    siteName,
    locale: siteLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Learning Guides | ${siteName}`,
    description:
      "Short guides for financial, fitness, math, crypto, AI, and everyday utility calculators.",
  },
};

export default function LearnIndexPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <section className="section-pad">
          <div className="mx-auto w-full max-w-6xl">
            <p className="text-xs uppercase tracking-[0.4em] text-muted">Learn</p>
            <h1 className="mt-2 font-display text-4xl text-ink">Short guides for each calculator domain</h1>
            <p className="mt-4 max-w-3xl text-sm text-muted">
              Use these guides to understand when a calculator is helpful, what assumptions usually matter, and which tools are the best starting point in each domain.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => {
                const guide = getLearningGuide(category.id);
                const count = getCalculatorsByCategory(category.id).length;
                if (!guide) return null;

                return (
                  <article
                    key={category.id}
                    className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">
                      {category.name}
                    </p>
                    <h2 className="mt-2 font-display text-2xl text-ink">
                      {guide.title}
                    </h2>
                    <p className="mt-3 text-sm text-muted">{guide.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
                      <span className="rounded-full border border-stroke px-3 py-1">
                        {count} calculators
                      </span>
                      <span className="rounded-full border border-stroke px-3 py-1">
                        {guide.sections.length} short sections
                      </span>
                    </div>
                    <div className="mt-6 flex gap-3">
                      <Link
                        href={`/learn/${category.id}`}
                        className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
                      >
                        Read guide
                      </Link>
                      <Link
                        href={`/category/${category.id}`}
                        className="rounded-full border border-stroke px-4 py-2 text-sm text-ink"
                      >
                        Open calculators
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-pad pt-0">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">
                  Long-tail guides
                </p>
                <h2 className="font-display text-3xl text-ink">
                  Learn by the exact question you are trying to answer
                </h2>
              </div>
              <Link href="/learn/financial" className="text-sm text-ink underline">
                Open category guides
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {learnArticles.map((article) => (
                <LearnArticleCard key={`${article.categoryId}-${article.slug}`} article={article} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

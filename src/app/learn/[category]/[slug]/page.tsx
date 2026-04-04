import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CalculatorCard from "@/components/CalculatorCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  categories,
  type Calculator,
  getCalculator,
} from "@/lib/data/calculators";
import {
  getLearnArticle,
  getLearnArticlesByCategory,
  getLearnArticleStaticParams,
} from "@/lib/data/learnArticles";
import { getLearningGuide } from "@/lib/data/learningGuides";
import { getSiteUrl, siteLocale, siteName } from "@/lib/site";

type LearnArticlePageProps = {
  params: Promise<{ category: string; slug: string }>;
};

const siteUrl = getSiteUrl();

export async function generateMetadata(
  { params }: LearnArticlePageProps
): Promise<Metadata> {
  const { category: categoryId, slug } = await params;
  const category = categories.find((item) => item.id === categoryId);
  const article = category ? getLearnArticle(category.id, slug) : null;

  if (!category || !article) {
    return { title: "Article not found" };
  }

  const url = `${siteUrl}/learn/${category.id}/${article.slug}`;

  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${article.title} | ${siteName}`,
      description: article.summary,
      url,
      siteName,
      locale: siteLocale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | ${siteName}`,
      description: article.summary,
    },
  };
}

export function generateStaticParams() {
  return getLearnArticleStaticParams();
}

export default async function LearnArticlePage({
  params,
}: LearnArticlePageProps) {
  const { category: categoryId, slug } = await params;
  const category = categories.find((item) => item.id === categoryId);
  const article = category ? getLearnArticle(category.id, slug) : null;

  if (!category || !article) {
    notFound();
  }

  const categoryGuide = getLearningGuide(category.id);
  const siblingArticles = getLearnArticlesByCategory(category.id)
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);
  const relatedCalculators = article.calculatorSlugs
    .map((calculatorSlug) => getCalculator(calculatorSlug))
    .filter((calculator): calculator is Calculator => calculator !== null);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    url: `${siteUrl}/learn/${category.id}/${article.slug}`,
    about: category.name,
    keywords: article.targetQuery,
    author: {
      "@type": "Organization",
      name: siteName,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main>
        <section className="section-pad">
          <div className="mx-auto w-full max-w-6xl">
            <p className="text-xs uppercase tracking-[0.4em] text-muted">
              {category.name} learn article
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink">
              {article.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm text-muted">{article.summary}</p>
            <p className="mt-4 max-w-4xl text-base text-ink/80">{article.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/learn/${category.id}`}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                Back to {category.name.toLowerCase()} guide
              </Link>
              <Link
                href={`/category/${category.id}`}
                className="rounded-full border border-stroke px-5 py-2.5 text-sm text-ink"
              >
                Open {category.name.toLowerCase()} calculators
              </Link>
            </div>
          </div>
        </section>

        <section className="section-pad pt-0">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-3">
            {article.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft"
              >
                <h2 className="font-display text-2xl text-ink">{section.title}</h2>
                <p className="mt-3 text-sm text-muted">{section.body}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="rounded-2xl border border-stroke/70 bg-white/70 px-4 py-3"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-pad pt-0">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">
                  Linked tools
                </p>
                <h2 className="font-display text-3xl text-ink">
                  Calculators to use with this guide
                </h2>
              </div>
              <Link
                href={`/category/${category.id}`}
                className="text-sm text-ink underline"
              >
                View all {category.name.toLowerCase()} calculators
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedCalculators.map((calculator) => (
                <CalculatorCard key={calculator.slug} calculator={calculator} />
              ))}
            </div>
          </div>
        </section>

        {(categoryGuide || siblingArticles.length > 0) && (
          <section className="section-pad pt-0">
            <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-stroke bg-surface p-8 shadow-soft">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted">
                    Explore more
                  </p>
                  <h2 className="font-display text-3xl text-ink">
                    Keep moving through {category.name.toLowerCase()} learning pages
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-muted">
                    Use the category guide for the wider framework, then open related
                    questions when you want a narrower decision path.
                  </p>
                </div>
                <Link
                  href={`/category/${category.id}`}
                  className="text-sm text-ink underline"
                >
                  Browse {category.name.toLowerCase()} calculators
                </Link>
              </div>
              {categoryGuide ? (
                <div className="mt-6 rounded-3xl border border-stroke/80 bg-white/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted">
                    Category guide
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-ink">
                    {categoryGuide.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted">{categoryGuide.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/learn/${category.id}`}
                      className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
                    >
                      Read the guide
                    </Link>
                    <Link
                      href={`/category/${category.id}`}
                      className="rounded-full border border-stroke px-4 py-2 text-sm text-ink"
                    >
                      Open calculators
                    </Link>
                  </div>
                </div>
              ) : null}
              {siblingArticles.length > 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {siblingArticles.map((item) => (
                    <Link
                      key={`${item.categoryId}-${item.slug}`}
                      href={`/learn/${item.categoryId}/${item.slug}`}
                      className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 transition hover:-translate-y-0.5"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">
                        {item.targetQuery}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm text-muted">{item.summary}</p>
                      <p className="mt-4 text-sm font-semibold text-ink underline">
                        Read article
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="section-pad pt-0">
          <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-stroke bg-surface p-8 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">FAQ</p>
                <h2 className="mt-2 font-display text-3xl text-ink">
                  Common questions about {article.targetQuery}
                </h2>
              </div>
              {categoryGuide ? (
                <Link
                  href={`/learn/${category.id}`}
                  className="text-sm text-ink underline"
                >
                  Open the full {category.name.toLowerCase()} guide
                </Link>
              ) : null}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {article.faqs.map((item) => (
                <article
                  key={item.question}
                  className="rounded-2xl border border-stroke/70 bg-white/70 p-5"
                >
                  <h3 className="text-lg font-semibold text-ink">{item.question}</h3>
                  <p className="mt-3 text-sm text-muted">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

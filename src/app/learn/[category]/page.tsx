import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CalculatorCard from "@/components/CalculatorCard";
import EditorialMeta from "@/components/EditorialMeta";
import LearnArticleCard from "@/components/LearnArticleCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  categories,
  getCalculatorsByCategory,
  getCategoryStaticParams,
} from "@/lib/data/calculators";
import { getLearnArticlesByCategory } from "@/lib/data/learnArticles";
import { getLearningGuide } from "@/lib/data/learningGuides";
import { learnContentReviewedAt } from "@/lib/editorial";
import { getSiteUrl, siteLocale, siteName } from "@/lib/site";

type GuidePageProps = {
  params: Promise<{ category: string }>;
};

const siteUrl = getSiteUrl();

export async function generateMetadata(
  { params }: GuidePageProps
): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = categories.find((item) => item.id === categoryId);
  const guide = category ? getLearningGuide(category.id) : null;

  if (!category || !guide) {
    return { title: "Guide not found" };
  }

  const title = `${category.name} Guide`;
  const description = guide.summary;
  const url = `${siteUrl}/learn/${category.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url,
      siteName,
      locale: siteLocale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
    },
  };
}

export async function generateStaticParams() {
  return getCategoryStaticParams();
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { category: categoryId } = await params;
  const category = categories.find((item) => item.id === categoryId);
  const guide = category ? getLearningGuide(category.id) : null;

  if (!category || !guide) {
    notFound();
  }

  const calculators = getCalculatorsByCategory(category.id);
  const categoryArticles = getLearnArticlesByCategory(category.id);
  const starters = guide.starterSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter((calculator): calculator is (typeof calculators)[number] => calculator !== undefined);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    url: `${siteUrl}/learn/${category.id}`,
    mainEntityOfPage: `${siteUrl}/learn/${category.id}`,
    about: category.name,
    dateModified: learnContentReviewedAt,
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
        name: "Learn",
        item: `${siteUrl}/learn`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${category.name} Guide`,
        item: `${siteUrl}/learn/${category.id}`,
      },
    ],
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((item) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main>
        <section className="section-pad">
          <div className="mx-auto w-full max-w-6xl">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Learn", href: "/learn" },
                { label: `${category.name} Guide` },
              ]}
            />
            <p className="text-xs uppercase tracking-[0.4em] text-muted">
              {category.name} guide
            </p>
            <h1 className="mt-2 font-display text-4xl text-ink">{guide.title}</h1>
            <p className="mt-4 max-w-3xl text-sm text-muted">{guide.summary}</p>
            <p className="mt-4 max-w-4xl text-base text-ink/80">{guide.intro}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/category/${category.id}`}
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                Open {category.name.toLowerCase()} calculators
              </Link>
              <Link
                href="/learn"
                className="rounded-full border border-stroke px-5 py-2.5 text-sm text-ink"
              >
                All guides
              </Link>
            </div>
            <EditorialMeta reviewedAt={learnContentReviewedAt} className="mt-6" />
          </div>
        </section>

        <section className="section-pad pt-0">
          <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-3">
            {guide.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft"
              >
                <h2 className="font-display text-2xl text-ink">{section.title}</h2>
                <p className="mt-3 text-sm text-muted">{section.body}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="rounded-2xl border border-stroke/70 bg-white/70 px-4 py-3">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {categoryArticles.length > 0 && (
          <section className="section-pad pt-0">
            <div className="mx-auto w-full max-w-6xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-muted">
                    Popular questions
                  </p>
                  <h2 className="font-display text-3xl text-ink">
                    Long-tail guides for {category.name.toLowerCase()} search intent
                  </h2>
                </div>
                <Link href="/learn" className="text-sm text-ink underline">
                  Browse all learn articles
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
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">Start here</p>
                <h2 className="font-display text-3xl text-ink">Recommended calculators</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted">
                  These are the strongest internal starting points if you want to act on the guide right away.
                </p>
              </div>
              <Link href={`/category/${category.id}`} className="text-sm text-ink underline">
                View all {category.name.toLowerCase()} calculators
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {starters.map((calculator) => (
                <CalculatorCard key={calculator.slug} calculator={calculator} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad pt-0">
          <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-stroke bg-surface p-6 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">
                  Full directory
                </p>
                <h2 className="font-display text-3xl text-ink">
                  Every {category.name.toLowerCase()} calculator linked from this guide
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-muted">
                  Use this directory if you want to move from the high-level guide into
                  the exact calculator page without going back through the category index.
                </p>
              </div>
              <Link
                href={`/category/${category.id}`}
                className="text-sm text-ink underline"
              >
                Open the category hub
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {calculators.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={`/calc/${calculator.slug}`}
                  className="rounded-full border border-stroke bg-white/70 px-4 py-2 text-sm text-ink transition hover:border-ink"
                >
                  {calculator.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad pt-0">
          <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-stroke bg-surface p-8 shadow-soft">
            <p className="text-xs uppercase tracking-[0.4em] text-muted">FAQ</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {guide.faqs.map((item) => (
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

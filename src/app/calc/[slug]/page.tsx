import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CalculatorInteractive from "@/components/CalculatorInteractive";
import {
  categoryMap,
  getCalculator,
  getCalculatorStaticParams,
} from "@/lib/data/calculators";
import { calculatorContent } from "@/lib/data/calculatorContent";
import { buildFaqItems } from "@/lib/faq";
import { getCalculatorSeoPriority } from "@/lib/seoPriorities";
import { getSiteUrl, siteLocale, siteName } from "@/lib/site";

type CalculatorPageProps = {
  params: Promise<{ slug: string }>;
};

const siteUrl = getSiteUrl();
export const dynamicParams = false;

export function generateStaticParams() {
  return getCalculatorStaticParams();
}

export async function generateMetadata(
  { params }: CalculatorPageProps
): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) {
    return {
      title: "Calculator not found",
    };
  }

  const content = calculatorContent[calculator.slug];
  const seoPriority = getCalculatorSeoPriority(calculator.slug);
  const pageTitle = seoPriority?.title ?? calculator.name;
  const fullTitle = `${pageTitle} | ${siteName}`;
  const description =
    seoPriority?.description ?? content?.summary ?? calculator.blurb;
  const url = `${siteUrl}/calc/${calculator.slug}`;

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

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) {
    notFound();
  }

  const category = categoryMap.get(calculator.category);
  const content = calculatorContent[calculator.slug];
  const seoPriority = getCalculatorSeoPriority(calculator.slug);
  const faqItems = buildFaqItems({ calculator, category, content });
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: calculator.name,
    description:
      seoPriority?.description ?? content?.summary ?? calculator.blurb,
    url: `${siteUrl}/calc/${calculator.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
    },
    about: {
      "@type": "Thing",
      name: calculator.name,
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
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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
      {
        "@type": "ListItem",
        position: 3,
        name: `${category?.name ?? "Calculators"} Calculators`,
        item: `${siteUrl}/category/${calculator.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: seoPriority?.title ?? calculator.name,
        item: `${siteUrl}/calc/${calculator.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CalculatorInteractive
        calculator={calculator}
        category={category}
        content={content}
      />
      <SiteFooter />
    </div>
  );
}

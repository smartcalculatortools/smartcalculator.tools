import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CalculatorInteractive from "@/components/CalculatorInteractive";
import { categoryMap, getCalculator } from "@/lib/data/calculators";
import { calculatorContent } from "@/lib/data/calculatorContent";
import { buildFaqItems } from "@/lib/faq";
import { getSiteUrl, siteLocale, siteName } from "@/lib/site";

type CalculatorPageProps = {
  params: Promise<{ slug: string }>;
};

const siteUrl = getSiteUrl();

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
  const pageTitle = calculator.name;
  const fullTitle = `${pageTitle} | ${siteName}`;
  const description = content?.summary ?? calculator.blurb;
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
  const faqItems = buildFaqItems({ calculator, category, content });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: calculator.name,
    description: content?.summary ?? calculator.blurb,
    applicationCategory: "Calculator",
    operatingSystem: "All",
    isAccessibleForFree: true,
    keywords: calculator.tags.join(", "),
    url: `${siteUrl}/calc/${calculator.slug}`,
    publisher: {
      "@type": "Organization",
      name: "Smart Calculator Tools",
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
        name: `${category?.name ?? "Calculators"} Calculators`,
        item: `${siteUrl}/category/${calculator.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calculator.name,
        item: `${siteUrl}/calc/${calculator.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

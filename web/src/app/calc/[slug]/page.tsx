import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import CalculatorInteractive from "@/components/CalculatorInteractive";
import { categoryMap, getCalculator } from "@/lib/data/calculators";
import { calculatorContent } from "@/lib/data/calculatorContent";

type CalculatorPageProps = {
  params: Promise<{ slug: string }>;
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartcalculatortools.com";

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
  const title = `${calculator.name} | Smart Calculator Tools`;
  const description = content?.summary ?? calculator.blurb;
  const url = `${siteUrl}/calc/${calculator.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
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

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

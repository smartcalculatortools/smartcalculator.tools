import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CalculatorInteractive from "@/components/CalculatorInteractive";
import { categoryMap, getCalculator } from "@/lib/data/calculators";
import { calculatorContent } from "@/lib/data/calculatorContent";

export const metadata: Metadata = {
  title: "Embed",
  robots: {
    index: false,
    follow: false,
  },
};

type EmbedPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) {
    notFound();
  }

  const category = categoryMap.get(calculator.category);
  const content = calculatorContent[calculator.slug];

  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      <CalculatorInteractive
        calculator={calculator}
        category={category}
        content={content}
        isEmbed
      />
      <div className="mx-auto mt-4 w-full max-w-5xl pb-4 text-center">
        <a
          href={`https://smartcalculatortools.net/calc/${calculator.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted transition-colors hover:text-ink hover:underline"
        >
          Powered by Smart Calculator Tools
        </a>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import CompoundInterestCalculator from "@/components/calculators/CompoundInterestCalculator";
import SavingsCalculator from "@/components/calculators/SavingsCalculator";
import IncomeTaxCalculator from "@/components/calculators/IncomeTaxCalculator";
import BMICalculator from "@/components/calculators/BMICalculator";
import BMRCalculator from "@/components/calculators/BMRCalculator";
import CalorieCalculator from "@/components/calculators/CalorieCalculator";
import BodyFatCalculator from "@/components/calculators/BodyFatCalculator";
import ScientificCalculator from "@/components/calculators/ScientificCalculator";
import PercentageCalculator from "@/components/calculators/PercentageCalculator";
import FractionCalculator from "@/components/calculators/FractionCalculator";
import TriangleCalculator from "@/components/calculators/TriangleCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import DateCalculator from "@/components/calculators/DateCalculator";
import CryptoProfitLossCalculator from "@/components/calculators/CryptoProfitLossCalculator";
import CryptoDcaCalculator from "@/components/calculators/CryptoDcaCalculator";
import CryptoFeeImpactCalculator from "@/components/calculators/CryptoFeeImpactCalculator";
import AiTokenCostCalculator from "@/components/calculators/AiTokenCostCalculator";
import AiModelComparatorCalculator from "@/components/calculators/AiModelComparatorCalculator";
import { getCalculator } from "@/lib/data/calculators";

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

function getCalculatorComponent(slug: string) {
  switch (slug) {
    case "mortgage":
      return <MortgageCalculator />;
    case "loan":
      return <LoanCalculator />;
    case "compound-interest":
      return <CompoundInterestCalculator />;
    case "savings":
      return <SavingsCalculator />;
    case "income-tax":
      return <IncomeTaxCalculator />;
    case "bmi":
      return <BMICalculator />;
    case "bmr":
      return <BMRCalculator />;
    case "calorie":
      return <CalorieCalculator />;
    case "body-fat":
      return <BodyFatCalculator />;
    case "scientific":
      return <ScientificCalculator />;
    case "percentage":
      return <PercentageCalculator />;
    case "fraction":
      return <FractionCalculator />;
    case "triangle":
      return <TriangleCalculator />;
    case "age":
      return <AgeCalculator />;
    case "date":
      return <DateCalculator />;
    case "crypto-profit-loss":
      return <CryptoProfitLossCalculator />;
    case "crypto-dca":
      return <CryptoDcaCalculator />;
    case "crypto-fee-impact":
      return <CryptoFeeImpactCalculator />;
    case "ai-token-cost":
      return <AiTokenCostCalculator />;
    case "ai-model-comparator":
      return <AiModelComparatorCalculator />;
    default:
      return null;
  }
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) {
    notFound();
  }

  const calculatorComponent = getCalculatorComponent(slug);
  if (!calculatorComponent) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {calculatorComponent}
      <p className="mt-6 text-xs text-muted">
        Powered by Smart Calculator Tools
      </p>
    </div>
  );
}

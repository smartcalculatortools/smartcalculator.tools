import { configurableCalculators } from "@/lib/data/configurableCalculators/index";
export type CategoryId =
  | "financial"
  | "fitness"
  | "math"
  | "other"
  | "crypto"
  | "ai";

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
  tone: string;
};

export type Calculator = {
  slug: string;
  name: string;
  category: CategoryId;
  blurb: string;
  tags: string[];
};

export const categories: Category[] = [
  {
    id: "financial",
    name: "Financial",
    blurb: "Loans, mortgages, taxes, and money decisions without the fog.",
    tone: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  },
  {
    id: "fitness",
    name: "Fitness & Health",
    blurb: "Body metrics, energy needs, and simple health baselines.",
    tone: "from-amber-400/30 via-amber-300/10 to-transparent",
  },
  {
    id: "math",
    name: "Math",
    blurb: "Everyday math, geometry, and core scientific tools.",
    tone: "from-sky-500/25 via-sky-300/10 to-transparent",
  },
  {
    id: "other",
    name: "Other",
    blurb: "Time, dates, and practical utilities you use weekly.",
    tone: "from-stone-400/30 via-stone-200/10 to-transparent",
  },
  {
    id: "crypto",
    name: "Crypto",
    blurb: "Trading clarity, fees, and position planning.",
    tone: "from-teal-500/25 via-teal-300/10 to-transparent",
  },
  {
    id: "ai",
    name: "AI",
    blurb: "Costs, usage, and planning for modern AI work.",
    tone: "from-indigo-500/20 via-indigo-300/10 to-transparent",
  },
];

const coreCalculators: Calculator[] = [
  {
    slug: "mortgage",
    name: "Mortgage Calculator",
    category: "financial",
    blurb: "Monthly payment, interest split, and payoff horizon.",
    tags: ["loan", "housing", "payments"],
  },
  {
    slug: "loan",
    name: "Loan Calculator",
    category: "financial",
    blurb: "Estimate payments for personal or business loans.",
    tags: ["installments", "finance"],
  },
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    category: "financial",
    blurb: "Project growth with compounding and contributions.",
    tags: ["savings", "growth"],
  },
  {
    slug: "savings",
    name: "Savings Calculator",
    category: "financial",
    blurb: "Plan targets with regular deposits.",
    tags: ["budget", "goal"],
  },
  {
    slug: "income-tax",
    name: "Income Tax Calculator",
    category: "financial",
    blurb: "Estimate take-home with quick assumptions.",
    tags: ["salary", "tax"],
  },
  {
    slug: "bmi",
    name: "BMI Calculator",
    category: "fitness",
    blurb: "Body mass index with quick category feedback.",
    tags: ["health", "weight"],
  },
  {
    slug: "calorie",
    name: "Calorie Calculator",
    category: "fitness",
    blurb: "Daily calorie needs based on activity.",
    tags: ["nutrition", "energy"],
  },
  {
    slug: "bmr",
    name: "BMR Calculator",
    category: "fitness",
    blurb: "Basal metabolic rate estimate.",
    tags: ["metabolism"],
  },
  {
    slug: "body-fat",
    name: "Body Fat Calculator",
    category: "fitness",
    blurb: "Estimate body fat percentage from key measurements.",
    tags: ["composition"],
  },
  {
    slug: "scientific",
    name: "Scientific Calculator",
    category: "math",
    blurb: "Advanced functions in a clean layout.",
    tags: ["trig", "log"],
  },
  {
    slug: "percentage",
    name: "Percentage Calculator",
    category: "math",
    blurb: "Percent change, increase, and share.",
    tags: ["ratio"],
  },
  {
    slug: "fraction",
    name: "Fraction Calculator",
    category: "math",
    blurb: "Add, subtract, multiply, and divide fractions.",
    tags: ["arithmetic"],
  },
  {
    slug: "triangle",
    name: "Triangle Calculator",
    category: "math",
    blurb: "Solve triangles with sides and angles.",
    tags: ["geometry"],
  },
  {
    slug: "age",
    name: "Age Calculator",
    category: "other",
    blurb: "Exact age in years, months, and days.",
    tags: ["date"],
  },
  {
    slug: "date",
    name: "Date Calculator",
    category: "other",
    blurb: "Add or subtract days between dates.",
    tags: ["time"],
  },
  {
    slug: "crypto-profit-loss",
    name: "Crypto Profit/Loss Calculator",
    category: "crypto",
    blurb: "Measure profit after fees and price moves.",
    tags: ["trading", "fees"],
  },
  {
    slug: "crypto-dca",
    name: "Crypto DCA Calculator",
    category: "crypto",
    blurb: "Average your entry price over time.",
    tags: ["dca"],
  },
  {
    slug: "crypto-fee-impact",
    name: "Crypto Fee Impact Calculator",
    category: "crypto",
    blurb: "Understand how fees change breakeven.",
    tags: ["costs"],
  },
  {
    slug: "ai-token-cost",
    name: "AI Token Cost Calculator",
    category: "ai",
    blurb: "Estimate cost by tokens and model tier.",
    tags: ["pricing"],
  },
  {
    slug: "ai-model-comparator",
    name: "AI Model Cost Comparator",
    category: "ai",
    blurb: "Compare providers by workload and cost.",
    tags: ["benchmark"],
  },
];

export const calculators: Calculator[] = [...coreCalculators, ...configurableCalculators];

export const categoryMap = new Map(
  categories.map((category) => [category.id, category])
);

export function getCalculatorsByCategory(categoryId: CategoryId) {
  return calculators.filter((calc) => calc.category === categoryId);
}

export function getCalculator(slug: string) {
  return calculators.find((calc) => calc.slug === slug) ?? null;
}



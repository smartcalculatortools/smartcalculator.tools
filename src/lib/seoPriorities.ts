export type SeoPriority = {
  slug: string;
  targetQuery: string;
  title: string;
  description: string;
};

export const calculatorSeoPriorities: SeoPriority[] = [
  {
    slug: "mortgage",
    targetQuery: "mortgage calculator",
    title: "Mortgage Calculator with Taxes, Insurance, and Extra Payments",
    description:
      "Estimate monthly mortgage payments, escrow, payoff timing, and interest savings with taxes, insurance, HOA, and extra monthly payments.",
  },
  {
    slug: "loan",
    targetQuery: "loan calculator",
    title: "Loan Payment Calculator with Amortization Schedule",
    description:
      "Calculate loan payments, payoff date, and amortization details for personal, auto, and business loans with flexible payment schedules.",
  },
  {
    slug: "compound-interest",
    targetQuery: "compound interest calculator",
    title: "Compound Interest Calculator with Contributions",
    description:
      "Project compound growth with regular contributions, flexible compounding frequency, and a monthly or yearly balance schedule.",
  },
  {
    slug: "savings",
    targetQuery: "savings calculator",
    title: "Savings Calculator for Growth, Goals, and Regular Deposits",
    description:
      "Estimate how savings grow over time with recurring deposits, rate changes, and contribution timing for better goal planning.",
  },
  {
    slug: "income-tax",
    targetQuery: "income tax calculator",
    title: "Income Tax Calculator for Salary and Take-Home Pay",
    description:
      "Estimate take-home pay, effective tax rate, and after-tax income with salary, filing assumptions, and other income inputs.",
  },
  {
    slug: "bmi",
    targetQuery: "bmi calculator",
    title: "BMI Calculator for Adults with Category Results",
    description:
      "Calculate body mass index from height and weight, then view BMI category ranges and quick interpretation for adult screening.",
  },
  {
    slug: "calorie",
    targetQuery: "calorie calculator",
    title: "Calorie Calculator for Maintenance, Weight Loss, and Gain",
    description:
      "Estimate daily calorie needs, maintenance calories, and goal-adjusted targets using common BMR formulas and activity levels.",
  },
  {
    slug: "bmr",
    targetQuery: "bmr calculator",
    title: "BMR Calculator for Basal Metabolic Rate",
    description:
      "Calculate basal metabolic rate with Mifflin-St Jeor, Harris-Benedict, and Katch-McArdle formulas for calorie planning.",
  },
  {
    slug: "body-fat",
    targetQuery: "body fat calculator",
    title: "Body Fat Calculator with Navy and BMI Methods",
    description:
      "Estimate body fat percentage using tape measurements or BMI-based methods, with quick comparison between common formulas.",
  },
  {
    slug: "scientific",
    targetQuery: "scientific calculator online",
    title: "Scientific Calculator Online with Trig, Logs, and Memory",
    description:
      "Use a full scientific calculator online with trigonometry, logarithms, exponents, factorials, memory keys, and keyboard support.",
  },
  {
    slug: "percentage",
    targetQuery: "percentage calculator",
    title: "Percentage Calculator for Change, Increase, and Difference",
    description:
      "Solve percent of a number, percent change, percent increase, percent difference, and reverse percentage in one calculator.",
  },
  {
    slug: "fraction",
    targetQuery: "fraction calculator",
    title: "Fraction Calculator for Add, Subtract, Multiply, and Divide",
    description:
      "Add, subtract, multiply, and divide fractions with simplified results, improper fractions, and mixed number support.",
  },
  {
    slug: "triangle",
    targetQuery: "triangle calculator",
    title: "Triangle Calculator with Sides, Angles, Area, and Perimeter",
    description:
      "Solve triangle dimensions from three sides, then calculate area, perimeter, internal angles, and triangle type.",
  },
  {
    slug: "age",
    targetQuery: "age calculator",
    title: "Age Calculator by Date of Birth",
    description:
      "Calculate exact age in years, months, and days from date of birth, including total days lived and next birthday countdown.",
  },
  {
    slug: "date",
    targetQuery: "date calculator",
    title: "Date Calculator for Days Between Dates",
    description:
      "Find days between dates, add or subtract days from a base date, and compare calendar-day or business-day ranges.",
  },
  {
    slug: "crypto-profit-loss",
    targetQuery: "crypto profit calculator",
    title: "Crypto Profit and Loss Calculator After Fees",
    description:
      "Estimate crypto profit, loss, ROI, and breakeven after fees using entry price, exit price, and position size.",
  },
  {
    slug: "crypto-dca",
    targetQuery: "dca calculator crypto",
    title: "Crypto DCA Calculator for Average Entry Price",
    description:
      "Calculate average entry price across multiple crypto buys to track cost basis, total invested, and blended position value.",
  },
  {
    slug: "crypto-fee-impact",
    targetQuery: "crypto fee calculator",
    title: "Crypto Fee Impact Calculator and Breakeven Price",
    description:
      "Measure how trading fees affect breakeven price, net profit, and trade efficiency before entering or exiting a crypto position.",
  },
  {
    slug: "ai-token-cost",
    targetQuery: "ai token cost calculator",
    title: "AI Token Cost Calculator for Input and Output Pricing",
    description:
      "Estimate AI usage cost from input and output tokens using per-1K pricing for quick budgeting and model selection.",
  },
  {
    slug: "ai-model-comparator",
    targetQuery: "ai model cost comparison",
    title: "AI Model Cost Comparator for Token Workloads",
    description:
      "Compare two AI model pricing tiers on the same token workload to see total cost difference before choosing a provider.",
  },
];

export const calculatorSeoPriorityMap = new Map(
  calculatorSeoPriorities.map((item) => [item.slug, item])
);

export function getCalculatorSeoPriority(slug: string) {
  return calculatorSeoPriorityMap.get(slug) ?? null;
}

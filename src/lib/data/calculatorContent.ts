import { generatedCalculatorContent } from "@/lib/data/configurableCalculators/index";

export type ExampleCase = {
  title: string;
  inputs: string[];
  outputs: string[];
  note?: string;
};

export type ReferenceTable = {
  title: string;
  columns: string[];
  rows: string[][];
  note?: string;
};

export type InsightChartPoint = {
  label: string;
  value: number;
};

export type InsightChart = {
  title: string;
  xLabel: string;
  yLabel: string;
  format?: "currency" | "number" | "percent";
  points: InsightChartPoint[];
  note?: string;
};

export type CalculatorContent = {
  summary: string;
  whenToUse?: string[];
  inputs?: string[];
  outputs?: string[];
  formulas?: string[];
  assumptions?: string[];
  commonMistakes?: string[];
  tips?: string[];
  references?: string[];
  disclaimer?: string;
  examples?: ExampleCase[];
  table?: ReferenceTable;
  chart?: InsightChart;
};

const staticCalculatorContent: Record<string, CalculatorContent> = {
  mortgage: {
    summary:
      "Estimates fixed-rate mortgage payments and blends in escrow costs such as property taxes, insurance, and HOA. It also models extra monthly payments so you can see interest saved, payoff time, and a full amortization schedule.",
    inputs: [
      "Home price, down payment percentage, and loan term",
      "Annual interest rate (APR) and start month/year",
      "Property tax rate, insurance, PMI, HOA, and other annual costs",
      "Toggle to include or exclude taxes and costs",
      "Extra monthly payment applied to principal",
      "Annual escrow increase for the year 2 estimate",
    ],
    outputs: [
      "Loan amount, cash down payment, and base P&I payment",
      "Escrow total, total monthly payment, and payoff date",
      "Total interest, total escrow, and out-of-pocket estimate",
      "Interest saved and payoff time with extra payments",
      "Monthly or yearly amortization schedule with balance and dates",
      "Monthly breakdown of taxes, insurance, PMI, HOA, and other costs",
      "Monthly vs total breakdown by cost category",
    ],
    formulas: [
      "Loan Amount = Home Price * (1 - DownPayment%/100)",
      "Monthly Rate r = APR/12 and n = years * 12",
      "Payment M = P * r * (1 + r)^n / ((1 + r)^n - 1)",
      "Escrow = Tax/12 + Insurance/12 + PMI/12 + HOA + Other/12",
      "Total Out-of-Pocket = Principal + Interest + Total Escrow",
    ],
    assumptions: [
      "Fixed rate mortgage with equal monthly payments",
      "Escrow uses current annual costs and ignores local adjustments",
      "PMI and other costs are treated as flat annual estimates",
      "Extra payments are applied directly to principal each month",
      "Annual increase is shown as a year 2 estimate only",
    ],
    tips: [
      "Compare baseline vs extra payments to see interest savings",
      "Verify tax, insurance, and PMI numbers with local sources",
      "Use the yearly view for a high level payoff summary",
      "Turn off escrow to see pure principal and interest payments",
      "Print the schedule for budgeting or lender discussions",
    ],
    references: [
      "Standard fixed-rate amortization formula",
      "Mortgage escrow accounting practices",
      "Loan amortization schedules",
    ],
    disclaimer:
      "Estimates only. Taxes, insurance, and fees vary by lender and location.",
    examples: [
      {
        title: "Starter home scenario",
        inputs: [
          "Home price 350,000 with 10% down payment",
          "APR 6.0% for 30 years",
          "Tax 1.1%, insurance 1,200, HOA 0",
        ],
        outputs: [
          "Monthly P and I about 1,889",
          "Total monthly about 2,209 with escrow",
        ],
        note:
          "Numbers are illustrative and assume fixed rate with monthly payments.",
      },
      {
        title: "Payoff with extra payments",
        inputs: [
          "Home price 420,000 with 15% down payment",
          "APR 6.2% for 30 years",
          "Extra payment 200 per month",
        ],
        outputs: [
          "Payoff time reduced by several years",
          "Interest saved compared to baseline",
        ],
        note: "Use the schedule view to see the balance drop faster.",
      },
    ],
    table: {
      title: "Down payment impact on 350,000 home",
      columns: ["Down payment", "Loan amount", "Monthly P and I at 6%"],
      rows: [
        ["5%", "332,500", "1,995"],
        ["10%", "315,000", "1,889"],
        ["20%", "280,000", "1,679"],
      ],
      note: "Example assumes a 30 year term and excludes escrow.",
    },
    chart: {
      title: "Payment sensitivity to rate (300,000, 30y)",
      xLabel: "APR",
      yLabel: "Monthly payment",
      format: "currency",
      points: [
        { label: "4%", value: 1432 },
        { label: "5%", value: 1610 },
        { label: "6%", value: 1799 },
        { label: "7%", value: 1996 },
      ],
      note: "Principal and interest only; taxes and fees are excluded.",
    },
  },
  loan: {
    summary:
      "Calculates fixed-rate loan scenarios with amortized, deferred payment, and bond-style payoffs. It supports flexible compounding and payback frequencies, plus a monthly or yearly schedule.",
    inputs: [
      "Loan amount or face value (for bonds)",
      "Annual interest rate (APR)",
      "Loan term length in years",
      "Start month and year for payoff date estimates",
      "Loan type (amortized, deferred, bond)",
      "Compounding frequency (including continuous)",
      "Payback frequency for amortized loans",
    ],
    outputs: [
      "Payment per period (amortized loans)",
      "Amount due at maturity (deferred loans)",
      "Amount received (bond proceeds)",
      "Total interest paid or accrued",
      "Monthly or yearly schedule summary",
      "Estimated payoff date based on the start date",
    ],
    formulas: [
      "Monthly Rate r = APR/12 and n = years * 12",
      "Payment M = P * r * (1 + r)^n / ((1 + r)^n - 1)",
      "Total Paid = M * n and Total Interest = Total Paid - Principal",
      "Deferred Amount Due = P * (1 + r/c)^(c*years)",
      "Bond Present Value = Face Value / (1 + r/c)^(c*years)",
    ],
    assumptions: [
      "Fixed rate and equal periodic payments",
      "No origination fees, insurance, or taxes included",
      "Payments are made at the end of each period",
    ],
    tips: [
      "Longer terms lower the payment but increase total interest",
      "Run multiple rates to see rate sensitivity",
      "Add fees separately for a full cost view",
    ],
    references: [
      "Standard amortization formula",
      "Basic loan payment schedules",
    ],
    disclaimer: "Results are estimates and not a loan offer.",
    examples: [
      {
        title: "Car loan example",
        inputs: [
          "Loan 25,000 at 6% APR",
          "Term length 5 years",
        ],
        outputs: [
          "Monthly payment about 483",
          "Total interest about 4,000",
        ],
        note: "Rounded values based on standard fixed payment math.",
      },
      {
        title: "Personal loan example",
        inputs: [
          "Loan 8,000 at 11% APR",
          "Term length 3 years",
        ],
        outputs: [
          "Monthly payment about 262",
          "Total interest about 1,400",
        ],
        note: "Use the same inputs to compare multiple lenders.",
      },
    ],
    table: {
      title: "Term vs interest (20,000 at 6%)",
      columns: ["Term", "Monthly payment", "Total interest"],
      rows: [
        ["3 years", "608", "1,900"],
        ["5 years", "387", "3,200"],
        ["7 years", "292", "4,500"],
      ],
      note: "Longer terms reduce payment but raise total interest.",
    },
    chart: {
      title: "Payment vs term",
      xLabel: "Term length",
      yLabel: "Monthly payment",
      format: "currency",
      points: [
        { label: "3y", value: 608 },
        { label: "5y", value: 387 },
        { label: "7y", value: 292 },
      ],
      note: "Assumes a 20,000 loan at 6% APR.",
    },
  },
  "compound-interest": {
    summary:
      "Projects account growth with flexible compounding, contribution timing, and contribution frequency. Includes a monthly or yearly schedule and start date selection for timeline planning.",
    inputs: [
      "Starting balance (principal amount)",
      "Contribution amount and frequency",
      "Annual interest rate",
      "Time horizon in years and months",
      "Compounding frequency (annual, quarterly, monthly, etc.)",
      "Contribution timing (start or end of period)",
      "Start month and year for schedule dates",
    ],
    outputs: [
      "Future value at the end of the period",
      "Total contributions (principal + deposits)",
      "Interest earned above contributions",
      "Monthly or yearly schedule breakdown",
      "Total number of compounding periods",
    ],
    formulas: [
      "n = years * 12 and r = APR/12",
      "Future Value = P*(1+r)^n + PMT * ((1+r)^n - 1) / r",
      "Total Contributions = P + PMT * n",
      "Interest Earned = Future Value - Total Contributions",
    ],
    assumptions: [
      "Contributions occur at the end of each month",
      "Rate is constant and compounded at the selected frequency",
      "Taxes, fees, and inflation are not included",
    ],
    tips: [
      "Small rate changes compound significantly over long horizons",
      "Increase contributions to accelerate growth",
      "Use conservative rates for planning",
    ],
    references: [
      "Compound interest formula",
      "Future value of an annuity",
    ],
    disclaimer: "Projections are illustrative and not investment advice.",
    examples: [
      {
        title: "Starter investment",
        inputs: [
          "Starting balance 10,000",
          "Monthly contribution 100",
          "APR 5% for 10 years",
        ],
        outputs: [
          "Future value about 29,000",
          "Interest earned about 7,000",
        ],
        note: "Shows how consistent deposits build over time.",
      },
      {
        title: "Long horizon plan",
        inputs: [
          "Starting balance 5,000",
          "Monthly contribution 200",
          "APR 7% for 20 years",
        ],
        outputs: [
          "Future value about 114,000",
          "Interest earned about 61,000",
        ],
        note: "Higher rates and longer horizons magnify compounding.",
      },
    ],
    table: {
      title: "Yearly balance sample (10,000 + 100/mo at 5%)",
      columns: ["Year", "Balance", "Interest earned"],
      rows: [
        ["1", "11,300", "1,300"],
        ["5", "19,000", "3,000"],
        ["10", "29,000", "7,000"],
      ],
      note: "Values are rounded to show growth milestones.",
    },
    chart: {
      title: "Balance growth by year",
      xLabel: "Year",
      yLabel: "Account balance",
      format: "currency",
      points: [
        { label: "1", value: 11300 },
        { label: "5", value: 19000 },
        { label: "10", value: 29000 },
      ],
      note: "Sample based on 10,000 starting balance and 100 monthly.",
    },
  },
  savings: {
    summary:
      "Estimates how a savings balance grows with flexible deposit frequency, contribution timing, and compounding. Includes a monthly or yearly schedule and timeline start date.",
    inputs: [
      "Starting balance",
      "Deposit amount and frequency",
      "Annual interest rate",
      "Time horizon in years and months",
      "Compounding frequency",
      "Deposit timing (start or end of period)",
      "Annual deposit increase percentage",
      "Tax rate and inflation rate for adjusted values",
      "Start month and year for schedule dates",
    ],
    outputs: [
      "Future value",
      "Total saved (starting balance + deposits)",
      "Interest earned",
      "Monthly or yearly schedule breakdown",
      "Total number of months",
      "After-tax future value",
      "Inflation-adjusted future value",
    ],
    formulas: [
      "n = years * 12 and r = APR/12",
      "Future Value = P*(1+r)^n + PMT * ((1+r)^n - 1) / r",
      "Total Saved = P + PMT * n",
      "Interest Earned = Future Value - Total Saved",
    ],
    assumptions: [
      "Deposits are made at the end of each compounding period",
      "Rate is fixed and compounded at the selected frequency",
      "Tax and inflation adjustments are simplified estimates",
    ],
    tips: [
      "Set a goal amount, then adjust deposits and timeline",
      "Review the rate if your bank updates APY",
      "Use shorter horizons for cash goals",
    ],
    references: [
      "Compound interest formula",
      "Future value of a savings annuity",
    ],
    disclaimer: "Estimates only; actual bank rates and terms vary.",
    examples: [
      {
        title: "Emergency fund",
        inputs: [
          "Starting balance 2,000",
          "Monthly deposit 300",
          "APR 3% for 2 years",
        ],
        outputs: [
          "Future value about 9,500",
          "Interest earned about 300",
        ],
        note: "A short horizon with steady deposits adds up fast.",
      },
      {
        title: "Vacation goal",
        inputs: [
          "Starting balance 1,000",
          "Monthly deposit 200",
          "APR 2% for 1 year",
        ],
        outputs: [
          "Future value about 3,500",
          "Interest earned about 100",
        ],
        note: "Lower rates still help but deposits do most of the work.",
      },
    ],
    table: {
      title: "Monthly deposit vs 3 year balance (3%)",
      columns: ["Monthly deposit", "Future value", "Interest earned"],
      rows: [
        ["100", "3,750", "150"],
        ["300", "11,300", "500"],
        ["500", "19,000", "900"],
      ],
      note: "Shows how deposit size drives most of the total balance.",
    },
    chart: {
      title: "Future value by monthly deposit",
      xLabel: "Monthly deposit",
      yLabel: "Future value",
      format: "currency",
      points: [
        { label: "100", value: 3750 },
        { label: "300", value: 11300 },
        { label: "500", value: 19000 },
      ],
      note: "Example uses a 3 year horizon and 3% APR.",
    },
  },
  "income-tax": {
    summary:
      "Estimates federal income tax using IRS brackets by year and filing status. It supports standard or itemized deductions plus credits to show taxable income, effective rate, and take-home pay.",
    inputs: [
      "Tax year and filing status selection",
      "Wages and other income sources",
      "Adjustments and pre-tax deductions",
      "Standard or itemized deduction choice",
      "Federal tax credits to apply",
      "Pay period selection for per-check estimates",
    ],
    outputs: [
      "Taxable income after deductions",
      "Federal tax after credits",
      "Net income after federal tax",
      "Effective tax rate percentage",
      "Net income per pay period",
    ],
    formulas: [
      "Taxable Income = max(0, Income - Adjustments - Deductions)",
      "Tax = sum of bracket taxes on taxable income",
      "Net Income = Income - Tax",
    ],
    assumptions: [
      "Federal-only estimate without state taxes",
      "Credits reduce tax but not below zero",
      "Uses published IRS bracket thresholds",
    ],
    tips: [
      "Compare standard vs itemized deductions",
      "Update inputs when filing status changes",
      "Use effective rate for budgeting checks",
    ],
    references: [
      "IRS income tax basics (US)",
      "IRS revenue procedures for tax brackets and standard deductions",
      "Marginal vs effective tax rate concept",
    ],
    disclaimer: "Not tax advice. Verify with local regulations.",
    examples: [
      {
        title: "Single filer example",
        inputs: [
          "Wages 50,000 with no other income",
          "Standard deduction with 2024 brackets",
        ],
        outputs: [
          "Taxable income about 35,400",
          "Federal tax around 4,016",
        ],
        note: "Illustrative numbers based on 2024 single filer brackets.",
      },
      {
        title: "Joint filer example",
        inputs: [
          "Wages 120,000 and other income 10,000",
          "Standard deduction with 2025 brackets",
        ],
        outputs: [
          "Taxable income around 98,500",
          "Federal tax computed across multiple brackets",
        ],
        note: "Use your own filing status and year for accuracy.",
      },
    ],
    table: {
      title: "Bracket tax example (2024 single, 35,400 taxable)",
      columns: ["Bracket", "Taxed income", "Tax"],
      rows: [
        ["10% up to 11,600", "11,600", "1,160"],
        ["12% next 23,800", "23,800", "2,856"],
        ["Total", "35,400", "4,016"],
      ],
      note: "Shows how bracketed tax is summed for a sample taxable income.",
    },
    chart: {
      title: "Tax by bracket (sample)",
      xLabel: "Bracket",
      yLabel: "Tax",
      format: "currency",
      points: [
        { label: "10%", value: 1160 },
        { label: "12%", value: 2856 },
        { label: "Total", value: 4016 },
      ],
      note: "Bracket shares illustrate how total tax is built up.",
    },
  },
  
bmi: {
    summary:
      "Calculates body mass index from height and weight and classifies the result for adults. It also provides BMI Prime, Ponderal Index, and a healthy weight range based on height so you can interpret the result with more context.",
    inputs: [
      "Height and weight in Metric, US, or Other units",
      "Age and sex for context",
      "Unit selection and conversions",
    ],
    outputs: [
      "BMI value and category",
      "Healthy weight range for the given height",
      "BMI Prime and Ponderal Index",
      "BMI scale position",
    ],
    formulas: [
      "BMI = weight(kg) / height(m)^2",
      "BMI Prime = BMI / 25",
      "Ponderal Index = weight(kg) / height(m)^3",
      "Healthy Range = 18.5-24.9 * height(m)^2",
    ],
    assumptions: [
      "Adult BMI categories are screening guidelines",
      "Children and teens require age- and sex-specific charts",
      "BMI does not directly measure body fat",
    ],
    tips: [
      "Use consistent units for better accuracy",
      "Consider waist and body composition for more context",
      "Track trends over time rather than a single value",
    ],
    references: [
      "World Health Organization BMI classification",
      "CDC BMI guidance for adults and children",
      "Ponderal Index background",
    ],
    disclaimer: "BMI is a screening tool and not a diagnosis.",
    examples: [
      {
        title: "Metric example",
        inputs: [
          "Weight 70 kg and height 175 cm",
          "Age 30 with adult category",
        ],
        outputs: [
          "BMI about 22.9 and Normal category",
          "Healthy range about 56 to 76 kg",
        ],
        note: "Uses standard adult categories for interpretation.",
      },
      {
        title: "US example",
        inputs: [
          "Weight 154 lb and height 5 ft 9 in",
          "Age 30 with adult category",
        ],
        outputs: [
          "BMI about 22.7 and Normal category",
          "BMI Prime about 0.91",
        ],
        note: "Same outcome with different units and conversions.",
      },
    ],
    table: {
      title: "Adult BMI categories",
      columns: ["Category", "Range"],
      rows: [
        ["Underweight", "< 18.5"],
        ["Normal", "18.5 - 24.9"],
        ["Overweight", "25 - 29.9"],
        ["Obesity", "30+"],
      ],
      note: "Categories apply to adults and are not diagnostic.",
    },
    chart: {
      title: "BMI points on scale",
      xLabel: "Category",
      yLabel: "BMI value",
      format: "number",
      points: [
        { label: "Under", value: 17 },
        { label: "Normal", value: 22 },
        { label: "Over", value: 27 },
        { label: "Obese", value: 32 },
      ],
      note: "Sample values placed within each category band.",
    },
  },
  calorie: {
    summary:
      "Estimates daily calories using multiple BMR formulas, activity level multipliers, and an optional goal adjustment. Outputs can be shown in kcal or kJ.",
    inputs: [
      "Sex, age, height, and weight",
      "BMR formula selection and optional body fat %",
      "Activity level multiplier",
      "Goal adjustment in calories",
      "Output unit (kcal or kJ)",
      "Measurements in cm/kg or ft/in + lb",
      "Update inputs when activity changes",
    ],
    outputs: [
      "BMR calories per day",
      "Maintenance calories per day",
      "Goal-adjusted calorie target",
    ],
    formulas: [
      "BMR (male) = 10w + 6.25h - 5a + 5",
      "BMR (female) = 10w + 6.25h - 5a - 161",
      "Maintenance Calories = BMR * ActivityMultiplier",
    ],
    assumptions: [
      "Formula is designed for adults and average body composition",
      "Activity multipliers are generalized estimates",
      "Does not account for medical conditions or adaptive metabolism",
    ],
    tips: [
      "Adjust after 2-3 weeks based on real outcomes",
      "Recalculate if weight or activity changes significantly",
      "Use a modest deficit or surplus for sustainable goals",
    ],
    references: [
      "Mifflin-St Jeor equation",
      "Common activity multiplier tables",
    ],
    disclaimer: "For informational use only and not medical advice.",
    examples: [
      {
        title: "Office worker",
        inputs: [
          "Male, 30 years, 80 kg, 180 cm",
          "Activity level light",
        ],
        outputs: [
          "BMR about 1,780 calories",
          "Maintenance about 2,450 calories",
        ],
        note: "Light activity typically means 1-3 workouts weekly.",
      },
      {
        title: "Active athlete",
        inputs: [
          "Female, 28 years, 65 kg, 170 cm",
          "Activity level very",
        ],
        outputs: [
          "BMR about 1,410 calories",
          "Maintenance about 2,430 calories",
        ],
        note: "High activity can raise maintenance significantly.",
      },
    ],
    table: {
      title: "Activity multipliers",
      columns: ["Level", "Multiplier", "Description"],
      rows: [
        ["Sedentary", "1.2", "Little to no exercise"],
        ["Light", "1.375", "1-3 workouts per week"],
        ["Moderate", "1.55", "3-5 workouts per week"],
        ["Very", "1.725", "6-7 workouts per week"],
        ["Extra", "1.9", "Physical job or two-a-days"],
      ],
      note: "Pick the closest match and adjust after tracking results.",
    },
    chart: {
      title: "Maintenance calories by activity (BMR 1,700)",
      xLabel: "Activity level",
      yLabel: "Calories per day",
      format: "number",
      points: [
        { label: "Sed", value: 2040 },
        { label: "Light", value: 2338 },
        { label: "Mod", value: 2635 },
        { label: "Very", value: 2933 },
        { label: "Extra", value: 3230 },
      ],
      note: "Chart assumes a 1,700 calorie BMR baseline.",
    },
  },
  bmr: {
    summary:
      "Calculates basal metabolic rate (BMR) using multiple common formulas. This is the calorie burn at rest and a baseline for maintenance planning before applying an activity multiplier.",
    inputs: [
      "Biological sex (male or female)",
      "Age in years (whole number)",
      "Height measured in centimeters or feet/inches",
      "Weight measured in kilograms or pounds",
      "Formula selection (Mifflin-St Jeor, Harris-Benedict, Katch-McArdle)",
      "Body fat percentage for the Katch-McArdle formula",
    ],
    outputs: [
      "BMR calories per day",
      "Resting energy baseline",
      "Starting point for maintenance calculations",
    ],
    formulas: [
      "BMR (male) = 10w + 6.25h - 5a + 5",
      "BMR (female) = 10w + 6.25h - 5a - 161",
      "Harris-Benedict (male) = 13.397w + 4.799h - 5.677a + 88.362",
      "Harris-Benedict (female) = 9.247w + 3.098h - 4.330a + 447.593",
      "Katch-McArdle = 370 + 21.6 * leanMass(kg)",
    ],
    assumptions: [
      "Adult population averages",
      "Measurements are accurate and current",
    ],
    tips: [
      "Pair BMR with activity level for maintenance calories",
      "Recalculate after significant weight change",
      "Use as a baseline, not a precise prescription",
    ],
    references: [
      "Mifflin-St Jeor equation",
      "Clinical nutrition energy estimation basics",
    ],
    disclaimer: "For informational use only and not medical advice.",
    examples: [
      {
        title: "Male example",
        inputs: [
          "Male, 30 years, 180 cm",
          "Weight 80 kg",
        ],
        outputs: [
          "BMR about 1,780 calories",
          "Use activity multiplier for maintenance",
        ],
        note: "BMR is the resting baseline before daily activity.",
      },
      {
        title: "Female example",
        inputs: [
          "Female, 30 years, 165 cm",
          "Weight 60 kg",
        ],
        outputs: [
          "BMR about 1,330 calories",
          "Use activity multiplier for maintenance",
        ],
        note: "Results are estimates and vary by body composition.",
      },
    ],
    table: {
      title: "BMR by weight (male, 30y, 175cm)",
      columns: ["Weight", "BMR estimate"],
      rows: [
        ["60 kg", "1,520"],
        ["70 kg", "1,620"],
        ["80 kg", "1,720"],
        ["90 kg", "1,820"],
      ],
      note: "Each 10 kg adds about 100 calories in this profile.",
    },
    chart: {
      title: "BMR vs weight",
      xLabel: "Weight",
      yLabel: "Calories per day",
      format: "number",
      points: [
        { label: "60", value: 1520 },
        { label: "70", value: 1620 },
        { label: "80", value: 1720 },
        { label: "90", value: 1820 },
      ],
      note: "Profile assumes male, 30 years, 175 cm height.",
    },
  },
  "body-fat": {
    summary:
      "Estimates body fat percentage using both the US Navy circumference method and a BMI-based method. It uses tape measurements or BMI plus age/sex to provide quick screening estimates rather than clinical measurements.",
    inputs: [
      "Sex selection",
      "Age in years for BMI-based estimates",
      "Target body fat percentage",
      "Body weight in kg or lb",
      "Height, waist, and neck circumference in cm or inches",
      "Hip circumference in cm or inches for females",
      "Consistent tape measurement technique",
    ],
    outputs: [
      "Estimated body fat percentage (US Navy)",
      "Estimated body fat percentage (BMI method)",
      "Fat mass and lean mass estimates",
      "Target weight based on current lean mass",
      "Fat to lose or gain to reach the target",
      "Result clamped to a 0-100 percent range",
    ],
    formulas: [
      "Male: 86.010*log10(waist-neck) - 70.041*log10(height) + 36.76",
      "Female: 163.205*log10(waist+hip-neck) - 97.684*log10(height) - 78.387",
      "BMI method (adult male): 1.20*BMI + 0.23*age - 16.2",
      "BMI method (adult female): 1.20*BMI + 0.23*age - 5.4",
      "BMI method (boys): 1.51*BMI - 0.70*age - 2.2",
      "BMI method (girls): 1.51*BMI - 0.70*age + 1.4",
    ],
    assumptions: [
      "Tape measurements are accurate and taken at standard sites",
      "Units are converted internally between cm and inches",
      "Method is an estimate and not a clinical test",
    ],
    tips: [
      "Measure at the same time of day for consistency",
      "Keep the tape level and snug but not tight",
      "Track trends instead of single measurements",
    ],
    references: [
      "US Navy body fat method",
      "Circumference-based body composition formulas",
    ],
    disclaimer: "Estimate only and not a medical diagnosis.",
    examples: [
      {
        title: "Male example",
        inputs: [
          "Male, height 180 cm",
          "Waist 90 cm and neck 40 cm",
        ],
        outputs: [
          "Body fat about 18%",
          "Result is a screening estimate",
        ],
        note: "Small changes in tape placement can move the result.",
      },
      {
        title: "Female example",
        inputs: [
          "Female, height 165 cm",
          "Waist 75 cm, neck 35 cm, hip 95 cm",
        ],
        outputs: [
          "Body fat about 26%",
          "Result is a screening estimate",
        ],
        note: "Use consistent technique to track changes over time.",
      },
    ],
    table: {
      title: "General body fat ranges (male)",
      columns: ["Range", "Percent", "Note"],
      rows: [
        ["Essential", "2-5", "Minimum healthy range"],
        ["Athletes", "6-13", "Competitive fitness"],
        ["Fitness", "14-17", "Lean and fit"],
        ["Average", "18-24", "Typical range"],
        ["High", "25+", "Elevated body fat"],
      ],
      note: "Ranges vary by source and are not medical thresholds.",
    },
    chart: {
      title: "Body fat scenarios",
      xLabel: "Scenario",
      yLabel: "Body fat percent",
      format: "percent",
      points: [
        { label: "Lean", value: 12 },
        { label: "Fit", value: 17 },
        { label: "Avg", value: 22 },
        { label: "High", value: 28 },
      ],
      note: "Use ranges for context rather than exact targets.",
    },
  },
  scientific: {
    summary:
      "Full scientific calculator with trig, logs, exponents, factorial, memory, and DEG/RAD modes. Supports keyboard input, keeps the last answer for chained calculations, and follows standard operator precedence.",
    inputs: [
      "Expression entry via buttons or keyboard",
      "Angle mode selection (DEG or RAD)",
      "Memory actions (MC, MR, M+, M-)",
    ],
    outputs: [
      "Computed result",
      "Memory register value",
      "ANS value from the last calculation",
    ],
    formulas: [
      "sin(x), cos(x), tan(x) with DEG or RAD mode",
      "log(x) for base 10 and ln(x) for natural log",
      "x^y, sqrt(x), 1/x, and factorial(x)",
    ],
    assumptions: [
      "Operator precedence follows standard math rules",
      "Calculations use JavaScript floating point precision",
    ],
    tips: [
      "Use parentheses to control order of operations",
      "Toggle DEG or RAD before trig calculations",
      "Use ANS to chain results quickly",
    ],
    references: [
      "Standard scientific calculator functions",
      "Trigonometric and logarithmic definitions",
    ],
    examples: [
      {
        title: "Trig in DEG mode",
        inputs: [
          "Set angle mode to DEG",
          "Enter sin(30) and press equals",
        ],
        outputs: [
          "Result is about 0.5",
          "ANS stores the last value",
        ],
        note: "Switch to RAD if your inputs are in radians.",
      },
      {
        title: "Log example",
        inputs: [
          "Enter log(1000) and press equals",
          "Or use ln(2.718) for natural log",
        ],
        outputs: [
          "log(1000) returns 3",
          "ln(2.718) returns about 1",
        ],
        note: "Use log for base 10 and ln for natural log.",
      },
    ],
    table: {
      title: "Common keys",
      columns: ["Key", "Example input", "Result"],
      rows: [
        ["sin", "sin(30)", "0.5"],
        ["sqrt", "sqrt(81)", "9"],
        ["10^x", "10^3", "1000"],
        ["1/x", "1/4", "0.25"],
        ["x!", "fact(5)", "120"],
      ],
      note: "Trig examples assume DEG mode for clarity.",
    },
    chart: {
      title: "Sine values in DEG",
      xLabel: "Angle",
      yLabel: "sin(x)",
      format: "number",
      points: [
        { label: "0", value: 0 },
        { label: "30", value: 0.5 },
        { label: "60", value: 0.866 },
        { label: "90", value: 1 },
      ],
      note: "Use RAD mode if you prefer radians for trig inputs.",
    },
  },
  percentage: {
    summary:
      "Multiple percentage tools in one: percent of a number, percent share, percent change, percent difference, and base-value lookup. Useful for growth comparisons, discounts, and proportional splits.",
    inputs: [
      "Percent value and base number",
      "Part and total for share percentage",
      "From and to values for percent change",
      "Value A and B for percent difference",
      "Percent and result to back into the base value",
    ],
    outputs: [
      "Percent-of result",
      "Share percentage",
      "Percent change",
      "Percent difference",
      "Base value estimate",
    ],
    formulas: [
      "Percent Of = (Percent/100) * Base",
      "Share % = (Part / Total) * 100",
      "Change % = (New - Old) / Old * 100",
      "Difference % = |A - B| / ((|A| + |B|)/2) * 100",
      "Base = Result / (Percent/100)",
    ],
    assumptions: [
      "Total and old values should be non-zero",
      "Negative values are allowed but may need interpretation",
    ],
    tips: [
      "Use percent change to compare growth over time",
      "Check totals before interpreting share percentages",
      "Round results consistently for reporting",
    ],
    references: [
      "Basic percentage formulas",
    ],
    examples: [
      {
        title: "Percent of a number",
        inputs: [
          "Percent 25 and base 200",
          "Use percent-of section",
        ],
        outputs: [
          "Result is 50",
          "This equals 25% of 200",
        ],
        note: "Good for discounts, commissions, and ratios.",
      },
      {
        title: "Percent change example",
        inputs: [
          "From 80 to 100",
          "Use percent change section",
        ],
        outputs: [
          "Change is 25%",
          "Positive value means increase",
        ],
        note: "If the starting value is zero the result is undefined.",
      },
    ],
    table: {
      title: "Percent change reference",
      columns: ["From", "To", "Change %"],
      rows: [
        ["80", "100", "25%"],
        ["100", "80", "-20%"],
        ["50", "75", "50%"],
      ],
      note: "Use the absolute value to compare magnitude of change.",
    },
    chart: {
      title: "Change examples",
      xLabel: "Scenario",
      yLabel: "Percent change",
      format: "percent",
      points: [
        { label: "80-100", value: 25 },
        { label: "100-80", value: 20 },
        { label: "50-75", value: 50 },
      ],
      note: "Chart shows absolute change size; see the table for sign.",
    },
  },
  fraction: {
    summary:
      "Performs add, subtract, multiply, and divide on two fractions with optional mixed numbers. It reduces results, returns decimals, and converts decimal inputs to fractions.",
    inputs: [
      "Fraction A numerator and denominator",
      "Fraction B numerator and denominator",
      "Optional whole number inputs for mixed numbers",
      "Selected operation (add, subtract, multiply, divide)",
      "Decimal value to convert to a fraction",
    ],
    outputs: [
      "Reduced fraction result",
      "Decimal form of the result",
      "Mixed number output",
      "Decimal to fraction conversion",
    ],
    formulas: [
      "Add: a/b + c/d = (ad + bc) / bd",
      "Multiply: a/b * c/d = (ac) / (bd)",
      "Divide: a/b / c/d = (a*d) / (b*c)",
    ],
    assumptions: [
      "Denominators cannot be zero",
      "Results are reduced using greatest common divisor",
    ],
    tips: [
      "Reduce inputs first to avoid overflow",
      "Check for zero denominators before dividing",
      "Use decimal output for quick comparisons",
    ],
    references: [
      "Basic fraction arithmetic",
    ],
    examples: [
      {
        title: "Add fractions",
        inputs: [
          "Fraction A 1/2",
          "Fraction B 1/3",
          "Operation add",
        ],
        outputs: [
          "Result equals 5/6",
          "Decimal about 0.833",
        ],
        note: "The calculator reduces the result automatically.",
      },
      {
        title: "Divide fractions",
        inputs: [
          "Fraction A 3/4",
          "Fraction B 2/5",
          "Operation divide",
        ],
        outputs: [
          "Result equals 15/8",
          "Decimal about 1.875",
        ],
        note: "Dividing by a fraction multiplies by its reciprocal.",
      },
    ],
    table: {
      title: "Common fractions",
      columns: ["Fraction", "Decimal"],
      rows: [
        ["1/2", "0.50"],
        ["1/3", "0.33"],
        ["2/3", "0.67"],
        ["3/4", "0.75"],
        ["5/8", "0.625"],
      ],
      note: "Decimals are rounded for quick comparison.",
    },
    chart: {
      title: "Decimal equivalents",
      xLabel: "Fraction",
      yLabel: "Decimal",
      format: "number",
      points: [
        { label: "1/2", value: 0.5 },
        { label: "2/3", value: 0.667 },
        { label: "3/4", value: 0.75 },
        { label: "5/8", value: 0.625 },
      ],
      note: "Use the chart to compare fraction sizes quickly.",
    },
  },
  triangle: {
    summary:
      "Computes area, perimeter, angles, and triangle type from three sides using Heron's formula and the law of cosines. Validates the triangle inequality before returning results.",
    inputs: [
      "Side A length",
      "Side B length",
      "Side C length",
      "Angle unit (degrees or radians)",
    ],
    outputs: [
      "Triangle area",
      "Triangle perimeter",
      "Triangle type (equilateral, isosceles, scalene)",
      "All three angles",
    ],
    formulas: [
      "s = (a + b + c) / 2",
      "Area = sqrt(s(s-a)(s-b)(s-c))",
      "Perimeter = a + b + c",
    ],
    assumptions: [
      "Sides must satisfy the triangle inequality",
      "Units are consistent across all sides",
    ],
    tips: [
      "If results show invalid, check side lengths",
      "Keep units consistent (cm, in, or m)",
    ],
    references: [
      "Heron formula for triangle area",
    ],
    examples: [
      {
        title: "3-4-5 triangle",
        inputs: [
          "Side A 3, Side B 4, Side C 5",
          "All sides in the same unit",
        ],
        outputs: [
          "Area equals 6",
          "Perimeter equals 12",
        ],
        note: "This classic right triangle is useful for checks.",
      },
      {
        title: "Isosceles example",
        inputs: [
          "Side A 5, Side B 5, Side C 6",
          "All sides in the same unit",
        ],
        outputs: [
          "Area about 12",
          "Perimeter equals 16",
        ],
        note: "Area is approximate due to square root rounding.",
      },
    ],
    table: {
      title: "Triangle validity check",
      columns: ["Sides", "Valid", "Note"],
      rows: [
        ["3, 4, 5", "Yes", "Satisfies inequality"],
        ["2, 2, 5", "No", "2 + 2 is not greater than 5"],
        ["5, 5, 9", "No", "5 + 5 is not greater than 9"],
        ["5, 5, 6", "Yes", "Valid isosceles triangle"],
      ],
      note: "A + B must be greater than C for all side pairs.",
    },
    chart: {
      title: "Area scaling (3-4-5 family)",
      xLabel: "Triangle set",
      yLabel: "Area",
      format: "number",
      points: [
        { label: "3-4-5", value: 6 },
        { label: "6-8-10", value: 24 },
        { label: "9-12-15", value: 54 },
      ],
      note: "Scaling sides by 2 multiplies area by 4.",
    },
  },
  age: {
    summary:
      "Calculates precise age between two dates with a full breakdown (years, months, days) plus total units and next birthday countdown.",
    inputs: [
      "Birth date (start date)",
      "Reference date (end date)",
    ],
    outputs: [
      "Years difference",
      "Months difference",
      "Days difference",
      "Total days between dates",
      "Total weeks, hours, minutes, seconds",
      "Next birthday date and days remaining",
    ],
    formulas: [
      "Total Days = |End Date - Start Date| / 86400000",
      "Y/M/D breakdown uses calendar-aware component differences",
    ],
    assumptions: [
      "Dates are normalized to UTC midnight",
      "If end date is earlier, the difference is absolute",
    ],
    tips: [
      "Use a fixed reference date for consistent results",
      "Date formats follow ISO-8601",
    ],
    references: [
      "ISO 8601 date format",
    ],
    examples: [
      {
        title: "Eligibility check",
        inputs: [
          "Birth date 1990-06-01",
          "Reference date 2025-06-01",
        ],
        outputs: [
          "Age is 35 years",
          "Total days about 12,783",
        ],
        note: "Total days are rounded and depend on leap years.",
      },
      {
        title: "Exact age example",
        inputs: [
          "Birth date 2000-01-15",
          "Reference date 2026-03-14",
        ],
        outputs: [
          "Age is 26 years, 1 month, 27 days",
          "Total days about 9,566",
        ],
        note: "Use the breakdown for precise eligibility windows.",
      },
    ],
    table: {
      title: "Sample age spans",
      columns: ["Start date", "End date", "Total days"],
      rows: [
        ["2010-01-01", "2020-01-01", "3,652"],
        ["2015-05-10", "2020-05-10", "1,826"],
        ["2020-03-01", "2026-03-01", "2,192"],
      ],
      note: "Day counts include leap days where applicable.",
    },
    chart: {
      title: "Total days by age",
      xLabel: "Age in years",
      yLabel: "Total days",
      format: "number",
      points: [
        { label: "10", value: 3652 },
        { label: "20", value: 7305 },
        { label: "30", value: 10958 },
      ],
      note: "Approximate days using leap years across the span.",
    },
  },
  date: {
    summary:
      "Finds calendar and business-day spans between dates, plus adds or subtracts a day offset from a base date. Dates are normalized to UTC to reduce timezone drift.",
    inputs: [
      "Start date for the date range",
      "End date for the date range",
      "Include end date toggle",
      "Delta days to add or subtract",
    ],
    outputs: [
      "Years, months, and days breakdown",
      "Total days and business days",
      "Weeks and remaining days",
      "Adjusted date after applying delta",
    ],
    formulas: [
      "Days Between = (End - Start) / 86400000",
      "Adjusted Date = Start Date + Delta Days",
    ],
    assumptions: [
      "Dates are interpreted at UTC midnight",
      "Delta days can be positive or negative",
    ],
    tips: [
      "Use the same timezone when comparing dates",
      "Negative delta values subtract days",
    ],
    references: [
      "ISO 8601 date format",
    ],
    examples: [
      {
        title: "Days between dates",
        inputs: [
          "Start 2024-01-01",
          "End 2024-02-01",
        ],
        outputs: [
          "Days between equals 31",
          "Use for elapsed time checks",
        ],
        note: "Calendar months have different lengths.",
      },
      {
        title: "Add days",
        inputs: [
          "Base date 2024-01-01",
          "Delta +45 days",
        ],
        outputs: [
          "Adjusted date 2024-02-15",
          "Useful for scheduling follow-ups",
        ],
        note: "Negative deltas move the date backward.",
      },
    ],
    table: {
      title: "Date offsets from 2024-01-01",
      columns: ["Delta days", "Result date"],
      rows: [
        ["+7", "2024-01-08"],
        ["+30", "2024-01-31"],
        ["-15", "2023-12-17"],
      ],
      note: "Offsets are shown using UTC midnight normalization.",
    },
    chart: {
      title: "Common ranges",
      xLabel: "Range",
      yLabel: "Days",
      format: "number",
      points: [
        { label: "7 days", value: 7 },
        { label: "30 days", value: 30 },
        { label: "90 days", value: 90 },
      ],
      note: "Use these as quick mental anchors for planning.",
    },
  },
  "crypto-profit-loss": {
    summary:
      "Estimates profit for a crypto position after fees on both the buy and sell. Shows cost, revenue, total fees, profit, and ROI so you can compare trades of different sizes.",
    inputs: [
      "Buy price per coin",
      "Sell price per coin",
      "Quantity traded",
      "Fee percent applied to both sides",
    ],
    outputs: [
      "Total entry cost",
      "Total exit revenue",
      "Fees paid on entry and exit",
      "Net profit or loss",
      "ROI percentage",
    ],
    formulas: [
      "Cost = Buy Price * Quantity",
      "Revenue = Sell Price * Quantity",
      "Fees = (Cost + Revenue) * FeeRate",
      "Profit = Revenue - Cost - Fees; ROI = Profit / Cost * 100",
    ],
    assumptions: [
      "Fees are the same on entry and exit",
      "No slippage or spread is modeled",
      "Prices and fees are in the same currency",
    ],
    tips: [
      "Include both maker and taker fees if applicable",
      "Test multiple exit prices for scenario planning",
      "Use ROI to compare trades of different sizes",
    ],
    references: [
      "Basic trading PnL math",
      "Exchange fee schedule concepts",
    ],
    disclaimer: "For informational use only and not financial advice.",
    examples: [
      {
        title: "Simple trade",
        inputs: [
          "Buy 100, sell 120, quantity 2",
          "Fee rate 1% per side",
        ],
        outputs: [
          "Profit about 36",
          "ROI about 18%",
        ],
        note: "Fees reduce profit on both the entry and exit.",
      },
      {
        title: "Small loss",
        inputs: [
          "Buy 200, sell 190, quantity 1",
          "Fee rate 0.5%",
        ],
        outputs: [
          "Loss about 12",
          "ROI about -6%",
        ],
        note: "Lower prices and fees can still produce a loss.",
      },
    ],
    table: {
      title: "Profit vs fee (buy 100, sell 120, qty 1)",
      columns: ["Fee", "Profit", "ROI"],
      rows: [
        ["0.1%", "19.76", "19.8%"],
        ["0.5%", "19.00", "19.0%"],
        ["1%", "18.00", "18.0%"],
      ],
      note: "Higher fees reduce profit even when price moves up.",
    },
    chart: {
      title: "Profit after fees",
      xLabel: "Fee rate",
      yLabel: "Profit",
      format: "currency",
      points: [
        { label: "0.1%", value: 19.76 },
        { label: "0.5%", value: 19 },
        { label: "1%", value: 18 },
      ],
      note: "Assumes buy 100, sell 120, quantity 1.",
    },
  },
  "crypto-dca": {
    summary:
      "Computes your average entry price across multiple buys to visualize dollar-cost averaging. Summarizes total invested and total quantity so you can track your blended cost basis.",
    inputs: [
      "Price and amount for each purchase",
      "Up to three purchase rows",
      "All prices in the same quote currency",
    ],
    outputs: [
      "Average entry price",
      "Total invested amount",
      "Total quantity accumulated",
    ],
    formulas: [
      "Total Cost = sum(price * amount)",
      "Average Entry = Total Cost / Total Amount",
    ],
    assumptions: [
      "No fees or slippage included",
      "Amounts are in the base asset units",
    ],
    tips: [
      "Add fees separately for more accurate averages",
      "Use the same currency for all entries",
      "Check totals when amounts are very small",
    ],
    references: [
      "Dollar-cost averaging concept",
    ],
    disclaimer: "For informational use only and not financial advice.",
    examples: [
      {
        title: "Three buys",
        inputs: [
          "Buy 1 at 100, buy 1 at 120",
          "Buy 2 units at 80",
        ],
        outputs: [
          "Average entry about 95",
          "Total invested 360, total qty 4",
        ],
        note: "Average is weighted by total amount, not price count.",
      },
      {
        title: "Two buys",
        inputs: [
          "Buy 2 units at 50",
          "Buy 2 units at 75",
        ],
        outputs: [
          "Average entry 62.5",
          "Total invested 250, total qty 4",
        ],
        note: "Use consistent units for all purchases.",
      },
    ],
    table: {
      title: "Purchase summary",
      columns: ["Price", "Amount", "Cost"],
      rows: [
        ["100", "1", "100"],
        ["120", "1", "120"],
        ["80", "2", "160"],
        ["Total", "4", "380"],
      ],
      note: "Totals show the weighted cost basis for the position.",
    },
    chart: {
      title: "Average vs entries",
      xLabel: "Entry",
      yLabel: "Price",
      format: "number",
      points: [
        { label: "100", value: 100 },
        { label: "120", value: 120 },
        { label: "80", value: 80 },
        { label: "Avg", value: 95 },
      ],
      note: "Average sits between the lower and higher entry prices.",
    },
  },
  "crypto-fee-impact": {
    summary:
      "Shows the breakeven exit price required to cover round-trip fees. Helpful for understanding how fee rates affect short-term trades or tight price targets.",
    inputs: [
      "Entry price per coin",
      "Fee percent applied on entry and exit",
    ],
    outputs: [
      "Breakeven exit price",
      "Fee drag above entry price",
    ],
    formulas: [
      "Breakeven = Entry * (1 + FeeRate) / (1 - FeeRate)",
    ],
    assumptions: [
      "Same fee rate on entry and exit",
      "No slippage, spread, or funding costs",
    ],
    tips: [
      "Compare fee rates across exchanges",
      "Use small fee rates for long-term holds",
    ],
    references: [
      "Trading fee impact math",
    ],
    disclaimer: "For informational use only and not financial advice.",
    examples: [
      {
        title: "Low fee example",
        inputs: [
          "Entry price 100",
          "Fee rate 0.1%",
        ],
        outputs: [
          "Breakeven about 100.20",
          "Fee drag about 0.20",
        ],
        note: "Even small fees require a higher exit price.",
      },
      {
        title: "Higher fee",
        inputs: [
          "Entry price 100",
          "Fee rate 1% per side",
        ],
        outputs: [
          "Breakeven about 102.02",
          "Fee drag about 2.02",
        ],
        note: "Fee drag grows quickly as rates increase.",
      },
    ],
    table: {
      title: "Breakeven by fee rate (entry 100)",
      columns: ["Fee", "Breakeven", "Drag"],
      rows: [
        ["0.1%", "100.20", "0.20"],
        ["0.5%", "101.01", "1.01"],
        ["1%", "102.02", "2.02"],
      ],
      note: "Breakeven grows faster than the fee rate itself.",
    },
    chart: {
      title: "Breakeven exit price",
      xLabel: "Fee rate",
      yLabel: "Exit price",
      format: "currency",
      points: [
        { label: "0.1%", value: 100.2 },
        { label: "0.5%", value: 101.01 },
        { label: "1%", value: 102.02 },
      ],
      note: "Use your exchange fee schedule for accurate rates.",
    },
  },
  "ai-token-cost": {
    summary:
      "Estimates AI usage cost from input and output tokens with per-1K pricing. Splits input, output, and total cost for quick budgeting and vendor comparisons.",
    inputs: [
      "Input token count",
      "Output token count",
      "Input rate per 1K tokens",
      "Output rate per 1K tokens",
    ],
    outputs: [
      "Input token cost",
      "Output token cost",
      "Total usage cost",
    ],
    formulas: [
      "Input Cost = (Input Tokens / 1000) * Input Rate",
      "Output Cost = (Output Tokens / 1000) * Output Rate",
    ],
    assumptions: [
      "Token counts match provider billing rules",
      "Rates are entered in the same currency",
      "No volume discounts or cached pricing modeled",
    ],
    tips: [
      "Separate prompt and completion tokens for accuracy",
      "Add a buffer for retries and tool calls",
      "Update rates when providers change pricing",
    ],
    references: [
      "Provider token billing guides",
      "Token-based AI pricing tables",
    ],
    disclaimer: "Estimates only and not a provider quote.",
    examples: [
      {
        title: "Support bot",
        inputs: [
          "Input 120,000 tokens and output 40,000 tokens",
          "Rates 1.5 input and 2.0 output per 1K",
        ],
        outputs: [
          "Input cost 180 and output cost 80",
          "Total cost about 260",
        ],
        note: "Use actual token logs for a more accurate estimate.",
      },
      {
        title: "Batch job",
        inputs: [
          "Input 500,000 tokens and output 200,000 tokens",
          "Rates 0.8 input and 1.2 output per 1K",
        ],
        outputs: [
          "Total cost about 640",
          "Input and output costs are shown separately",
        ],
        note: "Large jobs magnify small changes in per-1K rates.",
      },
    ],
    table: {
      title: "Cost by token volume (rates 1.5 and 2.0)",
      columns: ["Input tokens", "Output tokens", "Total cost"],
      rows: [
        ["50,000", "20,000", "115"],
        ["100,000", "50,000", "200"],
        ["200,000", "100,000", "400"],
      ],
      note: "Totals assume input rate 1.5 and output rate 2.0.",
    },
    chart: {
      title: "Total cost by workload",
      xLabel: "Workload",
      yLabel: "Total cost",
      format: "currency",
      points: [
        { label: "Small", value: 115 },
        { label: "Medium", value: 200 },
        { label: "Large", value: 400 },
      ],
      note: "Use your own token counts for accurate budgeting.",
    },
  },
  "ai-model-comparator": {
    summary:
      "Compares two model pricing tiers on the same token workload. Highlights the total cost difference so you can choose the cheaper option or validate pricing changes.",
    inputs: [
      "Input token count",
      "Output token count",
      "Model A input and output rates",
      "Model B input and output rates",
    ],
    outputs: [
      "Total cost for Model A",
      "Total cost for Model B",
      "Cost difference between models",
    ],
    formulas: [
      "Model Cost = (Input Tokens/1000)*Input Rate + (Output Tokens/1000)*Output Rate",
      "Delta = Cost A - Cost B",
    ],
    assumptions: [
      "Both models process the same token counts",
      "Rates are entered in the same currency",
    ],
    tips: [
      "Use realistic token counts from logs",
      "Re-evaluate when pricing changes",
      "Consider latency and quality along with cost",
    ],
    references: [
      "Model pricing tables",
      "Token-based cost comparison methods",
    ],
    disclaimer: "Estimates only and not a provider quote.",
    examples: [
      {
        title: "Pricing check",
        inputs: [
          "Workload 100,000 input and 50,000 output tokens",
          "Model A 1.5 input and 2.5 output per 1K",
          "Model B 1.0 input and 1.8 output per 1K",
        ],
        outputs: [
          "Model A cost about 275",
          "Model B cost about 190",
          "Difference about 85",
        ],
        note: "Lower input and output rates can outweigh other factors.",
      },
      {
        title: "High output workload",
        inputs: [
          "Workload 50,000 input and 150,000 output tokens",
          "Model A 1.2 input and 2.0 output per 1K",
          "Model B 0.9 input and 2.4 output per 1K",
        ],
        outputs: [
          "Model A cost about 330",
          "Model B cost about 405",
          "Difference about 75 (B higher)",
        ],
        note: "Output heavy workloads can flip the cheaper option.",
      },
    ],
    table: {
      title: "Model totals (100,000 input, 50,000 output)",
      columns: ["Model", "Input rate", "Output rate", "Total"],
      rows: [
        ["Model A", "1.5", "2.5", "275"],
        ["Model B", "1.0", "1.8", "190"],
        ["Difference", "-", "-", "85"],
      ],
      note: "Totals are in the same currency as the input rates.",
    },
    chart: {
      title: "Cost comparison",
      xLabel: "Model",
      yLabel: "Total cost",
      format: "currency",
      points: [
        { label: "Model A", value: 275 },
        { label: "Model B", value: 190 },
        { label: "Delta", value: 85 },
      ],
      note: "Use this as a quick check before deeper evaluation.",
    },
  },
};

const priorityContentEnhancements: Record<
  string,
  Pick<CalculatorContent, "whenToUse" | "commonMistakes">
> = {
  mortgage: {
    whenToUse: [
      "Compare home prices, down payments, and mortgage rates before speaking with a lender.",
      "Estimate the real monthly housing cost after taxes, insurance, HOA, and PMI.",
      "Test how extra principal payments change payoff timing and total interest over the loan.",
    ],
    commonMistakes: [
      "Using principal and interest only while forgetting escrow, HOA dues, or mortgage insurance.",
      "Comparing two offers by monthly payment alone instead of checking total interest over the full term.",
      "Leaving property tax or homeowners insurance at zero even though the lender will likely collect them monthly.",
    ],
  },
  loan: {
    whenToUse: [
      "Check monthly payments before taking an auto, personal, or small business loan.",
      "Compare shorter and longer repayment terms to balance cash flow against total interest paid.",
      "Estimate payoff timing from a planned start date before signing a lender offer.",
    ],
    commonMistakes: [
      "Ignoring lender fees and focusing only on the APR and payment shown by the calculator.",
      "Comparing loans with different payment frequencies without matching the same compounding assumptions.",
      "Choosing the lowest payment without noticing how much extra interest the longer term adds.",
    ],
  },
  "compound-interest": {
    whenToUse: [
      "Project long-term portfolio growth for retirement, college savings, or general investing plans.",
      "Compare how different monthly contributions change the ending balance over the same horizon.",
      "Stress-test growth expectations with conservative versus aggressive return assumptions.",
    ],
    commonMistakes: [
      "Assuming the projected return is guaranteed even though real investment returns vary over time.",
      "Using an annual rate that already includes fees, then forgetting to model taxes or inflation separately.",
      "Comparing scenarios with different contribution timing without noticing the start-versus-end effect.",
    ],
  },
  savings: {
    whenToUse: [
      "Plan cash goals such as an emergency fund, vacation, car purchase, or house down payment.",
      "Estimate how recurring deposits and a starting balance combine to reach a target amount.",
      "See how taxes or inflation can reduce the practical value of a future savings balance.",
    ],
    commonMistakes: [
      "Treating a short-term cash goal like an investment projection and using an unrealistic interest rate.",
      "Forgetting to increase deposits when income rises, even though that usually drives results more than rate changes.",
      "Looking only at nominal future value without checking after-tax or inflation-adjusted purchasing power.",
    ],
  },
  "income-tax": {
    whenToUse: [
      "Estimate federal tax and take-home pay before accepting a new salary or bonus structure.",
      "Compare filing statuses, deduction choices, and credits for year-end planning scenarios.",
      "Translate annual tax estimates into per-paycheck numbers for budgeting and withholding checks.",
    ],
    commonMistakes: [
      "Assuming the result includes state or payroll taxes when this estimate is focused on federal income tax.",
      "Using the wrong tax year or filing status, which can materially change deductions and bracket thresholds.",
      "Confusing marginal tax rate with effective tax rate when evaluating raises, bonuses, or side income.",
    ],
  },
  bmi: {
    whenToUse: [
      "Get a fast adult screening metric from height and weight before looking at deeper body-composition tools.",
      "Track broad weight-status trends over time with one simple, standardized measurement.",
      "Check whether current weight falls inside a common healthy-weight range for a given height.",
    ],
    commonMistakes: [
      "Treating BMI like a diagnosis even though it is only a screening tool and not a direct fat measurement.",
      "Applying adult BMI categories to children or teens, who require age- and sex-specific growth charts.",
      "Overreacting to a single result instead of looking at trend, waist size, and other health context.",
    ],
  },
  calorie: {
    whenToUse: [
      "Estimate maintenance calories before setting a weight-loss, gain, or recomposition target.",
      "Compare activity multipliers and goal adjustments for a realistic daily calorie starting point.",
      "Recalculate nutrition targets after a noticeable change in body weight, training load, or routine.",
    ],
    commonMistakes: [
      "Choosing an activity level that reflects ideal training volume instead of current weekly behavior.",
      "Using a very large deficit or surplus immediately, then blaming the calculator when adherence drops.",
      "Treating the output as exact when real maintenance calories often need several weeks of adjustment.",
    ],
  },
  bmr: {
    whenToUse: [
      "Estimate resting calorie needs before calculating maintenance or cutting and bulking targets.",
      "Compare common BMR equations when you want a better baseline for nutrition planning.",
      "Build a simple calorie model that starts from body size and age rather than guesswork.",
    ],
    commonMistakes: [
      "Using BMR as if it were daily maintenance even though normal movement requires an activity multiplier.",
      "Entering outdated body weight after a meaningful cut or bulk, which makes the baseline stale.",
      "Expecting one formula to be universally correct when body composition can shift which estimate is best.",
    ],
  },
  "body-fat": {
    whenToUse: [
      "Estimate body fat percentage from tape measurements when you do not have access to a scan device.",
      "Track changes in body composition over time using the same measurement method and timing.",
      "Compare Navy and BMI-based estimates to spot whether a reading is directionally reasonable.",
    ],
    commonMistakes: [
      "Changing where the tape is placed from one check to the next, which makes trend tracking unreliable.",
      "Pulling the tape too tight or measuring after meals, training, or heavy water fluctuation.",
      "Comparing results from different methods as if they should match exactly instead of treating them as estimates.",
    ],
  },
  scientific: {
    whenToUse: [
      "Handle quick trig, logarithm, exponent, fraction, or factorial calculations without opening a desktop app.",
      "Run chained calculations in the browser while keeping memory values and the last answer available.",
      "Check homework, engineering, finance, or programming math that needs more than a basic calculator.",
    ],
    commonMistakes: [
      "Using DEG mode for radians input, or RAD mode for degree input, before trig calculations.",
      "Skipping parentheses and assuming the calculator will follow a custom order instead of standard precedence.",
      "Expecting perfect symbolic precision even though the calculator uses floating-point arithmetic in the browser.",
    ],
  },
  percentage: {
    whenToUse: [
      "Calculate discounts, markups, commissions, and tax adjustments without switching between separate percentage formulas.",
      "Measure growth, decline, or share of total when comparing sales, traffic, pricing, or budget figures.",
      "Back into an unknown base value when you know the percentage and the result amount already.",
    ],
    commonMistakes: [
      "Confusing percent change with percent difference even though they answer different comparison questions.",
      "Using zero as the original value in percent change and expecting a defined result.",
      "Forgetting whether the sign matters when reading decreases versus absolute change magnitude.",
    ],
  },
  fraction: {
    whenToUse: [
      "Add, subtract, multiply, or divide classroom, recipe, measurement, and construction fractions quickly.",
      "Convert decimal values into reduced fractions when you need cleaner math or more readable ratios.",
      "Check mixed-number arithmetic before writing the final answer in homework or technical notes.",
    ],
    commonMistakes: [
      "Entering a zero denominator, which makes the fraction undefined before any operation starts.",
      "Forgetting that division by a fraction means multiplying by its reciprocal.",
      "Comparing raw numerators and denominators instead of using the reduced or decimal result for size checks.",
    ],
  },
  triangle: {
    whenToUse: [
      "Solve side-only triangles when you need area, perimeter, and angles from three known lengths.",
      "Validate whether three measurements can actually form a triangle before using them in design or homework.",
      "Check geometric scaling effects by comparing similar triangles and their changing areas.",
    ],
    commonMistakes: [
      "Ignoring the triangle inequality and expecting valid output from side lengths that cannot form a triangle.",
      "Mixing units across sides, such as centimeters for one side and inches for another.",
      "Assuming the triangle is right-angled without verifying the side relationship or returned angles.",
    ],
  },
  age: {
    whenToUse: [
      "Calculate exact age for forms, eligibility checks, HR records, and milestone tracking.",
      "Measure the full calendar difference between two dates in years, months, and days rather than total days only.",
      "Check next-birthday timing or total days lived for personal records and scheduling.",
    ],
    commonMistakes: [
      "Using the wrong reference date when an application or regulation expects age on a specific deadline.",
      "Assuming total days and calendar years are interchangeable even though leap years shift the count.",
      "Typing dates in the wrong order and then misreading the absolute difference returned by the tool.",
    ],
  },
  date: {
    whenToUse: [
      "Find elapsed calendar days or business days between two dates for planning, billing, or compliance checks.",
      "Add or subtract a day offset from a base date when scheduling follow-ups, deadlines, or renewals.",
      "Compare timeline options quickly without doing manual calendar counting.",
    ],
    commonMistakes: [
      "Expecting business-day counts to match calendar days even when weekends are excluded.",
      "Forgetting whether the end date should be included before comparing the result with a contract or schedule.",
      "Using local-time assumptions while the calculator normalizes dates to avoid timezone drift.",
    ],
  },
};

export const calculatorContent: Record<string, CalculatorContent> = {
  ...Object.fromEntries(
    Object.entries(staticCalculatorContent).map(([slug, content]) => [
      slug,
      {
        ...content,
        ...(priorityContentEnhancements[slug] ?? {}),
      },
    ])
  ),
  ...generatedCalculatorContent,
};

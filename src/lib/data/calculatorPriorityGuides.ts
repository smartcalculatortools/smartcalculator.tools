export type CalculatorPriorityGuide = {
  slug: string;
  intro: string;
  bestFor: string[];
  beforeYouStart: string[];
};

export const calculatorPriorityGuides: CalculatorPriorityGuide[] = [
  {
    slug: "mortgage",
    intro:
      "Use this mortgage calculator when you need to compare the real monthly housing cost, not just the lender headline payment. It works best when you want principal, interest, taxes, insurance, HOA, and extra payments in one decision view.",
    bestFor: [
      "Comparing 15-year and 30-year payment structures",
      "Checking whether taxes and insurance change affordability",
      "Testing how extra monthly payments cut payoff time",
    ],
    beforeYouStart: [
      "Confirm the down payment and term you actually expect to use",
      "Keep taxes, insurance, PMI, and HOA as separate cost lines",
      "Run at least one conservative rate scenario before deciding",
    ],
  },
  {
    slug: "loan",
    intro:
      "Use this loan calculator when you need a clean payment estimate, payoff date, and amortization view before accepting a personal, business, or auto-style loan offer. It is strongest when you are comparing lenders, terms, or repayment frequency.",
    bestFor: [
      "Screening multiple loan offers with the same principal amount",
      "Comparing shorter vs longer terms on payment and total interest",
      "Checking how payment frequency affects payoff timing",
    ],
    beforeYouStart: [
      "Use the actual APR rather than a marketing headline rate",
      "Keep fees outside the base math if the lender quote is unclear",
      "Compare total interest and payoff date, not payment alone",
    ],
  },
  {
    slug: "compound-interest",
    intro:
      "Use this compound interest calculator when you want to project how a balance grows over time with recurring contributions and compounding frequency changes. It is especially useful for savings plans, investing assumptions, and future-value scenario checks.",
    bestFor: [
      "Projecting long-term growth with monthly contributions",
      "Testing the difference between contribution timing choices",
      "Comparing conservative vs optimistic return assumptions",
    ],
    beforeYouStart: [
      "Pick one time horizon before you compare scenarios",
      "Keep contribution amount and frequency realistic",
      "Re-run the estimate with a lower return to stress-test the plan",
    ],
  },
  {
    slug: "savings",
    intro:
      "Use this savings calculator when your main question is how quickly a target balance can be reached with regular deposits and interest growth. It is useful for emergency funds, short-term goals, and medium-term planning where deposit size matters as much as rate.",
    bestFor: [
      "Estimating how long a savings goal will take",
      "Comparing deposit size vs interest rate tradeoffs",
      "Planning monthly contributions for a fixed target amount",
    ],
    beforeYouStart: [
      "Define whether the target is a balance goal or a timeline goal",
      "Use the deposit amount you can sustain every month",
      "Check a lower-rate case if the account yield may change",
    ],
  },
  {
    slug: "income-tax",
    intro:
      "Use this income tax calculator when you need a quick take-home estimate and want to see how gross pay becomes after-tax income. It is useful for salary comparisons, offer evaluation, and rough budgeting before the exact payroll details are known.",
    bestFor: [
      "Comparing job offers by net income rather than gross salary",
      "Estimating effective tax drag on annual earnings",
      "Checking how income changes affect take-home pay",
    ],
    beforeYouStart: [
      "Use your closest filing and income assumptions",
      "Treat the result as a planning estimate, not payroll advice",
      "Recheck withholding rules if your situation has multiple income sources",
    ],
  },
  {
    slug: "bmi",
    intro:
      "Use this BMI calculator when you want a fast body-size screening metric based on height and weight. It is most useful as a first-pass classification, not as a full body-composition or health diagnosis.",
    bestFor: [
      "Quick adult height and weight screening",
      "Tracking BMI category changes over time",
      "Adding context before moving to waist or body-fat metrics",
    ],
    beforeYouStart: [
      "Use consistent height and weight measurements each time",
      "Do not treat BMI alone as a body-fat measurement",
      "Pair the result with waist or composition context when needed",
    ],
  },
  {
    slug: "calorie",
    intro:
      "Use this calorie calculator when you need a practical daily intake target for maintenance, fat loss, or weight gain. It is best used as a starting estimate that you refine after two to three weeks of real-world tracking.",
    bestFor: [
      "Setting a first daily calorie target for fat loss",
      "Checking maintenance calories before adjusting macros",
      "Comparing activity assumptions before committing to a plan",
    ],
    beforeYouStart: [
      "Choose the activity level that matches your actual routine",
      "Use a moderate adjustment instead of an extreme deficit or surplus",
      "Update the target only after reviewing a multi-week trend",
    ],
  },
  {
    slug: "bmr",
    intro:
      "Use this BMR calculator when you want to estimate resting calorie needs before building a full daily intake plan. It is a baseline tool, and it works best when paired with activity-based calorie planning instead of being treated as the final target on its own.",
    bestFor: [
      "Estimating resting energy needs from common formulas",
      "Comparing BMR methods before setting a calorie plan",
      "Building a maintenance estimate with TDEE or calorie tools",
    ],
    beforeYouStart: [
      "Use body data that reflects your current weight and height",
      "Remember that BMR is a floor, not your full daily intake",
      "Pair the result with actual activity and weekly progress",
    ],
  },
  {
    slug: "body-fat",
    intro:
      "Use this body fat calculator when the question is about composition rather than weight alone. It is especially useful when BMI feels incomplete and you need a directionally better estimate from measurements or a comparison of common formulas.",
    bestFor: [
      "Estimating body-fat percentage from body measurements",
      "Comparing Navy and BMI-based approaches side by side",
      "Adding context to weight-loss or physique tracking",
    ],
    beforeYouStart: [
      "Take measurements consistently and at the same time of day",
      "Expect estimate methods to differ slightly from each other",
      "Track the trend, not one isolated reading",
    ],
  },
  {
    slug: "scientific",
    intro:
      "Use this scientific calculator when you need an all-purpose math tool with trigonometry, logs, powers, memory, and a full keyboard-friendly layout. It is designed for fast calculation flow when a basic calculator would force too many steps.",
    bestFor: [
      "Trig, exponent, and logarithm calculations in one place",
      "Quick keyboard-based math without switching tools",
      "General-purpose use during homework or technical work",
    ],
    beforeYouStart: [
      "Check whether the angle mode matches the problem",
      "Use parentheses when the order of operations matters",
      "Clear memory or history if you are switching to a new problem",
    ],
  },
  {
    slug: "percentage",
    intro:
      "Use this percentage calculator when you need to solve part-of-whole, percent change, increase, decrease, or reverse percentage questions quickly. It is strongest when the real problem is clearly about relative change rather than ratio splitting.",
    bestFor: [
      "Finding the percent of a number",
      "Calculating percent increase, decrease, or difference",
      "Working backward from a final value to the original amount",
    ],
    beforeYouStart: [
      "Decide whether the problem is about share, change, or reversal",
      "Keep the old and new values in the correct order",
      "Use ratio tools instead if the question is about fixed-part splits",
    ],
  },
  {
    slug: "fraction",
    intro:
      "Use this fraction calculator when exact arithmetic matters more than rounded decimals. It is useful for schoolwork, measurement math, and any situation where mixed numbers, simplification, or improper fractions should stay in exact form.",
    bestFor: [
      "Adding, subtracting, multiplying, and dividing fractions",
      "Reducing fractions to simplest form",
      "Working with mixed numbers instead of decimal approximations",
    ],
    beforeYouStart: [
      "Enter numerator and denominator in the right order",
      "Keep exact fractions when rounding would affect the next step",
      "Use common denominators carefully when checking the result manually",
    ],
  },
  {
    slug: "triangle",
    intro:
      "Use this triangle calculator when you need sides, angles, area, perimeter, or triangle type from a valid set of known measurements. It is most helpful when you want one tool to solve geometry questions without jumping between several formulas.",
    bestFor: [
      "Solving triangle dimensions from side and angle data",
      "Checking area and perimeter together",
      "Classifying triangle type after solving the shape",
    ],
    beforeYouStart: [
      "Use one consistent unit for all side lengths",
      "Make sure the given values form a valid triangle setup",
      "Check whether the problem gives enough information to solve uniquely",
    ],
  },
  {
    slug: "age",
    intro:
      "Use this age calculator when you need an exact age breakdown in years, months, and days instead of a rough guess. It is helpful for forms, milestones, eligibility checks, and any task where manual date counting can drift.",
    bestFor: [
      "Exact age from date of birth",
      "Checking milestone or eligibility timing",
      "Seeing total days lived and next birthday timing",
    ],
    beforeYouStart: [
      "Use the exact date of birth and reference date",
      "Check whether the form needs age or simple date difference",
      "Use local calendar dates carefully if the deadline is strict",
    ],
  },
  {
    slug: "date",
    intro:
      "Use this date calculator when you need the number of days between dates or need to add and subtract days from a base date. It is useful for planning, deadlines, scheduling, and reducing manual counting mistakes around month lengths and leap years.",
    bestFor: [
      "Counting days between two calendar dates",
      "Adding or subtracting days from a base date",
      "Checking deadline windows with exact calendar math",
    ],
    beforeYouStart: [
      "Decide whether you need a duration or a target date",
      "Check whether the end date is included in your rule",
      "Use business-day logic elsewhere if weekends are excluded",
    ],
  },
  {
    slug: "crypto-profit-loss",
    intro:
      "Use this crypto profit calculator when you want to see whether a trade idea produces a real net gain after fees and position size. It is strongest when you already know the entry, exit, and size assumptions and want to test the outcome before acting.",
    bestFor: [
      "Checking trade profit, loss, ROI, and breakeven",
      "Comparing several exit scenarios on the same position",
      "Seeing how fees reduce the clean chart outcome",
    ],
    beforeYouStart: [
      "Use the actual fee assumptions from your exchange or route",
      "Enter position size before judging the trade attractiveness",
      "Check both the gross move and the net result after friction",
    ],
  },
  {
    slug: "crypto-dca",
    intro:
      "Use this crypto DCA calculator when you are building a position over multiple buys and need the true average entry price. It helps turn a scattered purchase history into a cleaner cost-basis view before you decide what happens next.",
    bestFor: [
      "Averaging the entry price across multiple buys",
      "Tracking total invested capital and blended cost basis",
      "Comparing staged accumulation with a single-entry plan",
    ],
    beforeYouStart: [
      "Keep each buy size and price recorded accurately",
      "Include fees separately if they matter to your breakeven",
      "Do not compare DCA and trading results with different timelines",
    ],
  },
  {
    slug: "crypto-fee-impact",
    intro:
      "Use this crypto fee calculator when you need to know how much trading friction changes breakeven before you enter or exit a position. It is useful because small fees can erase a trade that looked profitable on price alone.",
    bestFor: [
      "Measuring how fees move breakeven price",
      "Comparing low-fee and high-fee execution paths",
      "Screening small-move trades before taking them",
    ],
    beforeYouStart: [
      "Use the fee structure that matches your actual venue",
      "Account for both entry and exit friction, not one side only",
      "Check whether multiple fills make the total cost worse",
    ],
  },
  {
    slug: "ai-token-cost",
    intro:
      "Use this AI token cost calculator when your main question is how prompt and completion size turn into actual spend. It is best for budgeting experiments, estimating production traffic, and comparing model tiers before the invoice grows quietly.",
    bestFor: [
      "Estimating the cost of one request or one workflow",
      "Comparing model pricing on the same token workload",
      "Stress-testing prompt length growth before launch",
    ],
    beforeYouStart: [
      "Use realistic input and output token sizes, not idealized ones",
      "Run a higher-volume scenario before approving the budget",
      "Separate token cost from image or fine-tune project costs",
    ],
  },
  {
    slug: "ai-model-comparator",
    intro:
      "Use this AI model cost comparator when you need to compare two pricing tiers against the same workload instead of reading provider tables in isolation. It is especially useful when request volume and token length are clear enough to make the comparison real.",
    bestFor: [
      "Comparing two models on one repeated workload",
      "Checking whether a higher-quality tier still fits the budget",
      "Evaluating model changes before switching providers",
    ],
    beforeYouStart: [
      "Define one representative workload before comparing models",
      "Keep token assumptions identical across both options",
      "Check total monthly effect, not only cost per request",
    ],
  },
];

const calculatorPriorityGuideMap = new Map(
  calculatorPriorityGuides.map((guide) => [guide.slug, guide])
);

export function getCalculatorPriorityGuide(slug: string) {
  return calculatorPriorityGuideMap.get(slug) ?? null;
}

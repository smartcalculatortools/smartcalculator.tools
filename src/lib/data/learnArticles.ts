import type { CategoryId } from "@/lib/data/calculators";

export type LearnArticleSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type LearnArticleFaq = {
  question: string;
  answer: string;
};

export type LearnArticle = {
  categoryId: CategoryId;
  slug: string;
  targetQuery: string;
  title: string;
  summary: string;
  intro: string;
  calculatorSlugs: string[];
  sections: LearnArticleSection[];
  faqs: LearnArticleFaq[];
};

export const learnArticles: LearnArticle[] = [
  {
    categoryId: "financial",
    slug: "compare-loan-offers",
    targetQuery: "how to compare loan offers",
    title: "How to Compare Loan Offers Without Missing the Real Cost",
    summary:
      "Use payment, APR, amortization, and affordability calculators together before choosing a mortgage, auto loan, or personal loan offer.",
    intro:
      "Most borrowers compare offers by monthly payment because it is the fastest number to read. That usually hides the real tradeoff. A better comparison checks payment size, total interest, fees, APR, and how the term changes the payoff path. This guide helps you compare loan offers in a sequence that avoids the most common shortcuts.",
    calculatorSlugs: ["loan", "apr", "amortization", "auto-loan", "mortgage"],
    sections: [
      {
        title: "Start with the decision you are making",
        body:
          "A good comparison starts by naming the borrowing question clearly. Are you trying to lower the monthly payment, minimize total interest, shorten the payoff period, or stay under an affordability threshold?",
        bullets: [
          "Use the Loan Calculator first when the core question is payment size and payoff timing.",
          "Use APR when fees or lender charges make the advertised rate incomplete.",
          "Use Mortgage or Auto Loan tools when the asset type changes taxes, insurance, or ownership costs.",
        ],
      },
      {
        title: "Compare total cost, not payment alone",
        body:
          "Lower payments often come from longer terms, and longer terms usually shift more money into interest. Two offers can feel similar monthly while producing very different lifetime cost.",
        bullets: [
          "Check payment, total interest, and payoff date side by side.",
          "Use amortization views to see how quickly principal actually falls.",
          "Treat fees, points, and insurance as separate cost lines instead of burying them inside one total.",
        ],
      },
      {
        title: "Use affordability as a filter",
        body:
          "An offer can be mathematically valid and still be a bad fit for your budget. Run the payment against income, emergency-fund needs, and the rest of your recurring obligations.",
        bullets: [
          "Reject offers that only work in a best-case month.",
          "Stress-test the payment against a higher rate or a smaller down payment.",
          "Keep room for taxes, repairs, fuel, or other ownership costs the lender quote may not emphasize.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I compare rates or APR first?",
        answer:
          "Start with payment and rate for a fast screen, then use APR when fees or points differ between lenders. APR is more useful when the fee structure is meaningfully different.",
      },
      {
        question: "Why can a lower monthly payment still be worse?",
        answer:
          "Because longer terms often reduce the payment while increasing total interest and slowing principal payoff. The cheaper month can be the more expensive loan overall.",
      },
    ],
  },
  {
    categoryId: "fitness",
    slug: "set-calorie-and-protein-targets",
    targetQuery: "how to set calorie and protein targets",
    title: "How to Set Calorie and Protein Targets You Can Actually Use",
    summary:
      "Turn BMR, TDEE, calorie, and protein calculators into a practical nutrition target instead of a one-day guess.",
    intro:
      "Most people do not need a perfect calorie formula. They need a starting target they can follow for two or three weeks, then adjust from real progress. This guide shows how to combine calorie, BMR, and protein tools into a setup that is useful in everyday eating rather than only inside a spreadsheet.",
    calculatorSlugs: ["calorie", "bmr", "tdee", "protein-intake", "macro-split"],
    sections: [
      {
        title: "Build the baseline first",
        body:
          "Start with the simplest chain possible: BMR to estimate resting needs, TDEE or calorie tools to estimate maintenance, and protein planning to protect recovery and appetite.",
        bullets: [
          "Use BMR as the floor, not as your full daily target.",
          "Use TDEE or calorie estimates to account for activity and goal adjustments.",
          "Add protein planning once maintenance or deficit direction is clear.",
        ],
      },
      {
        title: "Pick a target you can follow consistently",
        body:
          "A smaller deficit or surplus that you can follow beats a dramatic target that collapses after a few days. Sustainability is part of the math because it determines whether the plan is real.",
        bullets: [
          "Use a modest calorie adjustment for fat loss or lean gain.",
          "Match protein to body size and training demand instead of copying someone else’s number.",
          "Recalculate when bodyweight, activity, or training volume changes materially.",
        ],
      },
      {
        title: "Use outcomes to calibrate the calculators",
        body:
          "The calculator gives a starting point. Your bodyweight trend, performance, recovery, and hunger tell you whether the target needs to move.",
        bullets: [
          "Review average bodyweight over 2 to 3 weeks before making a change.",
          "Change one variable at a time so you can see what caused the result.",
          "Treat one unusual day as noise unless the trend repeats.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which should I trust more: BMR or TDEE?",
        answer:
          "Use BMR for the resting baseline and TDEE or calorie estimates for the daily target. They solve different parts of the same planning problem.",
      },
      {
        question: "How often should I recalculate calorie targets?",
        answer:
          "Recalculate after a meaningful change in bodyweight, activity, or training load, or when progress stalls for several weeks.",
      },
    ],
  },
  {
    categoryId: "math",
    slug: "percentage-ratio-fraction-guide",
    targetQuery: "percentage vs ratio vs fraction calculator",
    title: "When to Use Percentage, Ratio, Fraction, or Proportion Calculators",
    summary:
      "Choose the right math tool for shares, comparisons, splits, and equivalent-value questions instead of forcing every problem into one formula.",
    intro:
      "Many math mistakes happen because the wrong calculator gets opened first. Percentage, ratio, fraction, and proportion problems overlap, but they are not interchangeable. This guide helps you identify the structure of the question so you can move to the right calculator faster and avoid translating the problem incorrectly.",
    calculatorSlugs: ["percentage", "ratio-split", "fraction", "proportion", "average"],
    sections: [
      {
        title: "Use percentage for part-of-whole and change",
        body:
          "Percent is the right language when the question is about change, discount, markup, or share of a total. It is less useful when the relationship needs to stay in whole-number form.",
        bullets: [
          "Use Percentage Calculator for discounts, tax, growth, and percent-of-a-number questions.",
          "Use percent change when the question compares old versus new.",
          "Do not use percentage when the real question is how to split one total into fixed parts.",
        ],
      },
      {
        title: "Use ratio and proportion for scaling relationships",
        body:
          "Ratio and proportion are better when two values must stay in the same relationship. This shows up in recipes, pricing, and allocation problems.",
        bullets: [
          "Use Ratio Split when one total must be divided into fixed shares.",
          "Use Proportion when one value in the relationship is missing.",
          "Simplifying a ratio can clarify the problem even when the output amount stays the same.",
        ],
      },
      {
        title: "Use fractions when the exact form matters",
        body:
          "Fractions are strongest when the problem needs exact arithmetic or a reduced form rather than a rounded decimal. They also help when denominators carry meaning.",
        bullets: [
          "Use Fraction Calculator for classroom arithmetic and exact mixed-number work.",
          "Convert to decimal only after checking whether the exact reduced fraction matters.",
          "Use GCF or LCM helpers when common denominators or simplification are the real bottleneck.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between ratio and proportion?",
        answer:
          "A ratio compares values. A proportion solves for a missing value while keeping two ratios equivalent.",
      },
      {
        question: "When should I keep a fraction instead of converting to decimal?",
        answer:
          "Keep the fraction when exact form matters, such as homework, measurement, or any problem where rounded decimals could distort the next step.",
      },
    ],
  },
  {
    categoryId: "other",
    slug: "count-days-and-deadlines",
    targetQuery: "how to count days between dates",
    title: "How to Count Days Between Dates and Avoid Deadline Mistakes",
    summary:
      "Use date, age, and time-duration calculators to handle calendar ranges, offsets, and age thresholds without manual counting errors.",
    intro:
      "Date questions look simple until month lengths, leap years, or deadline rules get involved. This guide shows how to use the date-related calculators on the site for elapsed time, future offsets, age checks, and duration planning without mixing those questions together.",
    calculatorSlugs: ["date", "age", "time-duration", "time", "hours"],
    sections: [
      {
        title: "Decide whether you need a duration or a target date",
        body:
          "Many date mistakes happen because the user mixes two different problems: counting the gap between dates versus finding the date after adding or subtracting an offset.",
        bullets: [
          "Use Date Calculator when the core question is days between dates or date offsets.",
          "Use Age Calculator when the answer must be expressed in years, months, and days.",
          "Use Time Duration or Hours tools when the problem is about clock time rather than calendar days.",
        ],
      },
      {
        title: "Clarify the rule before trusting the output",
        body:
          "Official forms, HR policies, or legal deadlines can define date counting in very specific ways. The calculator gives a clean baseline, but the rule still matters.",
        bullets: [
          "Check whether the end date is included or excluded.",
          "Confirm whether weekends or business days matter for the deadline.",
          "Use the exact reference date required by the form or policy, not today by default.",
        ],
      },
      {
        title: "Use exact outputs to reduce repeat errors",
        body:
          "Calendar tools save time because they remove the same manual counting error from every future task. They are most useful when you reuse the result in scheduling, eligibility, or planning.",
        bullets: [
          "Save the exact output when the result may need to be checked later.",
          "Run a second scenario when the deadline moves by a few days or weeks.",
          "Keep dates in one format to avoid entry mistakes when copying them elsewhere.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why do manual date counts go wrong so often?",
        answer:
          "Because month lengths, leap years, and inclusive-versus-exclusive rules are easy to miscount when you do them by hand.",
      },
      {
        question: "Should I use Age Calculator or Date Calculator for eligibility?",
        answer:
          "Use Age Calculator when the rule is expressed as age in years and months. Use Date Calculator when the rule is an exact number of days before or after a date.",
      },
    ],
  },
  {
    categoryId: "crypto",
    slug: "calculate-crypto-breakeven",
    targetQuery: "how to calculate crypto breakeven",
    title: "How to Calculate Crypto Breakeven Before You Enter a Trade",
    summary:
      "Use fee, profit/loss, DCA, and position-sizing tools to understand breakeven and risk before opening a crypto position.",
    intro:
      "Crypto traders often think about upside first and breakeven second. That is backwards. Breakeven tells you how far price must move before the trade even starts working after fees and position sizing. This guide shows how to use the crypto calculators on the site to estimate breakeven, trade cost, and position risk before execution.",
    calculatorSlugs: [
      "crypto-profit-loss",
      "crypto-fee-impact",
      "crypto-position-size",
      "crypto-dca",
      "crypto-risk-reward",
    ],
    sections: [
      {
        title: "Start with trade friction, not target profit",
        body:
          "Fees, spreads, and slippage shift breakeven. If you ignore them, the trade looks better than it really is before the market has even moved.",
        bullets: [
          "Use Crypto Fee Impact before assuming a small move will be profitable.",
          "Use Profit/Loss to translate entry, exit, and size into a net result.",
          "Check the effect of multiple entries if the plan is not a single fill.",
        ],
      },
      {
        title: "Position size decides how much the idea can hurt",
        body:
          "A correct market view can still produce a bad trade if the position is too large. Size and stop distance belong in the same decision.",
        bullets: [
          "Use position sizing before entry, not after the trade is open.",
          "Keep risk stable across different setups even when volatility changes.",
          "Run a smaller-size scenario if the stop distance expands.",
        ],
      },
      {
        title: "Use DCA and risk/reward only when they match the plan",
        body:
          "DCA and risk/reward tools are powerful when the strategy actually uses staged entries or defined reward targets. They are less useful when the plan is vague.",
        bullets: [
          "Use DCA when entry is spread across multiple buys.",
          "Use risk/reward when the stop and target are already defined.",
          "Avoid mixing a long-term accumulation plan with short-term trade assumptions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is breakeven more useful than raw profit target?",
        answer:
          "Because breakeven includes the real friction of the trade. It tells you how much price movement is required before the position starts producing net profit.",
      },
      {
        question: "Should I calculate fees before or after sizing the position?",
        answer:
          "Do both. Use fees to understand breakeven, then use position size to control the amount of capital and risk exposed to the setup.",
      },
    ],
  },
  {
    categoryId: "ai",
    slug: "estimate-ai-usage-budget",
    targetQuery: "how to estimate ai usage cost",
    title: "How to Estimate AI Usage Cost Before the Bill Surprises You",
    summary:
      "Combine token, inference, image, fine-tune, and automation calculators to build a realistic AI budget before usage scales.",
    intro:
      "AI costs drift because the workload often grows quietly. Prompt length expands, request volume rises, image jobs multiply, and experiments repeat. The right response is not another rough guess. It is a set of calculators that break the budget into token, inference, training, and automation components so you can stress-test the real cost before it lands on an invoice.",
    calculatorSlugs: [
      "ai-token-cost",
      "ai-inference-budget",
      "ai-image-cost",
      "ai-fine-tune-budget",
      "ai-batch-savings",
    ],
    sections: [
      {
        title: "Define the workload before checking the model price",
        body:
          "Provider rates matter, but usage shape matters first. Budgeting gets more accurate when the request pattern is defined before the price table is applied.",
        bullets: [
          "Use AI Token Cost when prompt and completion size are the main variables.",
          "Use AI Inference Budget when request volume over time matters more than a single call.",
          "Use AI Image Cost when generation count is the driver instead of text tokens.",
        ],
      },
      {
        title: "Separate recurring cost from one-time cost",
        body:
          "Inference, batch processing, and fine-tuning answer different cost questions. Rolling them together hides which part of the system is actually driving spend.",
        bullets: [
          "Track fine-tuning as a project cost rather than a day-to-day usage cost.",
          "Track monthly inference separately from image or batch workloads.",
          "Use automation savings only after the raw operating cost is visible on its own.",
        ],
      },
      {
        title: "Stress-test for scale, not only today",
        body:
          "The budget that looks safe at a pilot stage can become wrong quickly once users or internal teams increase usage. Build at least one growth scenario while the numbers are still manageable.",
        bullets: [
          "Double request volume and check the monthly bill impact.",
          "Increase average token length and compare the delta, not just the total.",
          "Use conservative assumptions for automation savings until the workflow is proven.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which AI calculator should I open first?",
        answer:
          "Open the calculator that matches the biggest cost driver in your workflow: tokens, requests, images, fine-tuning volume, or batch labor savings.",
      },
      {
        question: "Why do AI costs usually exceed the first estimate?",
        answer:
          "Because small increases in volume, prompt length, or experiment count compound quickly. A static estimate often misses how the workload evolves after launch.",
      },
    ],
  },
];

export function getLearnArticle(categoryId: CategoryId, slug: string) {
  return (
    learnArticles.find(
      (article) => article.categoryId === categoryId && article.slug === slug
    ) ?? null
  );
}

export function getLearnArticlesByCategory(categoryId: CategoryId) {
  return learnArticles.filter((article) => article.categoryId === categoryId);
}

export function getLearnArticleStaticParams() {
  return learnArticles.map((article) => ({
    category: article.categoryId,
    slug: article.slug,
  }));
}

export function getLearnArticlesByCalculator(slug: string) {
  return learnArticles.filter((article) => article.calculatorSlugs.includes(slug));
}

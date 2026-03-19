import type { CategoryId } from "@/lib/data/calculators";

export type LearningGuideSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type LearningGuideFaq = {
  question: string;
  answer: string;
};

export type LearningGuide = {
  categoryId: CategoryId;
  title: string;
  summary: string;
  intro: string;
  sections: LearningGuideSection[];
  starterSlugs: string[];
  faqs: LearningGuideFaq[];
};

export const learningGuides: Record<CategoryId, LearningGuide> = {
  financial: {
    categoryId: "financial",
    title: "Financial Calculator Guide",
    summary:
      "Understand when to use payment, return, tax, and budgeting calculators so you can make cleaner money decisions.",
    intro:
      "Financial calculators are most useful when they reduce uncertainty before you commit to a loan, pricing plan, or savings target. The goal is not to predict the future perfectly. The goal is to understand the size of the tradeoff, identify the variables that matter most, and compare a few realistic scenarios before you act.",
    sections: [
      {
        title: "Start with the decision, not the formula",
        body:
          "People often open a calculator before they know what decision they are actually trying to make. That creates noise. Start by naming the decision first, then pick the calculator that fits it.",
        bullets: [
          "Use mortgage and loan tools when you need payment size, payoff timing, or interest impact.",
          "Use ROI, break-even, and payback tools when you are comparing business or investment ideas.",
          "Use discount, sales tax, and commission tools when pricing or compensation is the main question.",
        ],
      },
      {
        title: "Check assumptions that usually distort the answer",
        body:
          "Most bad financial estimates come from hidden assumptions rather than bad arithmetic. Interest rate, time horizon, taxes, and fees can change a result much more than small rounding differences.",
        bullets: [
          "Always verify whether the rate is monthly, annual, fixed, or variable.",
          "Keep taxes, fees, and extra costs separate so you can see where the total is really coming from.",
          "Run a best case, base case, and conservative case instead of trusting one output.",
        ],
      },
      {
        title: "Use outputs as comparison tools",
        body:
          "A financial calculator is strongest when you use it to compare choices. Compare two terms, two rates, or two contribution levels and look at the difference instead of only the final number.",
        bullets: [
          "Look at payment and total cost together when borrowing.",
          "Look at ROI and absolute profit together when evaluating projects.",
          "Look at affordability metrics like debt-to-income before assuming a larger purchase is manageable.",
        ],
      },
    ],
    starterSlugs: [
      "mortgage",
      "loan",
      "roi",
      "break-even",
      "debt-to-income",
      "simple-interest",
    ],
    faqs: [
      {
        question: "Which financial calculator should I open first?",
        answer:
          "Open the calculator that matches the decision in front of you: borrowing, saving, pricing, taxes, or affordability. If the decision is unclear, start with the category page and compare the short descriptions.",
      },
      {
        question: "Why do financial estimates change so much with small input changes?",
        answer:
          "Because time, rate, and fees compound their effect. Even a small change in rate or duration can move the total cost more than expected.",
      },
    ],
  },
  fitness: {
    categoryId: "fitness",
    title: "Fitness & Health Calculator Guide",
    summary:
      "Use body, nutrition, and training calculators as planning tools rather than diagnoses, and focus on trends instead of one-off numbers.",
    intro:
      "Health and fitness calculators are best used for direction, not certainty. They can help you set a calorie target, estimate protein intake, or turn a workout result into a practical benchmark. What they cannot do is replace a clinician, lab testing, or context about your own history.",
    sections: [
      {
        title: "Treat the result as a starting point",
        body:
          "Most fitness formulas are population-level estimates. That makes them useful for building a baseline, but not for assuming that the output is your exact physiological truth.",
        bullets: [
          "Use BMR and calorie calculators to create a first nutrition target, then adjust from actual bodyweight trends.",
          "Use protein and water tools to plan daily habits, not to chase a perfect single-day number.",
          "Use heart-rate and pace tools to structure training, then update them as your performance changes.",
        ],
      },
      {
        title: "Consistency beats one perfect estimate",
        body:
          "A good calculator is most useful when it helps you stay consistent for weeks, not when it gives the most dramatic number today. Repeating the same measurement method is often more valuable than changing formulas.",
        bullets: [
          "Measure weight, waist, or resting heart rate in a consistent way each time.",
          "Track average intake and training output instead of reacting to one unusual day.",
          "Use a weekly review to decide whether the target needs to move up or down.",
        ],
      },
      {
        title: "Choose the calculator by the goal",
        body:
          "The right tool depends on whether you are trying to improve body composition, endurance, hydration, recovery, or general planning.",
        bullets: [
          "Use BMI or waist-to-height for simple screening, not diagnosis.",
          "Use pace and one-rep-max for training benchmarks and progression targets.",
          "Use protein, calorie, and water tools when nutrition planning is the main problem.",
        ],
      },
    ],
    starterSlugs: [
      "calorie",
      "protein-intake",
      "water-intake",
      "one-rep-max",
      "target-heart-rate",
      "waist-to-height",
    ],
    faqs: [
      {
        question: "Are these health calculators medically accurate?",
        answer:
          "They are useful planning tools, but they are not medical devices or diagnoses. Use them for estimates and combine them with professional guidance when the context is important.",
      },
      {
        question: "What matters more: one accurate number or repeated tracking?",
        answer:
          "Repeated tracking usually matters more. A consistent method over time shows whether you are moving in the right direction.",
      },
    ],
  },
  math: {
    categoryId: "math",
    title: "Math Calculator Guide",
    summary:
      "Pick the right math calculator by problem type: arithmetic, ratios, coordinates, geometry, or measurement.",
    intro:
      "Math calculators save time when the structure of the problem is already clear. Most mistakes happen before the calculation starts: wrong units, wrong formula category, or wrong interpretation of what the question is really asking. The fastest way to get a good answer is to classify the problem correctly first.",
    sections: [
      {
        title: "Classify the problem before calculating",
        body:
          "Many math problems look different but share the same structure. Once you identify the structure, the right calculator becomes obvious.",
        bullets: [
          "Use average, percentage, and ratio tools for comparisons and allocation problems.",
          "Use distance, slope, and proportion tools for coordinate or algebra-style relationships.",
          "Use circle, rectangle, triangle, and cylinder tools for geometry and measurement tasks.",
        ],
      },
      {
        title: "Units matter as much as formulas",
        body:
          "A correct formula with mixed units still gives a bad answer. Keep every length, volume, or currency input in the same system before you calculate.",
        bullets: [
          "Do not mix meters and centimeters without converting first.",
          "Check whether a percent is expected as 25 or 0.25 before entering it.",
          "For coordinate work, keep the point order consistent when comparing direction and distance.",
        ],
      },
      {
        title: "Use the comparison tables intentionally",
        body:
          "The tables and charts attached to these calculators are useful when you want sensitivity, not only one output. They help you see how the answer changes as one input moves.",
        bullets: [
          "Use geometry comparison views to understand how area or volume scales.",
          "Use average and proportion tools to test what happens when the target becomes stricter.",
          "Use slope and coordinate tools to compare shape or direction changes quickly.",
        ],
      },
    ],
    starterSlugs: [
      "percentage",
      "average",
      "ratio-split",
      "circle",
      "distance-between-points",
      "slope",
    ],
    faqs: [
      {
        question: "How do I choose between a ratio, percentage, and proportion calculator?",
        answer:
          "Use percentage when the question is about part-of-whole or change. Use ratio when you are splitting or comparing quantities. Use proportion when one side of a scale relationship is missing.",
      },
      {
        question: "Why do geometry outputs change so fast when I adjust one dimension?",
        answer:
          "Because some formulas scale linearly and others scale quadratically. Area and volume can grow much faster than length.",
      },
    ],
  },
  other: {
    categoryId: "other",
    title: "Everyday Utility Calculator Guide",
    summary:
      "Use date and age tools to answer scheduling and timeline questions without manual counting errors.",
    intro:
      "Utility calculators are about precision in everyday planning. They are useful when you need exact intervals, calendar offsets, or age breakdowns for forms, scheduling, or milestone planning. Their main value is removing small counting mistakes that become annoying in real use.",
    sections: [
      {
        title: "Use utility tools for exact date logic",
        body:
          "Calendar questions become messy quickly once months, leap years, and exact day counts are involved. A utility calculator handles the edge cases for you.",
        bullets: [
          "Use the age calculator when you need exact years, months, and days.",
          "Use the date calculator when you need to add or subtract a precise number of days.",
          "Double-check whether the problem is asking for elapsed time or a target future date.",
        ],
      },
      {
        title: "Define the interval clearly",
        body:
          "Date problems go wrong when the start or end point is ambiguous. Decide what counts as the start, what counts as the end, and whether you want inclusive or exclusive logic.",
        bullets: [
          "Keep the same time zone and local date convention when entering dates.",
          "Be clear about whether you want a duration or a deadline.",
          "If a form or legal process has its own rule, follow that rule rather than the generic calendar answer.",
        ],
      },
      {
        title: "Use exact outputs to avoid manual drift",
        body:
          "Utility tools are often used for forms, applications, planning, or reminders. In these cases, exactness is more important than complexity.",
        bullets: [
          "Let the calculator handle month length differences.",
          "Use exact outputs for administrative deadlines and age thresholds.",
          "Save or print the result if the date logic needs to be referenced later.",
        ],
      },
    ],
    starterSlugs: ["age", "date"],
    faqs: [
      {
        question: "Why not just count dates manually?",
        answer:
          "Manual counting breaks down once month lengths, leap years, and offsets get involved. A date calculator removes those avoidable errors.",
      },
      {
        question: "Can I use the result for official deadlines?",
        answer:
          "You can use it as a planning reference, but official deadlines may use specific legal or administrative rules that you should confirm separately.",
      },
    ],
  },
  crypto: {
    categoryId: "crypto",
    title: "Crypto Calculator Guide",
    summary:
      "Use crypto calculators to manage risk, fees, averaging, and yield before opening or adjusting a position.",
    intro:
      "Crypto calculators are most valuable when they slow you down before a fast decision. They help quantify the cost of a fee, the size of a position, or the effect of averaging into a trade. In volatile markets, this kind of structure matters more than another opinion.",
    sections: [
      {
        title: "Risk comes before upside",
        body:
          "The first crypto question should usually be about downside. Position size, stop distance, and fee drag often matter more than the best-case target.",
        bullets: [
          "Use position sizing before entering a trade, not after you are emotionally committed.",
          "Use fee tools to understand how much the breakeven moves once trading costs are included.",
          "Keep account risk constant even when market volatility changes.",
        ],
      },
      {
        title: "Separate strategy types clearly",
        body:
          "Long-term accumulation, short-term trading, and staking each need different tools. The calculator should match the behavior of the strategy.",
        bullets: [
          "Use DCA when entries are spread over time.",
          "Use profit/loss and fee tools when you already know entry and exit logic.",
          "Use staking yield tools when the main question is holding return rather than trading return.",
        ],
      },
      {
        title: "Stress-test the assumptions",
        body:
          "Fees, slippage, yield variability, and stop execution can all make the real result worse than the clean estimate. Scenario testing is the safe default.",
        bullets: [
          "Model at least one conservative scenario before sizing the position.",
          "Treat advertised yield as variable unless the product is explicitly fixed.",
          "Check whether the notional position is too large even if the risk per trade looks acceptable.",
        ],
      },
    ],
    starterSlugs: [
      "crypto-position-size",
      "crypto-profit-loss",
      "crypto-fee-impact",
      "crypto-dca",
      "crypto-staking-yield",
    ],
    faqs: [
      {
        question: "Which crypto calculator should I use first?",
        answer:
          "Usually start with position size or fee impact. They define risk and breakeven before profit projections become useful.",
      },
      {
        question: "Why do fees matter so much in crypto?",
        answer:
          "Because frequent entries and exits can stack fees quickly and move your breakeven farther than expected, especially on smaller moves.",
      },
    ],
  },
  ai: {
    categoryId: "ai",
    title: "AI Calculator Guide",
    summary:
      "Estimate token spend, image generation cost, training budget, and automation savings with clearer workload assumptions.",
    intro:
      "AI calculators help teams convert vague usage into actual budget lines. They are useful when you need to answer questions like how much inference will cost, whether a fine-tuning run fits the budget, or how much labor an automation workflow may realistically save. Their value comes from turning workload assumptions into numbers that can be challenged and improved.",
    sections: [
      {
        title: "Model the workload first",
        body:
          "AI cost planning is only as good as the workload estimate underneath it. Before you worry about provider rates, define requests, tokens, images, or hours saved as clearly as possible.",
        bullets: [
          "Use inference tools when the product is live or close to live.",
          "Use fine-tune tools when training volume and experimentation cost are the main concern.",
          "Use image and automation tools when media generation or operations savings are the real question.",
        ],
      },
      {
        title: "Separate cost types",
        body:
          "Training cost, inference cost, and labor savings are different economic questions. Treating them as the same bucket can hide where the real budget risk sits.",
        bullets: [
          "Track token-based cost separately from labor-based savings.",
          "Keep monthly and annual views visible when the workload is recurring.",
          "Model conservative and growth scenarios if usage could scale fast.",
        ],
      },
      {
        title: "Use sensitivity as the default",
        body:
          "AI workloads can change quickly as prompts grow, products expand, or adoption improves. Scenario testing is not optional if the budget matters.",
        bullets: [
          "Increase volume assumptions and see where the monthly bill starts to change materially.",
          "Check whether training spend still makes sense after several experiment cycles.",
          "Use a realistic automation percentage instead of assuming full replacement.",
        ],
      },
    ],
    starterSlugs: [
      "ai-token-cost",
      "ai-inference-budget",
      "ai-image-cost",
      "ai-fine-tune-budget",
      "ai-batch-savings",
    ],
    faqs: [
      {
        question: "What is the best AI calculator to start with?",
        answer:
          "Start with the calculator that matches the cost driver you are actually trying to manage: tokens, images, training volume, or labor hours.",
      },
      {
        question: "Why do AI budgets drift so easily?",
        answer:
          "Because usage scales quietly. Small increases in request volume, token length, or experiment count can compound into a noticeably larger monthly bill.",
      },
    ],
  },
};

export function getLearningGuide(categoryId: CategoryId) {
  return learningGuides[categoryId] ?? null;
}

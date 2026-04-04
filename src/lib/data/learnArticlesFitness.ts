import type { LearnArticle } from "./learnArticlesShared";

export const fitnessLearnArticles: LearnArticle[] = [
  {
    categoryId: "fitness",
    slug: "bmi-body-fat-and-waist-guide",
    targetQuery: "bmi vs body fat vs waist to height",
    title: "BMI vs Body Fat vs Waist-to-Height: Which Metric Should You Use?",
    summary:
      "Use BMI, body fat, waist-to-height, healthy weight, and ideal weight calculators to choose the body metric that actually matches your goal.",
    intro:
      "Most body-metric confusion comes from using one number to answer every health or physique question. BMI, body fat estimates, waist-to-height ratio, and weight-range tools each solve a different problem. This guide helps you choose the right metric first so you can interpret the result with less noise.",
    calculatorSlugs: ["bmi", "body-fat", "waist-to-height", "healthy-weight", "ideal-weight"],
    sections: [
      {
        title: "Use BMI for quick screening, not full interpretation",
        body:
          "BMI is useful because it is fast and standardized, but it does not directly measure fat distribution or muscle mass. It is best used as a first-pass screen, not the final verdict.",
        bullets: [
          "Use BMI when you want a simple height-and-weight classification.",
          "Do not treat BMI alone as a body-composition diagnosis.",
          "Move to body fat or waist-based tools when the question is more specific than general screening.",
        ],
      },
      {
        title: "Use body fat and waist ratio when composition matters",
        body:
          "If the real question is about fat distribution or muscularity, BMI becomes less useful on its own. Waist-to-height and body fat estimates usually provide better context for that decision.",
        bullets: [
          "Use Body Fat when you want a composition-oriented estimate from measurements.",
          "Use Waist-to-Height when central fat distribution is the concern.",
          "Compare methods for direction, but do not expect them to agree exactly.",
        ],
      },
      {
        title: "Use healthy-weight and ideal-weight tools for planning, not identity",
        body:
          "Target-weight tools are most helpful when you need a broad range for planning. They become misleading when treated like a perfect personal endpoint divorced from strength, performance, and lifestyle context.",
        bullets: [
          "Use Healthy Weight for a broad range rather than one magic number.",
          "Use Ideal Weight as a planning reference, not a rigid personal rule.",
          "Track trend and behavior change alongside any body-metric output.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which metric is best for body composition?",
        answer:
          "Body fat and waist-to-height are usually more useful than BMI when the real question is about composition or fat distribution rather than general screening.",
      },
      {
        question: "Should I ignore BMI if I lift weights?",
        answer:
          "Not necessarily, but you should interpret it carefully and pair it with waist or body-fat context because muscularity can distort the BMI reading.",
      },
    ],
  },
  {
    categoryId: "fitness",
    slug: "set-macros-for-fat-loss-or-maintenance",
    targetQuery: "how to set macro targets",
    title: "How to Set Macro Targets for Fat Loss, Maintenance, or Lean Gain",
    summary:
      "Use macro split, calorie, TDEE, protein, fat, and carbohydrate calculators to build a macro plan that fits your actual calorie target.",
    intro:
      "Macro planning gets messy when protein, calories, and food preference are treated like separate decisions. The cleaner way is to set the calorie target first, lock protein for recovery and appetite, then distribute fats and carbs in a way you can follow. This guide shows how to use the nutrition calculators on the site in the right order.",
    calculatorSlugs: ["macro-split", "calorie", "tdee", "protein-intake", "fat-intake", "carbohydrate"],
    sections: [
      {
        title: "Set calories before you chase macro ratios",
        body:
          "Macro percentages look neat, but they are secondary. If the calorie target is wrong, the macro breakdown will still be built on the wrong base.",
        bullets: [
          "Use TDEE or Calorie tools to estimate maintenance before you set a deficit or surplus.",
          "Keep the calorie target modest enough to sustain for more than a few days.",
          "Adjust calories from real progress, then refresh the macro split if needed.",
        ],
      },
      {
        title: "Anchor protein first, then divide fats and carbs",
        body:
          "Protein usually deserves first priority because it affects recovery, muscle retention, and satiety. After that, fats and carbs can be adjusted according to food preference, training demand, and adherence.",
        bullets: [
          "Use Protein Intake to create a body-size-based anchor.",
          "Use Fat Intake to set a reasonable minimum before pushing carbs higher.",
          "Use Carbohydrate and Macro Split tools once total calories and protein are already stable.",
        ],
      },
      {
        title: "Choose the split you can repeat, not the one that looks perfect",
        body:
          "Macro plans fail when they are too strict for normal life. The best split is often the one you can execute across workdays, training days, and weekends without collapsing into guesswork.",
        bullets: [
          "Pick a split that matches the foods you actually eat.",
          "Review hunger, energy, and training performance after two or three weeks.",
          "Change one macro variable at a time when you need to troubleshoot the plan.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I set macro percentages or grams first?",
        answer:
          "Set total calories and protein grams first. After that, fats and carbs can be divided in grams based on preference and training needs.",
      },
      {
        question: "Why does my macro plan stop working after a while?",
        answer:
          "Because body weight, activity, and adherence change. The plan usually needs recalibration after a meaningful shift in progress, routine, or appetite.",
      },
    ],
  },
  {
    categoryId: "fitness",
    slug: "plan-training-zones-and-recovery",
    targetQuery: "heart rate pace and recovery calculator",
    title: "How to Plan Training Zones, Pacing, and Recovery Together",
    summary:
      "Use target heart rate, pace, one-rep max, water intake, and sleep calculators to build training targets that account for effort and recovery together.",
    intro:
      "Training plans break down when effort metrics are tracked in isolation from recovery. Heart rate, pace, strength benchmarks, hydration, and sleep all answer different parts of the same planning problem. This guide shows how to combine the training calculators on the site so the output is actionable across the whole week, not just one session.",
    calculatorSlugs: ["target-heart-rate", "pace", "one-rep-max", "water-intake", "sleep"],
    sections: [
      {
        title: "Use the metric that matches the workout",
        body:
          "Not every session should be judged by the same number. A steady cardio session, interval run, and strength session each need different output measures.",
        bullets: [
          "Use Target Heart Rate for zone-based cardio and effort control.",
          "Use Pace when speed over distance is the more useful benchmark.",
          "Use One-Rep Max for strength planning instead of forcing cardio metrics into lifting sessions.",
        ],
      },
      {
        title: "Track recovery as part of the plan, not after the damage",
        body:
          "Recovery determines whether the training target remains useful. Hydration and sleep are not side notes; they affect how repeatable the next sessions will be.",
        bullets: [
          "Use Water Intake as a planning baseline on heavier training days.",
          "Use Sleep goals to check whether the training load is supported by recovery habits.",
          "Interpret a bad session differently if the recovery inputs were weak in the days before it.",
        ],
      },
      {
        title: "Use trend-based planning instead of one heroic session",
        body:
          "A single strong or weak workout can be misleading. Training metrics are more useful when you compare them across several sessions under similar conditions.",
        bullets: [
          "Review pace, heart rate, or strength trends over weeks instead of one day.",
          "Keep the session type consistent when you compare benchmarks.",
          "Lower the plan temporarily when recovery signals are repeatedly poor.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I use heart rate or pace for cardio planning?",
        answer:
          "Use heart rate when effort control matters more than raw speed, and use pace when the training goal is tied to performance over distance or time.",
      },
      {
        question: "Why do my training numbers swing even when motivation is high?",
        answer:
          "Hydration, sleep, accumulated fatigue, and session context all affect performance. Good planning tracks recovery inputs alongside the workout output.",
      },
    ],
  },
  {
    categoryId: "fitness",
    slug: "bmr-vs-tdee-for-calorie-planning",
    targetQuery: "bmr vs tdee calculator",
    title: "BMR vs TDEE: Which Number Should You Use for Calorie Planning?",
    summary:
      "Use BMR, TDEE, calorie, macro split, and protein intake calculators to understand the difference between resting needs and full daily energy planning.",
    intro:
      "Many people find two calorie-related numbers and then use the wrong one for the wrong job. BMR and TDEE are related, but they answer different planning questions. BMR estimates resting energy needs, while TDEE tries to capture the full daily burn once activity is included. This guide shows how to use both numbers correctly when setting calorie and macro targets.",
    calculatorSlugs: ["bmr", "tdee", "calorie", "macro-split", "protein-intake"],
    sections: [
      {
        title: "Use BMR as a baseline, not as the final intake target",
        body:
          "BMR is useful because it estimates the energy your body would need at rest. That makes it a planning anchor, but it usually understates what you need to maintain body weight in daily life.",
        bullets: [
          "Use BMR when you want a resting baseline from common formulas.",
          "Do not use BMR alone as your normal maintenance intake unless a clinician has told you otherwise.",
          "Treat BMR as the starting layer underneath calorie planning, not the whole answer.",
        ],
      },
      {
        title: "Use TDEE when the real question is maintenance calories",
        body:
          "TDEE is usually the more useful number for day-to-day planning because it tries to include movement, exercise, and normal activity. That makes it the better anchor for maintenance, weight loss, or lean-gain adjustments.",
        bullets: [
          "Use TDEE or the Calorie Calculator when you need a practical daily target.",
          "Choose the activity level carefully because it can move the result more than expected.",
          "Run a slightly lower activity case if you are unsure whether your training volume is stable.",
        ],
      },
      {
        title: "Use calories and macros after the right anchor is chosen",
        body:
          "Macro planning works better once you know which calorie anchor you are actually using. BMR helps explain the floor, while TDEE supports the real daily target that protein and macros will sit inside.",
        bullets: [
          "Use Protein Intake once the calorie target direction is clear.",
          "Use Macro Split after maintenance or deficit calories have been set realistically.",
          "Adjust from your weekly trend, not one day of hunger or one weigh-in.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I eat at my BMR number to lose fat faster?",
        answer:
          "Usually no. BMR estimates resting needs and often sits too low for a practical daily target. Most people should build from maintenance calories instead of treating BMR as the diet target.",
      },
      {
        question: "Which number matters more for normal calorie planning: BMR or TDEE?",
        answer:
          "TDEE is usually more useful for normal planning because it includes daily activity. BMR is the baseline underneath it, not the full daily picture.",
      },
    ],
  },
];

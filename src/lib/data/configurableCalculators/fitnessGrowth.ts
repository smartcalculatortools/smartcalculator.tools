import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  safeDivide,
  shiftedValues,
} from "./base";

export const fitnessGrowthCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "macro-split",
      name: "Macro Calculator",
      category: "fitness",
      blurb: "Estimate protein, fat, and carbs from calories and macro split.",
      tags: ["macros", "nutrition", "diet"],
    },
    fields: [
      {
        key: "dailyCalories",
        label: "Daily calories",
        format: "number",
        defaultValue: 2400,
        min: 0,
        step: 10,
        description: "Daily calorie target used to convert the macro split into grams.",
      },
      {
        key: "proteinPercent",
        label: "Protein percent",
        format: "percent",
        defaultValue: 30,
        min: 0,
        step: 1,
        description: "Share of calories allocated to protein in the daily plan.",
      },
      {
        key: "fatPercent",
        label: "Fat percent",
        format: "percent",
        defaultValue: 25,
        min: 0,
        step: 1,
        description: "Share of calories allocated to fat in the daily plan.",
      },
    ],
    outputs: [
      {
        key: "proteinGrams",
        label: "Protein grams",
        format: "number",
        description: "Daily protein target in grams from the selected calorie split.",
      },
      {
        key: "fatGrams",
        label: "Fat grams",
        format: "number",
        description: "Daily fat target in grams from the selected calorie split.",
      },
      {
        key: "carbGrams",
        label: "Carb grams",
        format: "number",
        description: "Daily carbohydrate target in grams after protein and fat calories are allocated.",
      },
    ],
    compute: (inputs) => {
      const dailyCalories = clampNonNegative(inputs.dailyCalories);
      const proteinCalories =
        dailyCalories * (clampNonNegative(inputs.proteinPercent) / 100);
      const fatCalories =
        dailyCalories * (clampNonNegative(inputs.fatPercent) / 100);
      const carbCalories = clampNonNegative(dailyCalories - proteinCalories - fatCalories);

      return {
        proteinGrams: proteinCalories / 4,
        fatGrams: fatCalories / 9,
        carbGrams: carbCalories / 4,
      };
    },
    scenario: {
      fieldKey: "dailyCalories",
      values: (inputs) => shiftedValues(inputs.dailyCalories, [-400, -200, 0, 200, 400], 0),
      tableOutputKeys: ["proteinGrams", "carbGrams"],
      chartOutputKey: "carbGrams",
      tableTitle: "Macro grams by daily calories",
      chartTitle: "Carb target sensitivity",
      note: "Macro plans drift quickly when calories change, so compare a maintenance case with a dieting or gaining case before you prep meals.",
    },
    content: {
      summaryLead:
        "The Macro Calculator helps you turn a daily calorie target into protein, fat, and carbohydrate grams using a simple macro percentage split.",
      formulas: [
        "Protein Grams = Protein Calories / 4",
        "Fat Grams = Fat Calories / 9",
      ],
      assumptions: [
        "The remaining calories after protein and fat are assigned to carbohydrates.",
        "Protein and carbohydrates are modeled at 4 calories per gram and fat at 9 calories per gram.",
      ],
      tips: [
        "Check that protein and fat percentages leave enough calories for carbohydrates before you lock the plan.",
        "Use this as a planning baseline and then adjust from appetite, performance, and actual bodyweight trends.",
      ],
      references: [
        "Macro budgeting with calorie-based diet plans",
        "Nutrition planning using macro percentage splits",
      ],
      examples: [
        {
          title: "Cutting phase macro split",
          values: { dailyCalories: 2100, proteinPercent: 35, fatPercent: 25 },
          note: "Macro planning becomes easier when you convert percentages into gram targets you can actually track meal by meal.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "lean-body-mass",
      name: "Lean Body Mass Calculator",
      category: "fitness",
      blurb: "Estimate lean mass, fat mass, and target weight from body fat.",
      tags: ["body-fat", "lean-mass", "weight"],
    },
    fields: [
      {
        key: "bodyWeightKg",
        label: "Body weight",
        format: "number",
        defaultValue: 82,
        min: 0,
        step: 0.1,
        description: "Current body weight in kilograms used to split lean and fat mass.",
      },
      {
        key: "bodyFatPercent",
        label: "Body fat percent",
        format: "percent",
        defaultValue: 22,
        min: 0,
        max: 100,
        step: 0.1,
        description: "Current body fat percentage used to estimate lean mass and fat mass.",
      },
      {
        key: "targetBodyFatPercent",
        label: "Target body fat",
        format: "percent",
        defaultValue: 15,
        min: 0,
        max: 100,
        step: 0.1,
        description: "Target body fat percentage used to estimate target body weight with lean mass held constant.",
      },
    ],
    outputs: [
      {
        key: "leanMassKg",
        label: "Lean mass",
        format: "number",
        description: "Estimated lean body mass after body fat is removed from total weight.",
      },
      {
        key: "fatMassKg",
        label: "Fat mass",
        format: "number",
        description: "Estimated body fat mass in kilograms from the current body fat percentage.",
      },
      {
        key: "targetWeightKg",
        label: "Target weight",
        format: "number",
        description: "Estimated body weight if lean mass stays constant and body fat reaches the target level.",
      },
    ],
    compute: (inputs) => {
      const bodyWeightKg = clampNonNegative(inputs.bodyWeightKg);
      const fatMassKg = bodyWeightKg * (clampNonNegative(inputs.bodyFatPercent) / 100);
      const leanMassKg = bodyWeightKg - fatMassKg;
      const targetWeightKg = safeDivide(
        leanMassKg,
        Math.max(1 - clampNonNegative(inputs.targetBodyFatPercent) / 100, 0.0001)
      );

      return {
        leanMassKg,
        fatMassKg,
        targetWeightKg,
      };
    },
    scenario: {
      fieldKey: "bodyFatPercent",
      values: (inputs) => shiftedValues(inputs.bodyFatPercent, [-5, -2, 0, 2, 5], 0),
      tableOutputKeys: ["leanMassKg", "fatMassKg"],
      chartOutputKey: "fatMassKg",
      tableTitle: "Body composition by body fat percent",
      chartTitle: "Fat mass sensitivity",
      note: "Small body-fat changes can move the composition estimate meaningfully, so compare a few plausible measurement outcomes before using the result.",
    },
    content: {
      summaryLead:
        "The Lean Body Mass Calculator helps you estimate lean mass, fat mass, and a target body weight from current body weight and body fat percentage.",
      formulas: [
        "Fat Mass = Body Weight * Body Fat Percent",
        "Lean Mass = Body Weight - Fat Mass",
      ],
      assumptions: [
        "Lean mass is assumed to stay constant when the target body weight is estimated.",
        "Body fat percentage is treated as one current measurement rather than a range.",
      ],
      tips: [
        "Use the calculator for trend planning rather than treating one body-fat reading as perfect.",
        "Target body weight is more useful when paired with a realistic time horizon and training plan.",
      ],
      references: [
        "Body composition planning with lean mass and fat mass estimates",
        "Weight-target estimates based on body fat percentage",
      ],
      examples: [
        {
          title: "Recomposition target",
          values: { bodyWeightKg: 90, bodyFatPercent: 24, targetBodyFatPercent: 16 },
          note: "Lean-mass estimates work best when you compare a current composition reading with a realistic target instead of chasing scale weight alone.",
        },
      ],
    },
  },
];

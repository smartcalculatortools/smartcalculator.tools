import type { ConfigurableCalculatorDefinition } from "./base";
import { clampNonNegative, safeDivide, shiftedValues } from "./base";

export const fitnessCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "protein-intake",
      name: "Protein Intake Calculator",
      category: "fitness",
      blurb: "Estimate daily protein needs and per-meal targets.",
      tags: ["nutrition", "diet", "muscle"],
    },
    fields: [
      {
        key: "weightKg",
        label: "Body weight",
        format: "number",
        defaultValue: 75,
        min: 0,
        step: 0.5,
        description: "Body weight in kilograms used as the base for protein planning.",
      },
      {
        key: "gramsPerKg",
        label: "Protein target",
        format: "number",
        defaultValue: 1.8,
        min: 0,
        step: 0.1,
        description: "Daily protein target in grams per kilogram of body weight.",
      },
      {
        key: "mealsPerDay",
        label: "Meals per day",
        format: "number",
        defaultValue: 4,
        min: 1,
        step: 1,
        description: "Number of meals used to spread total protein across the day.",
      },
    ],
    outputs: [
      {
        key: "dailyProtein",
        label: "Daily protein",
        format: "number",
        description: "Total daily protein target in grams.",
      },
      {
        key: "proteinPerMeal",
        label: "Protein per meal",
        format: "number",
        description: "Average protein target for each meal across the day.",
      },
      {
        key: "weeklyProtein",
        label: "Weekly protein",
        format: "number",
        description: "Total protein target across a full seven-day week.",
      },
    ],
    compute: (inputs) => {
      const dailyProtein =
        clampNonNegative(inputs.weightKg) * clampNonNegative(inputs.gramsPerKg);
      return {
        dailyProtein,
        proteinPerMeal: safeDivide(dailyProtein, clampNonNegative(inputs.mealsPerDay)),
        weeklyProtein: dailyProtein * 7,
      };
    },
    scenario: {
      fieldKey: "gramsPerKg",
      values: (inputs) => shiftedValues(inputs.gramsPerKg, [-0.4, -0.2, 0, 0.2, 0.4], 0),
      tableOutputKeys: ["dailyProtein", "proteinPerMeal"],
      chartOutputKey: "dailyProtein",
      tableTitle: "Protein target by grams per kilogram",
      chartTitle: "Daily protein by target level",
      note: "Protein targets vary by goal, age, and training load, so use this as a planning baseline rather than a medical prescription.",
    },
    content: {
      summaryLead:
        "The Protein Intake Calculator helps you set a daily protein target from body weight and then split that target across meals for easier planning.",
      formulas: [
        "Daily Protein = Body Weight × Grams per Kilogram",
        "Protein per Meal = Daily Protein ÷ Meals per Day",
      ],
      assumptions: [
        "Body weight is entered in kilograms and used directly in the formula.",
        "Protein is spread evenly across the selected number of meals.",
      ],
      tips: [
        "Use a conservative target if your training volume is low.",
        "Per-meal planning is often easier than chasing the full daily total late in the day.",
      ],
      references: [
        "Sports nutrition protein intake guidelines",
        "Diet planning using body-weight-based protein targets",
      ],
      examples: [
        {
          title: "Strength training target",
          values: { weightKg: 82, gramsPerKg: 2, mealsPerDay: 4 },
          note: "A body-weight target gives you a fast daily anchor, but food quality and total calories still matter for real outcomes.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "water-intake",
      name: "Water Intake Calculator",
      category: "fitness",
      blurb: "Estimate baseline hydration and workout-related water needs.",
      tags: ["hydration", "health", "performance"],
    },
    fields: [
      {
        key: "weightKg",
        label: "Body weight",
        format: "number",
        defaultValue: 75,
        min: 0,
        step: 0.5,
        description: "Body weight in kilograms used to estimate baseline hydration needs.",
      },
      {
        key: "mlPerKg",
        label: "Baseline ml per kg",
        format: "number",
        defaultValue: 35,
        min: 0,
        step: 1,
        description: "Baseline hydration target in milliliters per kilogram of body weight.",
      },
      {
        key: "workoutMinutes",
        label: "Workout minutes",
        format: "number",
        defaultValue: 45,
        min: 0,
        step: 5,
        description: "Minutes of training used to estimate additional water needs.",
      },
    ],
    outputs: [
      {
        key: "baselineLiters",
        label: "Baseline liters",
        format: "number",
        description: "Baseline daily hydration need before workout adjustments.",
      },
      {
        key: "exerciseLiters",
        label: "Exercise liters",
        format: "number",
        description: "Additional hydration allowance linked to training time.",
      },
      {
        key: "totalLiters",
        label: "Total liters",
        format: "number",
        description: "Combined hydration target including the workout allowance.",
      },
    ],
    compute: (inputs) => {
      const baselineLiters =
        (clampNonNegative(inputs.weightKg) * clampNonNegative(inputs.mlPerKg)) / 1000;
      const exerciseLiters = (clampNonNegative(inputs.workoutMinutes) / 30) * 0.35;
      return {
        baselineLiters,
        exerciseLiters,
        totalLiters: baselineLiters + exerciseLiters,
      };
    },
    scenario: {
      fieldKey: "workoutMinutes",
      values: (inputs) => shiftedValues(inputs.workoutMinutes, [-30, 0, 30, 60], 0),
      tableOutputKeys: ["exerciseLiters", "totalLiters"],
      chartOutputKey: "totalLiters",
      tableTitle: "Water target by workout time",
      chartTitle: "Hydration target by training duration",
      note: "Heat, sweat rate, altitude, and medical context can change water needs substantially, so treat this as a rough planning estimate.",
    },
    content: {
      summaryLead:
        "The Water Intake Calculator gives you a baseline hydration target and adds a simple workout allowance so you can plan daily intake more consistently.",
      formulas: [
        "Baseline Liters = Body Weight × Baseline ml per kg ÷ 1000",
        "Total Liters = Baseline Liters + Exercise Liters",
      ],
      assumptions: [
        "The workout allowance uses a simple time-based estimate rather than measured sweat loss.",
        "Baseline hydration is modeled from body weight only.",
      ],
      tips: [
        "Increase targets in hot weather or if you sweat heavily.",
        "Use urine color and thirst as real-world checks, not only formulas.",
      ],
      references: [
        "General hydration guidance by body size and activity",
        "Exercise hydration planning methods",
      ],
      examples: [
        {
          title: "Training day hydration plan",
          values: { weightKg: 68, mlPerKg: 36, workoutMinutes: 75 },
          note: "Hydration formulas create a baseline, but weather and sweat rate can easily move the practical target higher.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "target-heart-rate",
      name: "Target Heart Rate Calculator",
      category: "fitness",
      blurb: "Estimate max heart rate, reserve, and target training pulse.",
      tags: ["cardio", "heart-rate", "training"],
    },
    fields: [
      {
        key: "age",
        label: "Age",
        format: "number",
        defaultValue: 35,
        min: 0,
        step: 1,
        description: "Age used to estimate maximum heart rate.",
      },
      {
        key: "restingHr",
        label: "Resting heart rate",
        format: "number",
        defaultValue: 62,
        min: 0,
        step: 1,
        description: "Measured resting heart rate used in the heart-rate reserve method.",
      },
      {
        key: "intensity",
        label: "Target intensity",
        format: "percent",
        defaultValue: 70,
        min: 0,
        step: 1,
        description: "Desired exercise intensity as a percentage of heart-rate reserve.",
      },
    ],
    outputs: [
      {
        key: "maxHr",
        label: "Estimated max HR",
        format: "number",
        description: "Estimated maximum heart rate based on age.",
      },
      {
        key: "reserveHr",
        label: "Heart-rate reserve",
        format: "number",
        description: "Difference between estimated max heart rate and resting heart rate.",
      },
      {
        key: "targetHr",
        label: "Target training HR",
        format: "number",
        description: "Target exercise pulse using the selected intensity and heart-rate reserve.",
      },
    ],
    compute: (inputs) => {
      const maxHr = 220 - clampNonNegative(inputs.age);
      const reserveHr = Math.max(0, maxHr - clampNonNegative(inputs.restingHr));
      return {
        maxHr,
        reserveHr,
        targetHr:
          clampNonNegative(inputs.restingHr) +
          (reserveHr * clampNonNegative(inputs.intensity)) / 100,
      };
    },
    scenario: {
      fieldKey: "intensity",
      values: (inputs) => shiftedValues(inputs.intensity, [-10, -5, 0, 5, 10], 40),
      tableOutputKeys: ["targetHr", "reserveHr"],
      chartOutputKey: "targetHr",
      tableTitle: "Target pulse by intensity",
      chartTitle: "Training pulse by intensity",
      note: "This formula is only a training estimate and should not replace personalized medical advice or testing.",
    },
    content: {
      summaryLead:
        "The Target Heart Rate Calculator estimates max heart rate, heart-rate reserve, and a target training pulse from age, resting HR, and intensity.",
      formulas: [
        "Estimated Max HR = 220 - Age",
        "Target HR = Resting HR + Heart-Rate Reserve × Intensity",
      ],
      assumptions: [
        "Maximum heart rate is estimated with a simple age-based formula.",
        "Intensity is entered as a percentage of heart-rate reserve.",
      ],
      tips: [
        "Use measured resting heart rate when possible for better consistency.",
        "If you know your tested max heart rate, use that instead of the age estimate.",
      ],
      references: [
        "Karvonen-style heart-rate reserve method",
        "Exercise intensity planning with estimated max heart rate",
      ],
      examples: [
        {
          title: "Moderate cardio target",
          values: { age: 42, restingHr: 58, intensity: 70 },
          note: "Age-based heart-rate formulas are practical for planning, but lab or field testing can give better individual anchors.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "one-rep-max",
      name: "One Rep Max Calculator",
      category: "fitness",
      blurb: "Estimate one-rep max and a practical training max.",
      tags: ["strength", "lifting", "programming"],
    },
    fields: [
      {
        key: "weightLifted",
        label: "Weight lifted",
        format: "number",
        defaultValue: 100,
        min: 0,
        step: 0.5,
        description: "Working weight used for the set that you completed.",
      },
      {
        key: "reps",
        label: "Repetitions",
        format: "number",
        defaultValue: 5,
        min: 1,
        step: 1,
        description: "Number of repetitions completed with the working weight.",
      },
      {
        key: "trainingPercent",
        label: "Training max",
        format: "percent",
        defaultValue: 90,
        min: 0,
        step: 1,
        description: "Percentage of estimated one-rep max used for a training max.",
      },
    ],
    outputs: [
      {
        key: "estimatedOrm",
        label: "Estimated 1RM",
        format: "number",
        description: "Estimated one-rep max based on the working set.",
      },
      {
        key: "trainingMax",
        label: "Training max",
        format: "number",
        description: "Conservative training max based on the selected percentage.",
      },
      {
        key: "repLoadPercent",
        label: "Rep set load",
        format: "percent",
        description: "Working weight shown as a percentage of the estimated one-rep max.",
      },
    ],
    compute: (inputs) => {
      const estimatedOrm =
        clampNonNegative(inputs.weightLifted) * (1 + clampNonNegative(inputs.reps) / 30);
      return {
        estimatedOrm,
        trainingMax: (estimatedOrm * clampNonNegative(inputs.trainingPercent)) / 100,
        repLoadPercent: safeDivide(clampNonNegative(inputs.weightLifted), estimatedOrm) * 100,
      };
    },
    scenario: {
      fieldKey: "reps",
      values: (inputs) => shiftedValues(inputs.reps, [-2, -1, 0, 1, 2], 1),
      tableOutputKeys: ["estimatedOrm", "trainingMax"],
      chartOutputKey: "estimatedOrm",
      tableTitle: "Estimated 1RM by reps",
      chartTitle: "Strength estimate by rep count",
      note: "Rep-based 1RM formulas get less reliable as reps get high or technique breaks down, so stay in a realistic rep range.",
    },
    content: {
      summaryLead:
        "The One Rep Max Calculator estimates your one-rep max from a working set and also gives you a practical training max for programming.",
      formulas: [
        "Estimated 1RM = Weight × (1 + Reps ÷ 30)",
        "Training Max = Estimated 1RM × Training Max %",
      ],
      assumptions: [
        "The estimate uses the Epley-style rep formula.",
        "The working set is performed with good technique and near-max intent.",
      ],
      tips: [
        "Use training max for programming if you want a more sustainable starting number.",
        "Do not chase exactness from very high-rep sets or sloppy reps.",
      ],
      references: [
        "Common one-rep max estimation formulas",
        "Strength training programming with training maxes",
      ],
      examples: [
        {
          title: "Bench press estimate",
          values: { weightLifted: 85, reps: 6, trainingPercent: 90 },
          note: "Estimated 1RM formulas are most useful for planning and trend tracking rather than for declaring a perfect absolute max.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "pace",
      name: "Pace Calculator",
      category: "fitness",
      blurb: "Estimate pace, speed, and projected race time.",
      tags: ["running", "pace", "endurance"],
    },
    fields: [
      {
        key: "distanceKm",
        label: "Distance",
        format: "number",
        defaultValue: 10,
        min: 0,
        step: 0.1,
        description: "Completed distance in kilometers for the reference effort.",
      },
      {
        key: "timeMinutes",
        label: "Time minutes",
        format: "number",
        defaultValue: 52,
        min: 0,
        step: 0.1,
        description: "Total time in minutes for the completed distance.",
      },
      {
        key: "targetDistanceKm",
        label: "Target distance",
        format: "number",
        defaultValue: 21.1,
        min: 0,
        step: 0.1,
        description: "Target race or workout distance used for the projected finish time.",
      },
    ],
    outputs: [
      {
        key: "pacePerKm",
        label: "Pace per km",
        format: "number",
        description: "Average minutes needed to cover one kilometer.",
      },
      {
        key: "speedKmh",
        label: "Speed km/h",
        format: "number",
        description: "Average speed in kilometers per hour.",
      },
      {
        key: "projectedTime",
        label: "Projected time",
        format: "number",
        description: "Projected minutes needed to cover the target distance at the same pace.",
      },
    ],
    compute: (inputs) => {
      const pacePerKm = safeDivide(
        clampNonNegative(inputs.timeMinutes),
        clampNonNegative(inputs.distanceKm)
      );
      return {
        pacePerKm,
        speedKmh:
          safeDivide(clampNonNegative(inputs.distanceKm), clampNonNegative(inputs.timeMinutes)) *
          60,
        projectedTime: pacePerKm * clampNonNegative(inputs.targetDistanceKm),
      };
    },
    scenario: {
      fieldKey: "targetDistanceKm",
      values: (inputs) => shiftedValues(inputs.targetDistanceKm, [-5, -2, 0, 5, 10], 0.1),
      tableOutputKeys: ["pacePerKm", "projectedTime"],
      chartOutputKey: "projectedTime",
      tableTitle: "Projected time by target distance",
      chartTitle: "Projected finish time",
      note: "Projection assumes the same pace throughout, which is useful for planning but not a guarantee for longer or hillier events.",
    },
    content: {
      summaryLead:
        "The Pace Calculator converts a completed run into average pace, speed, and a projected finish time for another distance at the same effort.",
      formulas: [
        "Pace per km = Total Time ÷ Distance",
        "Projected Time = Pace per km × Target Distance",
      ],
      assumptions: [
        "The pace is assumed to stay constant across the target distance.",
        "Terrain, weather, and fatigue changes are not modeled.",
      ],
      tips: [
        "Use this as a pacing baseline, then adjust for hills, heat, or race-day conditions.",
        "Projection becomes less reliable as the target distance moves far away from the reference run.",
      ],
      references: [
        "Running pace and speed conversion basics",
        "Endurance planning with pace-based projections",
      ],
      examples: [
        {
          title: "10K to half-marathon projection",
          values: { distanceKm: 10, timeMinutes: 48, targetDistanceKm: 21.1 },
          note: "A pace projection is useful for setting expectations, but longer races often require a slower sustainable pace than shorter efforts.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "waist-to-height",
      name: "Waist to Height Ratio Calculator",
      category: "fitness",
      blurb: "Check waist-to-height ratio and baseline waist threshold.",
      tags: ["health", "ratio", "screening"],
    },
    fields: [
      {
        key: "waistCm",
        label: "Waist",
        format: "number",
        defaultValue: 84,
        min: 0,
        step: 0.5,
        description: "Waist circumference in centimeters.",
      },
      {
        key: "heightCm",
        label: "Height",
        format: "number",
        defaultValue: 175,
        min: 0,
        step: 0.5,
        description: "Height in centimeters used for the ratio calculation.",
      },
      {
        key: "screeningThreshold",
        label: "Threshold",
        format: "percent",
        defaultValue: 50,
        min: 0,
        step: 1,
        description: "Reference threshold percentage used as a comparison line.",
      },
    ],
    outputs: [
      {
        key: "ratioPercent",
        label: "Waist-to-height ratio",
        format: "percent",
        description: "Waist circumference as a percentage of height.",
      },
      {
        key: "maxWaist",
        label: "Threshold waist",
        format: "number",
        description: "Waist measurement that matches the selected threshold.",
      },
      {
        key: "differenceCm",
        label: "Difference from threshold",
        format: "number",
        description: "Distance in centimeters above or below the selected threshold waist.",
      },
    ],
    compute: (inputs) => {
      const ratioPercent =
        safeDivide(clampNonNegative(inputs.waistCm), clampNonNegative(inputs.heightCm)) * 100;
      const maxWaist =
        (clampNonNegative(inputs.heightCm) * clampNonNegative(inputs.screeningThreshold)) / 100;
      return {
        ratioPercent,
        maxWaist,
        differenceCm: clampNonNegative(inputs.waistCm) - maxWaist,
      };
    },
    scenario: {
      fieldKey: "waistCm",
      values: (inputs) => shiftedValues(inputs.waistCm, [-8, -4, 0, 4, 8], 0),
      tableOutputKeys: ["ratioPercent", "differenceCm"],
      chartOutputKey: "ratioPercent",
      tableTitle: "Ratio by waist measurement",
      chartTitle: "Waist-to-height comparison",
      note: "Waist-to-height ratio is a simple screening metric and should not be treated as a diagnosis or a complete health assessment.",
    },
    content: {
      summaryLead:
        "The Waist to Height Ratio Calculator turns a waist and height measurement into a quick screening ratio and shows the waist size linked to your chosen threshold.",
      formulas: [
        "Waist-to-Height Ratio = Waist ÷ Height × 100",
        "Threshold Waist = Height × Threshold %",
      ],
      assumptions: [
        "Waist and height are measured in the same unit system.",
        "The threshold is used as a simple comparison line, not a diagnosis.",
      ],
      tips: [
        "Measure waist consistently at the same point each time for better tracking.",
        "Use this ratio with other health markers rather than relying on one metric alone.",
      ],
      references: [
        "Waist-to-height ratio screening guidance",
        "Anthropometric health risk screening methods",
      ],
      examples: [
        {
          title: "Baseline ratio check",
          values: { waistCm: 92, heightCm: 178, screeningThreshold: 50 },
          note: "Ratios are useful for tracking, but consistent measurement technique matters as much as the formula itself.",
        },
      ],
    },
  },
];

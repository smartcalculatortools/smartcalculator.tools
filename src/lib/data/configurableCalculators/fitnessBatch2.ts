import type { ConfigurableCalculatorDefinition } from "./base";
import { clampNonNegative, safeDivide, shiftedValues, scaledValues } from "./base";

export const fitnessBatch2Definitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: { slug: "ideal-weight", name: "Ideal Weight Calculator", category: "fitness", blurb: "Estimate ideal body weight based on height and frame.", tags: ["weight", "health", "bmi"] },
    fields: [
      { key: "heightCm", label: "Height (cm)", format: "number", defaultValue: 175, min: 100, step: 1, description: "Your height in centimeters." },
      { key: "isMale", label: "Gender (1=Male, 0=Female)", format: "number", defaultValue: 1, min: 0, max: 1, step: 1, description: "1 for male, 0 for female." },
    ],
    outputs: [
      { key: "devine", label: "Devine formula", format: "number", description: "Ideal weight using the Devine formula (kg)." },
      { key: "robinson", label: "Robinson formula", format: "number", description: "Ideal weight using the Robinson formula (kg)." },
      { key: "miller", label: "Miller formula", format: "number", description: "Ideal weight using the Miller formula (kg)." },
    ],
    compute: (i) => {
      const h = clampNonNegative(i.heightCm), male = i.isMale >= 0.5;
      const inchesOver5ft = Math.max(0, (h - 152.4) / 2.54);
      const devine = male ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
      const robinson = male ? 52 + 1.9 * inchesOver5ft : 49 + 1.7 * inchesOver5ft;
      const miller = male ? 56.2 + 1.41 * inchesOver5ft : 53.1 + 1.36 * inchesOver5ft;
      return { devine, robinson, miller };
    },
    scenario: { fieldKey: "heightCm", values: (i) => shiftedValues(i.heightCm, [-10, -5, 0, 5, 10], 100), tableOutputKeys: ["devine", "robinson"], chartOutputKey: "devine", tableTitle: "Ideal weight by height", chartTitle: "Weight vs height", note: "These formulas provide estimates and may not suit everyone equally." },
    content: { summaryLead: "The Ideal Weight Calculator estimates a healthy body weight range using three well-known medical formulas based on height and gender.", formulas: ["Devine (Male) = 50 + 2.3 × inches over 5ft", "Devine (Female) = 45.5 + 2.3 × inches over 5ft"], assumptions: ["Formulas designed for adults.", "Frame size is not accounted for."], tips: ["Use multiple formulas and take the range.", "BMI is a complementary but separate measure."], references: ["Devine formula for ideal body weight", "Robinson and Miller ideal weight formulas"], examples: [{ title: "Adult male estimate", values: { heightCm: 180, isMale: 1 }, note: "Different formulas give a range; aim for the middle and consult a doctor for personalized advice." }] },
  },
  {
    calculator: { slug: "tdee", name: "TDEE Calculator", category: "fitness", blurb: "Estimate total daily energy expenditure based on activity.", tags: ["calories", "metabolism", "energy"] },
    fields: [
      { key: "weight", label: "Weight (kg)", format: "number", defaultValue: 75, min: 20, step: 1, description: "Body weight in kilograms." },
      { key: "height", label: "Height (cm)", format: "number", defaultValue: 175, min: 100, step: 1, description: "Height in centimeters." },
      { key: "age", label: "Age", format: "number", defaultValue: 30, min: 15, step: 1, description: "Age in years." },
      { key: "activityMultiplier", label: "Activity multiplier", format: "number", defaultValue: 1.55, min: 1.2, max: 1.9, step: 0.05, description: "1.2=sedentary, 1.375=light, 1.55=moderate, 1.725=active, 1.9=very active." },
    ],
    outputs: [
      { key: "bmr", label: "BMR", format: "number", description: "Basal metabolic rate (calories/day)." },
      { key: "tdee", label: "TDEE", format: "number", description: "Total daily energy expenditure." },
      { key: "cuttingCalories", label: "Cutting calories", format: "number", description: "TDEE minus 500 for weight loss." },
    ],
    compute: (i) => {
      const w = clampNonNegative(i.weight), h = clampNonNegative(i.height), a = clampNonNegative(i.age), m = clampNonNegative(i.activityMultiplier);
      const bmr = 10 * w + 6.25 * h - 5 * a + 5;
      const tdee = bmr * m;
      return { bmr, tdee, cuttingCalories: Math.max(1200, tdee - 500) };
    },
    scenario: { fieldKey: "activityMultiplier", values: () => [1.2, 1.375, 1.55, 1.725, 1.9], tableOutputKeys: ["tdee", "cuttingCalories"], chartOutputKey: "tdee", tableTitle: "TDEE by activity level", chartTitle: "Energy needs by activity", note: "Activity level has the biggest impact on daily calorie needs." },
    content: { summaryLead: "The TDEE Calculator estimates your total daily energy expenditure by combining your basal metabolic rate with an activity multiplier.", formulas: ["BMR = 10×weight + 6.25×height − 5×age + 5 (Mifflin-St Jeor, male)", "TDEE = BMR × Activity Multiplier"], assumptions: ["Uses the Mifflin-St Jeor equation for males.", "Activity multiplier is a self-assessed estimate."], tips: ["Track actual intake for 2 weeks to calibrate.", "Adjust by 200-300 calories if weight isn't changing as expected."], references: ["Mifflin-St Jeor BMR equation", "Activity level multipliers from exercise science"], examples: [{ title: "Active adult estimate", values: { weight: 80, height: 180, age: 28, activityMultiplier: 1.55 }, note: "Moderate activity (3-5 days of exercise) uses a 1.55 multiplier." }] },
  },
  {
    calculator: { slug: "calories-burned", name: "Calories Burned Calculator", category: "fitness", blurb: "Estimate calories burned during exercise.", tags: ["exercise", "calories", "fitness"] },
    fields: [
      { key: "weight", label: "Weight (kg)", format: "number", defaultValue: 70, min: 20, step: 1, description: "Body weight in kilograms." },
      { key: "met", label: "MET value", format: "number", defaultValue: 7, min: 1, step: 0.5, description: "Metabolic equivalent of the activity (e.g. running=7-12, walking=3-4)." },
      { key: "durationMinutes", label: "Duration (minutes)", format: "number", defaultValue: 30, min: 1, step: 5, description: "Duration of the exercise session." },
    ],
    outputs: [
      { key: "caloriesBurned", label: "Calories burned", format: "number", description: "Estimated total calories burned." },
      { key: "caloriesPerMinute", label: "Calories per minute", format: "number", description: "Rate of calorie expenditure." },
      { key: "caloriesPerHour", label: "Calories per hour", format: "number", description: "Hourly calorie burn rate." },
    ],
    compute: (i) => {
      const w = clampNonNegative(i.weight), met = clampNonNegative(i.met), dur = clampNonNegative(i.durationMinutes);
      const cal = met * 3.5 * w / 200 * dur;
      return { caloriesBurned: cal, caloriesPerMinute: safeDivide(cal, dur), caloriesPerHour: safeDivide(cal, dur) * 60 };
    },
    scenario: { fieldKey: "met", values: (i) => shiftedValues(i.met, [-3, -1, 0, 2, 5], 1), tableOutputKeys: ["caloriesBurned", "caloriesPerHour"], chartOutputKey: "caloriesBurned", tableTitle: "Calories by activity intensity", chartTitle: "Burn rate comparison", note: "MET values: walking=3.5, cycling=6, running=8-12, swimming=7." },
    content: { summaryLead: "The Calories Burned Calculator estimates how many calories you burn during various activities using the MET (metabolic equivalent) method.", formulas: ["Calories = MET × 3.5 × Weight(kg) ÷ 200 × Minutes"], assumptions: ["MET values are standardized averages.", "Individual variation affects actual burn."], tips: ["Look up MET values for your specific activity.", "Higher intensity burns more per minute but may not be sustainable."], references: ["Compendium of Physical Activities MET values", "Exercise energy expenditure formulas"], examples: [{ title: "Morning jog", values: { weight: 75, met: 8, durationMinutes: 45 }, note: "A 45-minute jog at MET 8 burns roughly 470 calories for a 75kg person." }] },
  },
  {
    calculator: { slug: "pregnancy-due-date", name: "Pregnancy Due Date Calculator", category: "fitness", blurb: "Estimate the expected due date from the last period.", tags: ["pregnancy", "due date", "health"] },
    fields: [
      { key: "lmpDaysAgo", label: "Days since last period", format: "number", defaultValue: 42, min: 0, step: 1, description: "Number of days since the first day of the last menstrual period." },
      { key: "cycleLength", label: "Cycle length (days)", format: "number", defaultValue: 28, min: 21, max: 35, step: 1, description: "Average menstrual cycle length in days." },
    ],
    outputs: [
      { key: "daysRemaining", label: "Days remaining", format: "number", description: "Estimated days until the due date." },
      { key: "weeksPregnant", label: "Weeks pregnant", format: "number", description: "Current estimated weeks of pregnancy." },
      { key: "trimester", label: "Trimester (1-3)", format: "number", description: "Current trimester of pregnancy." },
    ],
    compute: (i) => {
      const daysAgo = clampNonNegative(i.lmpDaysAgo), cycle = clampNonNegative(i.cycleLength);
      const adjustment = cycle - 28;
      const totalDays = 280 + adjustment;
      const daysRemaining = Math.max(0, totalDays - daysAgo);
      const weeksPregnant = daysAgo / 7;
      const trimester = weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3;
      return { daysRemaining, weeksPregnant: Math.round(weeksPregnant * 10) / 10, trimester };
    },
    scenario: { fieldKey: "cycleLength", values: () => [25, 26, 28, 30, 32], tableOutputKeys: ["daysRemaining", "weeksPregnant"], chartOutputKey: "daysRemaining", tableTitle: "Due date by cycle length", chartTitle: "Days remaining by cycle", note: "Cycle length adjusts the due date by the same number of days." },
    content: { summaryLead: "The Pregnancy Due Date Calculator estimates expected delivery date and current gestational age based on the last menstrual period.", formulas: ["Due Date = LMP + 280 days + (Cycle Length − 28)"], assumptions: ["Uses Naegele's rule.", "Actual due dates vary ±2 weeks."], tips: ["An ultrasound date is more accurate for dating.", "Only 5% of babies arrive exactly on the due date."], references: ["Naegele's rule for due date estimation", "ACOG pregnancy dating guidelines"], examples: [{ title: "Early pregnancy check", values: { lmpDaysAgo: 56, cycleLength: 28 }, note: "At 8 weeks, the first trimester is well underway and early prenatal care is important." }] },
  },
  {
    calculator: { slug: "carbohydrate", name: "Carbohydrate Calculator", category: "fitness", blurb: "Estimate daily carb needs based on calorie target.", tags: ["nutrition", "carbs", "diet"] },
    fields: [
      { key: "dailyCalories", label: "Daily calories", format: "number", defaultValue: 2200, min: 800, step: 100, description: "Target daily calorie intake." },
      { key: "carbPercent", label: "Carb percentage", format: "percent", defaultValue: 50, min: 0, max: 100, step: 5, description: "Percentage of calories from carbohydrates." },
    ],
    outputs: [
      { key: "carbCalories", label: "Carb calories", format: "number", description: "Calories from carbohydrates." },
      { key: "carbGrams", label: "Carbs (grams)", format: "number", description: "Daily carb intake in grams." },
      { key: "carbPerMeal", label: "Carbs per meal (3 meals)", format: "number", description: "Grams of carbs per meal assuming 3 meals." },
    ],
    compute: (i) => {
      const cal = clampNonNegative(i.dailyCalories), pct = clampNonNegative(i.carbPercent) / 100;
      const carbCalories = cal * pct;
      const carbGrams = carbCalories / 4;
      return { carbCalories, carbGrams, carbPerMeal: carbGrams / 3 };
    },
    scenario: { fieldKey: "carbPercent", values: (i) => shiftedValues(i.carbPercent, [-20, -10, 0, 10], 5), tableOutputKeys: ["carbGrams", "carbCalories"], chartOutputKey: "carbGrams", tableTitle: "Carb intake by percentage", chartTitle: "Daily carbs by target", note: "Low-carb diets typically target 20-30%, moderate 40-50%, high-carb 55-65%." },
    content: { summaryLead: "The Carbohydrate Calculator estimates daily carb intake in grams based on your calorie target and desired macronutrient split.", formulas: ["Carb Calories = Daily Calories × Carb%", "Carb Grams = Carb Calories ÷ 4"], assumptions: ["Each gram of carbohydrate provides 4 calories.", "Percentage is of total daily intake."], tips: ["Choose complex carbs for sustained energy.", "Athletes may need 55-65% carbs for performance."], references: ["Dietary Reference Intakes for macronutrients", "Carbohydrate counting guidelines"], examples: [{ title: "Moderate carb plan", values: { dailyCalories: 2500, carbPercent: 45 }, note: "45% carbs provide the fuel most active adults need without excess." }] },
  },
  {
    calculator: { slug: "sleep", name: "Sleep Calculator", category: "fitness", blurb: "Find optimal bedtime and wake time by sleep cycles.", tags: ["sleep", "health", "rest"] },
    fields: [
      { key: "wakeHour", label: "Wake time (hour, 0-23)", format: "number", defaultValue: 7, min: 0, max: 23, step: 1, description: "Desired wake-up hour in 24-hour format." },
      { key: "cycleMinutes", label: "Sleep cycle (minutes)", format: "number", defaultValue: 90, min: 60, max: 120, step: 5, description: "Length of one sleep cycle (typically 90 minutes)." },
      { key: "fallAsleepMinutes", label: "Time to fall asleep (min)", format: "number", defaultValue: 15, min: 0, step: 5, description: "Average minutes needed to fall asleep." },
    ],
    outputs: [
      { key: "bedtime6", label: "Bedtime (6 cycles)", format: "number", description: "Bedtime for 6 full sleep cycles (~9 hours)." },
      { key: "bedtime5", label: "Bedtime (5 cycles)", format: "number", description: "Bedtime for 5 full sleep cycles (~7.5 hours)." },
      { key: "bedtime4", label: "Bedtime (4 cycles)", format: "number", description: "Bedtime for 4 full sleep cycles (~6 hours)." },
    ],
    compute: (i) => {
      const wake = clampNonNegative(i.wakeHour) * 60, cycle = clampNonNegative(i.cycleMinutes), fallAsleep = clampNonNegative(i.fallAsleepMinutes);
      const bed = (cycles: number) => { let t = wake - cycles * cycle - fallAsleep; if (t < 0) t += 1440; return Math.round(t / 60 * 100) / 100; };
      return { bedtime6: bed(6), bedtime5: bed(5), bedtime4: bed(4) };
    },
    scenario: { fieldKey: "wakeHour", values: (i) => shiftedValues(i.wakeHour, [-2, -1, 0, 1, 2], 0), tableOutputKeys: ["bedtime5", "bedtime6"], chartOutputKey: "bedtime5", tableTitle: "Bedtime by wake time", chartTitle: "Bedtime suggestions", note: "Waking between sleep cycles leads to feeling more refreshed." },
    content: { summaryLead: "The Sleep Calculator suggests ideal bedtimes based on complete 90-minute sleep cycles so you wake between cycles and feel rested.", formulas: ["Bedtime = Wake Time − (Cycles × Cycle Length) − Fall Asleep Time"], assumptions: ["Average sleep cycle is 90 minutes.", "Waking between cycles reduces grogginess."], tips: ["Most adults need 5-6 cycles (7.5-9 hours).", "Keep a consistent schedule even on weekends."], references: ["Sleep cycle duration research", "National Sleep Foundation recommendations"], examples: [{ title: "Early riser plan", values: { wakeHour: 6, cycleMinutes: 90, fallAsleepMinutes: 15 }, note: "For a 6 AM wake time, going to bed at 9:15 PM or 10:45 PM completes full cycles." }] },
  },
  {
    calculator: { slug: "fat-intake", name: "Fat Intake Calculator", category: "fitness", blurb: "Estimate daily fat needs based on calorie target.", tags: ["nutrition", "fat", "diet"] },
    fields: [
      { key: "dailyCalories", label: "Daily calories", format: "number", defaultValue: 2200, min: 800, step: 100, description: "Target daily calorie intake." },
      { key: "fatPercent", label: "Fat percentage", format: "percent", defaultValue: 30, min: 0, max: 100, step: 5, description: "Percentage of calories from fat." },
    ],
    outputs: [
      { key: "fatCalories", label: "Fat calories", format: "number", description: "Calories from dietary fat." },
      { key: "fatGrams", label: "Fat (grams)", format: "number", description: "Daily fat intake in grams." },
      { key: "fatPerMeal", label: "Fat per meal (3 meals)", format: "number", description: "Grams of fat per meal assuming 3 meals." },
    ],
    compute: (i) => {
      const cal = clampNonNegative(i.dailyCalories), pct = clampNonNegative(i.fatPercent) / 100;
      const fatCalories = cal * pct;
      const fatGrams = fatCalories / 9;
      return { fatCalories, fatGrams, fatPerMeal: fatGrams / 3 };
    },
    scenario: { fieldKey: "fatPercent", values: (i) => shiftedValues(i.fatPercent, [-10, -5, 0, 5, 10], 5), tableOutputKeys: ["fatGrams", "fatCalories"], chartOutputKey: "fatGrams", tableTitle: "Fat intake by percentage", chartTitle: "Daily fat by target", note: "Dietary guidelines recommend 20-35% of calories from fat." },
    content: { summaryLead: "The Fat Intake Calculator estimates daily fat needs in grams based on your calorie target and desired fat percentage.", formulas: ["Fat Calories = Daily Calories × Fat%", "Fat Grams = Fat Calories ÷ 9"], assumptions: ["Each gram of fat provides 9 calories.", "Percentage is of total daily intake."], tips: ["Focus on unsaturated fats from nuts, fish, and olive oil.", "Don't go below 20% fat for hormonal health."], references: ["Dietary Reference Intakes for fat", "Healthy fat consumption guidelines"], examples: [{ title: "Balanced fat plan", values: { dailyCalories: 2500, fatPercent: 30 }, note: "At 30%, a 2500-calorie diet includes about 83g of fat per day." }] },
  },
  {
    calculator: { slug: "healthy-weight", name: "Healthy Weight Calculator", category: "fitness", blurb: "Find the healthy weight range for your height.", tags: ["weight", "bmi", "health"] },
    fields: [
      { key: "heightCm", label: "Height (cm)", format: "number", defaultValue: 175, min: 100, step: 1, description: "Your height in centimeters." },
      { key: "bmiLow", label: "BMI lower bound", format: "number", defaultValue: 18.5, min: 15, max: 25, step: 0.5, description: "Lower BMI threshold for healthy range (standard is 18.5)." },
    ],
    outputs: [
      { key: "minWeight", label: "Minimum healthy weight (kg)", format: "number", description: "Lower bound of healthy BMI range." },
      { key: "maxWeight", label: "Maximum healthy weight (kg)", format: "number", description: "Upper bound of healthy BMI range (24.9)." },
      { key: "midWeight", label: "Midpoint weight (kg)", format: "number", description: "Midpoint of the healthy range." },
    ],
    compute: (i) => {
      const h = clampNonNegative(i.heightCm) / 100;
      const low = clampNonNegative(i.bmiLow) || 18.5;
      const minWeight = low * h * h;
      const maxWeight = 24.9 * h * h;
      return { minWeight, maxWeight, midWeight: (minWeight + maxWeight) / 2 };
    },
    scenario: { fieldKey: "heightCm", values: (i) => shiftedValues(i.heightCm, [-15, -5, 0, 5, 15], 100), tableOutputKeys: ["minWeight", "maxWeight"], chartOutputKey: "midWeight", tableTitle: "Healthy range by height", chartTitle: "Weight range by height", note: "BMI-based ranges don't account for muscle mass or body composition." },
    content: { summaryLead: "The Healthy Weight Calculator shows the healthy weight range for your height based on the standard BMI range of 18.5–24.9.", formulas: ["Min Weight = 18.5 × (Height in m)²", "Max Weight = 24.9 × (Height in m)²"], assumptions: ["Uses the BMI-based healthy range.", "Does not account for age, gender, or muscle mass."], tips: ["Use alongside body fat measurements for a fuller picture.", "Athletes may fall outside this range and still be healthy."], references: ["WHO BMI classification", "Healthy weight guidelines"], examples: [{ title: "Height-based range", values: { heightCm: 170 }, note: "For 170cm, the healthy range is roughly 53-72kg, but individual factors matter too." }] },
  },
];

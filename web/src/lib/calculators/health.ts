export type Sex = "male" | "female";

export type BmrFormula = "mifflin" | "harris" | "katch";

export function bmiFromMetric(weightKg: number, heightCm: number) {
  const safeWeight = Math.max(0, weightKg);
  const safeHeightCm = Math.max(0, heightCm);
  if (safeHeightCm === 0) return 0;
  const heightM = safeHeightCm / 100;
  return safeWeight / (heightM * heightM);
}

export function bmiCategory(bmi: number) {
  if (bmi === 0) return "";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

export function bmiPrime(bmi: number) {
  if (!Number.isFinite(bmi) || bmi <= 0) return 0;
  return bmi / 25;
}

export function ponderalIndex(weightKg: number, heightCm: number) {
  const safeWeight = Math.max(0, weightKg);
  const safeHeightCm = Math.max(0, heightCm);
  if (safeHeightCm === 0) return 0;
  const heightM = safeHeightCm / 100;
  return safeWeight / Math.pow(heightM, 3);
}

export function healthyWeightRange(heightCm: number) {
  const safeHeightCm = Math.max(0, heightCm);
  if (safeHeightCm === 0) return { min: 0, max: 0 };
  const heightM = safeHeightCm / 100;
  const min = 18.5 * heightM * heightM;
  const max = 24.9 * heightM * heightM;
  return { min, max };
}

export function bmrMifflinStJeor({
  weightKg,
  heightCm,
  age,
  sex,
}: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
}) {
  const safeWeight = Math.max(0, weightKg);
  const safeHeight = Math.max(0, heightCm);
  const safeAge = Math.max(0, age);
  const base = 10 * safeWeight + 6.25 * safeHeight - 5 * safeAge;
  return sex === "male" ? base + 5 : base - 161;
}

export function bmrHarrisBenedict({
  weightKg,
  heightCm,
  age,
  sex,
}: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
}) {
  const safeWeight = Math.max(0, weightKg);
  const safeHeight = Math.max(0, heightCm);
  const safeAge = Math.max(0, age);
  if (sex === "male") {
    return 13.397 * safeWeight + 4.799 * safeHeight - 5.677 * safeAge + 88.362;
  }
  return 9.247 * safeWeight + 3.098 * safeHeight - 4.33 * safeAge + 447.593;
}

export function bmrKatchMcArdle({
  weightKg,
  bodyFatPercent,
}: {
  weightKg: number;
  bodyFatPercent: number;
}) {
  const safeWeight = Math.max(0, weightKg);
  const safeFat = Math.max(0, Math.min(100, bodyFatPercent));
  const leanMass = safeWeight * (1 - safeFat / 100);
  return 370 + 21.6 * leanMass;
}

export function bmrFromFormula({
  formula,
  weightKg,
  heightCm,
  age,
  sex,
  bodyFatPercent = 0,
}: {
  formula: BmrFormula;
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  bodyFatPercent?: number;
}) {
  if (formula === "harris") {
    return bmrHarrisBenedict({ weightKg, heightCm, age, sex });
  }
  if (formula === "katch") {
    return bmrKatchMcArdle({ weightKg, bodyFatPercent });
  }
  return bmrMifflinStJeor({ weightKg, heightCm, age, sex });
}

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very"
  | "extra";

export const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extra: 1.9,
};

export function dailyCalorieNeeds({
  weightKg,
  heightCm,
  age,
  sex,
  activity,
  formula = "mifflin",
  bodyFatPercent = 0,
}: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
  activity: ActivityLevel;
  formula?: BmrFormula;
  bodyFatPercent?: number;
}) {
  const bmr = bmrFromFormula({
    formula,
    weightKg,
    heightCm,
    age,
    sex,
    bodyFatPercent,
  });
  return bmr * activityMultipliers[activity];
}

export function bodyFatPercentageUSNavy({
  sex,
  heightCm,
  waistCm,
  neckCm,
  hipCm,
}: {
  sex: Sex;
  heightCm: number;
  waistCm: number;
  neckCm: number;
  hipCm?: number;
}) {
  const heightIn = Math.max(0, heightCm) / 2.54;
  const waistIn = Math.max(0, waistCm) / 2.54;
  const neckIn = Math.max(0, neckCm) / 2.54;
  const hipIn = Math.max(0, hipCm ?? 0) / 2.54;

  if (heightIn === 0) return 0;

  if (sex === "male") {
    const diff = waistIn - neckIn;
    if (diff <= 0) return 0;
    const value =
      86.010 * Math.log10(diff) - 70.041 * Math.log10(heightIn) + 36.76;
    return clampPercent(value);
  }

  const sum = waistIn + hipIn - neckIn;
  if (sum <= 0) return 0;

  const value =
    163.205 * Math.log10(sum) - 97.684 * Math.log10(heightIn) - 78.387;
  return clampPercent(value);
}

export function bodyFatPercentageBMI({
  bmi,
  age,
  sex,
}: {
  bmi: number;
  age: number;
  sex: Sex;
}) {
  const safeBmi = Math.max(0, bmi);
  const safeAge = Math.max(0, age);

  if (safeAge < 18) {
    const value =
      sex === "male"
        ? 1.51 * safeBmi - 0.7 * safeAge - 2.2
        : 1.51 * safeBmi - 0.7 * safeAge + 1.4;
    return clampPercent(value);
  }

  const value =
    sex === "male"
      ? 1.2 * safeBmi + 0.23 * safeAge - 16.2
      : 1.2 * safeBmi + 0.23 * safeAge - 5.4;
  return clampPercent(value);
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

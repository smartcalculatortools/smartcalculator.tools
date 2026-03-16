import { describe, expect, it } from "vitest";
import {
  bmiCategory,
  bmiFromMetric,
  bmiPrime,
  bmrMifflinStJeor,
  bodyFatPercentageUSNavy,
  dailyCalorieNeeds,
  healthyWeightRange,
  ponderalIndex,
} from "./health";

describe("health calculations", () => {
  it("calculates BMI and category", () => {
    const bmi = bmiFromMetric(70, 175);
    expect(bmi).toBeCloseTo(22.86, 2);
    expect(bmiCategory(bmi)).toBe("Normal");
  });

  it("calculates BMI prime and ponderal index", () => {
    const bmi = bmiFromMetric(70, 175);
    expect(bmiPrime(bmi)).toBeCloseTo(bmi / 25, 6);
    const pi = ponderalIndex(70, 175);
    expect(pi).toBeCloseTo(13.06, 2);
  });

  it("calculates healthy weight range", () => {
    const range = healthyWeightRange(175);
    expect(range.min).toBeCloseTo(56.7, 1);
    expect(range.max).toBeCloseTo(76.3, 1);
  });

  it("calculates BMR using Mifflin-St Jeor", () => {
    const bmr = bmrMifflinStJeor({
      weightKg: 70,
      heightCm: 175,
      age: 30,
      sex: "male",
    });
    expect(bmr).toBeCloseTo(1648.75, 2);
  });

  it("scales calorie needs by activity", () => {
    const calories = dailyCalorieNeeds({
      weightKg: 70,
      heightCm: 175,
      age: 30,
      sex: "male",
      activity: "moderate",
    });
    expect(calories).toBeCloseTo(1648.75 * 1.55, 2);
  });

  it("calculates body fat percentage (US Navy)", () => {
    const male = bodyFatPercentageUSNavy({
      sex: "male",
      heightCm: 180,
      waistCm: 90,
      neckCm: 40,
    });
    expect(male).toBeCloseTo(18.46, 2);

    const female = bodyFatPercentageUSNavy({
      sex: "female",
      heightCm: 165,
      waistCm: 80,
      neckCm: 34,
      hipCm: 95,
    });
    expect(female).toBeCloseTo(29.24, 2);
  });
});

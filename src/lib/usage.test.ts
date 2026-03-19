import { describe, expect, it } from "vitest";
import type { Calculator } from "@/lib/data/calculators";
import {
  createEmptyUsageState,
  getRecentCalculators,
  getRecommendedCalculators,
  getTopCategories,
  hasUsageSignals,
  normalizeUsageState,
  recordCalculatorVisit,
  recordSearchUsage,
  sortCalculatorsByUsage,
} from "@/lib/usage";

const sampleCalculators: Calculator[] = [
  {
    slug: "mortgage",
    name: "Mortgage Calculator",
    category: "financial",
    blurb: "Mortgage planning.",
    tags: ["loan", "housing"],
  },
  {
    slug: "loan",
    name: "Loan Calculator",
    category: "financial",
    blurb: "Loan planning.",
    tags: ["loan"],
  },
  {
    slug: "bmi",
    name: "BMI Calculator",
    category: "fitness",
    blurb: "Body metrics.",
    tags: ["health"],
  },
];

describe("usage state helpers", () => {
  it("records calculator visits and preserves recent order", () => {
    let state = createEmptyUsageState();

    state = recordCalculatorVisit(state, sampleCalculators[0]);
    state = recordCalculatorVisit(state, sampleCalculators[1]);
    state = recordCalculatorVisit(state, sampleCalculators[0]);

    expect(state.recentSlugs).toEqual(["mortgage", "loan"]);
    expect(state.calculatorVisits.mortgage).toBe(2);
    expect(state.categoryAffinity.financial).toBe(9);
    expect(state.tagAffinity.loan).toBe(3);
  });

  it("records search usage and boosts category plus tag affinity", () => {
    const state = recordSearchUsage(createEmptyUsageState(), {
      query: "apr",
      categoryId: "financial",
      tag: "loan",
    });

    expect(state.searchTerms).toEqual(["apr"]);
    expect(state.categoryAffinity.financial).toBe(1);
    expect(state.tagAffinity.loan).toBe(2);
  });

  it("returns recent and recommended calculators from usage patterns", () => {
    let state = createEmptyUsageState();
    state = recordCalculatorVisit(state, sampleCalculators[0]);
    state = recordSearchUsage(state, { categoryId: "financial", tag: "loan" });

    const recent = getRecentCalculators(state, sampleCalculators);
    const recommended = getRecommendedCalculators(state, sampleCalculators, {
      excludeSlugs: recent.map((calculator) => calculator.slug),
    });

    expect(recent.map((calculator) => calculator.slug)).toEqual(["mortgage"]);
    expect(recommended.map((calculator) => calculator.slug)).toEqual(["loan"]);
  });

  it("sorts calculators by accumulated usage score", () => {
    let state = createEmptyUsageState();
    state = recordCalculatorVisit(state, sampleCalculators[2]);
    state = recordCalculatorVisit(state, sampleCalculators[0]);
    state = recordCalculatorVisit(state, sampleCalculators[0]);

    const sorted = sortCalculatorsByUsage(state, sampleCalculators);

    expect(sorted.map((calculator) => calculator.slug)).toEqual(["mortgage", "bmi", "loan"]);
  });

  it("normalizes broken persisted state safely", () => {
    const state = normalizeUsageState({
      recentSlugs: [" Mortgage ", "", "loan"],
      calculatorVisits: { Mortgage: 2.9, loan: -1, bmi: 1 },
      categoryAffinity: { financial: 2, ai: 1, invalid: 9 },
      tagAffinity: { Loan: 4, "": 3 },
      searchTerms: [" APR ", "APR", 42],
      updatedAt: "2026-03-19T00:00:00.000Z",
    });

    expect(state.recentSlugs).toEqual(["mortgage", "loan"]);
    expect(state.calculatorVisits).toEqual({ mortgage: 2, bmi: 1 });
    expect(state.categoryAffinity.financial).toBe(2);
    expect(state.categoryAffinity.ai).toBe(1);
    expect(state.tagAffinity).toEqual({ loan: 4 });
    expect(state.searchTerms).toEqual(["apr"]);
  });

  it("reports whether usage signals exist and exposes top categories", () => {
    let state = createEmptyUsageState();
    expect(hasUsageSignals(state)).toBe(false);

    state = recordSearchUsage(state, { categoryId: "fitness" });
    const topCategories = getTopCategories(state, [
      { id: "financial", name: "Financial", blurb: "", tone: "" },
      { id: "fitness", name: "Fitness", blurb: "", tone: "" },
    ]);

    expect(hasUsageSignals(state)).toBe(true);
    expect(topCategories.map((item) => item.category.id)).toEqual(["fitness"]);
  });
});

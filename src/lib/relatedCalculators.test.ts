import { describe, expect, it } from "vitest";
import { getCalculator } from "@/lib/data/calculators";
import { getRelatedCalculators, getRelatedContextLabel } from "./relatedCalculators";

describe("getRelatedCalculators", () => {
  it("returns curated same-intent links for mortgage", () => {
    const calculator = getCalculator("mortgage");
    expect(calculator).toBeTruthy();
    if (!calculator) return;

    const related = getRelatedCalculators(calculator, 4).map((item) => item.slug);

    expect(related).toEqual([
      "house-affordability",
      "refinance",
      "mortgage-points",
      "amortization",
    ]);
  });

  it("does not include duplicates or the source calculator", () => {
    const calculator = getCalculator("percentage");
    expect(calculator).toBeTruthy();
    if (!calculator) return;

    const related = getRelatedCalculators(calculator, 4).map((item) => item.slug);

    expect(related).not.toContain(calculator.slug);
    expect(new Set(related).size).toBe(related.length);
  });
});

describe("getRelatedContextLabel", () => {
  it("returns a readable intent label for age calculator", () => {
    const calculator = getCalculator("age");
    expect(calculator).toBeTruthy();
    if (!calculator) return;

    expect(getRelatedContextLabel(calculator)).toBe("date and time calculations");
  });
});

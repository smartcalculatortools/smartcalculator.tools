import { describe, expect, it } from "vitest";
import { calculators, categories } from "./calculators";

describe("calculator catalog", () => {
  it("uses unique slugs", () => {
    expect(new Set(calculators.map((calculator) => calculator.slug)).size).toBe(
      calculators.length
    );
  });

  it("reaches the expanded library target", () => {
    expect(calculators.length).toBeGreaterThanOrEqual(100);
  });

  it("keeps every category populated", () => {
    categories.forEach((category) => {
      expect(
        calculators.some((calculator) => calculator.category === category.id),
        category.id
      ).toBe(true);
    });
  });
});

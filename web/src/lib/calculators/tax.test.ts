import { describe, expect, it } from "vitest";
import { calculateIncomeTax } from "./tax";

describe("income tax", () => {
  it("calculates federal tax using brackets", () => {
    const result = calculateIncomeTax({
      year: 2024,
      filingStatus: "single",
      wages: 50000,
      otherIncome: 0,
      adjustments: 0,
      itemizedDeductions: 0,
      useStandardDeduction: true,
      taxCredits: 0,
    });

    expect(result.taxableIncome).toBe(35400);
    expect(result.taxAfterCredits).toBeCloseTo(4016, 0);
  });

  it("applies tax credits", () => {
    const result = calculateIncomeTax({
      year: 2024,
      filingStatus: "single",
      wages: 50000,
      otherIncome: 0,
      adjustments: 0,
      itemizedDeductions: 0,
      useStandardDeduction: true,
      taxCredits: 1000,
    });

    expect(result.taxAfterCredits).toBeCloseTo(3016, 0);
  });
});

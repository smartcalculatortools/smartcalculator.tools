import { describe, expect, it } from "vitest";
import { futureValue, interestEarned, totalContributions } from "./compound";

describe("compound interest", () => {
  it("calculates future value with contributions", () => {
    const fv = futureValue({
      principal: 10000,
      annualRate: 5,
      years: 10,
      contribution: 100,
      compoundsPerYear: 12,
    });

    expect(fv).toBeCloseTo(31998.32, 2);
  });

  it("handles zero interest rate", () => {
    const fv = futureValue({
      principal: 5000,
      annualRate: 0,
      years: 2,
      contribution: 200,
      compoundsPerYear: 12,
    });

    expect(fv).toBeCloseTo(5000 + 200 * 24, 6);
    expect(interestEarned({
      principal: 5000,
      annualRate: 0,
      years: 2,
      contribution: 200,
      compoundsPerYear: 12,
    })).toBeCloseTo(0, 6);
  });

  it("returns interest earned", () => {
    const inputs = {
      principal: 10000,
      annualRate: 5,
      years: 10,
      contribution: 100,
      compoundsPerYear: 12,
    };

    const interest = interestEarned(inputs);
    const contributions = totalContributions(inputs);

    expect(interest).toBeCloseTo(31998.32 - contributions, 2);
  });

  it("supports contribution timing", () => {
    const endValue = futureValue({
      principal: 1000,
      annualRate: 6,
      years: 1,
      contribution: 100,
      compoundsPerYear: 12,
      contributionTiming: "end",
    });
    const startValue = futureValue({
      principal: 1000,
      annualRate: 6,
      years: 1,
      contribution: 100,
      compoundsPerYear: 12,
      contributionTiming: "start",
    });

    expect(startValue).toBeGreaterThan(endValue);
  });
});

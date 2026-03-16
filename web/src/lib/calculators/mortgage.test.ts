import { describe, expect, it } from "vitest";
import { amortizationSchedule, amortizationSummary } from "./mortgage";

describe("mortgage amortization", () => {
  it("creates a schedule with payoff", () => {
    const { schedule } = amortizationSchedule({
      principal: 200000,
      annualRate: 6,
      termYears: 30,
      extraMonthly: 0,
    });

    expect(schedule.length).toBeGreaterThan(300);
    expect(schedule[schedule.length - 1].balance).toBe(0);
  });

  it("reduces term with extra payments", () => {
    const base = amortizationSchedule({
      principal: 200000,
      annualRate: 6,
      termYears: 30,
      extraMonthly: 0,
    });
    const extra = amortizationSchedule({
      principal: 200000,
      annualRate: 6,
      termYears: 30,
      extraMonthly: 200,
    });

    expect(extra.schedule.length).toBeLessThan(base.schedule.length);
  });

  it("summarizes totals", () => {
    const { schedule } = amortizationSchedule({
      principal: 150000,
      annualRate: 5,
      termYears: 15,
      extraMonthly: 0,
    });

    const summary = amortizationSummary(schedule);
    expect(summary.totalInterest).toBeGreaterThan(0);
    expect(summary.totalPrincipal).toBeGreaterThan(0);
  });
});

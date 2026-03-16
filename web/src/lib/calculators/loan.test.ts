import { describe, expect, it } from "vitest";
import {
  bondPresentValue,
  deferredAmountDue,
  monthlyPayment,
  totalInterest,
  totalPayment,
} from "./loan";

describe("loan calculations", () => {
  it("calculates monthly payment for a standard loan", () => {
    const payment = monthlyPayment({
      principal: 200000,
      annualRate: 6,
      termYears: 30,
    });

    expect(payment).toBeCloseTo(1199.10, 2);
  });

  it("handles zero interest loans", () => {
    const payment = monthlyPayment({
      principal: 12000,
      annualRate: 0,
      termYears: 1,
    });

    expect(payment).toBeCloseTo(1000, 6);
  });

  it("calculates total payment and interest", () => {
    const total = totalPayment({
      principal: 15000,
      annualRate: 4.5,
      termYears: 3,
    });
    const interest = totalInterest({
      principal: 15000,
      annualRate: 4.5,
      termYears: 3,
    });

    expect(total).toBeGreaterThan(15000);
    expect(interest).toBeGreaterThan(0);
  });

  it("calculates deferred amount due", () => {
    const due = deferredAmountDue({
      principal: 10000,
      annualRate: 0,
      termYears: 5,
      paymentsPerYear: 12,
      compoundsPerYear: 12,
    });
    expect(due).toBeCloseTo(10000, 6);
  });

  it("calculates bond present value", () => {
    const present = bondPresentValue({
      principal: 10000,
      annualRate: 0,
      termYears: 5,
      paymentsPerYear: 12,
      compoundsPerYear: 12,
    });
    expect(present).toBeCloseTo(10000, 6);
  });
});

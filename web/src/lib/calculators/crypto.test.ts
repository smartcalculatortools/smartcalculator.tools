import { describe, expect, it } from "vitest";
import { averageEntryPrice, breakEvenExitPrice, profitLoss } from "./crypto";

describe("crypto calculations", () => {
  it("calculates profit and ROI", () => {
    const result = profitLoss({
      buyPrice: 100,
      sellPrice: 120,
      quantity: 2,
      feePercent: 1,
    });

    expect(result.profit).toBeCloseTo(35.6, 2);
    expect(result.roi).toBeCloseTo(17.8, 1);
  });

  it("calculates average entry price", () => {
    const avg = averageEntryPrice([
      { price: 100, amount: 1 },
      { price: 120, amount: 1 },
      { price: 80, amount: 2 },
    ]);

    expect(avg.average).toBeCloseTo(95, 6);
  });

  it("calculates breakeven exit price", () => {
    const breakeven = breakEvenExitPrice({ entryPrice: 100, feePercent: 1 });
    expect(breakeven).toBeCloseTo(102.02, 2);
  });
});

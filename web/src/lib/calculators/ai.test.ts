import { describe, expect, it } from "vitest";
import { compareModels, tokenCost } from "./ai";

describe("ai cost calculations", () => {
  it("calculates token cost", () => {
    const cost = tokenCost({
      inputTokens: 100000,
      outputTokens: 50000,
      inputRate: 1.5,
      outputRate: 2.0,
    });

    expect(cost.total).toBeCloseTo(250, 6);
  });

  it("compares models", () => {
    const comparison = compareModels({
      inputTokens: 50000,
      outputTokens: 20000,
      modelA: { inputRate: 1.0, outputRate: 2.0 },
      modelB: { inputRate: 0.5, outputRate: 1.5 },
    });

    expect(comparison.costA).toBeGreaterThan(comparison.costB);
  });
});

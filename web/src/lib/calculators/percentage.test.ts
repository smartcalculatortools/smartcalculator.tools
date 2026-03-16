import { describe, expect, it } from "vitest";
import {
  baseFromPercent,
  percentChange,
  percentDifference,
  percentOf,
  percentageOf,
} from "./percentage";

describe("percentage calculations", () => {
  it("calculates percent of a number", () => {
    expect(percentageOf(25, 200)).toBe(50);
  });

  it("calculates percent share", () => {
    expect(percentOf(30, 120)).toBeCloseTo(25, 6);
  });

  it("calculates percent change", () => {
    expect(percentChange(80, 100)).toBeCloseTo(25, 6);
  });

  it("calculates percent difference", () => {
    expect(percentDifference(100, 120)).toBeCloseTo(18.1818, 3);
  });

  it("calculates base from percent", () => {
    expect(baseFromPercent(25, 50)).toBeCloseTo(200, 6);
  });
});

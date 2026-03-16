import { describe, expect, it } from "vitest";
import {
  addFractions,
  approximateFraction,
  divideFractions,
  fractionToDecimal,
  multiplyFractions,
  reduceFraction,
  subtractFractions,
} from "./fraction";

describe("fraction operations", () => {
  it("reduces fractions", () => {
    const reduced = reduceFraction({ numerator: 8, denominator: 12 });
    expect(reduced).toEqual({ numerator: 2, denominator: 3 });
  });

  it("adds fractions", () => {
    const result = addFractions(
      { numerator: 1, denominator: 4 },
      { numerator: 1, denominator: 4 }
    );
    expect(result).toEqual({ numerator: 1, denominator: 2 });
  });

  it("subtracts fractions", () => {
    const result = subtractFractions(
      { numerator: 3, denominator: 5 },
      { numerator: 1, denominator: 5 }
    );
    expect(result).toEqual({ numerator: 2, denominator: 5 });
  });

  it("multiplies fractions", () => {
    const result = multiplyFractions(
      { numerator: 2, denominator: 3 },
      { numerator: 3, denominator: 4 }
    );
    expect(result).toEqual({ numerator: 1, denominator: 2 });
  });

  it("divides fractions", () => {
    const result = divideFractions(
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 4 }
    );
    expect(result).toEqual({ numerator: 2, denominator: 1 });
  });

  it("converts to decimal", () => {
    const decimal = fractionToDecimal({ numerator: 1, denominator: 4 });
    expect(decimal).toBeCloseTo(0.25, 6);
  });

  it("approximates decimals", () => {
    const fraction = approximateFraction(0.125);
    expect(fraction).toEqual({ numerator: 1, denominator: 8 });
  });
});

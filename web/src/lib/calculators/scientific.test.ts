import { describe, expect, it } from "vitest";
import { evaluateExpression } from "./scientific";

describe("scientific evaluation", () => {
  it("evaluates arithmetic", () => {
    expect(evaluateExpression("2+2")).toBe(4);
  });

  it("evaluates trig and constants in radians", () => {
    const result = evaluateExpression("sin(pi/2)");
    expect(result).toBeCloseTo(1, 6);
  });

  it("evaluates trig in degrees", () => {
    const result = evaluateExpression("sin(90)", { angleMode: "deg" });
    expect(result).toBeCloseTo(1, 6);
  });

  it("supports ans variable", () => {
    const result = evaluateExpression("ans+5", { ans: 10 });
    expect(result).toBe(15);
  });

  it("rejects invalid input", () => {
    expect(evaluateExpression("alert(1)")).toBeNull();
  });
});

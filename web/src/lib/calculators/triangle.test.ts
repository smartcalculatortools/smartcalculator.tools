import { describe, expect, it } from "vitest";
import {
  triangleAnglesFromSides,
  triangleAreaFromSides,
  trianglePerimeter,
  triangleType,
} from "./triangle";

describe("triangle calculations", () => {
  it("calculates area using Heron's formula", () => {
    const area = triangleAreaFromSides(3, 4, 5);
    expect(area).toBeCloseTo(6, 6);
  });

  it("calculates perimeter", () => {
    const perimeter = trianglePerimeter(3, 4, 5);
    expect(perimeter).toBe(12);
  });

  it("returns null for invalid triangle", () => {
    expect(triangleAreaFromSides(1, 2, 10)).toBeNull();
  });

  it("calculates angles", () => {
    const angles = triangleAnglesFromSides(3, 4, 5);
    expect(angles?.angleC).toBeCloseTo(Math.PI / 2, 3);
  });

  it("classifies triangle type", () => {
    expect(triangleType(3, 3, 3)).toBe("Equilateral");
    expect(triangleType(3, 3, 4)).toBe("Isosceles");
    expect(triangleType(3, 4, 5)).toBe("Scalene");
  });
});

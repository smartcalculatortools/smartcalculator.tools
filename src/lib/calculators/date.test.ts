import { describe, expect, it } from "vitest";
import {
  addDays,
  businessDaysBetween,
  daysBetween,
  diffDateComponents,
} from "./date";

describe("date calculations", () => {
  it("calculates days between", () => {
    const start = new Date(Date.UTC(2024, 0, 1));
    const end = new Date(Date.UTC(2024, 0, 11));
    expect(daysBetween(start, end)).toBe(10);
  });

  it("adds days", () => {
    const start = new Date(Date.UTC(2024, 0, 1));
    const result = addDays(start, 10);
    expect(result.getUTCDate()).toBe(11);
  });

  it("diffs date components", () => {
    const start = new Date(Date.UTC(2020, 0, 15));
    const end = new Date(Date.UTC(2024, 2, 20));
    const diff = diffDateComponents(start, end);
    expect(diff.years).toBe(4);
    expect(diff.months).toBe(2);
  });

  it("counts business days", () => {
    const start = new Date(Date.UTC(2024, 0, 1)); // Monday
    const end = new Date(Date.UTC(2024, 0, 8)); // Monday
    expect(businessDaysBetween(start, end, false)).toBe(5);
    expect(businessDaysBetween(start, end, true)).toBe(6);
  });
});

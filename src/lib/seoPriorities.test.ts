import { describe, expect, it } from "vitest";
import {
  calculatorSeoPriorities,
  getCalculatorSeoPriority,
} from "@/lib/seoPriorities";

describe("SEO priorities", () => {
  it("tracks 20 priority calculator pages", () => {
    expect(calculatorSeoPriorities).toHaveLength(20);
  });

  it("returns a focused SEO override for mortgage", () => {
    expect(getCalculatorSeoPriority("mortgage")).toMatchObject({
      targetQuery: "mortgage calculator",
      title: expect.stringContaining("Mortgage Calculator"),
    });
  });
});

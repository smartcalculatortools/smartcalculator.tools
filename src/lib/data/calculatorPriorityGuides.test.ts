import { describe, expect, it } from "vitest";
import { calculatorSeoPriorities } from "@/lib/seoPriorities";
import {
  calculatorPriorityGuides,
  getCalculatorPriorityGuide,
} from "./calculatorPriorityGuides";

describe("calculator priority guides", () => {
  it("covers every SEO priority calculator", () => {
    calculatorSeoPriorities.forEach(({ slug }) => {
      expect(getCalculatorPriorityGuide(slug), slug).toBeTruthy();
    });
  });

  it("keeps each guide substantive", () => {
    calculatorPriorityGuides.forEach((guide) => {
      expect(guide.intro.length).toBeGreaterThanOrEqual(120);
      expect(guide.bestFor.length).toBeGreaterThanOrEqual(3);
      expect(guide.beforeYouStart.length).toBeGreaterThanOrEqual(3);

      guide.bestFor.forEach((item) => {
        expect(item.length).toBeGreaterThanOrEqual(18);
      });

      guide.beforeYouStart.forEach((item) => {
        expect(item.length).toBeGreaterThanOrEqual(18);
      });
    });
  });
});

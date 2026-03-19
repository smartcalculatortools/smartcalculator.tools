import { describe, expect, it } from "vitest";
import { calculators, categories } from "./calculators";
import { learningGuides } from "./learningGuides";

describe("learning guides coverage", () => {
  it("has one guide per category", () => {
    categories.forEach((category) => {
      const guide = learningGuides[category.id];
      expect(guide, `${category.id} guide`).toBeTruthy();
      expect(guide.title.length).toBeGreaterThanOrEqual(12);
      expect(guide.summary.length).toBeGreaterThanOrEqual(40);
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);
      expect(guide.faqs.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("uses valid starter calculators", () => {
    const calculatorSlugs = new Set(calculators.map((calculator) => calculator.slug));

    Object.values(learningGuides).forEach((guide) => {
      guide.starterSlugs.forEach((slug) => {
        expect(calculatorSlugs.has(slug), `${guide.categoryId}:${slug}`).toBe(true);
      });
    });
  });
});

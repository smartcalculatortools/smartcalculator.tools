import { describe, expect, it } from "vitest";
import { categories, calculators } from "./calculators";
import {
  getLearnArticlesByCalculator,
  learnArticles,
} from "./learnArticles";

describe("learn articles", () => {
  it("publishes between 4 and 8 long-tail learn articles", () => {
    expect(learnArticles.length).toBeGreaterThanOrEqual(4);
    expect(learnArticles.length).toBeLessThanOrEqual(8);
  });

  it("covers every category with at least one article", () => {
    const coveredCategories = new Set(learnArticles.map((article) => article.categoryId));
    categories.forEach((category) => {
      expect(coveredCategories.has(category.id), category.id).toBe(true);
    });
  });

  it("only references valid calculators", () => {
    const calculatorSlugs = new Set(calculators.map((calculator) => calculator.slug));

    learnArticles.forEach((article) => {
      expect(article.targetQuery.length).toBeGreaterThanOrEqual(12);
      expect(article.sections.length).toBeGreaterThanOrEqual(3);
      expect(article.faqs.length).toBeGreaterThanOrEqual(2);
      article.calculatorSlugs.forEach((slug) => {
        expect(calculatorSlugs.has(slug), `${article.slug}:${slug}`).toBe(true);
      });
    });
  });

  it("links articles back from calculators", () => {
    expect(getLearnArticlesByCalculator("mortgage").length).toBeGreaterThanOrEqual(1);
    expect(getLearnArticlesByCalculator("ai-token-cost").length).toBeGreaterThanOrEqual(1);
  });
});

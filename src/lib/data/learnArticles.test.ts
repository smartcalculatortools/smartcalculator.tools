import { describe, expect, it } from "vitest";
import { categories, calculators } from "./calculators";
import {
  getLearnArticlesByCalculator,
  getLearnArticlesByCategory,
  learnArticles,
} from "./learnArticles";

describe("learn articles", () => {
  it("publishes a large long-tail learn library", () => {
    expect(learnArticles.length).toBeGreaterThanOrEqual(20);
    expect(learnArticles.length).toBeLessThanOrEqual(40);
  });

  it("covers every category with multiple articles", () => {
    const coveredCategories = new Set(learnArticles.map((article) => article.categoryId));
    categories.forEach((category) => {
      expect(coveredCategories.has(category.id), category.id).toBe(true);
      expect(getLearnArticlesByCategory(category.id).length, category.id).toBeGreaterThanOrEqual(3);
    });
  });

  it("keeps article slugs unique per category", () => {
    const articleKeys = new Set<string>();

    learnArticles.forEach((article) => {
      const key = `${article.categoryId}:${article.slug}`;
      expect(articleKeys.has(key), key).toBe(false);
      articleKeys.add(key);
    });
  });

  it("only references valid calculators and keeps article quality bars", () => {
    const calculatorSlugs = new Set(calculators.map((calculator) => calculator.slug));

    learnArticles.forEach((article) => {
      expect(article.targetQuery.length).toBeGreaterThanOrEqual(12);
      expect(article.summary.length).toBeGreaterThanOrEqual(80);
      expect(article.intro.length).toBeGreaterThanOrEqual(120);
      expect(article.calculatorSlugs.length).toBeGreaterThanOrEqual(2);
      expect(article.sections.length).toBeGreaterThanOrEqual(3);
      expect(article.faqs.length).toBeGreaterThanOrEqual(2);
      article.sections.forEach((section) => {
        expect(section.body.length).toBeGreaterThanOrEqual(80);
        expect(section.bullets.length).toBeGreaterThanOrEqual(3);
      });
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

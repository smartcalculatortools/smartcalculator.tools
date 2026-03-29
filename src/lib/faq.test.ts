import { describe, expect, it } from "vitest";
import { getCalculator, categoryMap } from "@/lib/data/calculators";
import { calculatorContent } from "@/lib/data/calculatorContent";
import { buildFaqItems } from "./faq";

describe("buildFaqItems", () => {
  it("includes use-case and mistake FAQs for priority calculator pages", () => {
    const calculator = getCalculator("mortgage");
    expect(calculator).toBeTruthy();
    if (!calculator) return;

    const faqItems = buildFaqItems({
      calculator,
      category: categoryMap.get(calculator.category),
      content: calculatorContent[calculator.slug],
    });

    expect(
      faqItems.some((item) => item.question === "When should I use this calculator?")
    ).toBe(true);
    expect(
      faqItems.some((item) => item.question === "What mistakes should I avoid?")
    ).toBe(true);
  });
});

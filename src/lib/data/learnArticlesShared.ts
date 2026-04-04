import type { CategoryId } from "@/lib/data/calculators";

export type LearnArticleSection = {
  title: string;
  body: string;
  bullets: string[];
};

export type LearnArticleFaq = {
  question: string;
  answer: string;
};

export type LearnArticle = {
  categoryId: CategoryId;
  slug: string;
  targetQuery: string;
  title: string;
  summary: string;
  intro: string;
  calculatorSlugs: string[];
  sections: LearnArticleSection[];
  faqs: LearnArticleFaq[];
};

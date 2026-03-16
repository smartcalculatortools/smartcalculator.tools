import type { Calculator, Category } from "@/lib/data/calculators";
import type { CalculatorContent } from "@/lib/data/calculatorContent";

export type FaqItem = {
  question: string;
  answer: string;
};

type BuildFaqOptions = {
  calculator: Calculator;
  category?: Category;
  content?: CalculatorContent;
};

export function buildFaqItems({
  calculator,
  category,
  content,
}: BuildFaqOptions): FaqItem[] {
  const summary = content?.summary ?? calculator.blurb;
  const categoryLabel = category?.name ?? "this category";
  const inputList = content?.inputs?.slice(0, 3) ?? [];
  const outputList = content?.outputs?.slice(0, 3) ?? [];
  const inputHint = inputList.length
    ? `Typical inputs include ${inputList.join(", ")}.`
    : "Enter the values requested in the form, then adjust them to your case.";
  const outputHint = outputList.length
    ? `You will see outputs like ${outputList.join(", ")}.`
    : "Results update instantly as you change inputs.";
  const methodology = content
    ? 'We follow the formulas and assumptions outlined in the "How this calculator works" section.'
    : "We follow standard formulas for this type of calculator.";

  return [
    {
      question: `What does the ${calculator.name} do?`,
      answer: `${summary} It is part of our ${categoryLabel.toLowerCase()} toolkit.`,
    },
    {
      question: "What inputs do I need?",
      answer: inputHint,
    },
    {
      question: "How are the results calculated?",
      answer: `${methodology} ${outputHint}`,
    },
    {
      question: "Can I share or download the results?",
      answer:
        "Use the Copy link or Print buttons to share your results. If a table or chart appears, you can download the data as CSV.",
    },
    {
      question: "Is my data stored?",
      answer:
        "No. Calculations run in your browser and we do not store your inputs.",
    },
  ];
}

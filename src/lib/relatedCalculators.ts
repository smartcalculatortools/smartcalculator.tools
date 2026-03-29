import { calculators, getCalculator, type Calculator } from "@/lib/data/calculators";

const preferredRelatedSlugs: Record<string, string[]> = {
  mortgage: ["house-affordability", "refinance", "mortgage-points", "amortization"],
  loan: ["auto-loan", "student-loan", "amortization", "apr"],
  "compound-interest": ["investment", "future-value", "simple-interest", "inflation"],
  savings: ["cd", "future-value", "retirement", "budget"],
  "income-tax": ["take-home-pay", "hourly-to-salary", "salary-to-hourly", "debt-to-income"],
  bmi: ["body-fat", "healthy-weight", "ideal-weight", "waist-to-height"],
  calorie: ["tdee", "bmr", "macro-split", "protein-intake"],
  bmr: ["calorie", "tdee", "lean-body-mass", "macro-split"],
  "body-fat": ["bmi", "lean-body-mass", "waist-to-height", "healthy-weight"],
  scientific: ["exponent", "log", "quadratic", "pythagorean"],
  percentage: ["ratio-split", "discount", "markup", "commission"],
  fraction: ["gcf", "lcm", "percentage", "proportion"],
  triangle: ["pythagorean", "circle", "distance-between-points", "scientific"],
  age: ["date", "time-duration", "time", "hours"],
  date: ["age", "time-duration", "time", "hours"],
};

function calculateFallbackScore(source: Calculator, candidate: Calculator) {
  if (source.slug === candidate.slug) return -1;

  let score = 0;
  if (source.category === candidate.category) score += 40;

  const sharedTags = candidate.tags.filter((tag) => source.tags.includes(tag)).length;
  score += sharedTags * 15;

  const candidateText = `${candidate.name} ${candidate.blurb}`.toLowerCase();
  source.tags.forEach((tag) => {
    if (candidateText.includes(tag.toLowerCase())) {
      score += 4;
    }
  });

  return score;
}

export function getRelatedCalculators(calculator: Calculator, limit = 4) {
  const results: Calculator[] = [];
  const used = new Set<string>([calculator.slug]);

  preferredRelatedSlugs[calculator.slug]?.forEach((slug) => {
    const related = getCalculator(slug);
    if (!related || used.has(related.slug)) return;
    results.push(related);
    used.add(related.slug);
  });

  if (results.length >= limit) {
    return results.slice(0, limit);
  }

  const fallback = calculators
    .filter((candidate) => !used.has(candidate.slug))
    .map((candidate) => ({
      candidate,
      score: calculateFallbackScore(calculator, candidate),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.candidate.name.localeCompare(right.candidate.name);
    });

  for (const item of fallback) {
    if (results.length >= limit) break;
    results.push(item.candidate);
  }

  return results;
}

export function getRelatedContextLabel(calculator: Calculator) {
  switch (calculator.slug) {
    case "mortgage":
    case "house-affordability":
    case "refinance":
      return "home financing";
    case "loan":
    case "auto-loan":
    case "student-loan":
      return "loan planning";
    case "compound-interest":
    case "savings":
    case "investment":
    case "retirement":
      return "saving and growth planning";
    case "income-tax":
    case "take-home-pay":
      return "income and paycheck planning";
    case "bmi":
    case "calorie":
    case "bmr":
    case "body-fat":
      return "body metrics and calorie planning";
    case "scientific":
    case "percentage":
    case "fraction":
    case "triangle":
      return "everyday math work";
    case "age":
    case "date":
      return "date and time calculations";
    default:
      return `${calculator.category} workflows`;
  }
}

import type { Calculator, Category, CategoryId } from "@/lib/data/calculators";

const recentLimit = 6;
const searchLimit = 6;
const calculatorVisitWeight = 12;
const categoryWeight = 4;
const tagWeight = 2;
const recentWeight = 8;

export type UsageState = {
  recentSlugs: string[];
  calculatorVisits: Record<string, number>;
  categoryAffinity: Record<CategoryId, number>;
  tagAffinity: Record<string, number>;
  searchTerms: string[];
  updatedAt: string | null;
};

type SearchSignal = {
  query?: string;
  categoryId?: CategoryId | "all";
  tag?: string | "all";
};

type CalculatorQueryOptions = {
  categoryId?: CategoryId;
  limit?: number;
  excludeSlugs?: string[];
};

type CategoryUsage = {
  category: Category;
  score: number;
};

function emptyCategoryAffinity(): Record<CategoryId, number> {
  return {
    financial: 0,
    fitness: 0,
    math: 0,
    other: 0,
    crypto: 0,
    ai: 0,
  };
}

function normalizeCount(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.floor(value));
}

function normalizeStringList(value: unknown, limit: number) {
  if (!Array.isArray(value)) {
    return [];
  }

  const unique = new Set<string>();

  value.forEach((item) => {
    if (typeof item !== "string") {
      return;
    }

    const normalized = item.trim().toLowerCase();
    if (!normalized) {
      return;
    }

    unique.add(normalized);
  });

  return [...unique].slice(0, limit);
}

function incrementCount<T extends string>(
  record: Record<T, number>,
  key: T,
  amount: number
) {
  return {
    ...record,
    [key]: (record[key] ?? 0) + amount,
  };
}

function bumpRecent(items: string[], value: string, limit: number) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return items;
  }

  return [normalized, ...items.filter((item) => item !== normalized)].slice(0, limit);
}

function recentScore(state: UsageState, slug: string) {
  const index = state.recentSlugs.indexOf(slug);
  if (index === -1) {
    return 0;
  }

  return Math.max(0, (state.recentSlugs.length - index) * recentWeight);
}

function calculatorScore(state: UsageState, calculator: Calculator) {
  const visitScore = (state.calculatorVisits[calculator.slug] ?? 0) * calculatorVisitWeight;
  const categoryScore = (state.categoryAffinity[calculator.category] ?? 0) * categoryWeight;
  const tagsScore = calculator.tags.reduce(
    (sum, tag) => sum + (state.tagAffinity[tag.toLowerCase()] ?? 0) * tagWeight,
    0
  );

  return visitScore + categoryScore + tagsScore + recentScore(state, calculator.slug);
}

export function createEmptyUsageState(): UsageState {
  return {
    recentSlugs: [],
    calculatorVisits: {},
    categoryAffinity: emptyCategoryAffinity(),
    tagAffinity: {},
    searchTerms: [],
    updatedAt: null,
  };
}

export function normalizeUsageState(value: unknown): UsageState {
  const base = createEmptyUsageState();

  if (!value || typeof value !== "object") {
    return base;
  }

  const record = value as Record<string, unknown>;
  const rawCategoryAffinity =
    record.categoryAffinity && typeof record.categoryAffinity === "object"
      ? (record.categoryAffinity as Record<string, unknown>)
      : {};
  const rawCalculatorVisits =
    record.calculatorVisits && typeof record.calculatorVisits === "object"
      ? (record.calculatorVisits as Record<string, unknown>)
      : {};
  const rawTagAffinity =
    record.tagAffinity && typeof record.tagAffinity === "object"
      ? (record.tagAffinity as Record<string, unknown>)
      : {};

  const categoryAffinity = Object.keys(base.categoryAffinity).reduce(
    (result, key) => ({
      ...result,
      [key]: normalizeCount(rawCategoryAffinity[key]),
    }),
    base.categoryAffinity
  );

  const calculatorVisits = Object.entries(rawCalculatorVisits).reduce<Record<string, number>>(
    (result, [key, item]) => {
      const normalizedKey = key.trim().toLowerCase();
      const normalizedValue = normalizeCount(item);
      if (!normalizedKey || normalizedValue === 0) {
        return result;
      }

      return {
        ...result,
        [normalizedKey]: normalizedValue,
      };
    },
    {}
  );

  const tagAffinity = Object.entries(rawTagAffinity).reduce<Record<string, number>>(
    (result, [key, item]) => {
      const normalizedKey = key.trim().toLowerCase();
      const normalizedValue = normalizeCount(item);
      if (!normalizedKey || normalizedValue === 0) {
        return result;
      }

      return {
        ...result,
        [normalizedKey]: normalizedValue,
      };
    },
    {}
  );

  return {
    recentSlugs: normalizeStringList(record.recentSlugs, recentLimit),
    calculatorVisits,
    categoryAffinity,
    tagAffinity,
    searchTerms: normalizeStringList(record.searchTerms, searchLimit),
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : null,
  };
}

export function recordCalculatorVisit(state: UsageState, calculator: Calculator): UsageState {
  const nextState = normalizeUsageState(state);
  const nextTagAffinity = calculator.tags.reduce(
    (result, tag) => incrementCount(result, tag.toLowerCase(), 1),
    nextState.tagAffinity
  );

  return {
    ...nextState,
    recentSlugs: bumpRecent(nextState.recentSlugs, calculator.slug, recentLimit),
    calculatorVisits: incrementCount(nextState.calculatorVisits, calculator.slug, 1),
    categoryAffinity: incrementCount(nextState.categoryAffinity, calculator.category, 3),
    tagAffinity: nextTagAffinity,
    updatedAt: new Date().toISOString(),
  };
}

export function recordSearchUsage(state: UsageState, signal: SearchSignal): UsageState {
  const nextState = normalizeUsageState(state);
  const normalizedQuery = signal.query?.trim().toLowerCase() ?? "";
  const normalizedTag = signal.tag?.trim().toLowerCase() ?? "";
  const hasCategorySignal = !!signal.categoryId && signal.categoryId !== "all";
  const hasTagSignal = normalizedTag.length > 0 && normalizedTag !== "all";
  const hasQuerySignal = normalizedQuery.length >= 2;

  if (!hasCategorySignal && !hasTagSignal && !hasQuerySignal) {
    return nextState;
  }

  return {
    ...nextState,
    searchTerms: hasQuerySignal
      ? bumpRecent(nextState.searchTerms, normalizedQuery, searchLimit)
      : nextState.searchTerms,
    categoryAffinity: hasCategorySignal
      ? incrementCount(nextState.categoryAffinity, signal.categoryId as CategoryId, 1)
      : nextState.categoryAffinity,
    tagAffinity: hasTagSignal
      ? incrementCount(nextState.tagAffinity, normalizedTag, 2)
      : nextState.tagAffinity,
    updatedAt: new Date().toISOString(),
  };
}

export function getRecentCalculators(
  state: UsageState,
  calculatorList: Calculator[],
  options: CalculatorQueryOptions = {}
) {
  const nextState = normalizeUsageState(state);
  const calculatorMap = new Map(
    calculatorList.map((calculator) => [calculator.slug, calculator])
  );
  const limit = options.limit ?? 4;

  return nextState.recentSlugs
    .map((slug) => calculatorMap.get(slug))
    .filter((calculator): calculator is Calculator => {
      if (!calculator) {
        return false;
      }

      if (options.categoryId && calculator.category !== options.categoryId) {
        return false;
      }

      return true;
    })
    .slice(0, limit);
}

export function sortCalculatorsByUsage(state: UsageState, calculatorList: Calculator[]) {
  const nextState = normalizeUsageState(state);

  return calculatorList
    .map((calculator, index) => ({
      calculator,
      index,
      score: calculatorScore(nextState, calculator),
    }))
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.index - second.index;
    })
    .map((item) => item.calculator);
}

export function getRecommendedCalculators(
  state: UsageState,
  calculatorList: Calculator[],
  options: CalculatorQueryOptions = {}
) {
  const nextState = normalizeUsageState(state);
  const excluded = new Set(options.excludeSlugs?.map((slug) => slug.toLowerCase()) ?? []);
  const limit = options.limit ?? 4;

  return calculatorList
    .filter((calculator) => {
      if (options.categoryId && calculator.category !== options.categoryId) {
        return false;
      }

      return !excluded.has(calculator.slug);
    })
    .map((calculator) => ({
      calculator,
      score: calculatorScore(nextState, calculator),
    }))
    .filter((item) => item.score > 0)
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.calculator.name.localeCompare(second.calculator.name);
    })
    .slice(0, limit)
    .map((item) => item.calculator);
}

export function getTopCategories(
  state: UsageState,
  categoryList: Category[],
  limit = 3
): CategoryUsage[] {
  const nextState = normalizeUsageState(state);

  return categoryList
    .map((category) => ({
      category,
      score: nextState.categoryAffinity[category.id] ?? 0,
    }))
    .filter((item) => item.score > 0)
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.category.name.localeCompare(second.category.name);
    })
    .slice(0, limit);
}

export function hasUsageSignals(state: UsageState) {
  const nextState = normalizeUsageState(state);

  return (
    nextState.recentSlugs.length > 0 ||
    nextState.searchTerms.length > 0 ||
    Object.values(nextState.calculatorVisits).some((count) => count > 0) ||
    Object.values(nextState.categoryAffinity).some((count) => count > 0) ||
    Object.values(nextState.tagAffinity).some((count) => count > 0)
  );
}

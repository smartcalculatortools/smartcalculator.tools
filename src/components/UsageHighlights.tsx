"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import CalculatorCard from "@/components/CalculatorCard";
import { calculators, categories, categoryMap, type CategoryId } from "@/lib/data/calculators";
import {
  getRecentCalculators,
  getRecommendedCalculators,
  getTopCategories,
  hasUsageSignals,
  createEmptyUsageState,
} from "@/lib/usage";
import { readStoredUsageState, subscribeToUsageState } from "@/lib/usageStorage";

export default function UsageHighlights({
  categoryId,
}: {
  categoryId?: CategoryId;
}) {
  const usageState = useSyncExternalStore(
    subscribeToUsageState,
    readStoredUsageState,
    createEmptyUsageState
  );

  const recentCalculators = useMemo(
    () =>
      getRecentCalculators(usageState, calculators, {
        categoryId,
        limit: categoryId ? 3 : 4,
      }),
    [categoryId, usageState]
  );

  const recommendedCalculators = useMemo(
    () =>
      getRecommendedCalculators(usageState, calculators, {
        categoryId,
        excludeSlugs: recentCalculators.map((calculator) => calculator.slug),
        limit: 4,
      }),
    [categoryId, recentCalculators, usageState]
  );

  const topCategories = useMemo(() => {
    if (categoryId) {
      return [];
    }

    return getTopCategories(usageState, categories, 3);
  }, [categoryId, usageState]);

  if (!hasUsageSignals(usageState)) {
    return null;
  }

  if (
    recentCalculators.length === 0 &&
    recommendedCalculators.length === 0 &&
    topCategories.length === 0
  ) {
    return null;
  }

  const heading = categoryId
    ? `Keep moving in ${categoryMap.get(categoryId)?.name ?? "this category"}`
    : "Based on your recent use";
  const description = categoryId
    ? "We keep lightweight usage signals in your browser so the category can surface the calculators you return to most."
    : "We keep lightweight usage signals in your browser so the homepage can surface recent calculators and smarter next picks.";

  return (
    <section className="section-pad pt-0 cv-auto">
      <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-stroke bg-surface p-6 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted">Personalized</p>
            <h2 className="mt-2 font-display text-3xl text-ink">{heading}</h2>
          </div>
          <p className="max-w-2xl text-sm text-muted">{description}</p>
        </div>

        {topCategories.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Frequent categories</h3>
              <span className="text-xs text-muted">Local to this browser</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {topCategories.map((item) => (
                <Link
                  key={item.category.id}
                  href={`/category/${item.category.id}`}
                  className="rounded-full border border-stroke bg-white/70 px-4 py-2 text-sm text-ink transition hover:border-ink"
                >
                  {item.category.name}
                  <span className="ml-2 text-xs text-muted">{item.score} signals</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recentCalculators.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Recent calculators</h3>
              <span className="text-xs text-muted">Fast return path</span>
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {recentCalculators.map((calculator) => (
                <CalculatorCard key={calculator.slug} calculator={calculator} />
              ))}
            </div>
          </div>
        )}

        {recommendedCalculators.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Suggested next</h3>
              <span className="text-xs text-muted">Ranked from your recent patterns</span>
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {recommendedCalculators.map((calculator) => (
                <CalculatorCard key={calculator.slug} calculator={calculator} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

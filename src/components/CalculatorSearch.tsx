"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import CalculatorCard from "@/components/CalculatorCard";
import {
  calculators as allCalculators,
  categories,
  categoryMap,
  type Calculator,
  type CategoryId,
} from "@/lib/data/calculators";
import {
  getRecentCalculators,
  recordSearchUsage,
  sortCalculatorsByUsage,
  createEmptyUsageState,
} from "@/lib/usage";
import {
  readStoredUsageState,
  subscribeToUsageState,
  updateStoredUsageState,
} from "@/lib/usageStorage";

type CalculatorSearchProps = {
  calculators?: Calculator[];
  layout?: "list" | "grid";
  title?: string;
  description?: string;
  placeholder?: string;
  lockedCategoryId?: CategoryId;
  maxResults?: number;
};

function buildSearchText(calculator: Calculator) {
  return [
    calculator.name,
    calculator.blurb,
    calculator.tags.join(" "),
    calculator.category,
    categoryMap.get(calculator.category)?.name ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export default function CalculatorSearch({
  calculators = allCalculators,
  layout = "list",
  title = "Find the right calculator",
  description = "Type a topic and narrow the list instantly.",
  placeholder = "Search calculators",
  lockedCategoryId,
  maxResults = 8,
}: CalculatorSearchProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const recordedSearchRef = useRef<string>("");
  const deferredQuery = useDeferredValue(query);
  const activeCategory = lockedCategoryId ?? selectedCategory;
  const usageState = useSyncExternalStore(
    subscribeToUsageState,
    readStoredUsageState,
    createEmptyUsageState
  );

  const categoryFiltered = useMemo(() => {
    if (activeCategory === "all") return calculators;
    return calculators.filter((calculator) => calculator.category === activeCategory);
  }, [activeCategory, calculators]);

  const tagOptions = useMemo(() => {
    const tagCounts = new Map<string, number>();

    categoryFiltered.forEach((calculator) => {
      calculator.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
    });

    return [...tagCounts.entries()]
      .sort((first, second) => {
        if (second[1] !== first[1]) return second[1] - first[1];
        return first[0].localeCompare(second[0]);
      })
      .map(([tag]) => tag)
      .slice(0, 8);
  }, [categoryFiltered]);

  const activeTag = tagOptions.includes(selectedTag) ? selectedTag : "all";

  const filteredResults = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    const results = categoryFiltered.filter((calculator) => {
      if (activeTag !== "all" && !calculator.tags.includes(activeTag)) {
        return false;
      }

      if (!normalized) return true;
      return buildSearchText(calculator).includes(normalized);
    });

    if (normalized || activeTag !== "all") {
      return results;
    }

    return sortCalculatorsByUsage(usageState, results);
  }, [activeTag, categoryFiltered, deferredQuery, usageState]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    activeTag !== "all" ||
    (!lockedCategoryId && activeCategory !== "all");

  const visibleResults = useMemo(() => {
    if (layout === "grid") return filteredResults;
    const resultLimit = hasActiveFilters ? Math.max(maxResults, 10) : maxResults;
    return filteredResults.slice(0, resultLimit);
  }, [filteredResults, hasActiveFilters, layout, maxResults]);

  const recentSlugs = useMemo(
    () => new Set(getRecentCalculators(usageState, calculators, { limit: 6 }).map((item) => item.slug)),
    [calculators, usageState]
  );

  const showPersonalizedHint =
    deferredQuery.trim().length === 0 &&
    activeTag === "all" &&
    [...recentSlugs].some((slug) => visibleResults.some((calculator) => calculator.slug === slug));

  const countLabel =
    filteredResults.length === 1
      ? "1 calculator found"
      : `${filteredResults.length} calculators found`;

  const defaultCategory = lockedCategoryId ?? "all";

  function clearFilters() {
    setQuery("");
    setSelectedTag("all");
    setSelectedCategory(defaultCategory);
  }

  useEffect(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const shouldTrack =
      normalizedQuery.length >= 2 ||
      activeTag !== "all" ||
      (!lockedCategoryId && activeCategory !== "all");

    if (!shouldTrack) {
      return;
    }

    const trackingKey = `${normalizedQuery}|${activeCategory}|${activeTag}`;
    if (recordedSearchRef.current === trackingKey) {
      return;
    }

    recordedSearchRef.current = trackingKey;
    updateStoredUsageState((state) =>
      recordSearchUsage(state, {
        query: normalizedQuery,
        categoryId: activeCategory,
        tag: activeTag,
      })
    );
  }, [activeCategory, activeTag, deferredQuery, lockedCategoryId]);

  return (
    <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">Search</p>
      <h2 className="mt-3 font-display text-2xl text-ink">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <div className="mt-5">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
        />
      </div>

      {!lockedCategoryId && (
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Category</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              label="All"
              active={activeCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            />
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                label={category.name}
                active={activeCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              />
            ))}
          </div>
        </div>
      )}

      {tagOptions.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Filter by tag</p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-ink underline"
              >
                Clear filters
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <FilterChip
              label="All tags"
              active={activeTag === "all"}
              onClick={() => setSelectedTag("all")}
            />
            {tagOptions.map((tag) => (
              <FilterChip
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() => setSelectedTag(tag)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{countLabel}</p>
        {layout === "list" && filteredResults.length > visibleResults.length && (
          <p className="text-xs text-muted">
            Showing the first {visibleResults.length} matches
          </p>
        )}
      </div>
      {showPersonalizedHint && (
        <p className="mt-2 text-xs text-muted">
          Recently used calculators float to the top when no keyword is active.
        </p>
      )}

      {visibleResults.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-stroke bg-white/50 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-ink">No calculators match this filter</p>
          <p className="mt-2 text-xs text-muted">
            Try another keyword or clear the active filters.
          </p>
        </div>
      ) : layout === "grid" ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleResults.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visibleResults.map((calculator) => (
            <Link
              key={calculator.slug}
              href={`/calc/${calculator.slug}`}
              className="flex items-center justify-between rounded-2xl border border-stroke/80 bg-white/70 px-4 py-3 text-sm text-ink transition hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{calculator.name}</p>
                  {recentSlugs.has(calculator.slug) && (
                    <span className="rounded-full border border-stroke px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-muted">
                      Recent
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted">
                  {categoryMap.get(calculator.category)?.name}
                </p>
              </div>
              <span className="text-xs text-muted">Open</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? "border-ink bg-ink text-white"
          : "border-stroke bg-white/70 text-muted hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

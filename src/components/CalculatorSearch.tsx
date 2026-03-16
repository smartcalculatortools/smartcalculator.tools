"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { calculators, categoryMap } from "@/lib/data/calculators";

export default function CalculatorSearch() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) return calculators.slice(0, 8);

    return calculators
      .filter((calc) => {
        const haystack = [
          calc.name,
          calc.blurb,
          calc.tags.join(" "),
          calc.category,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 10);
  }, [deferredQuery]);

  return (
    <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">Search</p>
      <h2 className="mt-3 font-display text-2xl text-ink">
        Find the right calculator
      </h2>
      <p className="mt-2 text-sm text-muted">
        Type a topic and jump into a calculator instantly.
      </p>
      <div className="mt-5">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search calculators"
          className="w-full rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
        />
      </div>
      <div className="mt-6 space-y-3">
        {results.map((calc) => (
          <Link
            key={calc.slug}
            href={`/calc/${calc.slug}`}
            className="flex items-center justify-between rounded-2xl border border-stroke/80 bg-white/70 px-4 py-3 text-sm text-ink transition hover:-translate-y-0.5"
          >
            <div>
              <p className="text-sm font-semibold text-ink">{calc.name}</p>
              <p className="text-xs text-muted">
                {categoryMap.get(calc.category)?.name}
              </p>
            </div>
            <span className="text-xs text-muted">Open</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

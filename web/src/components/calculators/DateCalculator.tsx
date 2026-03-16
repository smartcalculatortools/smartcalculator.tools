"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import {
  addDays,
  addBusinessDays,
  businessDaysBetween,
  daysBetween,
  diffDateComponents,
  weekdayWeekendCounts,
} from "@/lib/calculators/date";
import type { CalculatorInsights } from "@/lib/insights";

function toDate(value: string) {
  return value ? new Date(`${value}T00:00:00Z`) : new Date();
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function DateCalculator({ onInsightsChange }: CalculatorProps) {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-02-01");
  const [deltaDays, setDeltaDays] = useState(30);
  const [includeEnd, setIncludeEnd] = useState(false);
  const [useBusinessDays, setUseBusinessDays] = useState(false);

  const daysDiff = useMemo(() => {
    return daysBetween(toDate(startDate), toDate(endDate));
  }, [startDate, endDate]);

  const breakdown = useMemo(() => {
    return diffDateComponents(toDate(startDate), toDate(endDate));
  }, [startDate, endDate]);

  const totalDays = useMemo(() => {
    const absolute = Math.abs(daysDiff);
    if (absolute === 0) return includeEnd ? 1 : 0;
    return includeEnd ? absolute + 1 : absolute;
  }, [daysDiff, includeEnd]);

  const businessDays = useMemo(() => {
    return businessDaysBetween(
      toDate(startDate),
      toDate(endDate),
      includeEnd
    );
  }, [startDate, endDate, includeEnd]);

  const weekdayCounts = useMemo(() => {
    return weekdayWeekendCounts(
      toDate(startDate),
      toDate(endDate),
      includeEnd
    );
  }, [startDate, endDate, includeEnd]);

  const weeks = useMemo(() => Math.floor(totalDays / 7), [totalDays]);
  const remainingDays = useMemo(() => totalDays % 7, [totalDays]);

  const adjustedDate = useMemo(() => {
    const base = toDate(startDate);
    const adjusted = useBusinessDays
      ? addBusinessDays(base, deltaDays)
      : addDays(base, deltaDays);
    return formatDate(adjusted);
  }, [startDate, deltaDays, useBusinessDays]);

  const insights = useMemo<CalculatorInsights>(() => {
    const rows = [
      ["Start date", startDate],
      ["End date", endDate],
      ["Years", formatNumber(breakdown.years)],
      ["Months", formatNumber(breakdown.months)],
      ["Days", formatNumber(breakdown.days)],
      ["Total days", formatNumber(totalDays)],
      ["Business days", formatNumber(businessDays)],
      ["Weekdays", formatNumber(weekdayCounts.weekdays)],
      ["Weekend days", formatNumber(weekdayCounts.weekends)],
      ["Weeks", `${formatNumber(weeks)} w ${formatNumber(remainingDays)} d`],
      ["Delta days", formatNumber(deltaDays)],
      ["Adjusted date", adjustedDate],
      ["Adjusted mode", useBusinessDays ? "Business days" : "Calendar days"],
    ];

    const chartPoints = [
      { label: "Total", value: totalDays },
      { label: "Business", value: businessDays },
      { label: "Delta", value: deltaDays },
    ];

    return {
      table: {
        title: "Date summary",
        columns: ["Field", "Value"],
        rows,
        note: "Dates are normalized to UTC midnight.",
      },
      chart: {
        title: "Day counts comparison",
        xLabel: "Scenario",
        yLabel: "Days",
        format: "number",
        points: chartPoints,
        note: "Use the delta to add or subtract days from a base date.",
      },
    };
  }, [
    adjustedDate,
    breakdown.days,
    breakdown.months,
    breakdown.years,
    businessDays,
    deltaDays,
    endDate,
    remainingDays,
    startDate,
    totalDays,
    weekdayCounts.weekdays,
    weekdayCounts.weekends,
    weeks,
    useBusinessDays,
  ]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Days between dates</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-muted">
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              End date
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(event) => setIncludeEnd(event.target.checked)}
              className="h-4 w-4"
            />
            Include end date in totals
          </label>
        </section>

        <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Add or subtract days</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-muted">
              Base date
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Days (+/-)
              <input
                type="number"
                value={deltaDays}
                onChange={(event) => setDeltaDays(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={useBusinessDays}
              onChange={(event) => setUseBusinessDays(event.target.checked)}
              className="h-4 w-4"
            />
            Use business days (skip weekends)
          </label>
        </section>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <div className="mt-6 grid gap-4">
          <ResultCard label="Years" value={`${formatNumber(breakdown.years)}`} />
          <ResultCard label="Months" value={`${formatNumber(breakdown.months)}`} />
          <ResultCard label="Days" value={`${formatNumber(breakdown.days)}`} />
          <ResultCard label="Total days" value={`${formatNumber(totalDays)}`} />
          <ResultCard label="Business days" value={`${formatNumber(businessDays)}`} />
          <ResultCard label="Weekdays" value={`${formatNumber(weekdayCounts.weekdays)}`} />
          <ResultCard label="Weekend days" value={`${formatNumber(weekdayCounts.weekends)}`} />
          <ResultCard label="Weeks" value={`${formatNumber(weeks)}w ${formatNumber(remainingDays)}d`} />
          <ResultCard label="Adjusted date" value={adjustedDate} />
        </div>
        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Day breakdown
          </p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Count</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Total days", value: totalDays },
                  { label: "Weekdays", value: weekdayCounts.weekdays },
                  { label: "Weekend days", value: weekdayCounts.weekends },
                  { label: "Business days", value: businessDays },
                ].map((row) => (
                  <tr key={row.label} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.label}</td>
                    <td className="px-4 py-2">{formatNumber(row.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            Weekdays exclude Saturday and Sunday.
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

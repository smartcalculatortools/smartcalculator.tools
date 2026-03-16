"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import { daysBetween, diffDateComponents } from "@/lib/calculators/date";
import type { CalculatorInsights } from "@/lib/insights";

function toDate(value: string) {
  return value ? new Date(`${value}T00:00:00Z`) : new Date();
}

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function AgeCalculator({ onInsightsChange }: CalculatorProps) {
  const today = new Date();
  const [birthDate, setBirthDate] = useState("1995-05-20");
  const [referenceDate, setReferenceDate] = useState(today.toISOString().slice(0, 10));
  const [targetAge, setTargetAge] = useState(65);

  const results = useMemo(() => {
    const birth = toDate(birthDate);
    const reference = toDate(referenceDate);
    const diff = diffDateComponents(birth, reference);
    const totalDays = Math.abs(daysBetween(birth, reference));
    const totalMonths = diff.years * 12 + diff.months;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    const referenceYear = reference.getUTCFullYear();
    const birthMonth = birth.getUTCMonth();
    const birthDay = birth.getUTCDate();
    let nextBirthday = new Date(Date.UTC(referenceYear, birthMonth, birthDay));
    if (nextBirthday < reference) {
      nextBirthday = new Date(Date.UTC(referenceYear + 1, birthMonth, birthDay));
    }
    if (nextBirthday.getUTCMonth() !== birthMonth) {
      nextBirthday = new Date(Date.UTC(nextBirthday.getUTCFullYear(), birthMonth, 28));
    }
    const daysUntilBirthday = Math.max(
      0,
      daysBetween(reference, nextBirthday)
    );

    const targetAgeSafe = Math.max(0, Math.round(targetAge));
    let targetDate = new Date(
      Date.UTC(
        birth.getUTCFullYear() + targetAgeSafe,
        birth.getUTCMonth(),
        birth.getUTCDate()
      )
    );
    if (targetDate.getUTCMonth() !== birthMonth) {
      targetDate = new Date(Date.UTC(targetDate.getUTCFullYear(), birthMonth, 28));
    }
    const daysUntilTarget = daysBetween(reference, targetDate);

    return {
      birth,
      reference,
      diff,
      totalDays,
      totalMonths,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday,
      daysUntilBirthday,
      targetDate,
      daysUntilTarget,
    };
  }, [birthDate, referenceDate, targetAge]);

  const weekdayLabels = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long" };
    return {
      birth: results.birth.toLocaleDateString("en-US", options),
      reference: results.reference.toLocaleDateString("en-US", options),
      nextBirthday: results.nextBirthday.toLocaleDateString("en-US", options),
    };
  }, [results.birth, results.nextBirthday, results.reference]);

  const milestoneRows = useMemo(() => {
    const baseAge =
      results.daysUntilBirthday === 0 ? results.diff.years : results.diff.years + 1;
    return Array.from({ length: 5 }).map((_, index) => {
      const age = baseAge + index;
      const date = new Date(results.nextBirthday);
      date.setUTCFullYear(results.nextBirthday.getUTCFullYear() + index);
      const daysUntil = Math.max(0, daysBetween(results.reference, date));
      return [
        `${formatNumber(age)} years`,
        date.toISOString().slice(0, 10),
        formatNumber(daysUntil),
      ];
    });
  }, [
    results.daysUntilBirthday,
    results.diff.years,
    results.nextBirthday,
    results.reference,
  ]);

  const insights = useMemo<CalculatorInsights>(() => {
    const baseYears = Math.max(0, results.diff.years);
    const yearOptions = Array.from(
      new Set([
        Math.max(1, baseYears - 5),
        Math.max(1, baseYears),
        Math.max(1, baseYears + 5),
      ])
    ).sort((a, b) => a - b);

    const rows = [
      ["Years", formatNumber(results.diff.years)],
      ["Months", formatNumber(results.diff.months)],
      ["Days", formatNumber(results.diff.days)],
      ["Total months", formatNumber(results.totalMonths)],
      ["Total weeks", formatNumber(results.totalWeeks)],
      ["Total days", formatNumber(results.totalDays)],
      ["Total hours", formatNumber(results.totalHours)],
      ["Total minutes", formatNumber(results.totalMinutes)],
      ["Total seconds", formatNumber(results.totalSeconds)],
      [
        "Next birthday",
        results.nextBirthday.toISOString().slice(0, 10),
      ],
      ["Days until birthday", formatNumber(results.daysUntilBirthday)],
    ];

    const chartPoints = yearOptions.map((year) => ({
      label: `${formatNumber(year)}y`,
      value: Math.round(year * 365.25),
    }));

    return {
      table: {
        title: "Age breakdown",
        columns: ["Unit", "Value"],
        rows,
        note: "Total days are based on calendar differences.",
      },
      chart: {
        title: "Approximate days by age",
        xLabel: "Age",
        yLabel: "Total days",
        format: "number",
        points: chartPoints,
        note: "Uses 365.25 days per year as an approximation.",
      },
    };
  }, [
    results.daysUntilBirthday,
    results.diff.days,
    results.diff.months,
    results.diff.years,
    results.nextBirthday,
    results.totalDays,
    results.totalHours,
    results.totalMinutes,
    results.totalMonths,
    results.totalSeconds,
    results.totalWeeks,
  ]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Calculate precise age between two dates.
        </p>
        <div className="mt-6 space-y-4">
          <label className="grid gap-2 text-sm text-muted">
            Date of birth
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Reference date
            <input
              type="date"
              value={referenceDate}
              onChange={(event) => setReferenceDate(event.target.value)}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Target age
            <input
              type="number"
              min={0}
              step={1}
              value={targetAge}
              onChange={(event) => setTargetAge(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          Breakdown of age plus total days.
        </p>
        <div className="mt-6 grid gap-4">
          <ResultCard label="Years" value={`${formatNumber(results.diff.years)}`} />
          <ResultCard label="Months" value={`${formatNumber(results.diff.months)}`} />
          <ResultCard label="Days" value={`${formatNumber(results.diff.days)}`} />
          <ResultCard label="Total days" value={`${formatNumber(results.totalDays)}`} />
          <ResultCard
            label="Total weeks"
            value={`${formatNumber(results.totalWeeks)}`}
          />
          <ResultCard
            label="Total hours"
            value={`${formatNumber(results.totalHours)}`}
          />
          <ResultCard label="Birth weekday" value={weekdayLabels.birth} />
          <ResultCard label="Reference weekday" value={weekdayLabels.reference} />
          <ResultCard label="Next birthday weekday" value={weekdayLabels.nextBirthday} />
          <ResultCard
            label="Next birthday"
            value={results.nextBirthday.toISOString().slice(0, 10)}
          />
          <ResultCard
            label="Days until birthday"
            value={`${formatNumber(results.daysUntilBirthday)}`}
          />
          <ResultCard
            label={`Date at age ${formatNumber(targetAge)}`}
            value={results.targetDate.toISOString().slice(0, 10)}
          />
          <ResultCard
            label="Days until target age"
            value={`${formatNumber(results.daysUntilTarget)}`}
          />
        </div>
        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Upcoming birthdays
          </p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Age</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Days away</th>
                </tr>
              </thead>
              <tbody>
                {milestoneRows.map((row) => (
                  <tr key={row[0]} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                    <td className="px-4 py-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            Dates are calculated in UTC to avoid timezone drift.
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

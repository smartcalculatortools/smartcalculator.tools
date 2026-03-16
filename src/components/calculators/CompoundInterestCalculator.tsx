"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import { buildMonthlySchedule } from "@/lib/calculators/compound";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function CompoundInterestCalculator({ onInsightsChange }: CalculatorProps) {
  const [principal, setPrincipal] = useState(10000);
  const [annualRate, setAnnualRate] = useState(5);
  const [years, setYears] = useState(10);
  const [months, setMonths] = useState(0);
  const [contribution, setContribution] = useState(100);
  const [contributionFrequency, setContributionFrequency] = useState(12);
  const [compoundsPerYear, setCompoundsPerYear] = useState(12);
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [contributionTiming, setContributionTiming] = useState<"end" | "start">(
    "end"
  );
  const [startMonth, setStartMonth] = useState(3);
  const [startYear, setStartYear] = useState(2026);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  const totalYears = useMemo(() => {
    return Math.max(0, years) + Math.max(0, months) / 12;
  }, [months, years]);

  const compoundingLabel = useMemo(() => {
    return compoundsPerYear === 0
      ? "continuous"
      : `${formatNumber(compoundsPerYear)}x/year`;
  }, [compoundsPerYear]);

  const startDate = useMemo(() => {
    return new Date(
      Math.max(1900, Math.round(startYear)),
      Math.min(11, Math.max(0, Math.round(startMonth) - 1)),
      1
    );
  }, [startMonth, startYear]);

  const scheduleData = useMemo(() => {
    return buildMonthlySchedule({
      principal,
      annualRate,
      years,
      months,
      contribution,
      contributionFrequency,
      contributionTiming,
      compoundsPerYear,
      annualIncrease,
      startDate,
    });
  }, [
    principal,
    annualRate,
    years,
    months,
    contribution,
    contributionFrequency,
    contributionTiming,
    compoundsPerYear,
    annualIncrease,
    startDate,
  ]);

  const monthlyRows = useMemo(() => {
    return scheduleData.schedule.map((row) => ({
      key: `${row.date.getFullYear()}-${row.date.getMonth()}`,
      year: row.date.getFullYear(),
      label: row.date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      contribution: row.contribution,
      interest: row.interest,
      balance: row.balance,
    }));
  }, [scheduleData.schedule]);

  const yearlyRows = useMemo(() => {
    const map = new Map<
      number,
      { year: number; contribution: number; interest: number; balance: number }
    >();

    monthlyRows.forEach((row) => {
      const year = row.year;
      const entry = map.get(year);
      if (!entry) {
        map.set(year, {
          year,
          contribution: row.contribution,
          interest: row.interest,
          balance: row.balance,
        });
      } else {
        entry.contribution += row.contribution;
        entry.interest += row.interest;
        entry.balance = row.balance;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.year - b.year);
  }, [monthlyRows]);

  const results = useMemo(() => {
    return {
      futureValue: scheduleData.endingBalance,
      interest: scheduleData.interestEarned,
      contributions: scheduleData.totalContrib,
    };
  }, [scheduleData.endingBalance, scheduleData.interestEarned, scheduleData.totalContrib]);

  const compositionRows = useMemo(
    () => [
      { label: "Starting balance", value: principal },
      { label: "Total contributions", value: results.contributions },
      { label: "Interest earned", value: results.interest },
      { label: "Ending balance", value: results.futureValue },
    ],
    [principal, results.contributions, results.futureValue, results.interest]
  );

  const insights = useMemo<CalculatorInsights>(() => {
    const safeYears = Math.max(1, Math.round(totalYears));
    const midYear = Math.max(1, Math.round(safeYears / 2));
    const timeline = Array.from(new Set([1, midYear, safeYears])).sort(
      (a, b) => a - b
    );

    const rows = timeline.map((year) => {
      const snapshot = buildMonthlySchedule({
        principal,
        annualRate,
        years: year,
        months: 0,
        contribution,
        contributionFrequency,
        contributionTiming,
        compoundsPerYear,
        annualIncrease,
        startDate,
      });
      return [
        `${formatNumber(year)} years`,
        formatCurrency(snapshot.endingBalance, currency),
        formatCurrency(snapshot.interestEarned, currency),
      ];
    });

    const chartPoints = timeline.map((year) => {
      const snapshot = buildMonthlySchedule({
        principal,
        annualRate,
        years: year,
        months: 0,
        contribution,
        contributionFrequency,
        contributionTiming,
        compoundsPerYear,
        annualIncrease,
        startDate,
      });
      return {
        label: `${formatNumber(year)}y`,
        value: snapshot.endingBalance,
      };
    });

    return {
      table: {
        title: "Balance milestones",
        columns: ["Year", "Balance", "Interest earned"],
        rows,
        note: `Compounds ${compoundingLabel} with ${formatNumber(
          contributionFrequency
        )}x/year contributions (${contributionTiming})${
          annualIncrease > 0 ? ` and ${formatNumber(annualIncrease)}% yearly increases` : ""
        }.`,
      },
      chart: {
        title: "Balance growth over time",
        xLabel: "Year",
        yLabel: "Future value",
        format: "currency",
        points: chartPoints,
        note: `Compounding frequency: ${compoundingLabel}.`,
      },
    };
  }, [
    annualRate,
    contribution,
    contributionFrequency,
    contributionTiming,
    principal,
    totalYears,
    compoundingLabel,
    compoundsPerYear,
    annualIncrease,
    startDate,
  ]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Inputs</h2>
          <p className="mt-2 text-sm text-muted">
            See how compounding and monthly contributions build over time.
          </p>
          <div className="mt-6 space-y-4">
            <label className="grid gap-2 text-sm text-muted">
              Starting balance
              <input
                type="number"
                min={0}
                step={500}
                value={principal}
                onChange={(event) => setPrincipal(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
          <label className="grid gap-2 text-sm text-muted">
            Contribution amount
            <input
              type="number"
              min={0}
              step={50}
              value={contribution}
              onChange={(event) => setContribution(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Annual contribution increase (%)
            <input
              type="number"
              min={0}
              step={0.1}
              value={annualIncrease}
              onChange={(event) => setAnnualIncrease(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
            <label className="grid gap-2 text-sm text-muted">
              Contribution frequency
              <select
                value={contributionFrequency}
                onChange={(event) => setContributionFrequency(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              >
                <option value={12}>Monthly</option>
                <option value={4}>Quarterly</option>
                <option value={1}>Annually</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Contribution timing
              <select
                value={contributionTiming}
                onChange={(event) =>
                  setContributionTiming(event.target.value as "end" | "start")
                }
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              >
                <option value="end">End of period</option>
                <option value="start">Start of period</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Compounding frequency
              <select
                value={compoundsPerYear}
                onChange={(event) => setCompoundsPerYear(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              >
                <option value={1}>Annually</option>
                <option value={2}>Semiannually</option>
                <option value={4}>Quarterly</option>
                <option value={12}>Monthly</option>
                <option value={52}>Weekly</option>
                <option value={365}>Daily</option>
                <option value={0}>Continuous</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Interest rate (annual %)
              <input
                type="number"
                min={0}
                step={0.01}
                value={annualRate}
                onChange={(event) => setAnnualRate(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Time horizon (years)
              <input
                type="number"
                min={1}
                step={1}
                value={years}
                onChange={(event) => setYears(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Additional months
              <input
                type="number"
                min={0}
                max={11}
                step={1}
                value={months}
                onChange={(event) => setMonths(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-muted">
                Start month
                <select
                  value={startMonth}
                  onChange={(event) => setStartMonth(Number(event.target.value))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                >
                  {[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ].map((label, index) => (
                    <option key={label} value={index + 1}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-muted">
                Start year
                <input
                  type="number"
                  min={1900}
                  step={1}
                  value={startYear}
                  onChange={(event) => setStartYear(Number(event.target.value))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Results</h2>
          <p className="mt-2 text-sm text-muted">
            Totals reflect the selected compounding frequency.
          </p>
        <div className="mt-6 grid gap-4">
          <ResultCard
            label="Future value"
            value={formatCurrency(results.futureValue, currency)}
          />
          <ResultCard
            label="Total contributions"
            value={formatCurrency(results.contributions, currency)}
          />
          <ResultCard
            label="Interest earned"
            value={formatCurrency(results.interest, currency)}
          />
        </div>
        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Balance composition
          </p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Component</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {compositionRows.map((row) => (
                  <tr key={row.label} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.label}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.value, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>

      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl text-ink">Growth schedule</h3>
            <p className="text-sm text-muted">
              View monthly or yearly balance growth.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setView("monthly")}
              className={`rounded-full border px-4 py-2 text-xs ${
                view === "monthly" ? "border-ink bg-ink text-white" : "border-stroke text-ink"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setView("yearly")}
              className={`rounded-full border px-4 py-2 text-xs ${
                view === "yearly" ? "border-ink bg-ink text-white" : "border-stroke text-ink"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-auto rounded-2xl border border-stroke bg-white/70">
          {view === "monthly" ? (
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Month</th>
                  <th className="px-4 py-3 text-left">Contribution</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {monthlyRows.map((row) => (
                  <tr key={row.key} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.label}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.contribution, currency)}
                    </td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.interest, currency)}
                    </td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.balance, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-left">Contribution</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {yearlyRows.map((row) => (
                  <tr key={row.year} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.year}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.contribution, currency)}
                    </td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.interest, currency)}
                    </td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.balance, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

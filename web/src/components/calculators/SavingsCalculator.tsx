"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import { buildMonthlySchedule } from "@/lib/calculators/compound";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function SavingsCalculator({ onInsightsChange }: CalculatorProps) {
  const [startingBalance, setStartingBalance] = useState(4000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(250);
  const [annualRate, setAnnualRate] = useState(3.5);
  const [years, setYears] = useState(5);
  const [months, setMonths] = useState(0);
  const [compoundsPerYear, setCompoundsPerYear] = useState(12);
  const [depositFrequency, setDepositFrequency] = useState(12);
  const [depositTiming, setDepositTiming] = useState<"end" | "start">("end");
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [inflationRate, setInflationRate] = useState(0);
  const [startMonth, setStartMonth] = useState(3);
  const [startYear, setStartYear] = useState(2026);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  const totalYears = useMemo(() => {
    return Math.max(0, years) + Math.max(0, months) / 12;
  }, [months, years]);

  const startDate = useMemo(() => {
    return new Date(
      Math.max(1900, Math.round(startYear)),
      Math.min(11, Math.max(0, Math.round(startMonth) - 1)),
      1
    );
  }, [startMonth, startYear]);

  const compoundingLabel = useMemo(() => {
    return compoundsPerYear === 0
      ? "continuous"
      : `${formatNumber(compoundsPerYear)}x/year`;
  }, [compoundsPerYear]);

  const scheduleData = useMemo(() => {
    return buildMonthlySchedule({
      principal: startingBalance,
      annualRate,
      years,
      months,
      contribution: monthlyDeposit,
      contributionFrequency: depositFrequency,
      contributionTiming: depositTiming,
      compoundsPerYear,
      annualIncrease,
      startDate,
    });
  }, [
    annualIncrease,
    annualRate,
    compoundsPerYear,
    depositFrequency,
    depositTiming,
    monthlyDeposit,
    months,
    startDate,
    startingBalance,
    years,
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
    const tax = Math.max(0, taxRate) / 100;
    const afterTaxInterest = scheduleData.interestEarned * (1 - tax);
    const afterTaxBalance = scheduleData.totalContrib + afterTaxInterest;
    const realBalance =
      afterTaxBalance / Math.pow(1 + Math.max(0, inflationRate) / 100, totalYears);

    return {
      futureValue: scheduleData.endingBalance,
      interest: scheduleData.interestEarned,
      contributions: scheduleData.totalContrib,
      afterTax: afterTaxBalance,
      realValue: realBalance,
    };
  }, [
    inflationRate,
    scheduleData.endingBalance,
    scheduleData.interestEarned,
    scheduleData.totalContrib,
    taxRate,
    totalYears,
  ]);

  const compositionRows = useMemo(
    () => [
      { label: "Starting balance", value: startingBalance },
      { label: "Total saved", value: results.contributions },
      { label: "Interest earned", value: results.interest },
      { label: "After-tax value", value: results.afterTax },
      { label: "Inflation-adjusted", value: results.realValue },
      { label: "Ending balance", value: results.futureValue },
    ],
    [
      results.afterTax,
      results.contributions,
      results.futureValue,
      results.interest,
      results.realValue,
      startingBalance,
    ]
  );

  const insights = useMemo<CalculatorInsights>(() => {
    const safeYears = Math.max(1, Math.round(totalYears));
    const midYear = Math.max(1, Math.round(safeYears / 2));
    const timeline = Array.from(new Set([1, midYear, safeYears])).sort(
      (a, b) => a - b
    );

    const rows = timeline.map((year) => {
      const simulation = buildMonthlySchedule({
        principal: startingBalance,
        annualRate,
        years: year,
        months: 0,
        contribution: monthlyDeposit,
        contributionFrequency: depositFrequency,
        contributionTiming: depositTiming,
        compoundsPerYear,
        annualIncrease,
        startDate,
      });
      return [
        `${formatNumber(year)} years`,
        formatCurrency(simulation.endingBalance, currency),
        formatCurrency(simulation.interestEarned, currency),
      ];
    });

    const chartPoints = timeline.map((year) => {
      const simulation = buildMonthlySchedule({
        principal: startingBalance,
        annualRate,
        years: year,
        months: 0,
        contribution: monthlyDeposit,
        contributionFrequency: depositFrequency,
        contributionTiming: depositTiming,
        compoundsPerYear,
        annualIncrease,
        startDate,
      });
      return {
        label: `${formatNumber(year)}y`,
        value: simulation.endingBalance,
      };
    });

    return {
      table: {
        title: "Savings milestones",
        columns: ["Year", "Balance", "Interest earned"],
        rows,
        note: `Compounds ${compoundingLabel} with ${formatNumber(
          depositFrequency
        )}x/year deposits (${depositTiming}).`,
      },
      chart: {
        title: "Balance growth over time",
        xLabel: "Year",
        yLabel: "Future value",
        format: "currency",
        points: chartPoints,
        note: `Uses ${compoundingLabel} compounding.`,
      },
    };
  }, [
    annualIncrease,
    annualRate,
    totalYears,
    compoundsPerYear,
    compoundingLabel,
    depositFrequency,
    depositTiming,
    monthlyDeposit,
    startDate,
    startingBalance,
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
            Track savings growth with steady monthly deposits.
          </p>
          <div className="mt-6 space-y-4">
            <label className="grid gap-2 text-sm text-muted">
              Starting balance
              <input
                type="number"
                min={0}
                step={100}
                value={startingBalance}
                onChange={(event) => setStartingBalance(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Deposit amount
              <input
                type="number"
                min={0}
                step={25}
                value={monthlyDeposit}
                onChange={(event) => setMonthlyDeposit(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Deposit frequency
              <select
                value={depositFrequency}
                onChange={(event) => setDepositFrequency(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              >
                <option value={12}>Monthly</option>
                <option value={4}>Quarterly</option>
                <option value={1}>Annually</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Deposit timing
              <select
                value={depositTiming}
                onChange={(event) =>
                  setDepositTiming(event.target.value as "end" | "start")
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
              Annual deposit increase (%)
              <input
                type="number"
                min={0}
                step={0.1}
                value={annualIncrease}
                onChange={(event) => setAnnualIncrease(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-muted">
                Tax rate (%)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={taxRate}
                  onChange={(event) => setTaxRate(Number(event.target.value))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
              <label className="grid gap-2 text-sm text-muted">
                Inflation rate (%)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={inflationRate}
                  onChange={(event) => setInflationRate(Number(event.target.value))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
            </div>
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
            Savings projection with selected compounding and adjustments.
          </p>
          <div className="mt-6 grid gap-4">
            <ResultCard
              label="Future value"
              value={formatCurrency(results.futureValue, currency)}
            />
            <ResultCard
              label="Total saved"
              value={formatCurrency(results.contributions, currency)}
            />
            <ResultCard
              label="Interest earned"
              value={formatCurrency(results.interest, currency)}
            />
            <ResultCard
              label="After-tax value"
              value={formatCurrency(results.afterTax, currency)}
            />
            <ResultCard
              label="Inflation-adjusted value"
              value={formatCurrency(results.realValue, currency)}
            />
          </div>
          <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Savings composition
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
            <h3 className="font-display text-2xl text-ink">Savings schedule</h3>
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
                  <th className="px-4 py-3 text-left">Deposit</th>
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
                  <th className="px-4 py-3 text-left">Deposit</th>
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

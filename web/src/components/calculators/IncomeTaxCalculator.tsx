"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import {
  calculateIncomeTax,
  type FilingStatus,
  type TaxYear,
} from "@/lib/calculators/tax";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

const filingStatusLabels: Record<FilingStatus, string> = {
  single: "Single",
  married_joint: "Married filing jointly",
  married_separate: "Married filing separately",
  head_of_household: "Head of household",
};

const payPeriodLabels: Record<number, string> = {
  12: "Monthly",
  24: "Semi-monthly",
  26: "Biweekly",
  52: "Weekly",
};

export default function IncomeTaxCalculator({ onInsightsChange }: CalculatorProps) {
  const [year, setYear] = useState<TaxYear>(2026);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [wages, setWages] = useState(90000);
  const [otherIncome, setOtherIncome] = useState(5000);
  const [adjustments, setAdjustments] = useState(0);
  const [useStandardDeduction, setUseStandardDeduction] = useState(true);
  const [itemizedDeductions, setItemizedDeductions] = useState(0);
  const [taxCredits, setTaxCredits] = useState(0);
  const [payPeriods, setPayPeriods] = useState(12);

  const results = useMemo(() => {
    return calculateIncomeTax({
      year,
      filingStatus,
      wages,
      otherIncome,
      adjustments,
      itemizedDeductions,
      useStandardDeduction,
      taxCredits,
    });
  }, [
    adjustments,
    filingStatus,
    itemizedDeductions,
    otherIncome,
    taxCredits,
    useStandardDeduction,
    wages,
    year,
  ]);

  const perPeriod = useMemo(() => {
    const periods = Math.max(1, payPeriods);
    return {
      gross: results.grossIncome / periods,
      tax: results.taxAfterCredits / periods,
      net: results.netIncome / periods,
    };
  }, [payPeriods, results.grossIncome, results.netIncome, results.taxAfterCredits]);

  const periodRows = useMemo(() => {
    const label = payPeriodLabels[payPeriods] ?? `${payPeriods} periods`;
    const monthly = {
      gross: results.grossIncome / 12,
      tax: results.taxAfterCredits / 12,
      net: results.netIncome / 12,
    };

    return [
      {
        label: "Annual",
        gross: results.grossIncome,
        tax: results.taxAfterCredits,
        net: results.netIncome,
      },
      { label: "Monthly", gross: monthly.gross, tax: monthly.tax, net: monthly.net },
      {
        label,
        gross: perPeriod.gross,
        tax: perPeriod.tax,
        net: perPeriod.net,
      },
    ];
  }, [
    payPeriods,
    perPeriod.gross,
    perPeriod.net,
    perPeriod.tax,
    results.grossIncome,
    results.netIncome,
    results.taxAfterCredits,
  ]);

  const insights = useMemo<CalculatorInsights>(() => {
    const rows = results.bracketDetails.map((detail) => [
      `${formatNumber(detail.rate * 100)}%`,
      formatCurrency(detail.taxableIncome, currency),
      formatCurrency(detail.tax, currency),
    ]);

    const chartPoints = results.bracketDetails.map((detail) => ({
      label: `${formatNumber(detail.rate * 100)}%`,
      value: detail.tax,
    }));

    return {
      table: {
        title: "Federal bracket breakdown",
        columns: ["Rate", "Taxed income", "Tax"],
        rows,
        note: useStandardDeduction
          ? `Uses the standard deduction for ${filingStatusLabels[filingStatus]}.`
          : "Uses your itemized deductions.",
      },
      chart: {
        title: "Tax by bracket",
        xLabel: "Bracket",
        yLabel: "Tax",
        format: "currency",
        points: chartPoints,
        note: "Shows how much tax is paid in each bracket.",
      },
    };
  }, [filingStatus, results.bracketDetails, useStandardDeduction]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Federal income tax estimate with brackets, deductions, and credits.
        </p>
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm text-muted">
              Tax year
              <select
                value={year}
                onChange={(event) => setYear(Number(event.target.value) as TaxYear)}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm text-muted">
              Filing status
              <select
                value={filingStatus}
                onChange={(event) =>
                  setFilingStatus(event.target.value as FilingStatus)
                }
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              >
                {Object.entries(filingStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="grid gap-2 text-sm text-muted">
            Wages / salary
            <input
              type="number"
              min={0}
              step={500}
              value={wages}
              onChange={(event) => setWages(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Other income
            <input
              type="number"
              min={0}
              step={100}
              value={otherIncome}
              onChange={(event) => setOtherIncome(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Adjustments / pre-tax deductions
            <input
              type="number"
              min={0}
              step={100}
              value={adjustments}
              onChange={(event) => setAdjustments(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={useStandardDeduction}
              onChange={(event) => setUseStandardDeduction(event.target.checked)}
              className="h-4 w-4"
            />
            Use standard deduction
          </label>
          {!useStandardDeduction && (
            <label className="grid gap-2 text-sm text-muted">
              Itemized deductions
              <input
                type="number"
                min={0}
                step={100}
                value={itemizedDeductions}
                onChange={(event) => setItemizedDeductions(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
          )}
          <label className="grid gap-2 text-sm text-muted">
            Tax credits
            <input
              type="number"
              min={0}
              step={100}
              value={taxCredits}
              onChange={(event) => setTaxCredits(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Pay periods
            <select
              value={payPeriods}
              onChange={(event) => setPayPeriods(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            >
              <option value={12}>Monthly (12)</option>
              <option value={24}>Semi-monthly (24)</option>
              <option value={26}>Biweekly (26)</option>
              <option value={52}>Weekly (52)</option>
            </select>
          </label>
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          Federal tax estimate using IRS bracket tables and deductions.
        </p>
        <div className="mt-6 grid gap-4">
          <ResultCard label="Gross income" value={formatCurrency(results.grossIncome, currency)} />
          <ResultCard label="Taxable income" value={formatCurrency(results.taxableIncome, currency)} />
          <ResultCard label="Federal tax" value={formatCurrency(results.taxAfterCredits, currency)} />
          <ResultCard
            label="Effective tax rate"
            value={`${formatNumber(results.effectiveRate)}%`}
          />
          <ResultCard label="Net income" value={formatCurrency(results.netIncome, currency)} />
          <ResultCard
            label="Net per pay period"
            value={formatCurrency(perPeriod.net, currency)}
          />
        </div>
        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Deduction used</p>
          <div className="mt-2 flex items-center justify-between">
            <span>{useStandardDeduction ? "Standard" : "Itemized"}</span>
            <span className="font-semibold text-ink">
              {formatCurrency(results.deduction, currency)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Standard for status</span>
            <span className="text-muted">
              {formatCurrency(results.standardDeduction, currency)}
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Pay schedule</p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Period</th>
                  <th className="px-4 py-3 text-left">Gross</th>
                  <th className="px-4 py-3 text-left">Federal tax</th>
                  <th className="px-4 py-3 text-left">Net</th>
                </tr>
              </thead>
              <tbody>
                {periodRows.map((row) => (
                  <tr key={row.label} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.label}</td>
                    <td className="px-4 py-2">{formatCurrency(row.gross, currency)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.tax, currency)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.net, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            Uses the selected pay period for the third row.
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

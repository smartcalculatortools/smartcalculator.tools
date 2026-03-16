"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import MiniLineChart from "@/components/charts/MiniLineChart";
import {
  amortizationSchedule,
  amortizationSummary,
  groupScheduleByYear,
} from "@/lib/calculators/mortgage";
import { monthlyPayment } from "@/lib/calculators/loan";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function MortgageCalculator({ onInsightsChange }: CalculatorProps) {
  const [homePrice, setHomePrice] = useState(420000);
  const [downPaymentMode, setDownPaymentMode] = useState<"percent" | "amount">(
    "percent"
  );
  const [downPaymentValue, setDownPaymentValue] = useState(15);
  const [closingCosts, setClosingCosts] = useState(0);
  const [annualRate, setAnnualRate] = useState(6.2);
  const [termYears, setTermYears] = useState(30);
  const [startMonth, setStartMonth] = useState(3);
  const [startYear, setStartYear] = useState(2026);
  const [includeEscrow, setIncludeEscrow] = useState(true);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [insuranceAnnual, setInsuranceAnnual] = useState(1200);
  const [pmiAnnual, setPmiAnnual] = useState(0);
  const [hoaMonthly, setHoaMonthly] = useState(0);
  const [otherAnnual, setOtherAnnual] = useState(0);
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  const results = useMemo(() => {
    const safeHomePrice = Math.max(0, homePrice);
    const safeDownValue = Math.max(0, downPaymentValue);
    const safeClosingCosts = Math.max(0, closingCosts);
    const downAmount =
      downPaymentMode === "amount"
        ? Math.min(safeDownValue, safeHomePrice)
        : (safeHomePrice * Math.min(safeDownValue, 100)) / 100;
    const downPercent =
      downPaymentMode === "percent"
        ? Math.min(safeDownValue, 100)
        : safeHomePrice === 0
          ? 0
          : Math.min(100, (downAmount / safeHomePrice) * 100);
    const principal = Math.max(0, safeHomePrice - downAmount);

    const propertyTaxMonthly =
      (safeHomePrice * (Math.max(0, propertyTaxRate) / 100)) / 12;
    const insuranceMonthly = Math.max(0, insuranceAnnual) / 12;
    const pmiMonthly = Math.max(0, pmiAnnual) / 12;
    const otherMonthly = Math.max(0, otherAnnual) / 12;
    const hoa = Math.max(0, hoaMonthly);
    const escrowMonthlyBase =
      propertyTaxMonthly + insuranceMonthly + pmiMonthly + hoa + otherMonthly;
    const escrowMonthly = includeEscrow ? escrowMonthlyBase : 0;

    const schedule = amortizationSchedule({
      principal,
      annualRate,
      termYears,
      extraMonthly,
    });
    const summary = amortizationSummary(schedule.schedule);

    const baseline = amortizationSchedule({
      principal,
      annualRate,
      termYears,
      extraMonthly: 0,
    });
    const baselineSummary = amortizationSummary(baseline.schedule);

    const monthsWithExtra = schedule.schedule.length;
    const monthsBaseline = baseline.schedule.length;

    const interestSaved = Math.max(
      0,
      baselineSummary.totalInterest - summary.totalInterest
    );

    const payoffYears = Math.floor(monthsWithExtra / 12);
    const payoffMonths = monthsWithExtra % 12;

    const year2Escrow = includeEscrow
      ? escrowMonthlyBase * (1 + Math.max(0, annualIncrease) / 100)
      : 0;

    const totalPrincipalAndInterest =
      summary.totalPrincipal + summary.totalInterest;
    const totalEscrow = includeEscrow ? escrowMonthlyBase * monthsWithExtra : 0;
    const totalOutOfPocket = totalPrincipalAndInterest + totalEscrow;
    const cashAtClosing = downAmount + safeClosingCosts;
    const totalOutOfPocketWithClosing = totalOutOfPocket + safeClosingCosts;

    const startDate = new Date(
      Math.max(1900, Math.round(startYear)),
      Math.min(11, Math.max(0, Math.round(startMonth) - 1)),
      1
    );
    const scheduleWithDates = schedule.schedule.map((row) => {
      const date = new Date(startDate);
      date.setMonth(startDate.getMonth() + row.month - 1);
      return {
        ...row,
        dateLabel: date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
      };
    });
    const payoffDate = new Date(startDate);
    payoffDate.setMonth(startDate.getMonth() + monthsWithExtra);

    const escrowFactor = includeEscrow ? 1 : 0;
    const breakdownRows = [
      {
        label: "Principal & interest",
        monthly: schedule.basePayment,
        total: totalPrincipalAndInterest,
      },
      {
        label: "Property tax",
        monthly: propertyTaxMonthly * escrowFactor,
        total: propertyTaxMonthly * monthsWithExtra * escrowFactor,
      },
      {
        label: "Home insurance",
        monthly: insuranceMonthly * escrowFactor,
        total: insuranceMonthly * monthsWithExtra * escrowFactor,
      },
      {
        label: "PMI insurance",
        monthly: pmiMonthly * escrowFactor,
        total: pmiMonthly * monthsWithExtra * escrowFactor,
      },
      {
        label: "HOA",
        monthly: hoa * escrowFactor,
        total: hoa * monthsWithExtra * escrowFactor,
      },
      {
        label: "Other costs",
        monthly: otherMonthly * escrowFactor,
        total: otherMonthly * monthsWithExtra * escrowFactor,
      },
      {
        label: "Total out-of-pocket",
        monthly: schedule.basePayment + escrowMonthly + Math.max(0, extraMonthly),
        total: totalOutOfPocket,
      },
    ];

    return {
      principal,
      downAmount,
      downPercent,
      basePayment: schedule.basePayment,
      escrowMonthly,
      escrowMonthlyBase,
      propertyTaxMonthly,
      insuranceMonthly,
      pmiMonthly,
      otherMonthly,
      hoaMonthly: hoa,
      totalMonthly: schedule.basePayment + escrowMonthly + Math.max(0, extraMonthly),
      schedule: schedule.schedule,
      scheduleWithDates,
      yearly: groupScheduleByYear(schedule.schedule),
      summary,
      interestSaved,
      totalPrincipalAndInterest,
      totalEscrow,
      totalOutOfPocket,
      totalOutOfPocketWithClosing,
      monthsWithExtra,
      monthsBaseline,
      payoffYears,
      payoffMonths,
      year2Escrow,
      payoffDate,
      cashAtClosing,
      closingCosts: safeClosingCosts,
      breakdownRows,
    };
  }, [
    homePrice,
    downPaymentMode,
    downPaymentValue,
    closingCosts,
    annualRate,
    termYears,
    startMonth,
    startYear,
    includeEscrow,
    propertyTaxRate,
    insuranceAnnual,
    pmiAnnual,
    hoaMonthly,
    otherAnnual,
    extraMonthly,
    annualIncrease,
  ]);

  const insights = useMemo<CalculatorInsights>(() => {
    const safeHomePrice = Math.max(0, homePrice);
    const safeRate = Math.max(0.1, annualRate);
    const safeTerm = Math.max(1, Math.round(termYears));

    const downOptions = [5, 10, 20];
    const downRows = downOptions.map((percent) => {
      const principal = safeHomePrice * (1 - percent / 100);
      const payment = monthlyPayment({
        principal,
        annualRate: safeRate,
        termYears: safeTerm,
      });
      return [
        `${formatNumber(percent)}%`,
        formatCurrency(principal, currency),
        formatCurrency(payment, currency),
      ];
    });

    const rateSteps = [
      Math.max(0.1, safeRate - 1),
      safeRate,
      safeRate + 1,
      safeRate + 2,
    ];
    const chartPoints = rateSteps.map((rate) => ({
      label: `${formatNumber(rate)}%`,
      value: monthlyPayment({
        principal: results.principal,
        annualRate: rate,
        termYears: safeTerm,
      }),
    }));

    return {
      table: {
        title: "Down payment impact",
        columns: ["Down payment", "Loan amount", "Monthly P and I"],
        rows: downRows,
        note: `Assumes ${safeTerm} year term at ${formatNumber(safeRate)}% APR.`,
      },
      chart: {
        title: "Payment sensitivity to rate",
        xLabel: "APR",
        yLabel: "Monthly payment",
        format: "currency",
        points: chartPoints,
        note: "Principal and interest only; escrow excluded.",
      },
    };
  }, [annualRate, homePrice, results.principal, termYears]);

  const breakdown = useMemo(() => {
    const escrowFactor = includeEscrow ? 1 : 0;
    const segments = [
      {
        label: "Principal & interest",
        value: results.basePayment,
        color: "#0f766e",
      },
      {
        label: "Property tax",
        value: results.propertyTaxMonthly * escrowFactor,
        color: "#0284c7",
      },
      {
        label: "Home insurance",
        value: results.insuranceMonthly * escrowFactor,
        color: "#6366f1",
      },
      {
        label: "PMI insurance",
        value: results.pmiMonthly * escrowFactor,
        color: "#f59e0b",
      },
      {
        label: "HOA",
        value: results.hoaMonthly * escrowFactor,
        color: "#10b981",
      },
      {
        label: "Other costs",
        value: results.otherMonthly * escrowFactor,
        color: "#ef4444",
      },
    ].filter((item) => item.value > 0);

    const total = segments.reduce((sum, item) => sum + item.value, 0);
    return { segments, total };
  }, [
    includeEscrow,
    results.basePayment,
    results.propertyTaxMonthly,
    results.insuranceMonthly,
    results.pmiMonthly,
    results.hoaMonthly,
    results.otherMonthly,
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
            Customize loan terms, escrow costs, and extra payments.
          </p>
          <div className="mt-6 space-y-4">
            <Input label="Home price" value={homePrice} onChange={setHomePrice} step={1000} />
            <label className="grid gap-2 text-sm text-muted">
              Down payment
              <div className="flex flex-wrap gap-2">
                {(["percent", "amount"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setDownPaymentMode(mode)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      downPaymentMode === mode
                        ? "border-ink bg-ink text-white"
                        : "border-stroke text-ink"
                    }`}
                  >
                    {mode === "percent" ? "%" : "Amount"}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={0}
                step={downPaymentMode === "percent" ? 0.1 : 500}
                value={downPaymentValue}
                onChange={(event) => setDownPaymentValue(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
              <span className="text-xs text-muted">
                {downPaymentMode === "percent"
                  ? `${formatCurrency(results.downAmount, currency)} down`
                  : `${formatNumber(results.downPercent)}% down`}
              </span>
            </label>
            <Input
              label="Closing costs"
              value={closingCosts}
              onChange={setClosingCosts}
              step={500}
            />
            <Input label="Interest rate (annual %)" value={annualRate} onChange={setAnnualRate} step={0.01} />
            <Input label="Loan term (years)" value={termYears} onChange={setTermYears} step={1} />
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
            <label className="flex items-center gap-3 rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={includeEscrow}
                onChange={(event) => setIncludeEscrow(event.target.checked)}
                className="h-4 w-4"
              />
              Include taxes and costs below
            </label>
            {includeEscrow && (
              <>
                <Input label="Property tax rate (%)" value={propertyTaxRate} onChange={setPropertyTaxRate} step={0.01} />
                <Input label="Home insurance (annual)" value={insuranceAnnual} onChange={setInsuranceAnnual} step={50} />
                <Input label="PMI insurance (annual)" value={pmiAnnual} onChange={setPmiAnnual} step={50} />
                <Input label="HOA / monthly" value={hoaMonthly} onChange={setHoaMonthly} step={10} />
                <Input label="Other costs (annual)" value={otherAnnual} onChange={setOtherAnnual} step={50} />
              </>
            )}
            <Input label="Extra payment / month" value={extraMonthly} onChange={setExtraMonthly} step={10} />
            <Input label="Annual cost increase (%)" value={annualIncrease} onChange={setAnnualIncrease} step={0.1} />
          </div>
        </div>

        <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Results</h2>
          <p className="mt-2 text-sm text-muted">
            Payments include escrow estimates for taxes, insurance, and HOA.
          </p>
          <div className="mt-6 grid gap-4">
            <ResultCard label="Loan amount" value={formatCurrency(results.principal, currency)} />
            <ResultCard label="Down payment" value={formatCurrency(results.downAmount, currency)} />
            <ResultCard label="Down payment (%)" value={`${formatNumber(results.downPercent)}%`} />
            <ResultCard label="Closing costs" value={formatCurrency(results.closingCosts, currency)} />
            <ResultCard label="Cash at closing" value={formatCurrency(results.cashAtClosing, currency)} />
            <ResultCard label="Principal & interest" value={formatCurrency(results.basePayment, currency)} />
            <ResultCard label="Escrow estimate" value={formatCurrency(results.escrowMonthly, currency)} />
            <ResultCard label="Total monthly" value={formatCurrency(results.totalMonthly, currency)} />
            <ResultCard label="Total interest" value={formatCurrency(results.summary.totalInterest, currency)} />
            <ResultCard label="Total escrow" value={formatCurrency(results.totalEscrow, currency)} />
            <ResultCard label="Total out-of-pocket" value={formatCurrency(results.totalOutOfPocket, currency)} />
            <ResultCard
              label="Total + closing"
              value={formatCurrency(results.totalOutOfPocketWithClosing, currency)}
            />
            <ResultCard label="Interest saved" value={formatCurrency(results.interestSaved, currency)} />
            <ResultCard
              label="Payoff time"
              value={`${results.payoffYears}y ${results.payoffMonths}m`}
            />
            <ResultCard
              label="Estimated payoff date"
              value={results.payoffDate.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            />
            <ResultCard
              label="Escrow after 1 year"
              value={formatCurrency(results.year2Escrow, currency)}
            />
          </div>
          <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Monthly breakdown
            </p>
            <div className="mt-3 grid gap-2">
              <BreakdownRow label="Principal & interest" value={results.basePayment} />
              <BreakdownRow label="Property tax" value={results.propertyTaxMonthly} />
              <BreakdownRow label="Home insurance" value={results.insuranceMonthly} />
              <BreakdownRow label="PMI insurance" value={results.pmiMonthly} />
              <BreakdownRow label="HOA" value={results.hoaMonthly} />
              <BreakdownRow label="Other costs" value={results.otherMonthly} />
              <BreakdownRow
                label="Escrow total"
                value={results.escrowMonthlyBase}
                emphasis
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Upfront costs
            </p>
            <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-2 text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Down payment", value: results.downAmount },
                    { label: "Closing costs", value: results.closingCosts },
                    { label: "Cash at closing", value: results.cashAtClosing },
                  ].map((row) => (
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

          <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Payment breakdown
            </p>
            <div className="mt-4">
              <DonutBreakdown segments={breakdown.segments} total={breakdown.total} />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Monthly vs total
            </p>
            <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-2 text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Monthly</th>
                    <th className="px-4 py-3 text-left">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.breakdownRows.map((row) => (
                    <tr key={row.label} className="border-t border-stroke/60">
                      <td className="px-4 py-2">{row.label}</td>
                      <td className="px-4 py-2">
                        {formatCurrency(row.monthly, currency)}
                      </td>
                      <td className="px-4 py-2">
                        {formatCurrency(row.total, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted">
              Totals assume the current payoff time and selected escrow option.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl text-ink">Amortization schedule</h3>
            <p className="text-sm text-muted">
              View monthly or yearly payoff breakdown.
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
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full border border-stroke px-4 py-2 text-xs text-ink"
            >
              Print
            </button>
          </div>
        </div>

        <div className="mt-6">
          <MiniLineChart
            title="Balance vs interest over time"
            yLabel="USD"
            series={[
              {
                label: "Balance",
                values: results.yearly.map((row) => row.balance),
                color: "#0f766e",
              },
              {
                label: "Interest",
                values: results.yearly.map((row) => row.interest),
                color: "#f59e0b",
              },
            ]}
          />
        </div>

        <div className="mt-6 overflow-auto rounded-2xl border border-stroke bg-white/70">
          {view === "monthly" ? (
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Month</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Principal</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {results.scheduleWithDates.map((row) => (
                  <tr key={row.month} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.month}</td>
                    <td className="px-4 py-2">{row.dateLabel}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.payment + row.extra, currency)}
                    </td>
                    <td className="px-4 py-2">{formatCurrency(row.principal, currency)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.interest, currency)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.balance, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Year</th>
                  <th className="px-4 py-3 text-left">Principal</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {results.yearly.map((row) => (
                  <tr key={row.year} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.year}</td>
                    <td className="px-4 py-2">{formatCurrency(row.principal, currency)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.interest, currency)}</td>
                    <td className="px-4 py-2">{formatCurrency(row.balance, currency)}</td>
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

function Input({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step: number;
}) {
  return (
    <label className="grid gap-2 text-sm text-muted">
      {label}
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
      />
    </label>
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

function BreakdownRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm text-ink">
      <span className={emphasis ? "font-semibold" : ""}>{label}</span>
      <span className={emphasis ? "font-semibold" : ""}>
        {formatCurrency(value, currency)}
      </span>
    </div>
  );
}

function DonutBreakdown({
  segments,
  total,
}: {
  segments: { label: string; value: number; color: string }[];
  total: number;
}) {
  if (segments.length === 0 || total === 0) {
    return (
      <p className="text-sm text-muted">No breakdown available for the current inputs.</p>
    );
  }

  const gradientStops = segments.reduce(
    (acc, segment) => {
      const start = acc.total;
      const share = (segment.value / total) * 100;
      const end = start + share;
      return {
        total: end,
        stops: [...acc.stops, `${segment.color} ${start}% ${end}%`],
      };
    },
    { total: 0, stops: [] as string[] }
  );
  const gradient = gradientStops.stops.join(", ");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div
        className="h-28 w-28 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      />
      <div className="grid gap-2 text-xs text-muted">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-ink">{segment.label}</span>
            <span className="ml-auto text-ink">
              {formatNumber((segment.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

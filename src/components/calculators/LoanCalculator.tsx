"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import MiniLineChart from "@/components/charts/MiniLineChart";
import {
  amortizationScheduleByFrequency,
  bondPresentValue,
  deferredAmountDue,
  deferredSchedule,
  type LoanType,
  periodicPayment,
  totalInterestByFrequency,
  totalPaymentByFrequency,
} from "@/lib/calculators/loan";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function LoanCalculator({ onInsightsChange }: CalculatorProps) {
  const [loanType, setLoanType] = useState<LoanType>("amortized");
  const [principal, setPrincipal] = useState(25000);
  const [annualRate, setAnnualRate] = useState(7.5);
  const [termYears, setTermYears] = useState(5);
  const [startMonth, setStartMonth] = useState(3);
  const [startYear, setStartYear] = useState(2026);
  const [compoundsPerYear, setCompoundsPerYear] = useState(12);
  const [paymentsPerYear, setPaymentsPerYear] = useState(12);
  const [originationFee, setOriginationFee] = useState(0);
  const [financeFee, setFinanceFee] = useState(false);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  const results = useMemo(() => {
    const safePrincipal = Math.max(0, principal);
    const feeAmount = (safePrincipal * Math.max(0, originationFee)) / 100;
    const effectivePrincipal =
      loanType === "amortized" && financeFee ? safePrincipal + feeAmount : safePrincipal;
    const startDate = new Date(
      Math.max(1900, Math.round(startYear)),
      Math.min(11, Math.max(0, Math.round(startMonth) - 1)),
      1
    );

    const getPaymentDate = (period: number, periodsPerYear: number) => {
      const date = new Date(startDate);
      if (periodsPerYear === 365) {
        date.setDate(date.getDate() + (period - 1));
        return date;
      }
      if (periodsPerYear === 52) {
        date.setDate(date.getDate() + (period - 1) * 7);
        return date;
      }
      if (periodsPerYear === 26) {
        date.setDate(date.getDate() + (period - 1) * 14);
        return date;
      }
      if (periodsPerYear === 24) {
        date.setDate(date.getDate() + (period - 1) * 15);
        return date;
      }
      const monthsPerPayment = 12 / Math.max(1, periodsPerYear);
      date.setMonth(date.getMonth() + Math.round((period - 1) * monthsPerPayment));
      return date;
    };

    const buildAggregates = (
      scheduleRows: { period: number; payment: number; interest: number; principal: number; balance: number }[],
      periodsPerYear: number
    ) => {
      const scheduleWithDates = scheduleRows.map((row) => {
        const date = getPaymentDate(row.period, periodsPerYear);
        return {
          ...row,
          date,
          dateLabel: date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
        };
      });

      const monthlyMap = new Map<
        string,
        {
          key: string;
          label: string;
          year: number;
          month: number;
          payment: number;
          principal: number;
          interest: number;
          balance: number;
        }
      >();
      const yearlyMap = new Map<
        number,
        {
          year: number;
          payment: number;
          principal: number;
          interest: number;
          balance: number;
        }
      >();

      scheduleWithDates.forEach((row) => {
        const year = row.date.getFullYear();
        const month = row.date.getMonth();
        const monthKey = `${year}-${month}`;
        const monthLabel = row.dateLabel;

        const monthEntry = monthlyMap.get(monthKey);
        if (!monthEntry) {
          monthlyMap.set(monthKey, {
            key: monthKey,
            label: monthLabel,
            year,
            month,
            payment: row.payment,
            principal: row.principal,
            interest: row.interest,
            balance: row.balance,
          });
        } else {
          monthEntry.payment += row.payment;
          monthEntry.principal += row.principal;
          monthEntry.interest += row.interest;
          monthEntry.balance = row.balance;
        }

        const yearEntry = yearlyMap.get(year);
        if (!yearEntry) {
          yearlyMap.set(year, {
            year,
            payment: row.payment,
            principal: row.principal,
            interest: row.interest,
            balance: row.balance,
          });
        } else {
          yearEntry.payment += row.payment;
          yearEntry.principal += row.principal;
          yearEntry.interest += row.interest;
          yearEntry.balance = row.balance;
        }
      });

      const monthly = Array.from(monthlyMap.values()).sort((a, b) => {
        if (a.year === b.year) return a.month - b.month;
        return a.year - b.year;
      });

      const yearly = Array.from(yearlyMap.values()).sort(
        (a, b) => a.year - b.year
      );

      const lastDate = scheduleWithDates.at(-1)?.date ?? startDate;
      const payoffDate = new Date(lastDate);

      return { monthly, yearly, payoffDate, scheduleWithDates };
    };

    if (loanType === "amortized") {
      const payment = periodicPayment({
        principal: effectivePrincipal,
        annualRate,
        termYears,
        paymentsPerYear,
        compoundsPerYear,
      });
      const total = totalPaymentByFrequency({
        principal: effectivePrincipal,
        annualRate,
        termYears,
        paymentsPerYear,
        compoundsPerYear,
      });
      const interest = totalInterestByFrequency({
        principal: effectivePrincipal,
        annualRate,
        termYears,
        paymentsPerYear,
        compoundsPerYear,
      });

      const schedule = amortizationScheduleByFrequency({
        principal: effectivePrincipal,
        annualRate,
        termYears,
        paymentsPerYear,
        compoundsPerYear,
      });
      const aggregates = buildAggregates(schedule.schedule, schedule.paymentsPerYear);

      return {
        type: loanType,
        effectivePrincipal,
        payment,
        total,
        interest,
        feeAmount,
        netProceeds: Math.max(0, safePrincipal - (financeFee ? 0 : feeAmount)),
        financeFee,
        schedule,
        monthly: aggregates.monthly,
        yearly: aggregates.yearly,
        payoffDate: aggregates.payoffDate,
      };
    }

    if (loanType === "bond") {
      const amountReceived = bondPresentValue({
        principal: safePrincipal,
        annualRate,
        termYears,
        paymentsPerYear,
        compoundsPerYear,
      });
      const amountDue = safePrincipal;
      const interest = Math.max(0, amountDue - amountReceived);
      const schedule = deferredSchedule({
        principal: amountReceived,
        annualRate,
        termYears,
        paymentsPerYear,
        compoundsPerYear,
      });
      const aggregates = buildAggregates(schedule.schedule, schedule.paymentsPerYear);

      return {
        type: loanType,
        amountReceived,
        amountDue,
        interest,
        feeAmount,
        netProceeds: Math.max(0, amountReceived - feeAmount),
        financeFee: false,
        schedule,
        monthly: aggregates.monthly,
        yearly: aggregates.yearly,
        payoffDate: aggregates.payoffDate,
      };
    }

    const amountDue = deferredAmountDue({
      principal: safePrincipal,
      annualRate,
      termYears,
      paymentsPerYear,
      compoundsPerYear,
    });
    const interest = Math.max(0, amountDue - safePrincipal);
    const schedule = deferredSchedule({
      principal: safePrincipal,
      annualRate,
      termYears,
      paymentsPerYear,
      compoundsPerYear,
    });
    const aggregates = buildAggregates(schedule.schedule, schedule.paymentsPerYear);

    return {
      type: loanType,
      amountDue,
      interest,
      feeAmount,
      netProceeds: Math.max(0, safePrincipal - feeAmount),
      financeFee: false,
      schedule,
      monthly: aggregates.monthly,
      yearly: aggregates.yearly,
      payoffDate: aggregates.payoffDate,
    };
  }, [
    principal,
    annualRate,
    termYears,
    startMonth,
    startYear,
    paymentsPerYear,
    compoundsPerYear,
    loanType,
    originationFee,
    financeFee,
  ]);
  const compoundingLabel =
    compoundsPerYear === 0
      ? "continuous"
      : `${formatNumber(compoundsPerYear)}x/year`;

  const insights = useMemo<CalculatorInsights>(() => {
    const safeRate = Math.max(0.1, annualRate);
    const baseTerm = Math.max(1, Math.round(termYears));
    const termOptions = Array.from(
      new Set([Math.max(1, baseTerm - 2), baseTerm, baseTerm + 2])
    ).sort((a, b) => a - b);

    if (loanType === "amortized") {
      const rows = termOptions.map((term) => {
        const payment = periodicPayment({
          principal,
          annualRate: safeRate,
          termYears: term,
          paymentsPerYear,
          compoundsPerYear,
        });
        const interest = totalInterestByFrequency({
          principal,
          annualRate: safeRate,
          termYears: term,
          paymentsPerYear,
          compoundsPerYear,
        });
        return [
          `${formatNumber(term)} years`,
          formatCurrency(payment, currency),
          formatCurrency(interest, currency),
        ];
      });

      const chartPoints = termOptions.map((term) => ({
        label: `${formatNumber(term)}y`,
        value: periodicPayment({
          principal,
          annualRate: safeRate,
          termYears: term,
          paymentsPerYear,
          compoundsPerYear,
        }),
      }));

      return {
        table: {
          title: "Term vs total interest",
          columns: [
            "Term",
            paymentsPerYear === 12 ? "Monthly payment" : "Payment per period",
            "Total interest",
          ],
          rows,
          note: `Assumes ${formatNumber(safeRate)}% APR with ${formatNumber(
            paymentsPerYear
          )} payments/year.`,
        },
        chart: {
          title: "Payment vs term length",
          xLabel: "Term length",
          yLabel: paymentsPerYear === 12 ? "Monthly payment" : "Payment per period",
          format: "currency",
          points: chartPoints,
          note: "Payment amount depends on compounding and payback frequency.",
        },
      };
    }

    if (loanType === "bond") {
      const rows = termOptions.map((term) => {
        const received = bondPresentValue({
          principal,
          annualRate: safeRate,
          termYears: term,
          paymentsPerYear,
          compoundsPerYear,
        });
        const interest = Math.max(0, principal - received);
        return [
          `${formatNumber(term)} years`,
          formatCurrency(received, currency),
          formatCurrency(interest, currency),
        ];
      });

      const chartPoints = termOptions.map((term) => ({
        label: `${formatNumber(term)}y`,
        value: bondPresentValue({
          principal,
          annualRate: safeRate,
          termYears: term,
          paymentsPerYear,
          compoundsPerYear,
        }),
      }));

      return {
        table: {
          title: "Bond proceeds by term",
          columns: ["Term", "Amount received", "Total interest"],
          rows,
          note: `Face value stays fixed; compounding ${compoundingLabel}.`,
        },
        chart: {
          title: "Amount received vs term",
          xLabel: "Term length",
          yLabel: "Amount received",
          format: "currency",
          points: chartPoints,
          note: "Longer terms reduce the proceeds for a fixed face value.",
        },
      };
    }

    const rows = termOptions.map((term) => {
      const amountDue = deferredAmountDue({
        principal,
        annualRate: safeRate,
        termYears: term,
        paymentsPerYear,
        compoundsPerYear,
      });
      const interest = Math.max(0, amountDue - principal);
      return [
        `${formatNumber(term)} years`,
        formatCurrency(amountDue, currency),
        formatCurrency(interest, currency),
      ];
    });

    const chartPoints = termOptions.map((term) => ({
      label: `${formatNumber(term)}y`,
      value: deferredAmountDue({
        principal,
        annualRate: safeRate,
        termYears: term,
        paymentsPerYear,
        compoundsPerYear,
      }),
    }));

    return {
      table: {
        title: "Deferred payoff by term",
        columns: ["Term", "Amount due", "Total interest"],
        rows,
        note: `No periodic payments; interest accrues to maturity.`,
      },
      chart: {
        title: "Amount due vs term",
        xLabel: "Term length",
        yLabel: "Amount due",
        format: "currency",
        points: chartPoints,
        note: "Longer terms increase the maturity amount.",
      },
    };
  }, [
    annualRate,
    principal,
    termYears,
    paymentsPerYear,
    compoundsPerYear,
    compoundingLabel,
    loanType,
  ]);

  const paymentLabel =
    results.type === "amortized"
      ? paymentsPerYear === 12
        ? "Monthly payment"
        : "Payment per period"
      : results.type === "bond"
        ? "Amount received"
        : "Amount due at maturity";

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  const isAmortized = results.type === "amortized";
  const isBond = results.type === "bond";
  const paymentValue = isAmortized
    ? results.payment
    : isBond
      ? results.amountReceived
      : results.amountDue;

  const scheduleTitle = isAmortized ? "Amortization schedule" : "Balance schedule";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Quick estimates for personal and business loans.
        </p>
        <div className="mt-6 space-y-4">
          <label className="grid gap-2 text-sm text-muted">
            Loan type
            <select
              value={loanType}
              onChange={(event) => setLoanType(event.target.value as LoanType)}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            >
              <option value="amortized">Amortized</option>
              <option value="deferred">Deferred payment</option>
              <option value="bond">Bond</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm text-muted">
            {loanType === "bond" ? "Face value (amount due)" : "Loan amount"}
            <input
              type="number"
              min={0}
              step={100}
              value={principal}
              onChange={(event) => setPrincipal(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
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
            Origination fee (%)
            <input
              type="number"
              min={0}
              step={0.1}
              value={originationFee}
              onChange={(event) => setOriginationFee(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          {loanType === "amortized" && (
            <label className="flex items-center gap-3 rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
              <input
                type="checkbox"
                checked={financeFee}
                onChange={(event) => setFinanceFee(event.target.checked)}
                className="h-4 w-4"
              />
              Finance fee into loan balance
            </label>
          )}
          <label className="grid gap-2 text-sm text-muted">
            Loan term (years)
            <input
              type="number"
              min={1}
              step={1}
              value={termYears}
              onChange={(event) => setTermYears(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
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
          {loanType === "amortized" && (
            <label className="grid gap-2 text-sm text-muted">
              Payback frequency
              <select
                value={paymentsPerYear}
                onChange={(event) => setPaymentsPerYear(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              >
                <option value={365}>Daily</option>
                <option value={52}>Weekly</option>
                <option value={26}>Biweekly</option>
                <option value={24}>Semi-monthly</option>
                <option value={12}>Monthly</option>
                <option value={4}>Quarterly</option>
                <option value={2}>Semiannually</option>
                <option value={1}>Annually</option>
              </select>
            </label>
          )}
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
          Calculated with your selected compounding and payback frequency.
        </p>
        <div className="mt-6 grid gap-4">
          <ResultCard
            label={paymentLabel}
            value={formatCurrency(paymentValue, currency)}
          />
          <ResultCard label="Origination fee" value={formatCurrency(results.feeAmount, currency)} />
          <ResultCard label="Net proceeds" value={formatCurrency(results.netProceeds, currency)} />
          {isAmortized && results.financeFee && (
            <ResultCard
              label="Financed balance"
              value={formatCurrency(results.effectivePrincipal, currency)}
            />
          )}
          <ResultCard label="Total interest" value={formatCurrency(results.interest, currency)} />
          {isAmortized && (
            <ResultCard label="Total paid" value={formatCurrency(results.total, currency)} />
          )}
          {isBond && (
            <ResultCard label="Face value" value={formatCurrency(results.amountDue, currency)} />
          )}
          <ResultCard
            label="Estimated payoff date"
            value={results.payoffDate.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          />
        </div>
        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Loan summary
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
                  {
                    label: isBond ? "Face value" : "Loan amount",
                    value: principal,
                  },
                  { label: "Origination fee", value: results.feeAmount },
                  { label: "Net proceeds", value: results.netProceeds },
                  { label: "Total interest", value: results.interest },
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
      </div>

      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl text-ink">{scheduleTitle}</h3>
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
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Principal</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {results.monthly.map((row) => (
                  <tr key={row.key} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.label}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.payment, currency)}
                    </td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.principal, currency)}
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
                  <th className="px-4 py-3 text-left">Payment</th>
                  <th className="px-4 py-3 text-left">Principal</th>
                  <th className="px-4 py-3 text-left">Interest</th>
                  <th className="px-4 py-3 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {results.yearly.map((row) => (
                  <tr key={row.year} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.year}</td>
                    <td className="px-4 py-2">
                      {formatCurrency(row.payment, currency)}
                    </td>
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

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}

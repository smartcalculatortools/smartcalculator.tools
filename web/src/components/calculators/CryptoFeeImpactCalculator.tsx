"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import { breakEvenExitPrice } from "@/lib/calculators/crypto";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function CryptoFeeImpactCalculator({ onInsightsChange }: CalculatorProps) {
  const [entryPrice, setEntryPrice] = useState(100);
  const [feePercent, setFeePercent] = useState(1);

  const breakeven = useMemo(() => {
    return breakEvenExitPrice({ entryPrice, feePercent });
  }, [entryPrice, feePercent]);

  const feeDrag = useMemo(() => {
    if (feePercent <= 0) return 0;
    if (breakeven === null) return 0;
    return breakeven - entryPrice;
  }, [breakeven, entryPrice, feePercent]);

  const insights = useMemo<CalculatorInsights>(() => {
    const feeOptions = Array.from(
      new Set([feePercent, feePercent + 0.5, feePercent + 1])
    ).sort((a, b) => a - b);

    const rows = feeOptions.map((fee) => {
      const price = breakEvenExitPrice({ entryPrice, feePercent: fee });
      const drag = price === null ? 0 : price - entryPrice;
      return [
        `${formatNumber(fee)}%`,
        price === null ? "--" : formatCurrency(price, currency),
        formatCurrency(drag, currency),
      ];
    });

    const chartPoints = feeOptions.map((fee) => {
      const price = breakEvenExitPrice({ entryPrice, feePercent: fee });
      return {
        label: `${formatNumber(fee)}%`,
        value: price ?? 0,
      };
    });

    return {
      table: {
        title: "Breakeven by fee rate",
        columns: ["Fee", "Breakeven", "Fee drag"],
        rows,
        note: "Fees are applied on both entry and exit.",
      },
      chart: {
        title: "Breakeven exit price",
        xLabel: "Fee rate",
        yLabel: "Exit price",
        format: "currency",
        points: chartPoints,
        note: "Higher fees require higher exits to break even.",
      },
    };
  }, [entryPrice, feePercent]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Estimate the breakeven price after fees.
        </p>
        <div className="mt-6 space-y-4">
          <Input label="Entry price" value={entryPrice} onChange={setEntryPrice} />
          <Input label="Fee percent (%)" value={feePercent} onChange={setFeePercent} />
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <div className="mt-6 grid gap-4">
          <ResultCard
            label="Breakeven exit"
            value={breakeven === null ? "--" : formatCurrency(breakeven, currency)}
          />
          <ResultCard label="Fee drag" value={formatNumber(feeDrag)} />
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2 text-sm text-muted">
      {label}
      <input
        type="number"
        step={0.01}
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

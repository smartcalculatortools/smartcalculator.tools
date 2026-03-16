"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import { profitLoss } from "@/lib/calculators/crypto";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function CryptoProfitLossCalculator({ onInsightsChange }: CalculatorProps) {
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(120);
  const [quantity, setQuantity] = useState(2);
  const [feePercent, setFeePercent] = useState(1);

  const results = useMemo(() => {
    return profitLoss({ buyPrice, sellPrice, quantity, feePercent });
  }, [buyPrice, sellPrice, quantity, feePercent]);

  const insights = useMemo<CalculatorInsights>(() => {
    const scenarioPrices = [sellPrice * 0.9, sellPrice, sellPrice * 1.1];
    const rows = scenarioPrices.map((price) => {
      const outcome = profitLoss({
        buyPrice,
        sellPrice: price,
        quantity,
        feePercent,
      });
      return [
        `${formatCurrency(price, currency)}`,
        formatCurrency(outcome.profit, currency),
        `${formatNumber(outcome.roi)}%`,
      ];
    });

    const chartPoints = scenarioPrices.map((price) => {
      const outcome = profitLoss({
        buyPrice,
        sellPrice: price,
        quantity,
        feePercent,
      });
      return {
        label: formatNumber(price),
        value: outcome.profit,
      };
    });

    return {
      table: {
        title: "Profit scenarios by sell price",
        columns: ["Sell price", "Profit", "ROI"],
        rows,
        note: "Scenarios use -10%, current, and +10% sell prices.",
      },
      chart: {
        title: "Profit vs sell price",
        xLabel: "Sell price",
        yLabel: "Profit",
        format: "currency",
        points: chartPoints,
        note: "Fees are applied on both entry and exit.",
      },
    };
  }, [buyPrice, feePercent, quantity, sellPrice]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Estimate profit after fees across the trade.
        </p>
        <div className="mt-6 space-y-4">
          <Input label="Buy price" value={buyPrice} onChange={setBuyPrice} />
          <Input label="Sell price" value={sellPrice} onChange={setSellPrice} />
          <Input label="Quantity" value={quantity} onChange={setQuantity} />
          <Input label="Fee percent (%)" value={feePercent} onChange={setFeePercent} />
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <div className="mt-6 grid gap-4">
          <ResultCard label="Cost" value={formatCurrency(results.cost, currency)} />
          <ResultCard label="Revenue" value={formatCurrency(results.revenue, currency)} />
          <ResultCard label="Fees" value={formatCurrency(results.fees, currency)} />
          <ResultCard label="Profit" value={formatCurrency(results.profit, currency)} />
          <ResultCard label="ROI" value={`${formatNumber(results.roi)}%`} />
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

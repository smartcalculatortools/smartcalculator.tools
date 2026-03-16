"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import { averageEntryPrice } from "@/lib/calculators/crypto";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function CryptoDcaCalculator({ onInsightsChange }: CalculatorProps) {
  const [p1, setP1] = useState(100);
  const [a1, setA1] = useState(1);
  const [p2, setP2] = useState(120);
  const [a2, setA2] = useState(1);
  const [p3, setP3] = useState(80);
  const [a3, setA3] = useState(2);

  const results = useMemo(() => {
    return averageEntryPrice([
      { price: p1, amount: a1 },
      { price: p2, amount: a2 },
      { price: p3, amount: a3 },
    ]);
  }, [p1, a1, p2, a2, p3, a3]);

  const insights = useMemo<CalculatorInsights>(() => {
    const purchases = [
      { label: "Buy 1", price: p1, amount: a1 },
      { label: "Buy 2", price: p2, amount: a2 },
      { label: "Buy 3", price: p3, amount: a3 },
    ];

    const rows = purchases.map((purchase) => [
      purchase.label,
      formatCurrency(purchase.price, currency),
      formatNumber(purchase.amount),
      formatCurrency(purchase.price * purchase.amount, currency),
    ]);
    rows.push([
      "Average",
      formatCurrency(results.average, currency),
      formatNumber(results.totalAmount),
      formatCurrency(results.totalCost, currency),
    ]);

    const chartPoints = [
      { label: "P1", value: p1 },
      { label: "P2", value: p2 },
      { label: "P3", value: p3 },
      { label: "Avg", value: results.average },
    ];

    return {
      table: {
        title: "Purchase summary",
        columns: ["Entry", "Price", "Amount", "Cost"],
        rows,
        note: "Average is weighted by amount, not by number of entries.",
      },
      chart: {
        title: "Entry prices vs average",
        xLabel: "Entry",
        yLabel: "Price",
        format: "number",
        points: chartPoints,
        note: "Average price reflects the weighted cost basis.",
      },
    };
  }, [a1, a2, a3, p1, p2, p3, results.average, results.totalAmount, results.totalCost]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Enter multiple buys to compute an average entry price.
        </p>
        <div className="mt-6 space-y-4">
          <PurchaseRow index={1} price={p1} amount={a1} setPrice={setP1} setAmount={setA1} />
          <PurchaseRow index={2} price={p2} amount={a2} setPrice={setP2} setAmount={setA2} />
          <PurchaseRow index={3} price={p3} amount={a3} setPrice={setP3} setAmount={setA3} />
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <div className="mt-6 grid gap-4">
          <ResultCard label="Average entry" value={formatCurrency(results.average, currency)} />
          <ResultCard label="Total invested" value={formatCurrency(results.totalCost, currency)} />
          <ResultCard label="Total quantity" value={formatNumber(results.totalAmount)} />
        </div>
      </div>
    </div>
  );
}

function PurchaseRow({
  index,
  price,
  amount,
  setPrice,
  setAmount,
}: {
  index: number;
  price: number;
  amount: number;
  setPrice: (value: number) => void;
  setAmount: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">Purchase {index}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs text-muted">
          Price
          <input
            type="number"
            step={0.01}
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            className="rounded-xl border border-stroke bg-white px-3 py-2 text-base text-ink"
          />
        </label>
        <label className="grid gap-1 text-xs text-muted">
          Amount
          <input
            type="number"
            step={0.0001}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="rounded-xl border border-stroke bg-white px-3 py-2 text-base text-ink"
          />
        </label>
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

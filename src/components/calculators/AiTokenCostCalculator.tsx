"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/calculators/format";
import { tokenCost } from "@/lib/calculators/ai";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function AiTokenCostCalculator({ onInsightsChange }: CalculatorProps) {
  const [inputTokens, setInputTokens] = useState(100000);
  const [outputTokens, setOutputTokens] = useState(50000);
  const [inputRate, setInputRate] = useState(1.5);
  const [outputRate, setOutputRate] = useState(2.0);

  const result = useMemo(() => {
    return tokenCost({ inputTokens, outputTokens, inputRate, outputRate });
  }, [inputTokens, outputTokens, inputRate, outputRate]);

  const insights = useMemo<CalculatorInsights>(() => {
    const workloads = [
      { label: "0.5x", multiplier: 0.5 },
      { label: "1x", multiplier: 1 },
      { label: "2x", multiplier: 2 },
    ];

    const rows = workloads.map((item) => {
      const inputs = {
        inputTokens: inputTokens * item.multiplier,
        outputTokens: outputTokens * item.multiplier,
        inputRate,
        outputRate,
      };
      const cost = tokenCost(inputs);
      return [
        item.label,
        `${Math.round(inputs.inputTokens).toLocaleString("en-US")}`,
        `${Math.round(inputs.outputTokens).toLocaleString("en-US")}`,
        formatCurrency(cost.total, currency),
      ];
    });

    const chartPoints = workloads.map((item) => {
      const cost = tokenCost({
        inputTokens: inputTokens * item.multiplier,
        outputTokens: outputTokens * item.multiplier,
        inputRate,
        outputRate,
      });
      return { label: item.label, value: cost.total };
    });

    return {
      table: {
        title: "Cost by workload size",
        columns: ["Workload", "Input tokens", "Output tokens", "Total cost"],
        rows,
        note: "Token counts scale linearly with workload size.",
      },
      chart: {
        title: "Total cost vs workload",
        xLabel: "Workload",
        yLabel: "Total cost",
        format: "currency",
        points: chartPoints,
        note: "Use this to estimate cost growth with volume.",
      },
    };
  }, [inputRate, inputTokens, outputRate, outputTokens]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Calculate costs per 1K tokens for input and output.
        </p>
        <div className="mt-6 space-y-4">
          <Input label="Input tokens" value={inputTokens} onChange={setInputTokens} />
          <Input label="Output tokens" value={outputTokens} onChange={setOutputTokens} />
          <Input label="Input rate ($ / 1K)" value={inputRate} onChange={setInputRate} />
          <Input label="Output rate ($ / 1K)" value={outputRate} onChange={setOutputRate} />
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <div className="mt-6 grid gap-4">
          <ResultCard label="Input cost" value={formatCurrency(result.inputCost, currency)} />
          <ResultCard label="Output cost" value={formatCurrency(result.outputCost, currency)} />
          <ResultCard label="Total" value={formatCurrency(result.total, currency)} />
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

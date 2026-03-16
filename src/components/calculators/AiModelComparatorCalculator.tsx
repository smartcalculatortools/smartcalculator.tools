"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import { compareModels } from "@/lib/calculators/ai";
import type { CalculatorInsights } from "@/lib/insights";

const currency = "USD";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function AiModelComparatorCalculator({ onInsightsChange }: CalculatorProps) {
  const [inputTokens, setInputTokens] = useState(50000);
  const [outputTokens, setOutputTokens] = useState(20000);

  const [modelAInput, setModelAInput] = useState(1.0);
  const [modelAOutput, setModelAOutput] = useState(2.0);
  const [modelBInput, setModelBInput] = useState(0.5);
  const [modelBOutput, setModelBOutput] = useState(1.5);

  const comparison = useMemo(() => {
    return compareModels({
      inputTokens,
      outputTokens,
      modelA: { inputRate: modelAInput, outputRate: modelAOutput },
      modelB: { inputRate: modelBInput, outputRate: modelBOutput },
    });
  }, [inputTokens, outputTokens, modelAInput, modelAOutput, modelBInput, modelBOutput]);

  const insights = useMemo<CalculatorInsights>(() => {
    const rows = [
      [
        "Model A",
        `${formatNumber(modelAInput)}`,
        `${formatNumber(modelAOutput)}`,
        formatCurrency(comparison.costA, currency),
      ],
      [
        "Model B",
        `${formatNumber(modelBInput)}`,
        `${formatNumber(modelBOutput)}`,
        formatCurrency(comparison.costB, currency),
      ],
      [
        "Delta",
        "-",
        "-",
        formatCurrency(Math.abs(comparison.delta), currency),
      ],
    ];

    const chartPoints = [
      { label: "Model A", value: comparison.costA },
      { label: "Model B", value: comparison.costB },
      { label: "Delta", value: Math.abs(comparison.delta) },
    ];

    return {
      table: {
        title: "Model cost breakdown",
        columns: ["Model", "Input rate", "Output rate", "Total cost"],
        rows,
        note: "Delta shows the absolute cost difference.",
      },
      chart: {
        title: "Cost comparison",
        xLabel: "Model",
        yLabel: "Total cost",
        format: "currency",
        points: chartPoints,
        note: "Compare both totals before selecting a model.",
      },
    };
  }, [comparison.costA, comparison.costB, comparison.delta, modelAInput, modelAOutput, modelBInput, modelBOutput]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Compare two pricing sets on the same workload.
        </p>
        <div className="mt-6 space-y-4">
          <Input label="Input tokens" value={inputTokens} onChange={setInputTokens} />
          <Input label="Output tokens" value={outputTokens} onChange={setOutputTokens} />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <ModelCard
            title="Model A"
            inputRate={modelAInput}
            outputRate={modelAOutput}
            setInputRate={setModelAInput}
            setOutputRate={setModelAOutput}
          />
          <ModelCard
            title="Model B"
            inputRate={modelBInput}
            outputRate={modelBOutput}
            setInputRate={setModelBInput}
            setOutputRate={setModelBOutput}
          />
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <div className="mt-6 grid gap-4">
          <ResultCard label="Model A" value={formatCurrency(comparison.costA, currency)} />
          <ResultCard label="Model B" value={formatCurrency(comparison.costB, currency)} />
          <ResultCard
            label="Difference"
            value={`${formatNumber(Math.abs(comparison.delta))} ${comparison.delta > 0 ? "A higher" : "B higher"}`}
          />
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

function ModelCard({
  title,
  inputRate,
  outputRate,
  setInputRate,
  setOutputRate,
}: {
  title: string;
  inputRate: number;
  outputRate: number;
  setInputRate: (value: number) => void;
  setOutputRate: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{title}</p>
      <div className="mt-3 grid gap-3">
        <label className="grid gap-1 text-xs text-muted">
          Input rate ($ / 1K)
          <input
            type="number"
            step={0.01}
            value={inputRate}
            onChange={(event) => setInputRate(Number(event.target.value))}
            className="rounded-xl border border-stroke bg-white px-3 py-2 text-base text-ink"
          />
        </label>
        <label className="grid gap-1 text-xs text-muted">
          Output rate ($ / 1K)
          <input
            type="number"
            step={0.01}
            value={outputRate}
            onChange={(event) => setOutputRate(Number(event.target.value))}
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

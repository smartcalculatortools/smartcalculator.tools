"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import {
  baseFromPercent,
  percentChange,
  percentDifference,
  percentOf,
  percentageOf,
} from "@/lib/calculators/percentage";
import type { CalculatorInsights } from "@/lib/insights";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function PercentageCalculator({ onInsightsChange }: CalculatorProps) {
  const [percent, setPercent] = useState(25);
  const [base, setBase] = useState(200);
  const [part, setPart] = useState(30);
  const [total, setTotal] = useState(120);
  const [fromValue, setFromValue] = useState(80);
  const [toValue, setToValue] = useState(100);
  const [differenceA, setDifferenceA] = useState(80);
  const [differenceB, setDifferenceB] = useState(100);
  const [basePercent, setBasePercent] = useState(25);
  const [baseResult, setBaseResult] = useState(50);
  const [fromPercent, setFromPercent] = useState(5);
  const [toPercent, setToPercent] = useState(7.5);

  const percentResult = useMemo(() => percentageOf(percent, base), [percent, base]);
  const shareResult = useMemo(() => percentOf(part, total), [part, total]);
  const changeResult = useMemo(() => percentChange(fromValue, toValue), [fromValue, toValue]);
  const differenceResult = useMemo(
    () => percentDifference(differenceA, differenceB),
    [differenceA, differenceB]
  );
  const originalValue = useMemo(
    () => baseFromPercent(basePercent, baseResult),
    [basePercent, baseResult]
  );
  const pointChange = useMemo(() => toPercent - fromPercent, [fromPercent, toPercent]);
  const relativePercentChange = useMemo(
    () => percentChange(fromPercent, toPercent),
    [fromPercent, toPercent]
  );

  const summaryRows = useMemo(
    () => [
      [
        "Percent of a number",
        `${formatNumber(percent)}% of ${formatNumber(base)}`,
        formatNumber(percentResult),
      ],
      [
        "Percent share",
        `${formatNumber(part)} of ${formatNumber(total)}`,
        `${formatNumber(shareResult)}%`,
      ],
      [
        "Percent change",
        `${formatNumber(fromValue)} → ${formatNumber(toValue)}`,
        `${formatNumber(changeResult)}%`,
      ],
      [
        "Percent difference",
        `${formatNumber(differenceA)} vs ${formatNumber(differenceB)}`,
        `${formatNumber(differenceResult)}%`,
      ],
      [
        "Find the base value",
        `${formatNumber(basePercent)}% = ${formatNumber(baseResult)}`,
        formatNumber(originalValue),
      ],
      [
        "Percentage points",
        `${formatNumber(fromPercent)}% → ${formatNumber(toPercent)}%`,
        `${formatNumber(pointChange)} pts`,
      ],
    ],
    [
      base,
      basePercent,
      baseResult,
      changeResult,
      differenceA,
      differenceB,
      differenceResult,
      fromValue,
      originalValue,
      part,
      pointChange,
      percent,
      percentResult,
      fromPercent,
      toPercent,
      shareResult,
      toValue,
      total,
    ]
  );

  const insights = useMemo<CalculatorInsights>(() => {
    const rows = [
      ["Percent of", `${formatNumber(percentResult)}`],
      ["Percent share", `${formatNumber(shareResult)}%`],
      ["Percent change", `${formatNumber(changeResult)}%`],
      ["Percent difference", `${formatNumber(differenceResult)}%`],
      ["Base value", `${formatNumber(originalValue)}`],
    ];

    const chartPoints = [
      { label: "Percent of", value: percentResult },
      { label: "Share %", value: shareResult },
      { label: "Change %", value: changeResult },
      { label: "Diff %", value: differenceResult },
      { label: "Base", value: originalValue },
    ];

    return {
      table: {
        title: "Percentage results summary",
        columns: ["Scenario", "Result"],
        rows,
        note: "Share and change are shown as percentages.",
      },
      chart: {
        title: "Output comparison",
        xLabel: "Scenario",
        yLabel: "Value",
        format: "number",
        points: chartPoints,
        note: "Percent values are plotted as numeric points.",
      },
    };
  }, [changeResult, differenceResult, originalValue, percentResult, shareResult]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Percent of a number</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input label="Percent" value={percent} onChange={setPercent} />
          <Input label="Number" value={base} onChange={setBase} />
          <Result label="Result" value={formatNumber(percentResult)} />
        </div>
      </section>

      <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Percent share</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input label="Part" value={part} onChange={setPart} />
          <Input label="Total" value={total} onChange={setTotal} />
          <Result label="Percent" value={`${formatNumber(shareResult)}%`} />
        </div>
      </section>

      <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Percent change</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input label="From" value={fromValue} onChange={setFromValue} />
          <Input label="To" value={toValue} onChange={setToValue} />
          <Result label="Change" value={`${formatNumber(changeResult)}%`} />
        </div>
      </section>

      <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Percent difference</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input label="Value A" value={differenceA} onChange={setDifferenceA} />
          <Input label="Value B" value={differenceB} onChange={setDifferenceB} />
          <Result label="Difference" value={`${formatNumber(differenceResult)}%`} />
        </div>
      </section>

      <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Find the base value</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input label="Percent" value={basePercent} onChange={setBasePercent} />
          <Input label="Result" value={baseResult} onChange={setBaseResult} />
          <Result label="Base" value={`${formatNumber(originalValue)}`} />
        </div>
      </section>

      <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Percentage points</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input
            label="From (%)"
            value={fromPercent}
            onChange={setFromPercent}
          />
          <Input label="To (%)" value={toPercent} onChange={setToPercent} />
          <Result
            label="Point change"
            value={`${formatNumber(pointChange)} pts`}
          />
        </div>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Result
            label="Relative change"
            value={`${formatNumber(relativePercentChange)}%`}
          />
          <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-3 text-xs text-muted sm:col-span-2">
            Percentage points are absolute changes, while relative change is a percent change.
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Summary table</h2>
        <div className="mt-4 overflow-auto rounded-2xl border border-stroke bg-white/70">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-4 py-3 text-left">Scenario</th>
                <th className="px-4 py-3 text-left">Inputs</th>
                <th className="px-4 py-3 text-left">Result</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row) => (
                <tr key={row[0]} className="border-t border-stroke/60">
                  <td className="px-4 py-2">{row[0]}</td>
                  <td className="px-4 py-2">{row[1]}</td>
                  <td className="px-4 py-2 font-semibold text-ink">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 text-sm text-muted">
      {label}
      <input
        type="number"
        step={0.1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
      />
    </label>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
      <p className="mt-2 text-xl font-semibold text-ink">{value}</p>
    </div>
  );
}

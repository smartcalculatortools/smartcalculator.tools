"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import {
  addFractions,
  approximateFraction,
  divideFractions,
  fractionToDecimal,
  multiplyFractions,
  reduceFraction,
  subtractFractions,
} from "@/lib/calculators/fraction";
import type { CalculatorInsights } from "@/lib/insights";

const operations = [
  { value: "add", label: "Add" },
  { value: "subtract", label: "Subtract" },
  { value: "multiply", label: "Multiply" },
  { value: "divide", label: "Divide" },
] as const;

type Operation = (typeof operations)[number]["value"];

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function FractionCalculator({ onInsightsChange }: CalculatorProps) {
  const [aNum, setANum] = useState(1);
  const [aDen, setADen] = useState(2);
  const [bNum, setBNum] = useState(1);
  const [bDen, setBDen] = useState(3);
  const [aWhole, setAWhole] = useState(0);
  const [bWhole, setBWhole] = useState(0);
  const [operation, setOperation] = useState<Operation>("add");
  const [useMixed, setUseMixed] = useState(false);
  const [decimalInput, setDecimalInput] = useState("0.5");
  const [simpNum, setSimpNum] = useState(6);
  const [simpDen, setSimpDen] = useState(8);

  const result = useMemo(() => {
    const left = reduceFraction(
      useMixed
        ? mixedToFraction(aWhole, aNum, aDen)
        : { numerator: aNum, denominator: aDen }
    );
    const right = reduceFraction(
      useMixed
        ? mixedToFraction(bWhole, bNum, bDen)
        : { numerator: bNum, denominator: bDen }
    );
    if (!left || !right) return null;

    switch (operation) {
      case "add":
        return addFractions(left, right);
      case "subtract":
        return subtractFractions(left, right);
      case "multiply":
        return multiplyFractions(left, right);
      case "divide":
        return divideFractions(left, right);
      default:
        return null;
    }
  }, [aNum, aDen, aWhole, bNum, bDen, bWhole, operation, useMixed]);

  const decimal = useMemo(() => {
    return result ? fractionToDecimal(result) : null;
  }, [result]);

  const mixedResult = useMemo(() => {
    return result ? fractionToMixed(result) : null;
  }, [result]);

  const decimalAsFraction = useMemo(() => {
    const value = Number(decimalInput);
    if (!Number.isFinite(value)) return null;
    return approximateFraction(value, 10000);
  }, [decimalInput]);

  const simplified = useMemo(() => {
    return reduceFraction({ numerator: simpNum, denominator: simpDen });
  }, [simpDen, simpNum]);

  const referenceRows = useMemo(() => {
    const baseFractions = [
      { numerator: 1, denominator: 2 },
      { numerator: 1, denominator: 3 },
      { numerator: 2, denominator: 3 },
      { numerator: 1, denominator: 4 },
      { numerator: 3, denominator: 4 },
      { numerator: 1, denominator: 5 },
      { numerator: 2, denominator: 5 },
    ];
    return baseFractions.map((fraction) => {
      const decimal = fractionToDecimal(fraction) ?? 0;
      return {
        label: `${fraction.numerator}/${fraction.denominator}`,
        decimal,
      };
    });
  }, []);

  const insights = useMemo<CalculatorInsights>(() => {
    const left = reduceFraction(
      useMixed
        ? mixedToFraction(aWhole, aNum, aDen)
        : { numerator: aNum, denominator: aDen }
    );
    const right = reduceFraction(
      useMixed
        ? mixedToFraction(bWhole, bNum, bDen)
        : { numerator: bNum, denominator: bDen }
    );
    const leftDecimal = left ? fractionToDecimal(left) : null;
    const rightDecimal = right ? fractionToDecimal(right) : null;

    const mixedLabel = (value: { whole: number; numerator: number; denominator: number } | null) =>
      value ? `${value.whole} ${value.numerator}/${value.denominator}` : "Invalid";

    const rows = [
      ["Fraction A", left ? `${left.numerator}/${left.denominator}` : "Invalid"],
      ["Fraction B", right ? `${right.numerator}/${right.denominator}` : "Invalid"],
      ["Result", result ? `${result.numerator}/${result.denominator}` : "Invalid"],
      ["Mixed", mixedLabel(mixedResult)],
      ["Decimal", decimal !== null ? formatNumber(decimal) : "--"],
      [
        "Decimal → Fraction",
        decimalAsFraction
          ? `${decimalAsFraction.numerator}/${decimalAsFraction.denominator}`
          : "--",
      ],
    ];

    const chartPoints = [
      { label: "A", value: leftDecimal ?? 0 },
      { label: "B", value: rightDecimal ?? 0 },
      { label: "Result", value: decimal ?? 0 },
    ];

    return {
      table: {
        title: "Fraction summary",
        columns: ["Field", "Value"],
        rows,
        note: "Invalid fractions occur when a denominator is zero.",
      },
      chart: {
        title: "Decimal comparison",
        xLabel: "Fraction",
        yLabel: "Decimal value",
        format: "number",
        points: chartPoints,
        note: "Use the decimal view for quick size comparison.",
      },
    };
  }, [
    aDen,
    aNum,
    aWhole,
    bDen,
    bNum,
    bWhole,
    decimal,
    decimalAsFraction,
    mixedResult,
    result,
    useMixed,
  ]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Work with two fractions and choose an operation.
        </p>
        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-sm text-ink">
          <input
            type="checkbox"
            checked={useMixed}
            onChange={(event) => setUseMixed(event.target.checked)}
            className="h-4 w-4"
          />
          Use mixed numbers
        </label>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <FractionInputs
            label="Fraction A"
            numerator={aNum}
            denominator={aDen}
            whole={aWhole}
            showWhole={useMixed}
            setWhole={setAWhole}
            setNumerator={setANum}
            setDenominator={setADen}
          />
          <FractionInputs
            label="Fraction B"
            numerator={bNum}
            denominator={bDen}
            whole={bWhole}
            showWhole={useMixed}
            setWhole={setBWhole}
            setNumerator={setBNum}
            setDenominator={setBDen}
          />
        </div>
        <label className="mt-6 grid gap-2 text-sm text-muted">
          Operation
          <select
            value={operation}
            onChange={(event) => setOperation(event.target.value as Operation)}
            className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
          >
            {operations.map((op) => (
              <option key={op.value} value={op.value}>
                {op.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          Reduced fraction and decimal form.
        </p>
        <div className="mt-6 grid gap-4">
          <ResultCard
            label="Fraction"
            value={result ? `${result.numerator}/${result.denominator}` : "--"}
          />
          <ResultCard
            label="Decimal"
            value={decimal !== null ? formatNumber(decimal) : "--"}
          />
          <ResultCard
            label="Mixed"
            value={
              mixedResult
                ? `${mixedResult.whole} ${mixedResult.numerator}/${mixedResult.denominator}`
                : "--"
            }
          />
        </div>
      </div>

      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft lg:col-span-2">
        <h3 className="font-display text-2xl text-ink">Decimal to fraction</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-muted">
            Decimal value
            <input
              type="number"
              step={0.0001}
              value={decimalInput}
              onChange={(event) => setDecimalInput(event.target.value)}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <ResultCard
            label="Fraction"
            value={
              decimalAsFraction
                ? `${decimalAsFraction.numerator}/${decimalAsFraction.denominator}`
                : "--"
            }
          />
        </div>
      </div>

      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft lg:col-span-2">
        <h3 className="font-display text-2xl text-ink">Simplify a fraction</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm text-muted">
            Numerator
            <input
              type="number"
              value={simpNum}
              onChange={(event) => setSimpNum(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Denominator
            <input
              type="number"
              value={simpDen}
              onChange={(event) => setSimpDen(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <ResultCard
            label="Reduced"
            value={
              simplified ? `${simplified.numerator}/${simplified.denominator}` : "Invalid"
            }
          />
        </div>
      </div>

      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft lg:col-span-2">
        <h3 className="font-display text-2xl text-ink">Common fractions</h3>
        <div className="mt-4 overflow-auto rounded-2xl border border-stroke bg-white/70">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-4 py-3 text-left">Fraction</th>
                <th className="px-4 py-3 text-left">Decimal</th>
                <th className="px-4 py-3 text-left">Percent</th>
              </tr>
            </thead>
            <tbody>
              {referenceRows.map((row) => (
                <tr key={row.label} className="border-t border-stroke/60">
                  <td className="px-4 py-2">{row.label}</td>
                  <td className="px-4 py-2">{formatNumber(row.decimal)}</td>
                  <td className="px-4 py-2">
                    {formatNumber(row.decimal * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FractionInputs({
  label,
  numerator,
  denominator,
  whole,
  showWhole,
  setWhole,
  setNumerator,
  setDenominator,
}: {
  label: string;
  numerator: number;
  denominator: number;
  whole: number;
  showWhole: boolean;
  setWhole: (value: number) => void;
  setNumerator: (value: number) => void;
  setDenominator: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
      <div className="mt-3 grid gap-3">
        {showWhole && (
          <label className="grid gap-1 text-xs text-muted">
            Whole
            <input
              type="number"
              value={whole}
              onChange={(event) => setWhole(Number(event.target.value))}
              className="rounded-xl border border-stroke bg-white px-3 py-2 text-base text-ink"
            />
          </label>
        )}
        <label className="grid gap-1 text-xs text-muted">
          Numerator
          <input
            type="number"
            value={numerator}
            onChange={(event) => setNumerator(Number(event.target.value))}
            className="rounded-xl border border-stroke bg-white px-3 py-2 text-base text-ink"
          />
        </label>
        <label className="grid gap-1 text-xs text-muted">
          Denominator
          <input
            type="number"
            value={denominator}
            onChange={(event) => setDenominator(Number(event.target.value))}
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

function mixedToFraction(whole: number, numerator: number, denominator: number) {
  const safeDen = denominator === 0 ? 0 : denominator;
  const absWhole = Math.abs(whole);
  const absNumerator = Math.abs(numerator);
  const sign = whole < 0 ? -1 : numerator < 0 ? -1 : 1;
  return {
    numerator: sign * (absWhole * safeDen + absNumerator),
    denominator: safeDen,
  };
}

function fractionToMixed(fraction: { numerator: number; denominator: number }) {
  if (fraction.denominator === 0) return null;
  const sign = fraction.numerator < 0 ? -1 : 1;
  const absNum = Math.abs(fraction.numerator);
  const whole = Math.floor(absNum / fraction.denominator);
  const remainder = absNum % fraction.denominator;
  return {
    whole: sign * whole,
    numerator: remainder,
    denominator: fraction.denominator,
  };
}

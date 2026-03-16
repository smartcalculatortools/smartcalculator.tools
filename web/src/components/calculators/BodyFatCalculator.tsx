"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import {
  bmiFromMetric,
  bodyFatPercentageBMI,
  bodyFatPercentageUSNavy,
  type Sex,
} from "@/lib/calculators/health";
import {
  cmToFtIn,
  cmToIn,
  ftInToCm,
  inToCm,
  kgToLb,
  lbToKg,
  roundTo,
} from "@/lib/units";
import type { CalculatorInsights } from "@/lib/insights";

type UnitMode = "metric" | "us";
type MethodMode = "us-navy" | "bmi";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function BodyFatCalculator({ onInsightsChange }: CalculatorProps) {
  const [unit, setUnit] = useState<UnitMode>("metric");
  const [method, setMethod] = useState<MethodMode>("us-navy");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [weightKg, setWeightKg] = useState(80);
  const [heightCm, setHeightCm] = useState(180);
  const [waistCm, setWaistCm] = useState(90);
  const [neckCm, setNeckCm] = useState(40);
  const [hipCm, setHipCm] = useState(95);
  const [targetBodyFat, setTargetBodyFat] = useState(18);

  const heightParts = useMemo(() => cmToFtIn(heightCm), [heightCm]);
  const heightFt = heightParts.feet;
  const heightIn = roundTo(heightParts.inches, 1);
  const waistIn = useMemo(() => roundTo(cmToIn(waistCm), 1), [waistCm]);
  const neckIn = useMemo(() => roundTo(cmToIn(neckCm), 1), [neckCm]);
  const hipIn = useMemo(() => roundTo(cmToIn(hipCm), 1), [hipCm]);
  const weightLb = useMemo(() => roundTo(kgToLb(weightKg), 1), [weightKg]);

  const bodyFatNavy = useMemo(() => {
    return bodyFatPercentageUSNavy({
      sex,
      heightCm,
      waistCm,
      neckCm,
      hipCm: sex === "female" ? hipCm : undefined,
    });
  }, [sex, heightCm, waistCm, neckCm, hipCm]);

  const bmi = useMemo(() => bmiFromMetric(weightKg, heightCm), [weightKg, heightCm]);
  const bodyFatBmi = useMemo(() => {
    return bodyFatPercentageBMI({ bmi, age, sex });
  }, [bmi, age, sex]);

  const selectedBodyFat = method === "us-navy" ? bodyFatNavy : bodyFatBmi;
  const fatMass = useMemo(() => {
    return (weightKg * selectedBodyFat) / 100;
  }, [weightKg, selectedBodyFat]);
  const leanMass = useMemo(() => {
    return Math.max(0, weightKg - fatMass);
  }, [weightKg, fatMass]);

  const targetWeight = useMemo(() => {
    const safeTarget = Math.max(1, Math.min(60, targetBodyFat));
    const lean = Math.max(0, leanMass);
    const targetRatio = 1 - safeTarget / 100;
    if (targetRatio <= 0) return 0;
    return lean / targetRatio;
  }, [leanMass, targetBodyFat]);

  const targetFatMass = useMemo(() => {
    const safeTarget = Math.max(1, Math.min(60, targetBodyFat));
    return (targetWeight * safeTarget) / 100;
  }, [targetBodyFat, targetWeight]);

  const fatToChange = useMemo(() => {
    return fatMass - targetFatMass;
  }, [fatMass, targetFatMass]);

  const waistToHip = useMemo(() => {
    return hipCm > 0 ? waistCm / hipCm : 0;
  }, [hipCm, waistCm]);

  const waistToHeight = useMemo(() => {
    return heightCm > 0 ? waistCm / heightCm : 0;
  }, [heightCm, waistCm]);

  const categoryRows = useMemo(() => {
    return sex === "female"
      ? [
          ["Essential", "10-13%"],
          ["Athletes", "14-20%"],
          ["Fitness", "21-24%"],
          ["Average", "25-31%"],
          ["High", "32%+"],
        ]
      : [
          ["Essential", "2-5%"],
          ["Athletes", "6-13%"],
          ["Fitness", "14-17%"],
          ["Average", "18-24%"],
          ["High", "25%+"],
        ];
  }, [sex]);

  const insights = useMemo<CalculatorInsights>(() => {
    const value = selectedBodyFat ? `${formatNumber(selectedBodyFat)}%` : "--";
    const rows = [
      ["Your estimate", value],
      ["Target body fat", `${formatNumber(targetBodyFat)}%`],
      ...categoryRows,
    ];

    const chartPoints = [
      { label: "Low", value: sex === "female" ? 14 : 6 },
      { label: "Avg", value: sex === "female" ? 28 : 21 },
      { label: "High", value: sex === "female" ? 35 : 28 },
      { label: "You", value: selectedBodyFat ?? 0 },
    ];

    return {
      table: {
        title: "Body fat context",
        columns: ["Range", "Percent"],
        rows,
        note: "Ranges are generalized and vary by source and age.",
      },
      chart: {
        title: "Body fat reference points",
        xLabel: "Range",
        yLabel: "Body fat percent",
        format: "percent",
        points: chartPoints,
        note: "Your estimate is shown alongside typical ranges.",
      },
    };
  }, [categoryRows, selectedBodyFat, sex, targetBodyFat]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Compare US Navy tape method and BMI-based estimates.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {(["metric", "us"] as UnitMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setUnit(mode)}
              className={`rounded-full border px-4 py-2 text-xs ${
                unit === mode
                  ? "border-ink bg-ink text-white"
                  : "border-stroke text-ink"
              }`}
            >
              {mode === "metric" ? "Metric" : "US"}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {([
            { id: "us-navy", label: "US Navy" },
            { id: "bmi", label: "BMI method" },
          ] as { id: MethodMode; label: string }[]).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMethod(item.id)}
              className={`rounded-full border px-4 py-2 text-xs ${
                method === item.id
                  ? "border-ink bg-ink text-white"
                  : "border-stroke text-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <label className="grid gap-2 text-sm text-muted">
            Sex
            <select
              value={sex}
              onChange={(event) => setSex(event.target.value as Sex)}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Age
            <input
              type="number"
              min={1}
              step={1}
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Target body fat (%)
            <input
              type="number"
              min={1}
              max={60}
              step={0.1}
              value={targetBodyFat}
              onChange={(event) => setTargetBodyFat(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          {unit === "metric" ? (
            <>
              <label className="grid gap-2 text-sm text-muted">
                Weight (kg)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={weightKg}
                  onChange={(event) => setWeightKg(Number(event.target.value))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
              <label className="grid gap-2 text-sm text-muted">
                Height (cm)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={heightCm}
                  onChange={(event) => setHeightCm(Number(event.target.value))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
              <label className="grid gap-2 text-sm text-muted">
                Waist (cm)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={waistCm}
                  onChange={(event) => setWaistCm(Number(event.target.value))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
              <label className="grid gap-2 text-sm text-muted">
                Neck (cm)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={neckCm}
                  onChange={(event) => setNeckCm(Number(event.target.value))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
              {sex === "female" && (
                <label className="grid gap-2 text-sm text-muted">
                  Hip (cm)
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={hipCm}
                    onChange={(event) => setHipCm(Number(event.target.value))}
                    className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                  />
                </label>
              )}
            </>
          ) : (
            <>
              <label className="grid gap-2 text-sm text-muted">
                Weight (lb)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={weightLb}
                  onChange={(event) => setWeightKg(lbToKg(Number(event.target.value)))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-muted">
                  Height (ft)
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={heightFt}
                    onChange={(event) =>
                      setHeightCm(
                        ftInToCm(Number(event.target.value), heightIn)
                      )
                    }
                    className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Height (in)
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={heightIn}
                    onChange={(event) =>
                      setHeightCm(
                        ftInToCm(heightFt, Number(event.target.value))
                      )
                    }
                    className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                  />
                </label>
              </div>
              <label className="grid gap-2 text-sm text-muted">
                Waist (in)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={waistIn}
                  onChange={(event) => setWaistCm(inToCm(Number(event.target.value)))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
              <label className="grid gap-2 text-sm text-muted">
                Neck (in)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={neckIn}
                  onChange={(event) => setNeckCm(inToCm(Number(event.target.value)))}
                  className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                />
              </label>
              {sex === "female" && (
                <label className="grid gap-2 text-sm text-muted">
                  Hip (in)
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={hipIn}
                    onChange={(event) =>
                      setHipCm(inToCm(Number(event.target.value)))
                    }
                    className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                  />
                </label>
              )}
            </>
          )}
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          Estimated body fat percentage.
        </p>
        <div className="mt-6 grid gap-4">
          <ResultCard
            label="US Navy method"
            value={bodyFatNavy ? `${formatNumber(bodyFatNavy)}%` : "--"}
          />
          <ResultCard
            label="BMI method"
            value={bodyFatBmi ? `${formatNumber(bodyFatBmi)}%` : "--"}
          />
          <ResultCard
            label="Fat mass"
            value={`${formatNumber(fatMass)} kg`}
          />
          <ResultCard
            label="Lean mass"
            value={`${formatNumber(leanMass)} kg`}
          />
          <ResultCard
            label="Target weight"
            value={`${formatNumber(targetWeight)} kg`}
          />
          <ResultCard
            label="Fat to change"
            value={`${formatNumber(fatToChange)} kg`}
          />
          <ResultCard
            label="Waist-to-hip ratio"
            value={formatNumber(waistToHip)}
          />
          <ResultCard
            label="Waist-to-height ratio"
            value={formatNumber(waistToHeight)}
          />
        </div>
        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Body composition snapshot
          </p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Metric</th>
                  <th className="px-4 py-3 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Current weight", `${formatNumber(weightKg)} kg`],
                  ["Body fat (selected)", `${formatNumber(selectedBodyFat)}%`],
                  ["Fat mass", `${formatNumber(fatMass)} kg`],
                  ["Lean mass", `${formatNumber(leanMass)} kg`],
                  ["Target body fat", `${formatNumber(targetBodyFat)}%`],
                  ["Target weight", `${formatNumber(targetWeight)} kg`],
                  ["Target fat mass", `${formatNumber(targetFatMass)} kg`],
                  ["Fat to change", `${formatNumber(fatToChange)} kg`],
                  ["Waist-to-hip ratio", formatNumber(waistToHip)],
                  ["Waist-to-height ratio", formatNumber(waistToHeight)],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Category ranges
          </p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Range</th>
                  <th className="px-4 py-3 text-left">Percent</th>
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((row) => (
                  <tr key={row[0]} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row[0]}</td>
                    <td className="px-4 py-2">{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            Ranges are generalized and vary by age and source.
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

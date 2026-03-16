"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import {
  bmiCategory,
  bmiFromMetric,
  bmiPrime,
  healthyWeightRange,
  ponderalIndex,
  type Sex,
} from "@/lib/calculators/health";
import { ftInToCm, kgToLb, lbToKg, roundTo } from "@/lib/units";
import type { CalculatorInsights } from "@/lib/insights";

type UnitMode = "metric" | "us" | "other";

const bmiTable = [
  { label: "Underweight", range: "< 18.5" },
  { label: "Normal", range: "18.5 - 24.9" },
  { label: "Overweight", range: "25 - 29.9" },
  { label: "Obesity", range: "30+" },
];

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function BMICalculator({ onInsightsChange }: CalculatorProps) {
  const [unit, setUnit] = useState<UnitMode>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [targetBmi, setTargetBmi] = useState(22);

  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);

  const [weightLb, setWeightLb] = useState(154);
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);

  const [otherWeightKg, setOtherWeightKg] = useState(70);
  const [otherHeightM, setOtherHeightM] = useState(1.75);

  const metrics = useMemo(() => {
    let finalWeightKg = weightKg;
    let finalHeightCm = heightCm;

    if (unit === "us") {
      finalHeightCm = ftInToCm(heightFt, heightIn);
      finalWeightKg = lbToKg(weightLb);
    }

    if (unit === "other") {
      finalHeightCm = Math.max(0, otherHeightM) * 100;
      finalWeightKg = Math.max(0, otherWeightKg);
    }

    const bmi = bmiFromMetric(finalWeightKg, finalHeightCm);
    const category = bmiCategory(bmi);
    const prime = bmiPrime(bmi);
    const ponderal = ponderalIndex(finalWeightKg, finalHeightCm);
    const range = healthyWeightRange(finalHeightCm);

    return {
      weightKg: finalWeightKg,
      heightCm: finalHeightCm,
      bmi,
      category,
      prime,
      ponderal,
      range,
    };
  }, [
    unit,
    weightKg,
    heightCm,
    weightLb,
    heightFt,
    heightIn,
    otherWeightKg,
    otherHeightM,
  ]);

  const bmiPosition = useMemo(() => {
    const min = 10;
    const max = 40;
    if (metrics.bmi === 0) return 0;
    const clamped = Math.max(min, Math.min(max, metrics.bmi));
    return ((clamped - min) / (max - min)) * 100;
  }, [metrics.bmi]);

  const weightTargets = useMemo(() => {
    const heightM = metrics.heightCm / 100;
    if (heightM <= 0) return [];
    const targets = [18.5, 25, 30, 35];
    return targets.map((bmi) => ({
      bmi,
      weight: bmi * heightM * heightM,
    }));
  }, [metrics.heightCm]);

  const targetWeight = useMemo(() => {
    const heightM = metrics.heightCm / 100;
    if (heightM <= 0) return 0;
    return Math.max(0, targetBmi) * heightM * heightM;
  }, [metrics.heightCm, targetBmi]);

  const insights = useMemo<CalculatorInsights>(() => {
    const heightM = metrics.heightCm / 100;
    const weightUnder = heightM > 0 ? 18.5 * heightM * heightM : 0;
    const weightNormal = heightM > 0 ? 24.9 * heightM * heightM : 0;
    const weightOver = heightM > 0 ? 29.9 * heightM * heightM : 0;
    const weightObese = heightM > 0 ? 30 * heightM * heightM : 0;

    const unitLabel = unit === "us" ? "lb" : "kg";
    const scale = unit === "us" ? kgToLb(1) : 1;
    const rows = [
      [
        "Underweight",
        `< ${formatNumber(roundTo(weightUnder * scale, 1))} ${unitLabel}`,
      ],
      [
        "Normal",
        `${formatNumber(roundTo(weightUnder * scale, 1))} - ${formatNumber(
          roundTo(weightNormal * scale, 1)
        )} ${unitLabel}`,
      ],
      [
        "Overweight",
        `${formatNumber(roundTo(weightNormal * scale, 1))} - ${formatNumber(
          roundTo(weightOver * scale, 1)
        )} ${unitLabel}`,
      ],
      [
        "Obesity",
        `> ${formatNumber(roundTo(weightObese * scale, 1))} ${unitLabel}`,
      ],
    ];

    const chartPoints = [
      { label: "Under", value: 18.5 },
      { label: "Normal", value: 24.9 },
      { label: "Over", value: 29.9 },
      { label: "Current", value: metrics.bmi },
    ];

    return {
      table: {
        title: "Weight ranges for your height",
        columns: ["Category", "Weight range"],
        rows,
        note: "Ranges use BMI thresholds applied to your height.",
      },
      chart: {
        title: "BMI thresholds vs current",
        xLabel: "Category",
        yLabel: "BMI value",
        format: "number",
        points: chartPoints,
        note: "Current BMI is shown against standard adult thresholds.",
      },
    };
  }, [metrics.bmi, metrics.heightCm, unit]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  const adultNote = age < 18;

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Inputs</h2>
          <p className="mt-2 text-sm text-muted">
            BMI uses height and weight to estimate body mass for adults.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {(["metric", "us", "other"] as UnitMode[]).map((mode) => (
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
                {mode.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
              Target BMI
              <input
                type="number"
                min={10}
                step={0.1}
                value={targetBmi}
                onChange={(event) => setTargetBmi(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
          </div>

          <div className="mt-6 space-y-4">
            {unit === "metric" && (
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
              </>
            )}

            {unit === "us" && (
              <>
                <label className="grid gap-2 text-sm text-muted">
                  Weight (lb)
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={weightLb}
                    onChange={(event) => setWeightLb(Number(event.target.value))}
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
                      onChange={(event) => setHeightFt(Number(event.target.value))}
                      className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-muted">
                    Height (in)
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={heightIn}
                      onChange={(event) => setHeightIn(Number(event.target.value))}
                      className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                    />
                  </label>
                </div>
              </>
            )}

            {unit === "other" && (
              <>
                <label className="grid gap-2 text-sm text-muted">
                  Weight (kg)
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={otherWeightKg}
                    onChange={(event) => setOtherWeightKg(Number(event.target.value))}
                    className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                  />
                </label>
                <label className="grid gap-2 text-sm text-muted">
                  Height (m)
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={otherHeightM}
                    onChange={(event) => setOtherHeightM(Number(event.target.value))}
                    className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
                  />
                </label>
              </>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Results</h2>
          <p className="mt-2 text-sm text-muted">
            BMI categories are general guidelines for adults.
          </p>
          <div className="mt-6 grid gap-4">
            <ResultCard label="Body mass index" value={formatNumber(metrics.bmi)} />
            <ResultCard label="Category" value={metrics.category || "--"} />
            <ResultCard
              label="Healthy weight range"
              value={`${formatNumber(metrics.range.min)} - ${formatNumber(
                metrics.range.max
              )} kg`}
            />
            <ResultCard
              label={`Target weight (BMI ${formatNumber(targetBmi)})`}
              value={`${formatNumber(
                unit === "us" ? kgToLb(targetWeight) : targetWeight
              )} ${unit === "us" ? "lb" : "kg"}`}
            />
            <ResultCard label="BMI Prime" value={formatNumber(metrics.prime)} />
            <ResultCard
              label="Ponderal Index"
              value={formatNumber(metrics.ponderal)}
            />
          </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">BMI scale</p>
          <div className="relative mt-3 h-3 rounded-full bg-gradient-to-r from-amber-200 via-emerald-300 to-rose-300">
            <div
              className="absolute -top-1 h-5 w-1.5 rounded-full bg-ink"
              style={{ left: `${bmiPosition}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted">
            <span>10</span>
            <span>25</span>
            <span>40</span>
          </div>
        </div>

        {weightTargets.length > 0 && (
          <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Target weights by BMI
            </p>
            <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-2 text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">BMI</th>
                    <th className="px-4 py-3 text-left">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {weightTargets.map((row) => (
                    <tr key={row.bmi} className="border-t border-stroke/60">
                      <td className="px-4 py-2">{formatNumber(row.bmi)}</td>
                      <td className="px-4 py-2">
                        {formatNumber(unit === "us" ? kgToLb(row.weight) : row.weight)}{" "}
                        {unit === "us" ? "lb" : "kg"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      </div>

      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h3 className="font-display text-2xl text-ink">BMI classifications</h3>
        <div className="mt-4 overflow-auto rounded-2xl border border-stroke bg-white/70">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">BMI range</th>
              </tr>
            </thead>
            <tbody>
              {bmiTable.map((row) => (
                <tr key={row.label} className="border-t border-stroke/60">
                  <td className="px-4 py-2 font-semibold text-ink">{row.label}</td>
                  <td className="px-4 py-2 text-muted">{row.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-sm text-muted">
          {adultNote ? (
            <p>
              You entered an age under 18. For children and teens, BMI should be
              interpreted using age- and sex-specific growth charts.
            </p>
          ) : (
            <p>
              BMI is a screening metric, not a diagnosis. Consider body
              composition and overall health.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h3 className="font-display text-2xl text-ink">References</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>World Health Organization BMI classification</li>
          <li>CDC BMI guidance for adults and children</li>
          <li>US Navy and academic references for Ponderal Index</li>
        </ul>
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

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import {
  activityMultipliers,
  bmrHarrisBenedict,
  bmrKatchMcArdle,
  bmrMifflinStJeor,
  dailyCalorieNeeds,
  type ActivityLevel,
  type Sex,
} from "@/lib/calculators/health";
import { cmToFtIn, ftInToCm, kgToLb, lbToKg, roundTo } from "@/lib/units";
import type { CalculatorInsights } from "@/lib/insights";

type UnitMode = "metric" | "us";
type BmrFormula = "mifflin" | "harris" | "katch";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function BMRCalculator({ onInsightsChange }: CalculatorProps) {
  const [unit, setUnit] = useState<UnitMode>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [formula, setFormula] = useState<BmrFormula>("mifflin");
  const [bodyFatPercent, setBodyFatPercent] = useState(20);

  const weightLb = useMemo(() => roundTo(kgToLb(weightKg), 1), [weightKg]);
  const heightParts = useMemo(() => cmToFtIn(heightCm), [heightCm]);
  const heightFt = heightParts.feet;
  const heightIn = roundTo(heightParts.inches, 1);

  const calculateBmr = useCallback(
    (weight: number, height: number, ageValue: number, sexValue: Sex) => {
      if (formula === "harris") {
        return bmrHarrisBenedict({
          weightKg: weight,
          heightCm: height,
          age: ageValue,
          sex: sexValue,
        });
      }
      if (formula === "katch") {
        return bmrKatchMcArdle({
          weightKg: weight,
          bodyFatPercent,
        });
      }
      return bmrMifflinStJeor({
        weightKg: weight,
        heightCm: height,
        age: ageValue,
        sex: sexValue,
      });
    },
    [formula, bodyFatPercent]
  );

  const bmr = useMemo(() => {
    return calculateBmr(weightKg, heightCm, age, sex);
  }, [calculateBmr, weightKg, heightCm, age, sex]);

  const tdeeRows = useMemo(() => {
    const levels: ActivityLevel[] = [
      "sedentary",
      "light",
      "moderate",
      "very",
      "extra",
    ];
    return levels.map((level) => {
      const calories = dailyCalorieNeeds({
        weightKg,
        heightCm,
        age,
        sex,
        activity: level,
        formula,
        bodyFatPercent,
      });
      return {
        level,
        multiplier: activityMultipliers[level],
        calories,
      };
    });
  }, [age, bodyFatPercent, formula, heightCm, sex, weightKg]);

  const insights = useMemo<CalculatorInsights>(() => {
    const baseWeight = Math.max(0, weightKg);
    const weights = [Math.max(0, baseWeight - 10), baseWeight, baseWeight + 10];

    const unitLabel = unit === "metric" ? "kg" : "lb";
    const displayWeights = weights.map((value) =>
      unit === "metric" ? value : kgToLb(value)
    );

    const rows = weights.map((weight, index) => [
      `${formatNumber(displayWeights[index] ?? weight)} ${unitLabel}`,
      `${formatNumber(calculateBmr(weight, heightCm, age, sex))} kcal`,
    ]);

    const chartPoints = weights.map((weight, index) => ({
      label: `${formatNumber(displayWeights[index] ?? weight)}${unitLabel}`,
      value: calculateBmr(weight, heightCm, age, sex),
    }));

    return {
      table: {
        title: "BMR by weight range",
        columns: ["Weight", "BMR estimate"],
        rows,
        note: "Uses the current age, height, and sex for comparison.",
      },
      chart: {
        title: "BMR vs weight",
        xLabel: "Weight",
        yLabel: "Calories per day",
        format: "number",
        points: chartPoints,
        note: "Heavier weights increase estimated resting calories.",
      },
    };
  }, [age, heightCm, sex, unit, weightKg, calculateBmr]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Basal metabolic rate estimate with multiple formulas.
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
        <div className="mt-6 space-y-4">
          <label className="grid gap-2 text-sm text-muted">
            Formula
            <select
              value={formula}
              onChange={(event) => setFormula(event.target.value as BmrFormula)}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            >
              <option value="mifflin">Mifflin-St Jeor</option>
              <option value="harris">Harris-Benedict</option>
              <option value="katch">Katch-McArdle</option>
            </select>
          </label>
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
          {formula === "katch" && (
            <label className="grid gap-2 text-sm text-muted">
              Body fat (%)
              <input
                type="number"
                min={0}
                max={60}
                step={0.1}
                value={bodyFatPercent}
                onChange={(event) => setBodyFatPercent(Number(event.target.value))}
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
            </label>
          )}
          <label className="grid gap-2 text-sm text-muted">
            Age
            <input
              type="number"
              min={0}
              step={1}
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
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
                  onChange={(event) =>
                    setWeightKg(lbToKg(Number(event.target.value)))
                  }
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
            </>
          )}
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          BMR is the estimated calories burned at rest per day.
        </p>
        <div className="mt-6 grid gap-4">
          <ResultCard label="BMR" value={`${formatNumber(bmr)} kcal/day`} />
        </div>
        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Daily calories by activity
          </p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Activity</th>
                  <th className="px-4 py-3 text-left">Multiplier</th>
                  <th className="px-4 py-3 text-left">Calories/day</th>
                </tr>
              </thead>
              <tbody>
                {tdeeRows.map((row) => (
                  <tr key={row.level} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.level}</td>
                    <td className="px-4 py-2">{formatNumber(row.multiplier)}x</td>
                    <td className="px-4 py-2">
                      {formatNumber(row.calories)} kcal
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            Uses your selected formula and body fat input if applicable.
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

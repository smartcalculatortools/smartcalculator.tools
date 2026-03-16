"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import {
  activityMultipliers,
  bmrFromFormula,
  dailyCalorieNeeds,
  type ActivityLevel,
  type BmrFormula,
  type Sex,
} from "@/lib/calculators/health";
import { cmToFtIn, ftInToCm, kgToLb, lbToKg, roundTo } from "@/lib/units";
import type { CalculatorInsights } from "@/lib/insights";

type UnitMode = "metric" | "us";

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little or no exercise)",
  light: "Light (1-3 days/week)",
  moderate: "Moderate (3-5 days/week)",
  very: "Very active (6-7 days/week)",
  extra: "Extra active (physical job + training)",
};

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function CalorieCalculator({ onInsightsChange }: CalculatorProps) {
  const [unit, setUnit] = useState<UnitMode>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState(30);
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");
  const [formula, setFormula] = useState<BmrFormula>("mifflin");
  const [bodyFatPercent, setBodyFatPercent] = useState(20);
  const [goalDelta, setGoalDelta] = useState(0);
  const [outputUnit, setOutputUnit] = useState<"kcal" | "kj">("kcal");

  const weightLb = useMemo(() => roundTo(kgToLb(weightKg), 1), [weightKg]);
  const heightParts = useMemo(() => cmToFtIn(heightCm), [heightCm]);
  const heightFt = heightParts.feet;
  const heightIn = roundTo(heightParts.inches, 1);

  const bmr = useMemo(() => {
    return bmrFromFormula({
      formula,
      weightKg,
      heightCm,
      age,
      sex,
      bodyFatPercent,
    });
  }, [age, bodyFatPercent, formula, heightCm, sex, weightKg]);

  const calories = useMemo(() => {
    return dailyCalorieNeeds({
      weightKg,
      heightCm,
      age,
      sex,
      activity,
      formula,
      bodyFatPercent,
    });
  }, [weightKg, heightCm, age, sex, activity, formula, bodyFatPercent]);

  const goalCalories = useMemo(() => {
    return Math.max(0, calories + goalDelta);
  }, [calories, goalDelta]);

  const goalPlans = useMemo(() => {
    const plans = [
      { label: "Maintain", delta: 0 },
      { label: "Mild loss", delta: -250 },
      { label: "Weight loss", delta: -500 },
      { label: "Aggressive loss", delta: -1000 },
      { label: "Mild gain", delta: 250 },
      { label: "Weight gain", delta: 500 },
    ];
    const kcalPerKg = 7700;
    return plans.map((plan) => {
      const daily = Math.max(0, calories + plan.delta);
      const weeklyChange = (plan.delta * 7) / kcalPerKg;
      return { ...plan, daily, weeklyChange };
    });
  }, [calories]);

  const weeklySchedule = useMemo(() => {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      maintenance: calories,
      goal: goalCalories,
    }));
  }, [calories, goalCalories]);

  const formatEnergy = useCallback(
    (value: number) => {
      if (outputUnit === "kj") {
        return `${formatNumber(value * 4.184)} kJ/day`;
      }
      return `${formatNumber(value)} kcal/day`;
    },
    [outputUnit]
  );

  const insights = useMemo<CalculatorInsights>(() => {
    const levels: ActivityLevel[] = ["sedentary", "light", "moderate", "very", "extra"];
    const rows = levels.map((level) => {
      const value = dailyCalorieNeeds({
        weightKg,
        heightCm,
        age,
        sex,
        activity: level,
        formula,
        bodyFatPercent,
      });
      return [
        activityLabels[level],
        `${formatNumber(activityMultipliers[level])}`,
        formatEnergy(value),
      ];
    });

    const chartPoints = (["sedentary", "moderate", "very"] as ActivityLevel[]).map(
      (level) => ({
        label: level === "sedentary" ? "Sed" : level === "moderate" ? "Mod" : "Very",
        value: dailyCalorieNeeds({
          weightKg,
          heightCm,
          age,
          sex,
          activity: level,
          formula,
          bodyFatPercent,
        }),
      })
    );

    return {
      table: {
        title: "Activity multipliers",
        columns: ["Level", "Multiplier", "Calories"],
        rows,
        note: "Choose the closest activity level for your routine.",
      },
      chart: {
        title: "Maintenance calories by activity",
        xLabel: "Activity level",
        yLabel: outputUnit === "kj" ? "Kilojoules per day" : "Calories per day",
        format: "number",
        points: chartPoints,
        note: "Higher activity levels require more daily calories.",
      },
    };
  }, [age, bodyFatPercent, formatEnergy, formula, heightCm, outputUnit, sex, weightKg]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Estimate maintenance calories using activity levels.
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
            Activity level
            <select
              value={activity}
              onChange={(event) => setActivity(event.target.value as ActivityLevel)}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            >
              {Object.entries(activityLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Goal adjustment (kcal)
            <input
              type="number"
              step={10}
              value={goalDelta}
              onChange={(event) => setGoalDelta(Number(event.target.value))}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            />
          </label>
          <label className="grid gap-2 text-sm text-muted">
            Output unit
            <select
              value={outputUnit}
              onChange={(event) => setOutputUnit(event.target.value as "kcal" | "kj")}
              className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
            >
              <option value="kcal">kcal</option>
              <option value="kj">kJ</option>
            </select>
          </label>
        </div>
        <p className="mt-4 text-xs text-muted">
          Activity multipliers: {activityMultipliers[activity]}x
        </p>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          Daily calories required to maintain current weight.
        </p>
        <div className="mt-6 grid gap-4">
          <ResultCard label="BMR" value={formatEnergy(bmr)} />
          <ResultCard label="Maintenance" value={formatEnergy(calories)} />
          <ResultCard label="Goal target" value={formatEnergy(goalCalories)} />
        </div>
        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Goal plan
          </p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Goal</th>
                  <th className="px-4 py-3 text-left">Daily calories</th>
                  <th className="px-4 py-3 text-left">Est. weekly change</th>
                </tr>
              </thead>
              <tbody>
                {goalPlans.map((plan) => (
                  <tr key={plan.label} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{plan.label}</td>
                    <td className="px-4 py-2">{formatEnergy(plan.daily)}</td>
                    <td className="px-4 py-2">
                      {plan.delta === 0
                        ? "0 kg/week"
                        : `${formatNumber(plan.weeklyChange)} kg/week`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            Weekly change uses ~7,700 kcal per kg as an approximation.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Weekly schedule
          </p>
          <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-2 text-muted">
                <tr>
                  <th className="px-4 py-3 text-left">Day</th>
                  <th className="px-4 py-3 text-left">Maintenance</th>
                  <th className="px-4 py-3 text-left">Goal target</th>
                </tr>
              </thead>
              <tbody>
                {weeklySchedule.map((row) => (
                  <tr key={row.day} className="border-t border-stroke/60">
                    <td className="px-4 py-2">{row.day}</td>
                    <td className="px-4 py-2">{formatEnergy(row.maintenance)}</td>
                    <td className="px-4 py-2">{formatEnergy(row.goal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            Use the goal adjustment input to set your daily target.
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

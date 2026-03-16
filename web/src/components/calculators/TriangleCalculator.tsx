"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import {
  triangleAnglesFromSides,
  triangleAreaFromSides,
  trianglePerimeter,
  triangleType,
} from "@/lib/calculators/triangle";
import type { CalculatorInsights } from "@/lib/insights";

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function TriangleCalculator({ onInsightsChange }: CalculatorProps) {
  const [sideA, setSideA] = useState(3);
  const [sideB, setSideB] = useState(4);
  const [sideC, setSideC] = useState(5);
  const [angleUnit, setAngleUnit] = useState<"deg" | "rad">("deg");
  const [baseLength, setBaseLength] = useState(10);
  const [heightLength, setHeightLength] = useState(6);

  const results = useMemo(() => {
    const area = triangleAreaFromSides(sideA, sideB, sideC);
    const perimeter = trianglePerimeter(sideA, sideB, sideC);
    const angles = triangleAnglesFromSides(sideA, sideB, sideC);
    const type = triangleType(sideA, sideB, sideC);
    return { area, perimeter, angles, type };
  }, [sideA, sideB, sideC]);

  const angleDisplay = useMemo(() => {
    if (!results.angles) return null;
    const toUnit =
      angleUnit === "deg" ? (value: number) => (value * 180) / Math.PI : (value: number) => value;
    return {
      a: toUnit(results.angles.angleA),
      b: toUnit(results.angles.angleB),
      c: toUnit(results.angles.angleC),
    };
  }, [angleUnit, results.angles]);

  const derived = useMemo(() => {
    if (results.area === null || results.perimeter === null) return null;
    const area = results.area;
    const perimeter = results.perimeter;
    if (area <= 0 || perimeter <= 0) return null;
    const semiperimeter = perimeter / 2;
    const inradius = area / semiperimeter;
    const circumradius = (sideA * sideB * sideC) / (4 * area);
    const altitudeA = (2 * area) / sideA;
    const altitudeB = (2 * area) / sideB;
    const altitudeC = (2 * area) / sideC;
    return {
      semiperimeter,
      inradius,
      circumradius,
      altitudeA,
      altitudeB,
      altitudeC,
    };
  }, [results.area, results.perimeter, sideA, sideB, sideC]);

  const baseHeightArea = useMemo(() => {
    const base = Math.max(0, baseLength);
    const height = Math.max(0, heightLength);
    return 0.5 * base * height;
  }, [baseLength, heightLength]);

  const insights = useMemo<CalculatorInsights>(() => {
    const isValid = results.area !== null && results.perimeter !== null;
    const rows = [
      ["Side A", formatNumber(sideA)],
      ["Side B", formatNumber(sideB)],
      ["Side C", formatNumber(sideC)],
      ["Perimeter", results.perimeter !== null ? formatNumber(results.perimeter) : "Invalid"],
      ["Area", results.area !== null ? formatNumber(results.area) : "Invalid"],
      ["Type", results.type],
      [
        "Angle A",
        angleDisplay ? `${formatNumber(angleDisplay.a)} ${angleUnit}` : "Invalid",
      ],
      [
        "Angle B",
        angleDisplay ? `${formatNumber(angleDisplay.b)} ${angleUnit}` : "Invalid",
      ],
      [
        "Angle C",
        angleDisplay ? `${formatNumber(angleDisplay.c)} ${angleUnit}` : "Invalid",
      ],
    ];

    const scales = [0.5, 1, 1.5];
    const chartPoints = scales.map((scale) => ({
      label: `${formatNumber(scale)}x`,
      value:
        results.area !== null
          ? triangleAreaFromSides(sideA * scale, sideB * scale, sideC * scale) ?? 0
          : 0,
    }));

    return {
      table: {
        title: "Triangle summary",
        columns: ["Metric", "Value"],
        rows,
        note: isValid ? "Triangle inequality satisfied." : "Triangle inequality failed.",
      },
      chart: {
        title: "Area scaling",
        xLabel: "Scale",
        yLabel: "Area",
        format: "number",
        points: chartPoints,
        note: "Scaling sides increases area quadratically.",
      },
    };
  }, [angleDisplay, angleUnit, results.area, results.perimeter, results.type, sideA, sideB, sideC]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Provide all three sides to compute area and perimeter.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {(["deg", "rad"] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => setAngleUnit(unit)}
              className={`rounded-full border px-4 py-2 text-xs ${
                angleUnit === unit
                  ? "border-ink bg-ink text-white"
                  : "border-stroke text-ink"
              }`}
            >
              {unit.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="mt-6 space-y-4">
          <Input label="Side A" value={sideA} onChange={setSideA} />
          <Input label="Side B" value={sideB} onChange={setSideB} />
          <Input label="Side C" value={sideC} onChange={setSideC} />
        </div>
      </div>
        <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          If the sides do not form a valid triangle, results are hidden.
        </p>
        <div className="mt-6 grid gap-4">
          <ResultCard
            label="Area"
            value={results.area !== null ? formatNumber(results.area) : "Invalid"}
          />
          <ResultCard
            label="Perimeter"
            value={results.perimeter !== null ? formatNumber(results.perimeter) : "Invalid"}
          />
          <ResultCard label="Type" value={results.type} />
          <ResultCard
            label="Angle A"
            value={angleDisplay ? formatNumber(angleDisplay.a) : "Invalid"}
          />
          <ResultCard
            label="Angle B"
            value={angleDisplay ? formatNumber(angleDisplay.b) : "Invalid"}
          />
          <ResultCard
            label="Angle C"
            value={angleDisplay ? formatNumber(angleDisplay.c) : "Invalid"}
          />
          {derived && (
            <>
              <ResultCard
                label="Semiperimeter"
                value={formatNumber(derived.semiperimeter)}
              />
              <ResultCard
                label="Inradius"
                value={formatNumber(derived.inradius)}
              />
              <ResultCard
                label="Circumradius"
                value={formatNumber(derived.circumradius)}
              />
            </>
          )}
        </div>
        {derived && (
          <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Altitudes
            </p>
            <div className="mt-3 overflow-auto rounded-2xl border border-stroke bg-white/70">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-2 text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Side</th>
                    <th className="px-4 py-3 text-left">Altitude</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "A", value: derived.altitudeA },
                    { label: "B", value: derived.altitudeB },
                    { label: "C", value: derived.altitudeC },
                  ].map((row) => (
                    <tr key={row.label} className="border-t border-stroke/60">
                      <td className="px-4 py-2">{row.label}</td>
                      <td className="px-4 py-2">{formatNumber(row.value)}</td>
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
        <h3 className="font-display text-2xl text-ink">Area from base and height</h3>
        <p className="mt-2 text-sm text-muted">
          Use this when you know the base length and height.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Input label="Base" value={baseLength} onChange={setBaseLength} />
          <Input label="Height" value={heightLength} onChange={setHeightLength} />
          <ResultCard label="Area" value={formatNumber(baseHeightArea)} />
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
        min={0}
        step={0.1}
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

"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalculatorInsights } from "@/lib/insights";
import {
  formatConfiguredValue,
  getDefaultValues,
  getConfigurableCalculatorDefinition,
  getConfigurableCalculatorInsights,
} from "@/lib/data/configurableCalculators/index";

type CalculatorProps = {
  slug: string;
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function ConfigurableCalculator({
  slug,
  onInsightsChange,
}: CalculatorProps) {
  const definition = getConfigurableCalculatorDefinition(slug);
  const [inputs, setInputs] = useState<Record<string, number>>(
    definition ? getDefaultValues(definition) : {}
  );

  const outputs = useMemo(() => {
    if (!definition) return null;
    return definition.compute(inputs);
  }, [definition, inputs]);

  const insights = useMemo(() => {
    if (!definition) return null;
    return getConfigurableCalculatorInsights(slug, inputs);
  }, [definition, inputs, slug]);

  useEffect(() => {
    if (insights) {
      onInsightsChange?.(insights);
    }
  }, [insights, onInsightsChange]);

  if (!definition || !outputs) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          Adjust the assumptions to match your scenario. Results update instantly.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {definition.fields.map((field) => (
            <label key={field.key} className="grid gap-2 text-sm text-muted">
              <span>{field.label}</span>
              <input
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? 0.1}
                value={inputs[field.key] ?? 0}
                onChange={(event) =>
                  setInputs((current) => ({
                    ...current,
                    [field.key]: Number(event.target.value),
                  }))
                }
                className="rounded-2xl border border-stroke bg-white/70 px-4 py-3 text-base text-ink"
              />
              <span className="text-xs text-muted">{field.description}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          Primary outputs and comparison insights are built from the current inputs.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {definition.outputs.map((output) => (
            <div
              key={output.key}
              className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                {output.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-ink">
                {formatConfiguredValue(
                  outputs[output.key],
                  output.format,
                  definition.currency
                )}
              </p>
              <p className="mt-1 text-xs text-muted">{output.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

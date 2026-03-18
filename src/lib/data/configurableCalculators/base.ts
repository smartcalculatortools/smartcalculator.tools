import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import type { Calculator } from "@/lib/data/calculators";
import type { CalculatorContent, InsightChart, ReferenceTable } from "@/lib/data/calculatorContent";

export type ValueFormat = "number" | "currency" | "percent";

export type CalculatorValues = Record<string, number>;

export type CalculatorField = {
  key: string;
  label: string;
  format: ValueFormat;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  description: string;
};

export type CalculatorOutput = {
  key: string;
  label: string;
  format: ValueFormat;
  description: string;
};

export type CalculatorExample = {
  title: string;
  values: CalculatorValues;
  note: string;
};

export type ScenarioConfig = {
  fieldKey: string;
  values: (inputs: CalculatorValues) => number[];
  tableOutputKeys: string[];
  chartOutputKey: string;
  tableTitle: string;
  chartTitle: string;
  note: string;
};

export type ContentSeed = {
  summaryLead: string;
  formulas: string[];
  assumptions: string[];
  tips: string[];
  references: string[];
  disclaimer?: string;
  examples: CalculatorExample[];
};

export type ConfigurableCalculatorDefinition = {
  calculator: Calculator;
  fields: CalculatorField[];
  outputs: CalculatorOutput[];
  compute: (inputs: CalculatorValues) => CalculatorValues;
  scenario: ScenarioConfig;
  content: ContentSeed;
  currency?: string;
};

export function safeDivide(numerator: number, denominator: number) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) {
    return 0;
  }
  return numerator / denominator;
}

export function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function shiftedValues(
  base: number,
  deltas: number[],
  min = Number.NEGATIVE_INFINITY
) {
  return Array.from(
    new Set(deltas.map((delta) => round(Math.max(min, base + delta))))
  ).sort((left, right) => left - right);
}

export function scaledValues(
  base: number,
  multipliers: number[],
  min = Number.NEGATIVE_INFINITY
) {
  return Array.from(
    new Set(multipliers.map((multiplier) => round(Math.max(min, base * multiplier))))
  ).sort((left, right) => left - right);
}

export function clampNonNegative(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function labelList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

export function formatConfiguredValue(
  value: number,
  format: ValueFormat,
  currency = "USD"
) {
  if (format === "currency") return formatCurrency(value, currency);
  if (format === "percent") return `${formatNumber(value)}%`;
  return formatNumber(value);
}

export function getDefaultValues(definition: ConfigurableCalculatorDefinition) {
  return Object.fromEntries(
    definition.fields.map((field) => [field.key, field.defaultValue])
  );
}

export function getOutput(
  definition: ConfigurableCalculatorDefinition,
  key: string
) {
  return definition.outputs.find((output) => output.key === key);
}

export function getField(
  definition: ConfigurableCalculatorDefinition,
  key: string
) {
  return definition.fields.find((field) => field.key === key);
}

export function buildScenarioArtifacts(
  definition: ConfigurableCalculatorDefinition,
  inputs: CalculatorValues
): { table: ReferenceTable; chart: InsightChart } {
  const scenarioField = getField(definition, definition.scenario.fieldKey);
  const chartOutput = getOutput(definition, definition.scenario.chartOutputKey);
  if (!scenarioField || !chartOutput) {
    throw new Error(`Invalid scenario configuration for ${definition.calculator.slug}`);
  }

  const values = definition.scenario.values(inputs);
  const rows = values.map((value) => {
    const nextInputs = { ...inputs, [scenarioField.key]: value };
    const outputs = definition.compute(nextInputs);
    return [
      formatConfiguredValue(value, scenarioField.format, definition.currency),
      ...definition.scenario.tableOutputKeys.map((key) => {
        const output = getOutput(definition, key);
        return formatConfiguredValue(
          outputs[key],
          output?.format ?? "number",
          definition.currency
        );
      }),
    ];
  });

  const chartPoints = values.map((value) => {
    const nextInputs = { ...inputs, [scenarioField.key]: value };
    const outputs = definition.compute(nextInputs);
    return {
      label: formatConfiguredValue(value, scenarioField.format, definition.currency),
      value: outputs[definition.scenario.chartOutputKey],
    };
  });

  return {
    table: {
      title: definition.scenario.tableTitle,
      columns: [
        scenarioField.label,
        ...definition.scenario.tableOutputKeys.map(
          (key) => getOutput(definition, key)?.label ?? key
        ),
      ],
      rows,
      note: definition.scenario.note,
    },
    chart: {
      title: definition.scenario.chartTitle,
      xLabel: scenarioField.label,
      yLabel: chartOutput.label,
      format: chartOutput.format,
      points: chartPoints,
      note: definition.scenario.note,
    },
  };
}

export function buildSummary(definition: ConfigurableCalculatorDefinition) {
  const fieldLabels = labelList(
    definition.fields.slice(0, 3).map((field) => field.label.toLowerCase())
  );
  const outputLabels = labelList(
    definition.outputs.slice(0, 3).map((output) => output.label.toLowerCase())
  );

  return `${definition.content.summaryLead} Enter ${fieldLabels} to estimate ${outputLabels}. The calculator updates instantly and adds a comparison table plus chart so you can test the sensitivity of the result before you use it in a decision.`;
}

export function buildExamples(definition: ConfigurableCalculatorDefinition) {
  return definition.content.examples.map((example) => {
    const outputs = definition.compute(example.values);
    return {
      title: example.title,
      inputs: definition.fields.map(
        (field) =>
          `Example input ${field.label}: ${formatConfiguredValue(
            example.values[field.key],
            field.format,
            definition.currency
          )}`
      ),
      outputs: definition.outputs.map(
        (output) =>
          `Example result ${output.label}: ${formatConfiguredValue(
            outputs[output.key],
            output.format,
            definition.currency
          )}`
      ),
      note: example.note,
    };
  });
}

export function buildGeneratedContent(
  definition: ConfigurableCalculatorDefinition
): CalculatorContent {
  const defaults = getDefaultValues(definition);
  const scenarioArtifacts = buildScenarioArtifacts(definition, defaults);

  return {
    summary: buildSummary(definition),
    inputs: definition.fields.map((field) => field.description),
    outputs: definition.outputs.map((output) => output.description),
    formulas: definition.content.formulas,
    assumptions: definition.content.assumptions,
    tips: definition.content.tips,
    references: definition.content.references,
    disclaimer: definition.content.disclaimer,
    examples: buildExamples(definition),
    table: scenarioArtifacts.table,
    chart: scenarioArtifacts.chart,
  };
}

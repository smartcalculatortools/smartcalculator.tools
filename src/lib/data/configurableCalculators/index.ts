import type { CalculatorContent } from "@/lib/data/calculatorContent";
import {
  buildGeneratedContent,
  buildScenarioArtifacts,
  formatConfiguredValue,
  getDefaultValues,
} from "./base";
import { aiGrowthCalculatorDefinitions } from "./aiGrowth";
import type { CalculatorValues } from "./base";
import { aiCalculatorDefinitions } from "./ai";
import { cryptoGrowthCalculatorDefinitions } from "./cryptoGrowth";
import { cryptoCalculatorDefinitions } from "./crypto";
import { financialCalculatorDefinitions } from "./financial";
import { financialGrowthCalculatorDefinitions } from "./financialGrowth";
import { financialBatch2Definitions } from "./financialBatch2";
import { financialBatch3Definitions } from "./financialBatch3";
import { fitnessCalculatorDefinitions } from "./fitness";
import { fitnessGrowthCalculatorDefinitions } from "./fitnessGrowth";
import { fitnessBatch2Definitions } from "./fitnessBatch2";
import { mathCalculatorDefinitions } from "./math";
import { mathGrowthCalculatorDefinitions } from "./mathGrowth";
import { mathBatch2Definitions } from "./mathBatch2";
import { otherCalculatorDefinitions } from "./other";
import { otherBatch2Definitions } from "./otherBatch2";

export const configurableCalculatorDefinitions = [
  ...financialCalculatorDefinitions,
  ...financialGrowthCalculatorDefinitions,
  ...financialBatch2Definitions,
  ...financialBatch3Definitions,
  ...fitnessCalculatorDefinitions,
  ...fitnessGrowthCalculatorDefinitions,
  ...fitnessBatch2Definitions,
  ...mathCalculatorDefinitions,
  ...mathGrowthCalculatorDefinitions,
  ...mathBatch2Definitions,
  ...otherCalculatorDefinitions,
  ...otherBatch2Definitions,
  ...cryptoCalculatorDefinitions,
  ...cryptoGrowthCalculatorDefinitions,
  ...aiCalculatorDefinitions,
  ...aiGrowthCalculatorDefinitions,
];

export const configurableCalculators = configurableCalculatorDefinitions.map(
  (definition) => definition.calculator
);

export const configurableCalculatorMap = new Map(
  configurableCalculatorDefinitions.map((definition) => [
    definition.calculator.slug,
    definition,
  ])
);

export const generatedCalculatorContent = Object.fromEntries(
  configurableCalculatorDefinitions.map((definition) => [
    definition.calculator.slug,
    buildGeneratedContent(definition),
  ])
) satisfies Record<string, CalculatorContent>;

export function getConfigurableCalculatorDefinition(slug: string) {
  return configurableCalculatorMap.get(slug) ?? null;
}

export function getConfigurableCalculatorInsights(
  slug: string,
  inputs: CalculatorValues
) {
  const definition = getConfigurableCalculatorDefinition(slug);
  if (!definition) return null;
  return buildScenarioArtifacts(definition, inputs);
}

export { formatConfiguredValue, getDefaultValues };

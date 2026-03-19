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
import { fitnessCalculatorDefinitions } from "./fitness";
import { fitnessGrowthCalculatorDefinitions } from "./fitnessGrowth";
import { mathCalculatorDefinitions } from "./math";
import { mathGrowthCalculatorDefinitions } from "./mathGrowth";
import { otherCalculatorDefinitions } from "./other";

export const configurableCalculatorDefinitions = [
  ...financialCalculatorDefinitions,
  ...financialGrowthCalculatorDefinitions,
  ...fitnessCalculatorDefinitions,
  ...fitnessGrowthCalculatorDefinitions,
  ...mathCalculatorDefinitions,
  ...mathGrowthCalculatorDefinitions,
  ...otherCalculatorDefinitions,
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

export type TokenCostInputs = {
  inputTokens: number;
  outputTokens: number;
  inputRate: number;
  outputRate: number;
};

export function tokenCost({
  inputTokens,
  outputTokens,
  inputRate,
  outputRate,
}: TokenCostInputs) {
  const inputCost = (Math.max(0, inputTokens) / 1000) * Math.max(0, inputRate);
  const outputCost = (Math.max(0, outputTokens) / 1000) * Math.max(0, outputRate);
  return { inputCost, outputCost, total: inputCost + outputCost };
}

export function compareModels({
  inputTokens,
  outputTokens,
  modelA,
  modelB,
}: {
  inputTokens: number;
  outputTokens: number;
  modelA: { inputRate: number; outputRate: number };
  modelB: { inputRate: number; outputRate: number };
}) {
  const costA = tokenCost({
    inputTokens,
    outputTokens,
    inputRate: modelA.inputRate,
    outputRate: modelA.outputRate,
  }).total;
  const costB = tokenCost({
    inputTokens,
    outputTokens,
    inputRate: modelB.inputRate,
    outputRate: modelB.outputRate,
  }).total;

  return { costA, costB, delta: costA - costB };
}

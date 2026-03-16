const CM_PER_IN = 2.54;
const LB_PER_KG = 2.2046226218;

function safeNumber(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function roundTo(value: number, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round(safeNumber(value) * factor) / factor;
}

export function kgToLb(kg: number) {
  return safeNumber(kg) * LB_PER_KG;
}

export function lbToKg(lb: number) {
  return safeNumber(lb) / LB_PER_KG;
}

export function cmToIn(cm: number) {
  return safeNumber(cm) / CM_PER_IN;
}

export function inToCm(inches: number) {
  return safeNumber(inches) * CM_PER_IN;
}

export function ftInToCm(feet: number, inches: number) {
  const totalInches = safeNumber(feet) * 12 + safeNumber(inches);
  return inToCm(totalInches);
}

export function cmToFtIn(cm: number) {
  const totalInches = cmToIn(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches - feet * 12;
  return { feet, inches };
}

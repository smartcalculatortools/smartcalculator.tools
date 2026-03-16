export type AngleMode = "rad" | "deg";
export type EvalOptions = {
  angleMode?: AngleMode;
  ans?: number;
};

const functionMap: Record<string, string> = {
  sin: "Math.sin",
  cos: "Math.cos",
  tan: "Math.tan",
  asin: "Math.asin",
  acos: "Math.acos",
  atan: "Math.atan",
  sqrt: "Math.sqrt",
  abs: "Math.abs",
  ln: "Math.log",
  log: "Math.log10",
  pow: "Math.pow",
  exp: "Math.exp",
};

const allowedMathProps = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "abs",
  "log10",
  "log",
  "pow",
  "exp",
  "PI",
  "E",
];

const allowedCustom = [
  "sind",
  "cosd",
  "tand",
  "asind",
  "acosd",
  "atand",
  "rand",
  "fact",
  "ANS",
];

export function evaluateExpression(expression: string, options: EvalOptions = {}) {
  const raw = expression.trim();
  if (!raw) return null;

  if (!/^[0-9+\-*/().,%^\sA-Za-z]*$/.test(raw)) {
    return null;
  }

  let normalized = raw.toLowerCase();

  if (options.angleMode === "deg") {
    normalized = normalized
      .replace(/\basin\(/g, "asind(")
      .replace(/\bacos\(/g, "acosd(")
      .replace(/\batan\(/g, "atand(")
      .replace(/\bsin\(/g, "sind(")
      .replace(/\bcos\(/g, "cosd(")
      .replace(/\btan\(/g, "tand(");
  }

  normalized = normalized.replace(/\bans\b/g, "ANS");
  normalized = normalized.replace(/\bpi\b/g, "Math.PI");
  normalized = normalized.replace(/\be\b/g, "Math.E");
  normalized = normalized.replace(/\^/g, "**");

  Object.entries(functionMap).forEach(([name, replacement]) => {
    const pattern = new RegExp(`\\b${name}\\b`, "g");
    normalized = normalized.replace(pattern, replacement);
  });

  let stripped = normalized;
  stripped = stripped.replace(new RegExp(`Math\\.(${allowedMathProps.join("|")})`, "g"), "");
  stripped = stripped.replace(new RegExp(`\\b(${allowedCustom.join("|")})\\b`, "g"), "");

  if (/[A-Za-z]/.test(stripped)) {
    return null;
  }

  const degToRad = (value: number) => (value * Math.PI) / 180;
  const radToDeg = (value: number) => (value * 180) / Math.PI;

  const sind = (value: number) => Math.sin(degToRad(value));
  const cosd = (value: number) => Math.cos(degToRad(value));
  const tand = (value: number) => Math.tan(degToRad(value));
  const asind = (value: number) => radToDeg(Math.asin(value));
  const acosd = (value: number) => radToDeg(Math.acos(value));
  const atand = (value: number) => radToDeg(Math.atan(value));

  const fact = (value: number) => {
    const n = Math.floor(value);
    if (!Number.isFinite(n) || n < 0) return NaN;
    if (n > 170) return Infinity;
    let total = 1;
    for (let i = 2; i <= n; i += 1) {
      total *= i;
    }
    return total;
  };

  const rand = () => Math.random();
  const ans = Number.isFinite(options.ans ?? NaN) ? (options.ans as number) : 0;

  try {
    const result = Function(
      "ANS",
      "sind",
      "cosd",
      "tand",
      "asind",
      "acosd",
      "atand",
      "fact",
      "rand",
      `"use strict"; return (${normalized});`
    )(ans, sind, cosd, tand, asind, acosd, atand, fact, rand);

    return Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

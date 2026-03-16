export type Fraction = { numerator: number; denominator: number };

export function reduceFraction({ numerator, denominator }: Fraction) {
  if (denominator === 0) return null;
  if (numerator === 0) return { numerator: 0, denominator: 1 };

  const sign = Math.sign(denominator);
  const gcdValue = gcd(Math.abs(numerator), Math.abs(denominator));

  return {
    numerator: (numerator / gcdValue) * sign,
    denominator: Math.abs(denominator / gcdValue),
  };
}

export function addFractions(a: Fraction, b: Fraction) {
  if (a.denominator === 0 || b.denominator === 0) return null;
  const numerator = a.numerator * b.denominator + b.numerator * a.denominator;
  const denominator = a.denominator * b.denominator;
  return reduceFraction({ numerator, denominator });
}

export function subtractFractions(a: Fraction, b: Fraction) {
  if (a.denominator === 0 || b.denominator === 0) return null;
  const numerator = a.numerator * b.denominator - b.numerator * a.denominator;
  const denominator = a.denominator * b.denominator;
  return reduceFraction({ numerator, denominator });
}

export function multiplyFractions(a: Fraction, b: Fraction) {
  if (a.denominator === 0 || b.denominator === 0) return null;
  const numerator = a.numerator * b.numerator;
  const denominator = a.denominator * b.denominator;
  return reduceFraction({ numerator, denominator });
}

export function divideFractions(a: Fraction, b: Fraction) {
  if (a.denominator === 0 || b.denominator === 0 || b.numerator === 0) return null;
  const numerator = a.numerator * b.denominator;
  const denominator = a.denominator * b.numerator;
  return reduceFraction({ numerator, denominator });
}

export function fractionToDecimal(fraction: Fraction) {
  if (fraction.denominator === 0) return null;
  return fraction.numerator / fraction.denominator;
}

export function approximateFraction(value: number, maxDenominator = 10000) {
  if (!Number.isFinite(value)) return null;
  if (value === 0) return { numerator: 0, denominator: 1 };

  const sign = value < 0 ? -1 : 1;
  let x = Math.abs(value);

  let h1 = 1;
  let h0 = 0;
  let k1 = 0;
  let k0 = 1;

  while (true) {
    const a = Math.floor(x);
    const h2 = a * h1 + h0;
    const k2 = a * k1 + k0;

    if (k2 > maxDenominator) break;

    h0 = h1;
    k0 = k1;
    h1 = h2;
    k1 = k2;

    const fractional = x - a;
    if (fractional === 0) break;
    x = 1 / fractional;
  }

  const result = reduceFraction({ numerator: sign * h1, denominator: k1 });
  return result ?? null;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

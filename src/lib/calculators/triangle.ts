export function triangleAreaFromSides(a: number, b: number, c: number) {
  const sides = [a, b, c].map((value) => Math.max(0, value));
  const [sideA, sideB, sideC] = sides;

  if (!isValidTriangle(sideA, sideB, sideC)) return null;

  const s = (sideA + sideB + sideC) / 2;
  const area = Math.sqrt(s * (s - sideA) * (s - sideB) * (s - sideC));
  return Number.isFinite(area) ? area : null;
}

export function trianglePerimeter(a: number, b: number, c: number) {
  const sides = [a, b, c].map((value) => Math.max(0, value));
  const [sideA, sideB, sideC] = sides;
  if (!isValidTriangle(sideA, sideB, sideC)) return null;
  return sideA + sideB + sideC;
}

export function isValidTriangle(a: number, b: number, c: number) {
  return a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a;
}

export function triangleAnglesFromSides(a: number, b: number, c: number) {
  const sides = [a, b, c].map((value) => Math.max(0, value));
  const [sideA, sideB, sideC] = sides;
  if (!isValidTriangle(sideA, sideB, sideC)) return null;

  const angleA = Math.acos(
    (Math.pow(sideB, 2) + Math.pow(sideC, 2) - Math.pow(sideA, 2)) /
      (2 * sideB * sideC)
  );
  const angleB = Math.acos(
    (Math.pow(sideA, 2) + Math.pow(sideC, 2) - Math.pow(sideB, 2)) /
      (2 * sideA * sideC)
  );
  const angleC = Math.PI - angleA - angleB;

  if (![angleA, angleB, angleC].every((angle) => Number.isFinite(angle))) {
    return null;
  }

  return { angleA, angleB, angleC };
}

export function triangleType(a: number, b: number, c: number) {
  const sides = [a, b, c].map((value) => Math.max(0, value));
  const [sideA, sideB, sideC] = sides;
  if (!isValidTriangle(sideA, sideB, sideC)) return "Invalid";
  if (sideA === sideB && sideB === sideC) return "Equilateral";
  if (sideA === sideB || sideA === sideC || sideB === sideC) return "Isosceles";
  return "Scalene";
}

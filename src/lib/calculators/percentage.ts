export function percentageOf(percent: number, base: number) {
  return (Math.max(0, percent) / 100) * base;
}

export function percentOf(part: number, total: number) {
  if (total === 0) return 0;
  return (part / total) * 100;
}

export function percentChange(fromValue: number, toValue: number) {
  if (fromValue === 0) return 0;
  return ((toValue - fromValue) / fromValue) * 100;
}

export function percentDifference(a: number, b: number) {
  const safeA = Math.abs(a);
  const safeB = Math.abs(b);
  const average = (safeA + safeB) / 2;
  if (average === 0) return 0;
  return (Math.abs(a - b) / average) * 100;
}

export function baseFromPercent(percent: number, result: number) {
  if (percent === 0) return 0;
  return result / (percent / 100);
}

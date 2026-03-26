import type { ConfigurableCalculatorDefinition } from "./base";
import { clampNonNegative, safeDivide, shiftedValues, scaledValues } from "./base";

export const mathBatch2Definitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: { slug: "standard-deviation", name: "Standard Deviation Calculator", category: "math", blurb: "Calculate mean, variance, and standard deviation from values.", tags: ["statistics", "variance", "data"] },
    fields: [
      { key: "v1", label: "Value 1", format: "number", defaultValue: 10, step: 1, description: "First data point." },
      { key: "v2", label: "Value 2", format: "number", defaultValue: 20, step: 1, description: "Second data point." },
      { key: "v3", label: "Value 3", format: "number", defaultValue: 30, step: 1, description: "Third data point." },
      { key: "v4", label: "Value 4", format: "number", defaultValue: 40, step: 1, description: "Fourth data point." },
      { key: "v5", label: "Value 5", format: "number", defaultValue: 50, step: 1, description: "Fifth data point." },
    ],
    outputs: [
      { key: "mean", label: "Mean", format: "number", description: "Average of the data points." },
      { key: "variance", label: "Variance", format: "number", description: "Average of squared deviations from the mean." },
      { key: "stdDev", label: "Standard deviation", format: "number", description: "Square root of the variance." },
    ],
    compute: (i) => {
      const vals = [i.v1, i.v2, i.v3, i.v4, i.v5];
      const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
      const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length;
      return { mean, variance, stdDev: Math.sqrt(variance) };
    },
    scenario: { fieldKey: "v5", values: (i) => shiftedValues(i.v5, [-20, -10, 0, 10, 20], 0), tableOutputKeys: ["mean", "stdDev"], chartOutputKey: "stdDev", tableTitle: "Std Dev by Value 5", chartTitle: "Spread sensitivity", note: "Outliers increase standard deviation significantly." },
    content: { summaryLead: "The Standard Deviation Calculator computes the mean, variance, and standard deviation for a set of data points.", formulas: ["Mean = Σx / n", "Variance = Σ(x−μ)² / n", "Std Dev = √Variance"], assumptions: ["Population standard deviation (divides by n).", "All five values are used."], tips: ["Use sample std dev (n−1) for small samples from a larger population.", "Lower std dev means less spread around the mean."], references: ["Statistical measures of dispersion", "Standard deviation fundamentals"], examples: [{ title: "Test scores spread", values: { v1: 72, v2: 85, v3: 90, v4: 68, v5: 95 }, note: "A std dev of ~10 on test scores means most scores fall within 10 points of the average." }] },
  },
  {
    calculator: { slug: "probability", name: "Probability Calculator", category: "math", blurb: "Calculate basic probability of single and combined events.", tags: ["probability", "odds", "statistics"] },
    fields: [
      { key: "favorableA", label: "Favorable outcomes A", format: "number", defaultValue: 3, min: 0, step: 1, description: "Number of favorable outcomes for event A." },
      { key: "totalOutcomes", label: "Total outcomes", format: "number", defaultValue: 10, min: 1, step: 1, description: "Total number of possible equally likely outcomes." },
      { key: "favorableB", label: "Favorable outcomes B", format: "number", defaultValue: 4, min: 0, step: 1, description: "Number of favorable outcomes for event B." },
    ],
    outputs: [
      { key: "probA", label: "P(A)", format: "percent", description: "Probability of event A occurring." },
      { key: "probB", label: "P(B)", format: "percent", description: "Probability of event B occurring." },
      { key: "probBoth", label: "P(A and B) independent", format: "percent", description: "Probability of both A and B if independent." },
    ],
    compute: (i) => {
      const total = Math.max(1, clampNonNegative(i.totalOutcomes));
      const pA = clampNonNegative(i.favorableA) / total * 100;
      const pB = clampNonNegative(i.favorableB) / total * 100;
      return { probA: pA, probB: pB, probBoth: pA * pB / 100 };
    },
    scenario: { fieldKey: "favorableA", values: (i) => shiftedValues(i.favorableA, [-2, -1, 0, 1, 2], 0), tableOutputKeys: ["probA", "probBoth"], chartOutputKey: "probA", tableTitle: "Probability by favorable outcomes", chartTitle: "P(A) sensitivity", note: "Combined probability of independent events multiplies individual probabilities." },
    content: { summaryLead: "The Probability Calculator computes the likelihood of single events and the combined probability of two independent events.", formulas: ["P(A) = Favorable A ÷ Total Outcomes", "P(A∩B) = P(A) × P(B) for independent events"], assumptions: ["All outcomes are equally likely.", "Events A and B are independent."], tips: ["For dependent events, use conditional probability instead.", "Convert between odds and probability as needed."], references: ["Basic probability theory", "Independent event probability formulas"], examples: [{ title: "Dice roll example", values: { favorableA: 2, totalOutcomes: 6, favorableB: 3 }, note: "Rolling a 1 or 2 (P=33%) and rolling odd (P=50%) on a fair die are independent events." }] },
  },
  {
    calculator: { slug: "quadratic", name: "Quadratic Formula Calculator", category: "math", blurb: "Solve ax² + bx + c = 0 using the quadratic formula.", tags: ["equation", "algebra", "roots"] },
    fields: [
      { key: "a", label: "a (x² coefficient)", format: "number", defaultValue: 1, step: 1, description: "Coefficient of x²." },
      { key: "b", label: "b (x coefficient)", format: "number", defaultValue: -5, step: 1, description: "Coefficient of x." },
      { key: "c", label: "c (constant)", format: "number", defaultValue: 6, step: 1, description: "Constant term." },
    ],
    outputs: [
      { key: "discriminant", label: "Discriminant", format: "number", description: "b² − 4ac determines the nature of roots." },
      { key: "root1", label: "Root 1", format: "number", description: "First solution of the equation." },
      { key: "root2", label: "Root 2", format: "number", description: "Second solution of the equation." },
    ],
    compute: (i) => {
      const a = i.a || 1, b = i.b, c = i.c;
      const disc = b * b - 4 * a * c;
      if (disc < 0) return { discriminant: disc, root1: 0, root2: 0 };
      return { discriminant: disc, root1: (-b + Math.sqrt(disc)) / (2 * a), root2: (-b - Math.sqrt(disc)) / (2 * a) };
    },
    scenario: { fieldKey: "c", values: (i) => shiftedValues(i.c, [-4, -2, 0, 2, 4], -100), tableOutputKeys: ["discriminant", "root1"], chartOutputKey: "discriminant", tableTitle: "Roots by constant c", chartTitle: "Discriminant sensitivity", note: "When the discriminant is negative, there are no real roots." },
    content: { summaryLead: "The Quadratic Formula Calculator solves any second-degree polynomial equation ax² + bx + c = 0 and shows the discriminant.", formulas: ["x = (−b ± √(b²−4ac)) / 2a", "Discriminant = b² − 4ac"], assumptions: ["Coefficient a must be non-zero.", "Only real roots are computed."], tips: ["Positive discriminant = 2 real roots, zero = 1, negative = complex.", "Factor first when possible for cleaner answers."], references: ["Quadratic formula derivation", "Discriminant analysis in algebra"], examples: [{ title: "Standard equation", values: { a: 2, b: -7, c: 3 }, note: "2x²−7x+3=0 factors to (2x−1)(x−3)=0, giving x=0.5 and x=3." }] },
  },
  {
    calculator: { slug: "pythagorean", name: "Pythagorean Theorem Calculator", category: "math", blurb: "Find the missing side of a right triangle.", tags: ["geometry", "triangle", "pythagoras"] },
    fields: [
      { key: "sideA", label: "Side a", format: "number", defaultValue: 3, min: 0, step: 0.5, description: "Length of one leg of the right triangle." },
      { key: "sideB", label: "Side b", format: "number", defaultValue: 4, min: 0, step: 0.5, description: "Length of the other leg." },
    ],
    outputs: [
      { key: "hypotenuse", label: "Hypotenuse c", format: "number", description: "Length of the hypotenuse." },
      { key: "area", label: "Area", format: "number", description: "Area of the right triangle." },
      { key: "perimeter", label: "Perimeter", format: "number", description: "Sum of all three sides." },
    ],
    compute: (i) => {
      const a = clampNonNegative(i.sideA), b = clampNonNegative(i.sideB);
      const c = Math.sqrt(a * a + b * b);
      return { hypotenuse: c, area: a * b / 2, perimeter: a + b + c };
    },
    scenario: { fieldKey: "sideA", values: (i) => shiftedValues(i.sideA, [-1, 0, 1, 2, 3], 0.5), tableOutputKeys: ["hypotenuse", "area"], chartOutputKey: "hypotenuse", tableTitle: "Hypotenuse by side a", chartTitle: "Hypotenuse growth", note: "The classic 3-4-5 right triangle is a Pythagorean triple." },
    content: { summaryLead: "The Pythagorean Theorem Calculator finds the hypotenuse, area, and perimeter of a right triangle given two legs.", formulas: ["c = √(a² + b²)", "Area = a × b ÷ 2"], assumptions: ["Triangle has a 90-degree angle.", "Both inputs are legs, not the hypotenuse."], tips: ["Common triples: 3-4-5, 5-12-13, 8-15-17.", "Use this to check if a corner is truly square."], references: ["Pythagorean theorem proof and applications", "Right triangle properties"], examples: [{ title: "Classic 3-4-5", values: { sideA: 5, sideB: 12 }, note: "5-12-13 is another common Pythagorean triple used in construction." }] },
  },
  {
    calculator: { slug: "gcf", name: "GCF Calculator", category: "math", blurb: "Find the greatest common factor of two numbers.", tags: ["gcd", "factor", "divisibility"] },
    fields: [
      { key: "num1", label: "Number 1", format: "number", defaultValue: 24, min: 1, step: 1, description: "First positive integer." },
      { key: "num2", label: "Number 2", format: "number", defaultValue: 36, min: 1, step: 1, description: "Second positive integer." },
    ],
    outputs: [
      { key: "gcf", label: "GCF", format: "number", description: "Greatest common factor." },
      { key: "lcm", label: "LCM", format: "number", description: "Least common multiple." },
      { key: "product", label: "Product", format: "number", description: "Product of the two numbers." },
    ],
    compute: (i) => {
      const a = Math.abs(Math.round(i.num1)) || 1, b = Math.abs(Math.round(i.num2)) || 1;
      const product = a * b;
      let tempA = a, tempB = b;
      while (tempB) { const t = tempB; tempB = tempA % tempB; tempA = t; }
      const gcf = tempA;
      return { gcf, lcm: safeDivide(product, gcf), product };
    },
    scenario: { fieldKey: "num2", values: (i) => shiftedValues(i.num2, [-10, -5, 0, 5, 10], 1), tableOutputKeys: ["gcf", "lcm"], chartOutputKey: "gcf", tableTitle: "GCF by second number", chartTitle: "GCF pattern", note: "GCF × LCM = Product of the two numbers." },
    content: { summaryLead: "The GCF Calculator finds the greatest common factor and least common multiple of two integers using the Euclidean algorithm.", formulas: ["GCF via Euclidean algorithm", "LCM = (a × b) ÷ GCF"], assumptions: ["Inputs are positive integers.", "Uses the Euclidean algorithm for efficiency."], tips: ["GCF is used for simplifying fractions.", "LCM is used for finding common denominators."], references: ["Euclidean algorithm for GCD", "Number theory fundamentals"], examples: [{ title: "Fraction simplification", values: { num1: 48, num2: 18 }, note: "GCF of 48 and 18 is 6, so the fraction 48/18 simplifies to 8/3." }] },
  },
  {
    calculator: { slug: "lcm", name: "LCM Calculator", category: "math", blurb: "Find the least common multiple of two numbers.", tags: ["lcm", "multiple", "math"] },
    fields: [
      { key: "num1", label: "Number 1", format: "number", defaultValue: 12, min: 1, step: 1, description: "First positive integer." },
      { key: "num2", label: "Number 2", format: "number", defaultValue: 18, min: 1, step: 1, description: "Second positive integer." },
    ],
    outputs: [
      { key: "lcm", label: "LCM", format: "number", description: "Least common multiple." },
      { key: "gcf", label: "GCF", format: "number", description: "Greatest common factor." },
      { key: "ratio", label: "LCM/GCF ratio", format: "number", description: "Ratio of LCM to GCF." },
    ],
    compute: (i) => {
      const a = Math.abs(Math.round(i.num1)) || 1, b = Math.abs(Math.round(i.num2)) || 1;
      let tempA = a, tempB = b;
      while (tempB) { const t = tempB; tempB = tempA % tempB; tempA = t; }
      const gcf = tempA, lcm = safeDivide(a * b, gcf);
      return { lcm, gcf, ratio: safeDivide(lcm, gcf) };
    },
    scenario: { fieldKey: "num2", values: (i) => shiftedValues(i.num2, [-6, -3, 0, 3, 6], 1), tableOutputKeys: ["lcm", "gcf"], chartOutputKey: "lcm", tableTitle: "LCM by second number", chartTitle: "LCM growth", note: "When two numbers share few factors, the LCM is close to their product." },
    content: { summaryLead: "The LCM Calculator finds the least common multiple of two numbers, useful for adding fractions and scheduling problems.", formulas: ["LCM = (a × b) ÷ GCF"], assumptions: ["Inputs are positive integers.", "Uses the GCF-based method for efficiency."], tips: ["LCM is key for adding fractions with different denominators.", "For more than 2 numbers, compute LCM iteratively."], references: ["LCM calculation methods", "Applications in arithmetic"], examples: [{ title: "Scheduling problem", values: { num1: 15, num2: 20 }, note: "LCM of 15 and 20 is 60, meaning events on 15-day and 20-day cycles coincide every 60 days." }] },
  },
  {
    calculator: { slug: "exponent", name: "Exponent Calculator", category: "math", blurb: "Calculate powers, roots, and exponential values.", tags: ["power", "exponent", "math"] },
    fields: [
      { key: "base", label: "Base", format: "number", defaultValue: 2, step: 0.5, description: "The base number." },
      { key: "exponent", label: "Exponent", format: "number", defaultValue: 8, step: 1, description: "The power to raise the base to." },
    ],
    outputs: [
      { key: "result", label: "Result", format: "number", description: "Base raised to the exponent power." },
      { key: "sqrtResult", label: "Square root of result", format: "number", description: "Square root of the computed result." },
      { key: "logResult", label: "Log₁₀ of result", format: "number", description: "Common logarithm of the result." },
    ],
    compute: (i) => {
      const result = Math.pow(i.base, i.exponent);
      return { result, sqrtResult: result >= 0 ? Math.sqrt(result) : 0, logResult: result > 0 ? Math.log10(result) : 0 };
    },
    scenario: { fieldKey: "exponent", values: (i) => shiftedValues(i.exponent, [-3, -1, 0, 1, 3], 0), tableOutputKeys: ["result", "logResult"], chartOutputKey: "result", tableTitle: "Result by exponent", chartTitle: "Exponential growth", note: "Exponential growth accelerates rapidly with each increment." },
    content: { summaryLead: "The Exponent Calculator computes the result of raising a base to any power, along with the square root and logarithm of the result.", formulas: ["Result = Base^Exponent"], assumptions: ["Supports negative and fractional exponents.", "Very large results may lose precision."], tips: ["Negative exponents give reciprocals: 2⁻³ = 1/8.", "Fractional exponents are roots: 8^(1/3) = 2."], references: ["Laws of exponents", "Power and root relationships"], examples: [{ title: "Binary powers", values: { base: 2, exponent: 10 }, note: "2^10 = 1024 is fundamental in computing (1 KB)." }] },
  },
  {
    calculator: { slug: "log", name: "Logarithm Calculator", category: "math", blurb: "Calculate logarithms in any base.", tags: ["logarithm", "math", "algebra"] },
    fields: [
      { key: "value", label: "Value", format: "number", defaultValue: 100, min: 0.001, step: 10, description: "The number to find the logarithm of." },
      { key: "base", label: "Base", format: "number", defaultValue: 10, min: 0.001, step: 1, description: "Logarithm base (e.g. 10, 2, or 2.718 for natural)." },
    ],
    outputs: [
      { key: "logResult", label: "Log result", format: "number", description: "Logarithm of value in the specified base." },
      { key: "log10", label: "Log₁₀", format: "number", description: "Common logarithm (base 10)." },
      { key: "ln", label: "Natural log (ln)", format: "number", description: "Natural logarithm (base e)." },
    ],
    compute: (i) => {
      const val = Math.max(0.001, i.value), base = Math.max(0.001, i.base);
      return { logResult: Math.log(val) / Math.log(base), log10: Math.log10(val), ln: Math.log(val) };
    },
    scenario: { fieldKey: "value", values: (i) => scaledValues(i.value, [0.1, 0.5, 1, 2, 10], 0.001), tableOutputKeys: ["logResult", "log10"], chartOutputKey: "logResult", tableTitle: "Log by value", chartTitle: "Logarithmic curve", note: "Logarithms grow very slowly compared to the input values." },
    content: { summaryLead: "The Logarithm Calculator computes logarithms in any base, plus common (log₁₀) and natural (ln) logarithms.", formulas: ["log_b(x) = ln(x) / ln(b)"], assumptions: ["Value must be positive.", "Base must be positive and not equal to 1."], tips: ["log₁₀(1000) = 3 because 10³ = 1000.", "Natural log (ln) uses base e ≈ 2.718."], references: ["Logarithm change of base formula", "Properties of logarithms"], examples: [{ title: "Common log check", values: { value: 1000, base: 10 }, note: "log₁₀(1000) = 3, a quick way to count the number of digits minus one." }] },
  },
  {
    calculator: { slug: "binary", name: "Binary Calculator", category: "math", blurb: "Convert between decimal and binary numbers.", tags: ["binary", "decimal", "conversion"] },
    fields: [
      { key: "decimal", label: "Decimal number", format: "number", defaultValue: 42, min: 0, step: 1, description: "A non-negative decimal integer to convert." },
      { key: "wordSize", label: "Word size (bits)", format: "number", defaultValue: 8, min: 1, max: 64, step: 8, description: "Target word size in bits (8, 16, 32, 64)." },
    ],
    outputs: [
      { key: "binaryDigits", label: "Binary digits count", format: "number", description: "Number of binary digits (bits) needed." },
      { key: "nextPowerOf2", label: "Next power of 2", format: "number", description: "Smallest power of 2 ≥ the decimal value." },
      { key: "hexValue", label: "Hex equivalent (decimal)", format: "number", description: "The same number (decimal representation shown)." },
    ],
    compute: (i) => {
      const d = Math.max(0, Math.round(i.decimal));
      const bits = d === 0 ? 1 : Math.floor(Math.log2(d)) + 1;
      const nextPow = d === 0 ? 1 : Math.pow(2, bits);
      return { binaryDigits: bits, nextPowerOf2: d <= 1 ? 1 : nextPow >= d ? nextPow : nextPow * 2, hexValue: d };
    },
    scenario: { fieldKey: "decimal", values: (i) => shiftedValues(i.decimal, [-10, 0, 10, 50, 100], 0), tableOutputKeys: ["binaryDigits", "nextPowerOf2"], chartOutputKey: "binaryDigits", tableTitle: "Bits by decimal value", chartTitle: "Bit count growth", note: "Every doubling of the value adds one more bit." },
    content: { summaryLead: "The Binary Calculator helps you understand binary representation by showing the bit count and nearest power of 2 for any decimal number.", formulas: ["Bits = floor(log₂(n)) + 1", "Next Power of 2 = 2^bits"], assumptions: ["Input is a non-negative integer.", "Standard binary representation."], tips: ["8 bits = 256 values (0-255), perfect for bytes.", "Powers of 2: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024."], references: ["Binary number system fundamentals", "Bit manipulation in computing"], examples: [{ title: "Computer science basics", values: { decimal: 255 }, note: "255 needs 8 bits (11111111 in binary) — the maximum value of a byte." }] },
  },
  {
    calculator: { slug: "mean-median-mode", name: "Mean Median Mode Calculator", category: "math", blurb: "Calculate central tendency measures from data values.", tags: ["statistics", "average", "data"] },
    fields: [
      { key: "v1", label: "Value 1", format: "number", defaultValue: 5, step: 1, description: "First data point." },
      { key: "v2", label: "Value 2", format: "number", defaultValue: 10, step: 1, description: "Second data point." },
      { key: "v3", label: "Value 3", format: "number", defaultValue: 10, step: 1, description: "Third data point." },
      { key: "v4", label: "Value 4", format: "number", defaultValue: 15, step: 1, description: "Fourth data point." },
      { key: "v5", label: "Value 5", format: "number", defaultValue: 20, step: 1, description: "Fifth data point." },
    ],
    outputs: [
      { key: "mean", label: "Mean", format: "number", description: "Arithmetic average of all values." },
      { key: "median", label: "Median", format: "number", description: "Middle value when sorted." },
      { key: "range", label: "Range", format: "number", description: "Difference between max and min." },
    ],
    compute: (i) => {
      const vals = [i.v1, i.v2, i.v3, i.v4, i.v5].sort((a, b) => a - b);
      const mean = vals.reduce((s, v) => s + v, 0) / vals.length;
      return { mean, median: vals[2], range: vals[4] - vals[0] };
    },
    scenario: { fieldKey: "v5", values: (i) => shiftedValues(i.v5, [-10, -5, 0, 5, 10], 0), tableOutputKeys: ["mean", "median"], chartOutputKey: "mean", tableTitle: "Mean by Value 5", chartTitle: "Central tendency shift", note: "The median is more resistant to outliers than the mean." },
    content: { summaryLead: "The Mean Median Mode Calculator computes key measures of central tendency and spread for a set of five data points.", formulas: ["Mean = Σx / n", "Median = middle value in sorted set", "Range = Max − Min"], assumptions: ["Exactly five data points.", "Mode detection simplified to most common value."], tips: ["Median is better for skewed data.", "Range gives a quick sense of spread but is sensitive to outliers."], references: ["Measures of central tendency", "Descriptive statistics basics"], examples: [{ title: "Test score analysis", values: { v1: 65, v2: 78, v3: 82, v4: 82, v5: 95 }, note: "The median (82) may represent the typical score better than the mean (80.4) when scores are clustered." }] },
  },
];

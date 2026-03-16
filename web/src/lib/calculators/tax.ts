export type FilingStatus =
  | "single"
  | "married_joint"
  | "married_separate"
  | "head_of_household";

export type TaxYear = 2024 | 2025 | 2026;

export type TaxBracket = {
  rate: number;
  upTo: number | null;
};

export type IncomeTaxInputs = {
  year: TaxYear;
  filingStatus: FilingStatus;
  wages: number;
  otherIncome: number;
  adjustments: number;
  itemizedDeductions: number;
  useStandardDeduction: boolean;
  taxCredits: number;
};

export type TaxBracketDetail = {
  rate: number;
  taxableIncome: number;
  tax: number;
  upTo: number | null;
};

const taxBrackets: Record<TaxYear, Record<FilingStatus, TaxBracket[]>> = {
  2024: {
    married_joint: [
      { rate: 0.1, upTo: 23200 },
      { rate: 0.12, upTo: 94300 },
      { rate: 0.22, upTo: 201050 },
      { rate: 0.24, upTo: 383900 },
      { rate: 0.32, upTo: 487450 },
      { rate: 0.35, upTo: 731200 },
      { rate: 0.37, upTo: null },
    ],
    head_of_household: [
      { rate: 0.1, upTo: 16550 },
      { rate: 0.12, upTo: 63100 },
      { rate: 0.22, upTo: 100500 },
      { rate: 0.24, upTo: 191950 },
      { rate: 0.32, upTo: 243700 },
      { rate: 0.35, upTo: 609350 },
      { rate: 0.37, upTo: null },
    ],
    single: [
      { rate: 0.1, upTo: 11600 },
      { rate: 0.12, upTo: 47150 },
      { rate: 0.22, upTo: 100525 },
      { rate: 0.24, upTo: 191950 },
      { rate: 0.32, upTo: 243725 },
      { rate: 0.35, upTo: 609350 },
      { rate: 0.37, upTo: null },
    ],
    married_separate: [
      { rate: 0.1, upTo: 11600 },
      { rate: 0.12, upTo: 47150 },
      { rate: 0.22, upTo: 100525 },
      { rate: 0.24, upTo: 191950 },
      { rate: 0.32, upTo: 243725 },
      { rate: 0.35, upTo: 365600 },
      { rate: 0.37, upTo: null },
    ],
  },
  2025: {
    married_joint: [
      { rate: 0.1, upTo: 23850 },
      { rate: 0.12, upTo: 96950 },
      { rate: 0.22, upTo: 206700 },
      { rate: 0.24, upTo: 394600 },
      { rate: 0.32, upTo: 501050 },
      { rate: 0.35, upTo: 751600 },
      { rate: 0.37, upTo: null },
    ],
    head_of_household: [
      { rate: 0.1, upTo: 17000 },
      { rate: 0.12, upTo: 64850 },
      { rate: 0.22, upTo: 103350 },
      { rate: 0.24, upTo: 197300 },
      { rate: 0.32, upTo: 250500 },
      { rate: 0.35, upTo: 626350 },
      { rate: 0.37, upTo: null },
    ],
    single: [
      { rate: 0.1, upTo: 11925 },
      { rate: 0.12, upTo: 48475 },
      { rate: 0.22, upTo: 103350 },
      { rate: 0.24, upTo: 197300 },
      { rate: 0.32, upTo: 250525 },
      { rate: 0.35, upTo: 626350 },
      { rate: 0.37, upTo: null },
    ],
    married_separate: [
      { rate: 0.1, upTo: 11925 },
      { rate: 0.12, upTo: 48475 },
      { rate: 0.22, upTo: 103350 },
      { rate: 0.24, upTo: 197300 },
      { rate: 0.32, upTo: 250525 },
      { rate: 0.35, upTo: 375800 },
      { rate: 0.37, upTo: null },
    ],
  },
  2026: {
    married_joint: [
      { rate: 0.1, upTo: 24450 },
      { rate: 0.12, upTo: 99400 },
      { rate: 0.22, upTo: 211750 },
      { rate: 0.24, upTo: 403900 },
      { rate: 0.32, upTo: 511050 },
      { rate: 0.35, upTo: 766550 },
      { rate: 0.37, upTo: null },
    ],
    head_of_household: [
      { rate: 0.1, upTo: 17600 },
      { rate: 0.12, upTo: 67150 },
      { rate: 0.22, upTo: 106200 },
      { rate: 0.24, upTo: 202050 },
      { rate: 0.32, upTo: 257100 },
      { rate: 0.35, upTo: 643050 },
      { rate: 0.37, upTo: null },
    ],
    single: [
      { rate: 0.1, upTo: 12200 },
      { rate: 0.12, upTo: 49900 },
      { rate: 0.22, upTo: 106200 },
      { rate: 0.24, upTo: 202050 },
      { rate: 0.32, upTo: 257100 },
      { rate: 0.35, upTo: 643050 },
      { rate: 0.37, upTo: null },
    ],
    married_separate: [
      { rate: 0.1, upTo: 12200 },
      { rate: 0.12, upTo: 49900 },
      { rate: 0.22, upTo: 106200 },
      { rate: 0.24, upTo: 202050 },
      { rate: 0.32, upTo: 257100 },
      { rate: 0.35, upTo: 383275 },
      { rate: 0.37, upTo: null },
    ],
  },
};

const standardDeduction: Record<TaxYear, Record<FilingStatus, number>> = {
  2024: {
    married_joint: 29200,
    head_of_household: 21900,
    single: 14600,
    married_separate: 14600,
  },
  2025: {
    married_joint: 31500,
    head_of_household: 23625,
    single: 15750,
    married_separate: 15750,
  },
  2026: {
    married_joint: 32100,
    head_of_household: 24075,
    single: 16050,
    married_separate: 16050,
  },
};

export function calculateIncomeTax(inputs: IncomeTaxInputs) {
  const wages = Math.max(0, inputs.wages);
  const otherIncome = Math.max(0, inputs.otherIncome);
  const adjustments = Math.max(0, inputs.adjustments);
  const itemized = Math.max(0, inputs.itemizedDeductions);
  const credits = Math.max(0, inputs.taxCredits);

  const grossIncome = wages + otherIncome;
  const standard = standardDeduction[inputs.year][inputs.filingStatus];
  const deduction = inputs.useStandardDeduction ? standard : itemized;
  const taxableIncome = Math.max(0, grossIncome - adjustments - deduction);

  const brackets = taxBrackets[inputs.year][inputs.filingStatus];
  let remaining = taxableIncome;
  let lastCap = 0;
  let taxBeforeCredits = 0;
  const bracketDetails: TaxBracketDetail[] = [];

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const cap = bracket.upTo ?? Number.POSITIVE_INFINITY;
    const taxableAtRate = Math.max(0, Math.min(remaining, cap - lastCap));
    const tax = taxableAtRate * bracket.rate;

    bracketDetails.push({
      rate: bracket.rate,
      taxableIncome: taxableAtRate,
      tax,
      upTo: bracket.upTo,
    });

    taxBeforeCredits += tax;
    remaining -= taxableAtRate;
    lastCap = cap;
  }

  const taxAfterCredits = Math.max(0, taxBeforeCredits - credits);
  const netIncome = Math.max(0, grossIncome - taxAfterCredits);
  const effectiveRate = grossIncome === 0 ? 0 : (taxAfterCredits / grossIncome) * 100;

  return {
    grossIncome,
    taxableIncome,
    standardDeduction: standard,
    deduction,
    taxBeforeCredits,
    taxCredits: credits,
    taxAfterCredits,
    netIncome,
    effectiveRate,
    bracketDetails,
  };
}

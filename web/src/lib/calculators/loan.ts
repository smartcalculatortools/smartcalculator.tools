export type LoanType = "amortized" | "deferred" | "bond";

export type LoanInputs = {
  principal: number;
  annualRate: number;
  termYears: number;
};

export type LoanFrequencyInputs = LoanInputs & {
  paymentsPerYear: number;
  compoundsPerYear: number;
};

export type FrequencyScheduleRow = {
  period: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
};

function effectiveAnnualRate(annualRate: number, compoundsPerYear: number) {
  const safeAnnualRate = Math.max(0, annualRate) / 100;
  const rounded = Math.round(compoundsPerYear);
  if (rounded <= 0) {
    return Math.exp(safeAnnualRate) - 1;
  }
  const safeCompounds = Math.max(1, rounded);
  return Math.pow(1 + safeAnnualRate / safeCompounds, safeCompounds) - 1;
}

function periodicRate({
  annualRate,
  paymentsPerYear,
  compoundsPerYear,
}: {
  annualRate: number;
  paymentsPerYear: number;
  compoundsPerYear: number;
}) {
  const safePayments = Math.max(1, Math.round(paymentsPerYear));

  const effectiveAnnual = effectiveAnnualRate(annualRate, compoundsPerYear);
  const ratePerPayment = Math.pow(1 + effectiveAnnual, 1 / safePayments) - 1;
  return { ratePerPayment, paymentsPerYear: safePayments };
}

export function monthlyPayment({
  principal,
  annualRate,
  termYears,
}: LoanInputs) {
  const safePrincipal = Math.max(0, principal);
  const months = Math.max(0, Math.round(termYears * 12));
  const rate = Math.max(0, annualRate) / 100 / 12;

  if (months === 0) return 0;
  if (rate === 0) return safePrincipal / months;

  return (safePrincipal * rate) / (1 - Math.pow(1 + rate, -months));
}

export function periodicPayment({
  principal,
  annualRate,
  termYears,
  paymentsPerYear,
  compoundsPerYear,
}: LoanFrequencyInputs) {
  const safePrincipal = Math.max(0, principal);
  const { ratePerPayment, paymentsPerYear: safePayments } = periodicRate({
    annualRate,
    paymentsPerYear,
    compoundsPerYear,
  });
  const periods = Math.max(0, Math.round(termYears * safePayments));

  if (periods === 0) return 0;
  if (ratePerPayment === 0) return safePrincipal / periods;

  return (
    (safePrincipal * ratePerPayment) / (1 - Math.pow(1 + ratePerPayment, -periods))
  );
}

export function totalPaymentByFrequency(inputs: LoanFrequencyInputs) {
  const periods = Math.max(0, Math.round(inputs.termYears * inputs.paymentsPerYear));
  return periodicPayment(inputs) * periods;
}

export function totalInterestByFrequency(inputs: LoanFrequencyInputs) {
  return Math.max(
    0,
    totalPaymentByFrequency(inputs) - Math.max(0, inputs.principal)
  );
}

export function amortizationScheduleByFrequency(inputs: LoanFrequencyInputs) {
  const safePrincipal = Math.max(0, inputs.principal);
  const { ratePerPayment, paymentsPerYear } = periodicRate(inputs);
  const periods = Math.max(1, Math.round(inputs.termYears * paymentsPerYear));
  const payment = periodicPayment(inputs);

  const schedule: FrequencyScheduleRow[] = [];
  let balance = safePrincipal;

  for (let period = 1; period <= periods; period += 1) {
    const interest = balance * ratePerPayment;
    const principalPaid = Math.max(0, payment - interest);
    const adjustedPrincipal = Math.min(principalPaid, balance);
    balance = Math.max(0, balance - adjustedPrincipal);

    schedule.push({
      period,
      payment,
      interest,
      principal: adjustedPrincipal,
      balance,
    });

    if (balance <= 0.01) {
      balance = 0;
      break;
    }
  }

  return { payment, schedule, paymentsPerYear };
}

export function totalPayment(inputs: LoanInputs) {
  const months = Math.max(0, Math.round(inputs.termYears * 12));
  return monthlyPayment(inputs) * months;
}

export function totalInterest(inputs: LoanInputs) {
  return Math.max(0, totalPayment(inputs) - Math.max(0, inputs.principal));
}


function compoundFactor({
  annualRate,
  compoundsPerYear,
  years,
}: {
  annualRate: number;
  compoundsPerYear: number;
  years: number;
}) {
  const safeYears = Math.max(0, years);
  if (safeYears === 0) return 1;
  const rate = Math.max(0, annualRate) / 100;
  const rounded = Math.round(compoundsPerYear);
  if (rounded <= 0) {
    return Math.exp(rate * safeYears);
  }
  const safeCompounds = Math.max(1, rounded);
  return Math.pow(1 + rate / safeCompounds, safeCompounds * safeYears);
}

export function deferredAmountDue({
  principal,
  annualRate,
  termYears,
  compoundsPerYear,
}: LoanFrequencyInputs) {
  const factor = compoundFactor({
    annualRate,
    compoundsPerYear,
    years: termYears,
  });
  return Math.max(0, principal) * factor;
}

export function bondPresentValue({
  principal,
  annualRate,
  termYears,
  compoundsPerYear,
}: LoanFrequencyInputs) {
  const factor = compoundFactor({
    annualRate,
    compoundsPerYear,
    years: termYears,
  });
  if (factor === 0) return 0;
  return Math.max(0, principal) / factor;
}

export function deferredSchedule(inputs: LoanFrequencyInputs) {
  const safePrincipal = Math.max(0, inputs.principal);
  const rounded = Math.round(inputs.compoundsPerYear);
  const periodsPerYear = rounded <= 0 ? 12 : Math.max(1, rounded);
  const periods = Math.max(1, Math.round(inputs.termYears * periodsPerYear));
  const effectiveAnnual = effectiveAnnualRate(inputs.annualRate, inputs.compoundsPerYear);
  const ratePerPeriod = Math.pow(1 + effectiveAnnual, 1 / periodsPerYear) - 1;

  const schedule: FrequencyScheduleRow[] = [];
  let balance = safePrincipal;

  for (let period = 1; period <= periods; period += 1) {
    const interest = balance * ratePerPeriod;
    balance += interest;

    schedule.push({
      period,
      payment: 0,
      interest,
      principal: 0,
      balance,
    });
  }

  return { schedule, paymentsPerYear: periodsPerYear };
}

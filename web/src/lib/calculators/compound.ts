export type CompoundInputs = {
  principal: number;
  annualRate: number;
  years: number;
  contribution: number;
  compoundsPerYear: number;
  contributionTiming?: "end" | "start";
};

function normalizedInputs(inputs: CompoundInputs) {
  const principal = Math.max(0, inputs.principal);
  const years = Math.max(0, inputs.years);
  const contribution = Math.max(0, inputs.contribution);
  const rawCompounds = Math.round(inputs.compoundsPerYear);
  const compoundsPerYear = rawCompounds <= 0 ? 0 : Math.max(1, rawCompounds);
  const annualRate = Math.max(0, inputs.annualRate) / 100;
  const rate =
    compoundsPerYear == 0
      ? Math.exp(annualRate / 12) - 1
      : annualRate / compoundsPerYear;
  const periods =
    compoundsPerYear == 0
      ? Math.max(0, Math.round(years * 12))
      : Math.max(0, Math.round(years * compoundsPerYear));
  const timing = inputs.contributionTiming ?? "end";

  return {
    principal,
    years,
    contribution,
    compoundsPerYear,
    rate,
    periods,
    timing,
    annualRate,
  };
}

export function futureValue(inputs: CompoundInputs) {
  const { principal, contribution, rate, periods, timing, annualRate } =
    normalizedInputs(inputs);

  if (periods === 0) return principal;
  if (annualRate === 0) return principal + contribution * periods;

  const growth = Math.pow(1 + rate, periods);
  const timingFactor = timing === "start" ? 1 + rate : 1;
  const contributions = contribution * ((growth - 1) / rate) * timingFactor;

  return principal * growth + contributions;
}

export function totalContributions(inputs: CompoundInputs) {
  const { principal, contribution, periods } = normalizedInputs(inputs);
  return principal + contribution * periods;
}

export function interestEarned(inputs: CompoundInputs) {
  return Math.max(0, futureValue(inputs) - totalContributions(inputs));
}


export type MonthlyScheduleRow = {
  month: number;
  date: Date;
  contribution: number;
  interest: number;
  balance: number;
};

export type MonthlyScheduleInputs = {
  principal: number;
  annualRate: number;
  years: number;
  months: number;
  contribution: number;
  contributionFrequency: number;
  contributionTiming: "end" | "start";
  compoundsPerYear: number;
  annualIncrease?: number;
  startDate: Date;
};

function effectiveMonthlyRate(annualRate: number, compoundsPerYear: number) {
  const safeRate = Math.max(0, annualRate) / 100;
  if (safeRate === 0) return 0;
  if (compoundsPerYear <= 0) {
    return Math.exp(safeRate / 12) - 1;
  }
  const safeCompounds = Math.max(1, Math.round(compoundsPerYear));
  const effectiveAnnual =
    Math.pow(1 + safeRate / safeCompounds, safeCompounds) - 1;
  return Math.pow(1 + effectiveAnnual, 1 / 12) - 1;
}

export function buildMonthlySchedule(inputs: MonthlyScheduleInputs) {
  const totalMonths = Math.max(0, Math.round(inputs.years * 12 + inputs.months));
  const monthlyRate = effectiveMonthlyRate(inputs.annualRate, inputs.compoundsPerYear);
  const frequency = Math.max(1, Math.round(inputs.contributionFrequency));
  const timing = inputs.contributionTiming;
  const annualIncrease = Math.max(0, inputs.annualIncrease ?? 0) / 100;

  let balance = Math.max(0, inputs.principal);
  let totalContrib = Math.max(0, inputs.principal);
  let currentContribution = Math.max(0, inputs.contribution);

  const schedule: MonthlyScheduleRow[] = [];

  for (let month = 1; month <= totalMonths; month += 1) {
    const date = new Date(inputs.startDate);
    date.setMonth(inputs.startDate.getMonth() + (month - 1));

    const contributionDue =
      frequency === 12
        ? true
        : frequency === 4
          ? month % 3 === 0
          : month % 12 === 0;

    let contribution = 0;
    if (timing === "start" && contributionDue) {
      contribution = currentContribution;
      balance += contribution;
      totalContrib += contribution;
    }

    const interest = balance * monthlyRate;
    balance += interest;

    if (timing === "end" && contributionDue) {
      contribution = currentContribution;
      balance += contribution;
      totalContrib += contribution;
    }

    schedule.push({
      month,
      date,
      contribution,
      interest,
      balance,
    });

    if (month % 12 === 0 && annualIncrease > 0) {
      currentContribution *= 1 + annualIncrease;
    }
  }

  const interestEarned = Math.max(0, balance - totalContrib);

  return {
    schedule,
    endingBalance: balance,
    totalContrib,
    interestEarned,
  };
}

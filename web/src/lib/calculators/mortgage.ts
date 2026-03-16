import { monthlyPayment } from "./loan";

export type MortgageInputs = {
  principal: number;
  annualRate: number;
  termYears: number;
  extraMonthly?: number;
};

export type AmortizationRow = {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  extra: number;
  balance: number;
};

export function amortizationSchedule({
  principal,
  annualRate,
  termYears,
  extraMonthly = 0,
}: MortgageInputs) {
  const safePrincipal = Math.max(0, principal);
  const safeExtra = Math.max(0, extraMonthly);
  const rate = Math.max(0, annualRate) / 100 / 12;
  const months = Math.max(1, Math.round(termYears * 12));
  const basePayment = monthlyPayment({
    principal: safePrincipal,
    annualRate,
    termYears,
  });

  const schedule: AmortizationRow[] = [];
  let balance = safePrincipal;
  let month = 1;

  while (balance > 0 && month <= months + 1) {
    const interest = balance * rate;
    const principalPaid = Math.max(0, basePayment - interest);
    let extra = safeExtra;
    if (principalPaid + extra > balance) {
      extra = Math.max(0, balance - principalPaid);
    }
    const totalPrincipal = principalPaid + extra;
    balance = Math.max(0, balance - totalPrincipal);

    schedule.push({
      month,
      payment: basePayment,
      interest,
      principal: totalPrincipal,
      extra,
      balance,
    });

    if (balance <= 0.01) {
      balance = 0;
      break;
    }

    month += 1;
  }

  return { basePayment, schedule };
}

export function amortizationSummary(schedule: AmortizationRow[]) {
  return schedule.reduce(
    (acc, row) => {
      acc.totalInterest += row.interest;
      acc.totalPrincipal += row.principal;
      acc.totalExtra += row.extra;
      return acc;
    },
    { totalInterest: 0, totalPrincipal: 0, totalExtra: 0 }
  );
}

export function groupScheduleByYear(schedule: AmortizationRow[]) {
  const years: {
    year: number;
    interest: number;
    principal: number;
    extra: number;
    balance: number;
  }[] = [];

  schedule.forEach((row) => {
    const year = Math.ceil(row.month / 12);
    const existing = years.find((item) => item.year === year);
    if (!existing) {
      years.push({
        year,
        interest: row.interest,
        principal: row.principal,
        extra: row.extra,
        balance: row.balance,
      });
    } else {
      existing.interest += row.interest;
      existing.principal += row.principal;
      existing.extra += row.extra;
      existing.balance = row.balance;
    }
  });

  return years;
}

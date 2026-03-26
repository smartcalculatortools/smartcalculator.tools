import type { ConfigurableCalculatorDefinition } from "./base";
import { clampNonNegative, safeDivide, shiftedValues, scaledValues } from "./base";

export const financialBatch2Definitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: { slug: "auto-loan", name: "Auto Loan Calculator", category: "financial", blurb: "Estimate monthly payments and total cost for a vehicle loan.", tags: ["car", "vehicle", "payments"] },
    fields: [
      { key: "loanAmount", label: "Loan amount", format: "currency", defaultValue: 30000, min: 0, step: 500, description: "Total amount borrowed for the vehicle purchase." },
      { key: "rate", label: "Annual rate", format: "percent", defaultValue: 6.5, min: 0, step: 0.1, description: "Annual interest rate on the auto loan." },
      { key: "termMonths", label: "Term (months)", format: "number", defaultValue: 60, min: 1, step: 6, description: "Loan repayment period in months." },
    ],
    outputs: [
      { key: "monthlyPayment", label: "Monthly payment", format: "currency", description: "Fixed monthly payment over the loan term." },
      { key: "totalInterest", label: "Total interest", format: "currency", description: "Total interest paid over the life of the loan." },
      { key: "totalCost", label: "Total cost", format: "currency", description: "Principal plus all interest paid." },
    ],
    compute: (i) => {
      const P = clampNonNegative(i.loanAmount), r = clampNonNegative(i.rate) / 100 / 12, n = Math.max(1, Math.round(clampNonNegative(i.termMonths)));
      if (r === 0) { const mp = safeDivide(P, n); return { monthlyPayment: mp, totalInterest: 0, totalCost: P }; }
      const mp = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalCost = mp * n;
      return { monthlyPayment: mp, totalInterest: totalCost - P, totalCost };
    },
    scenario: { fieldKey: "rate", values: (i) => shiftedValues(i.rate, [-2, -1, 0, 1, 2], 0), tableOutputKeys: ["monthlyPayment", "totalInterest"], chartOutputKey: "monthlyPayment", tableTitle: "Payment by interest rate", chartTitle: "Monthly payment sensitivity", note: "Even small rate changes shift total interest significantly on multi-year auto loans." },
    content: { summaryLead: "The Auto Loan Calculator helps you estimate monthly payments, total interest, and the overall cost of financing a vehicle.", formulas: ["Monthly Payment = P × r(1+r)^n / ((1+r)^n − 1)", "Total Cost = Monthly Payment × Term"], assumptions: ["Fixed interest rate for the full term.", "No early payoff or refinancing."], tips: ["Shorter terms cost more monthly but save on interest.", "Compare dealer financing with bank or credit union rates."], references: ["Standard amortizing loan payment formula", "Auto financing industry conventions"], examples: [{ title: "New car financing", values: { loanAmount: 35000, rate: 5.9, termMonths: 60 }, note: "A 60-month term is common, but a 48-month term saves significant interest." }] },
  },
  {
    calculator: { slug: "retirement", name: "Retirement Calculator", category: "financial", blurb: "Project retirement savings based on contributions and growth.", tags: ["retirement", "savings", "planning"] },
    fields: [
      { key: "currentSavings", label: "Current savings", format: "currency", defaultValue: 50000, min: 0, step: 1000, description: "Amount already saved for retirement." },
      { key: "monthlyContribution", label: "Monthly contribution", format: "currency", defaultValue: 500, min: 0, step: 50, description: "Amount added each month toward retirement." },
      { key: "annualReturn", label: "Annual return", format: "percent", defaultValue: 7, min: 0, step: 0.5, description: "Expected annual investment return rate." },
      { key: "yearsToRetirement", label: "Years to retirement", format: "number", defaultValue: 25, min: 1, step: 1, description: "Number of years until planned retirement." },
    ],
    outputs: [
      { key: "futureValue", label: "Retirement savings", format: "currency", description: "Projected total at retirement." },
      { key: "totalContributions", label: "Total contributions", format: "currency", description: "Sum of current savings and all monthly deposits." },
      { key: "totalGrowth", label: "Investment growth", format: "currency", description: "Earnings from compounding returns." },
    ],
    compute: (i) => {
      const pv = clampNonNegative(i.currentSavings), pmt = clampNonNegative(i.monthlyContribution), r = clampNonNegative(i.annualReturn) / 100 / 12, n = Math.max(1, Math.round(clampNonNegative(i.yearsToRetirement))) * 12;
      const fvLump = pv * Math.pow(1 + r, n);
      const fvAnnuity = r > 0 ? pmt * (Math.pow(1 + r, n) - 1) / r : pmt * n;
      const futureValue = fvLump + fvAnnuity;
      const totalContributions = pv + pmt * n;
      return { futureValue, totalContributions, totalGrowth: futureValue - totalContributions };
    },
    scenario: { fieldKey: "annualReturn", values: (i) => shiftedValues(i.annualReturn, [-3, -1, 0, 1, 3], 0), tableOutputKeys: ["futureValue", "totalGrowth"], chartOutputKey: "futureValue", tableTitle: "Savings by return rate", chartTitle: "Retirement projection", note: "Return rates vary with asset allocation; use conservative estimates for planning." },
    content: { summaryLead: "The Retirement Calculator projects how your savings will grow through regular contributions and compounding returns over time.", formulas: ["FV = PV(1+r)^n + PMT×((1+r)^n−1)/r"], assumptions: ["Constant monthly contribution and annual return.", "No withdrawals or tax effects modeled."], tips: ["Start early to maximize compound growth.", "Increase contributions with each raise."], references: ["Future value of annuity formula", "Retirement planning projection models"], examples: [{ title: "Mid-career projection", values: { currentSavings: 80000, monthlyContribution: 800, annualReturn: 7, yearsToRetirement: 20 }, note: "Compounding accelerates in later years, so patience is rewarded." }] },
  },
  {
    calculator: { slug: "amortization", name: "Amortization Calculator", category: "financial", blurb: "See how each payment splits between principal and interest.", tags: ["loan", "amortization", "schedule"] },
    fields: [
      { key: "loanAmount", label: "Loan amount", format: "currency", defaultValue: 200000, min: 0, step: 1000, description: "Original loan principal." },
      { key: "rate", label: "Annual rate", format: "percent", defaultValue: 6, min: 0, step: 0.1, description: "Annual interest rate on the loan." },
      { key: "termYears", label: "Term (years)", format: "number", defaultValue: 30, min: 1, step: 1, description: "Loan repayment period in years." },
    ],
    outputs: [
      { key: "monthlyPayment", label: "Monthly payment", format: "currency", description: "Fixed monthly payment amount." },
      { key: "totalInterest", label: "Total interest", format: "currency", description: "Total interest over the full loan term." },
      { key: "totalPaid", label: "Total paid", format: "currency", description: "Sum of all payments made." },
    ],
    compute: (i) => {
      const P = clampNonNegative(i.loanAmount), r = clampNonNegative(i.rate) / 100 / 12, n = Math.max(1, Math.round(clampNonNegative(i.termYears))) * 12;
      if (r === 0) { const mp = safeDivide(P, n); return { monthlyPayment: mp, totalInterest: 0, totalPaid: P }; }
      const mp = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalPaid = mp * n;
      return { monthlyPayment: mp, totalInterest: totalPaid - P, totalPaid };
    },
    scenario: { fieldKey: "termYears", values: (i) => shiftedValues(i.termYears, [-10, -5, 0, 5], 1), tableOutputKeys: ["monthlyPayment", "totalInterest"], chartOutputKey: "totalInterest", tableTitle: "Interest by loan term", chartTitle: "Total interest vs term length", note: "Shorter terms raise monthly payments but dramatically cut total interest." },
    content: { summaryLead: "The Amortization Calculator shows how loan payments are split between principal and interest over time.", formulas: ["Monthly Payment = P × r(1+r)^n / ((1+r)^n − 1)"], assumptions: ["Fixed rate and equal monthly payments.", "No extra payments or refinancing."], tips: ["Even one extra payment per year shortens the loan significantly.", "Compare 15-year vs 30-year terms to see the interest difference."], references: ["Amortization schedule calculation", "Loan repayment analysis"], examples: [{ title: "Home loan breakdown", values: { loanAmount: 250000, rate: 6.5, termYears: 30 }, note: "In the early years, most of each payment goes to interest rather than principal." }] },
  },
  {
    calculator: { slug: "investment", name: "Investment Calculator", category: "financial", blurb: "Project investment growth with regular contributions.", tags: ["invest", "growth", "compound"] },
    fields: [
      { key: "initialAmount", label: "Initial investment", format: "currency", defaultValue: 10000, min: 0, step: 500, description: "Starting investment amount." },
      { key: "monthlyAdd", label: "Monthly addition", format: "currency", defaultValue: 200, min: 0, step: 50, description: "Amount added every month." },
      { key: "annualReturn", label: "Annual return", format: "percent", defaultValue: 8, min: 0, step: 0.5, description: "Expected annual rate of return." },
      { key: "years", label: "Years", format: "number", defaultValue: 10, min: 1, step: 1, description: "Investment time horizon." },
    ],
    outputs: [
      { key: "endBalance", label: "End balance", format: "currency", description: "Projected portfolio value." },
      { key: "totalDeposited", label: "Total deposited", format: "currency", description: "Initial plus all monthly additions." },
      { key: "totalEarnings", label: "Total earnings", format: "currency", description: "Growth from investment returns." },
    ],
    compute: (i) => {
      const pv = clampNonNegative(i.initialAmount), pmt = clampNonNegative(i.monthlyAdd), r = clampNonNegative(i.annualReturn) / 100 / 12, n = Math.max(1, Math.round(clampNonNegative(i.years))) * 12;
      const fv = pv * Math.pow(1 + r, n) + (r > 0 ? pmt * (Math.pow(1 + r, n) - 1) / r : pmt * n);
      const totalDeposited = pv + pmt * n;
      return { endBalance: fv, totalDeposited, totalEarnings: fv - totalDeposited };
    },
    scenario: { fieldKey: "years", values: (i) => shiftedValues(i.years, [-5, 0, 5, 10, 15], 1), tableOutputKeys: ["endBalance", "totalEarnings"], chartOutputKey: "endBalance", tableTitle: "Balance by time horizon", chartTitle: "Growth over time", note: "Compounding accelerates over longer periods." },
    content: { summaryLead: "The Investment Calculator projects portfolio growth using an initial deposit, regular contributions, and expected returns.", formulas: ["FV = PV(1+r)^n + PMT×((1+r)^n−1)/r"], assumptions: ["Constant monthly addition and annual return.", "Returns are reinvested."], tips: ["Reinvesting dividends boosts compounding.", "Longer horizons tolerate more volatility."], references: ["Future value of annuity formula", "Investment growth projection models"], examples: [{ title: "Decade growth plan", values: { initialAmount: 15000, monthlyAdd: 300, annualReturn: 7, years: 15 }, note: "Most of the growth comes in the second half of the investment period." }] },
  },
  {
    calculator: { slug: "inflation", name: "Inflation Calculator", category: "financial", blurb: "See how purchasing power changes over time.", tags: ["inflation", "purchasing power", "economy"] },
    fields: [
      { key: "amount", label: "Current amount", format: "currency", defaultValue: 1000, min: 0, step: 100, description: "Amount of money today." },
      { key: "inflationRate", label: "Inflation rate", format: "percent", defaultValue: 3, min: 0, step: 0.1, description: "Expected annual inflation rate." },
      { key: "years", label: "Years", format: "number", defaultValue: 10, min: 1, step: 1, description: "Number of years into the future." },
    ],
    outputs: [
      { key: "futureEquivalent", label: "Future equivalent", format: "currency", description: "Amount needed in the future to match today's purchasing power." },
      { key: "purchasingPower", label: "Purchasing power", format: "currency", description: "What today's amount will be worth in future dollars." },
      { key: "totalLoss", label: "Value lost", format: "currency", description: "Decrease in real purchasing power." },
    ],
    compute: (i) => {
      const amount = clampNonNegative(i.amount), rate = clampNonNegative(i.inflationRate) / 100, years = Math.max(1, Math.round(clampNonNegative(i.years)));
      const futureEquivalent = amount * Math.pow(1 + rate, years);
      const purchasingPower = amount / Math.pow(1 + rate, years);
      return { futureEquivalent, purchasingPower, totalLoss: amount - purchasingPower };
    },
    scenario: { fieldKey: "inflationRate", values: (i) => shiftedValues(i.inflationRate, [-1, 0, 1, 2, 3], 0.5), tableOutputKeys: ["purchasingPower", "futureEquivalent"], chartOutputKey: "purchasingPower", tableTitle: "Purchasing power by inflation rate", chartTitle: "Erosion of value", note: "Even modest inflation compounds into significant purchasing power loss over decades." },
    content: { summaryLead: "The Inflation Calculator shows how rising prices erode purchasing power and how much more you will need in the future to maintain the same standard.", formulas: ["Future Equivalent = Amount × (1 + Rate)^Years", "Purchasing Power = Amount ÷ (1 + Rate)^Years"], assumptions: ["Constant annual inflation rate.", "No compounding interruptions."], tips: ["Use 2-3% for long-term US inflation planning.", "Factor inflation into retirement projections."], references: ["Consumer price index methodology", "Time value of money and inflation"], examples: [{ title: "Decade purchasing power check", values: { amount: 5000, inflationRate: 3.5, years: 15 }, note: "At 3.5% inflation, money loses roughly a third of its value in 15 years." }] },
  },
  {
    calculator: { slug: "credit-card-payoff", name: "Credit Card Payoff Calculator", category: "financial", blurb: "Find out how long to pay off a credit card balance.", tags: ["credit", "debt", "payoff"] },
    fields: [
      { key: "balance", label: "Balance", format: "currency", defaultValue: 5000, min: 0, step: 100, description: "Current credit card balance." },
      { key: "apr", label: "APR", format: "percent", defaultValue: 22, min: 0, step: 0.5, description: "Annual percentage rate on the card." },
      { key: "monthlyPayment", label: "Monthly payment", format: "currency", defaultValue: 200, min: 0, step: 25, description: "Amount you plan to pay each month." },
    ],
    outputs: [
      { key: "monthsToPayoff", label: "Months to payoff", format: "number", description: "Number of months to eliminate the balance." },
      { key: "totalInterest", label: "Total interest", format: "currency", description: "Total interest paid over the payoff period." },
      { key: "totalPaid", label: "Total paid", format: "currency", description: "Sum of all monthly payments." },
    ],
    compute: (i) => {
      const B = clampNonNegative(i.balance), r = clampNonNegative(i.apr) / 100 / 12, pmt = clampNonNegative(i.monthlyPayment);
      if (B === 0) return { monthsToPayoff: 0, totalInterest: 0, totalPaid: 0 };
      if (r === 0) { const m = Math.ceil(safeDivide(B, pmt)); return { monthsToPayoff: m, totalInterest: 0, totalPaid: pmt * m }; }
      if (pmt <= B * r) return { monthsToPayoff: 0, totalInterest: 0, totalPaid: 0 };
      const months = Math.ceil(-Math.log(1 - B * r / pmt) / Math.log(1 + r));
      const totalPaid = pmt * months;
      return { monthsToPayoff: months, totalInterest: totalPaid - B, totalPaid };
    },
    scenario: { fieldKey: "monthlyPayment", values: (i) => shiftedValues(i.monthlyPayment, [-50, 0, 50, 100, 200], 50), tableOutputKeys: ["monthsToPayoff", "totalInterest"], chartOutputKey: "totalInterest", tableTitle: "Payoff by monthly payment", chartTitle: "Interest savings", note: "Paying even a little more each month can save hundreds in interest." },
    content: { summaryLead: "The Credit Card Payoff Calculator shows how long it takes to clear a balance and how much interest you will pay based on your monthly payment.", formulas: ["Months = −ln(1 − B×r/PMT) / ln(1+r)"], assumptions: ["Fixed APR and consistent monthly payment.", "No new charges added to the balance."], tips: ["Pay more than the minimum to avoid years of interest.", "Consider a balance transfer for high-APR cards."], references: ["Credit card payoff mathematics", "Consumer debt repayment strategies"], examples: [{ title: "Aggressive payoff plan", values: { balance: 8000, apr: 24, monthlyPayment: 400 }, note: "Doubling your payment from minimum can cut the payoff time by more than half." }] },
  },
  {
    calculator: { slug: "debt-payoff", name: "Debt Payoff Calculator", category: "financial", blurb: "Plan a timeline to eliminate outstanding debt.", tags: ["debt", "payoff", "budget"] },
    fields: [
      { key: "totalDebt", label: "Total debt", format: "currency", defaultValue: 20000, min: 0, step: 500, description: "Combined outstanding debt balance." },
      { key: "rate", label: "Average interest rate", format: "percent", defaultValue: 10, min: 0, step: 0.5, description: "Weighted average interest rate across debts." },
      { key: "monthlyPayment", label: "Monthly payment", format: "currency", defaultValue: 600, min: 0, step: 50, description: "Total monthly payment toward debt." },
    ],
    outputs: [
      { key: "monthsToPayoff", label: "Months to payoff", format: "number", description: "Time needed to clear all debt." },
      { key: "totalInterest", label: "Total interest", format: "currency", description: "Total interest paid during repayment." },
      { key: "totalPaid", label: "Total paid", format: "currency", description: "All payments combined." },
    ],
    compute: (i) => {
      const B = clampNonNegative(i.totalDebt), r = clampNonNegative(i.rate) / 100 / 12, pmt = clampNonNegative(i.monthlyPayment);
      if (B === 0) return { monthsToPayoff: 0, totalInterest: 0, totalPaid: 0 };
      if (r === 0) { const m = Math.ceil(safeDivide(B, pmt)); return { monthsToPayoff: m, totalInterest: 0, totalPaid: pmt * m }; }
      if (pmt <= B * r) return { monthsToPayoff: 0, totalInterest: 0, totalPaid: 0 };
      const months = Math.ceil(-Math.log(1 - B * r / pmt) / Math.log(1 + r));
      const totalPaid = pmt * months;
      return { monthsToPayoff: months, totalInterest: totalPaid - B, totalPaid };
    },
    scenario: { fieldKey: "monthlyPayment", values: (i) => shiftedValues(i.monthlyPayment, [-100, 0, 100, 200, 400], 100), tableOutputKeys: ["monthsToPayoff", "totalInterest"], chartOutputKey: "monthsToPayoff", tableTitle: "Payoff timeline by payment", chartTitle: "Months to freedom", note: "Increasing monthly payments accelerates debt elimination exponentially." },
    content: { summaryLead: "The Debt Payoff Calculator estimates how long it will take to become debt-free based on your balance, interest rate, and monthly payment.", formulas: ["Months = −ln(1 − Debt×r/PMT) / ln(1+r)"], assumptions: ["Single blended interest rate.", "No additional borrowing."], tips: ["Focus extra payments on the highest-rate debt first.", "Automate payments to stay consistent."], references: ["Debt repayment amortization formulas", "Avalanche vs snowball repayment methods"], examples: [{ title: "Accelerated debt plan", values: { totalDebt: 30000, rate: 12, monthlyPayment: 900 }, note: "A focused plan can eliminate $30k in debt in under 4 years." }] },
  },
  {
    calculator: { slug: "student-loan", name: "Student Loan Calculator", category: "financial", blurb: "Estimate student loan payments and total repayment cost.", tags: ["education", "loan", "student"] },
    fields: [
      { key: "loanAmount", label: "Loan amount", format: "currency", defaultValue: 40000, min: 0, step: 1000, description: "Total student loan balance." },
      { key: "rate", label: "Interest rate", format: "percent", defaultValue: 5.5, min: 0, step: 0.1, description: "Annual interest rate on the student loan." },
      { key: "termYears", label: "Repayment term (years)", format: "number", defaultValue: 10, min: 1, step: 1, description: "Standard repayment period." },
    ],
    outputs: [
      { key: "monthlyPayment", label: "Monthly payment", format: "currency", description: "Fixed monthly repayment amount." },
      { key: "totalInterest", label: "Total interest", format: "currency", description: "Interest paid over the loan life." },
      { key: "totalPaid", label: "Total repaid", format: "currency", description: "Total of all payments." },
    ],
    compute: (i) => {
      const P = clampNonNegative(i.loanAmount), r = clampNonNegative(i.rate) / 100 / 12, n = Math.max(1, Math.round(clampNonNegative(i.termYears))) * 12;
      if (r === 0) { const mp = safeDivide(P, n); return { monthlyPayment: mp, totalInterest: 0, totalPaid: P }; }
      const mp = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalPaid = mp * n;
      return { monthlyPayment: mp, totalInterest: totalPaid - P, totalPaid };
    },
    scenario: { fieldKey: "termYears", values: (i) => shiftedValues(i.termYears, [-5, 0, 5, 10], 1), tableOutputKeys: ["monthlyPayment", "totalInterest"], chartOutputKey: "totalInterest", tableTitle: "Cost by repayment term", chartTitle: "Interest vs term length", note: "A 10-year plan is standard, but shorter terms save considerably on interest." },
    content: { summaryLead: "The Student Loan Calculator helps graduates estimate monthly payments and the total cost of repaying education debt.", formulas: ["Monthly Payment = P × r(1+r)^n / ((1+r)^n − 1)"], assumptions: ["Fixed rate for the full term.", "Standard repayment plan with no deferment."], tips: ["Make payments during the grace period to reduce principal.", "Refinancing can lower rates for borrowers with good credit."], references: ["Federal student loan repayment formulas", "Standard vs income-driven plan comparison"], examples: [{ title: "Graduate repayment plan", values: { loanAmount: 55000, rate: 6, termYears: 10 }, note: "Even small extra payments early in repayment cut years off the schedule." }] },
  },
  {
    calculator: { slug: "budget", name: "Budget Calculator", category: "financial", blurb: "Split income into needs, wants, and savings.", tags: ["budget", "income", "planning"] },
    fields: [
      { key: "monthlyIncome", label: "Monthly income", format: "currency", defaultValue: 5000, min: 0, step: 100, description: "Net monthly take-home pay." },
      { key: "needsPercent", label: "Needs %", format: "percent", defaultValue: 50, min: 0, max: 100, step: 1, description: "Percentage allocated to essential expenses." },
      { key: "wantsPercent", label: "Wants %", format: "percent", defaultValue: 30, min: 0, max: 100, step: 1, description: "Percentage allocated to discretionary spending." },
    ],
    outputs: [
      { key: "needs", label: "Needs budget", format: "currency", description: "Monthly spending on essentials." },
      { key: "wants", label: "Wants budget", format: "currency", description: "Monthly spending on non-essentials." },
      { key: "savings", label: "Savings", format: "currency", description: "Amount left for savings and investments." },
    ],
    compute: (i) => {
      const income = clampNonNegative(i.monthlyIncome), needsPct = clampNonNegative(i.needsPercent) / 100, wantsPct = clampNonNegative(i.wantsPercent) / 100;
      const needs = income * needsPct, wants = income * wantsPct;
      return { needs, wants, savings: Math.max(0, income - needs - wants) };
    },
    scenario: { fieldKey: "needsPercent", values: (i) => shiftedValues(i.needsPercent, [-10, -5, 0, 5, 10], 0), tableOutputKeys: ["needs", "savings"], chartOutputKey: "savings", tableTitle: "Savings by needs allocation", chartTitle: "Savings potential", note: "Reducing needs spending by even 5% can dramatically increase monthly savings." },
    content: { summaryLead: "The Budget Calculator helps you allocate monthly income into needs, wants, and savings using the popular 50/30/20 guideline or your own ratios.", formulas: ["Needs = Income × Needs%", "Savings = Income − Needs − Wants"], assumptions: ["Income is after-tax take-home pay.", "Percentages are user adjustable."], tips: ["Start with 50/30/20 and adjust to your reality.", "Track actual spending for a month before setting targets."], references: ["The 50/30/20 budgeting framework", "Personal budget allocation strategies"], examples: [{ title: "Standard budget split", values: { monthlyIncome: 6000, needsPercent: 50, wantsPercent: 30 }, note: "The 50/30/20 rule is a starting point; tailor it to your housing costs and goals." }] },
  },
  {
    calculator: { slug: "apr", name: "APR Calculator", category: "financial", blurb: "Convert nominal rate and fees into annual percentage rate.", tags: ["apr", "rate", "loan"] },
    fields: [
      { key: "loanAmount", label: "Loan amount", format: "currency", defaultValue: 20000, min: 0, step: 500, description: "Amount borrowed before fees." },
      { key: "nominalRate", label: "Nominal rate", format: "percent", defaultValue: 5, min: 0, step: 0.1, description: "Stated annual interest rate." },
      { key: "fees", label: "Upfront fees", format: "currency", defaultValue: 500, min: 0, step: 50, description: "Origination or closing fees rolled into the cost." },
      { key: "termYears", label: "Term (years)", format: "number", defaultValue: 5, min: 1, step: 1, description: "Loan term in years." },
    ],
    outputs: [
      { key: "effectiveAPR", label: "Effective APR", format: "percent", description: "True annualized cost including fees." },
      { key: "monthlyPayment", label: "Monthly payment", format: "currency", description: "Monthly payment on the full loan." },
      { key: "totalCost", label: "Total cost", format: "currency", description: "All payments plus fees." },
    ],
    compute: (i) => {
      const P = clampNonNegative(i.loanAmount), fees = clampNonNegative(i.fees), r = clampNonNegative(i.nominalRate) / 100 / 12, n = Math.max(1, Math.round(clampNonNegative(i.termYears))) * 12;
      if (r === 0) { const mp = safeDivide(P, n); return { effectiveAPR: safeDivide(fees, P) / clampNonNegative(i.termYears) * 100, monthlyPayment: mp, totalCost: P + fees }; }
      const mp = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const totalCost = mp * n + fees;
      const effectiveAPR = safeDivide(totalCost - P, P) / clampNonNegative(i.termYears) * 100;
      return { effectiveAPR, monthlyPayment: mp, totalCost };
    },
    scenario: { fieldKey: "fees", values: (i) => shiftedValues(i.fees, [-200, 0, 200, 500, 1000], 0), tableOutputKeys: ["effectiveAPR", "totalCost"], chartOutputKey: "effectiveAPR", tableTitle: "APR by fee level", chartTitle: "Fee impact on APR", note: "Hidden fees can raise the effective APR well beyond the advertised rate." },
    content: { summaryLead: "The APR Calculator converts a nominal interest rate and upfront fees into the effective annual percentage rate so you can compare loan offers fairly.", formulas: ["Effective APR ≈ (Total Cost − Principal) ÷ Principal ÷ Years × 100"], assumptions: ["Fees are treated as a lump-sum upfront cost.", "Simplified APR approximation."], tips: ["Always compare APR, not just the nominal rate.", "Ask lenders for the APR including all fees."], references: ["Truth in Lending Act APR definition", "APR calculation methodology"], examples: [{ title: "Loan with origination fee", values: { loanAmount: 25000, nominalRate: 5.5, fees: 750, termYears: 5 }, note: "Origination fees of 2-3% can add a full percentage point to the true borrowing cost." }] },
  },
];

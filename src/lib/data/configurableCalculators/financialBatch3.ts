import type { ConfigurableCalculatorDefinition } from "./base";
import { clampNonNegative, safeDivide, shiftedValues, scaledValues } from "./base";

export const financialBatch3Definitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: { slug: "vat", name: "VAT Calculator", category: "financial", blurb: "Calculate value-added tax and gross or net price.", tags: ["tax", "vat", "europe"] },
    fields: [
      { key: "netPrice", label: "Net price", format: "currency", defaultValue: 100, min: 0, step: 1, description: "Price before VAT is applied." },
      { key: "vatRate", label: "VAT rate", format: "percent", defaultValue: 20, min: 0, step: 0.5, description: "Value-added tax rate percentage." },
    ],
    outputs: [
      { key: "vatAmount", label: "VAT amount", format: "currency", description: "Tax amount added to the net price." },
      { key: "grossPrice", label: "Gross price", format: "currency", description: "Total price including VAT." },
      { key: "netFromGross", label: "Net from gross", format: "currency", description: "Net price extracted from the gross price." },
    ],
    compute: (i) => {
      const net = clampNonNegative(i.netPrice), rate = clampNonNegative(i.vatRate) / 100;
      const vat = net * rate;
      return { vatAmount: vat, grossPrice: net + vat, netFromGross: safeDivide(net + vat, 1 + rate) };
    },
    scenario: { fieldKey: "vatRate", values: (i) => shiftedValues(i.vatRate, [-5, 0, 5, 10], 0), tableOutputKeys: ["vatAmount", "grossPrice"], chartOutputKey: "grossPrice", tableTitle: "Price by VAT rate", chartTitle: "Gross price vs VAT rate", note: "VAT rates vary by country and product category." },
    content: { summaryLead: "The VAT Calculator helps you find the VAT amount, gross price, or extract the net price from a VAT-inclusive total.", formulas: ["VAT = Net Price × VAT Rate", "Gross = Net + VAT"], assumptions: ["Single flat VAT rate applied.", "No exemptions or reduced rates."], tips: ["Check the local VAT rate for your country before invoicing.", "Some goods have reduced or zero-rated VAT."], references: ["EU VAT Directive basics", "VAT calculation methodology"], examples: [{ title: "Standard EU invoice", values: { netPrice: 250, vatRate: 21 }, note: "Most EU countries apply 19-25% standard VAT rates." }] },
  },
  {
    calculator: { slug: "take-home-pay", name: "Take-Home Pay Calculator", category: "financial", blurb: "Estimate net pay after taxes and deductions.", tags: ["salary", "paycheck", "net pay"] },
    fields: [
      { key: "grossSalary", label: "Gross annual salary", format: "currency", defaultValue: 75000, min: 0, step: 1000, description: "Total salary before deductions." },
      { key: "taxRate", label: "Effective tax rate", format: "percent", defaultValue: 25, min: 0, step: 0.5, description: "Combined federal, state, and local tax rate." },
      { key: "deductions", label: "Monthly deductions", format: "currency", defaultValue: 200, min: 0, step: 25, description: "Insurance, 401k, and other pre-tax deductions per month." },
    ],
    outputs: [
      { key: "annualNet", label: "Annual net pay", format: "currency", description: "Estimated take-home pay for the year." },
      { key: "monthlyNet", label: "Monthly net pay", format: "currency", description: "Monthly take-home after taxes and deductions." },
      { key: "biweeklyNet", label: "Biweekly net pay", format: "currency", description: "Pay per biweekly pay period." },
    ],
    compute: (i) => {
      const gross = clampNonNegative(i.grossSalary), tax = clampNonNegative(i.taxRate) / 100, ded = clampNonNegative(i.deductions);
      const annualNet = gross * (1 - tax) - ded * 12;
      return { annualNet: Math.max(0, annualNet), monthlyNet: Math.max(0, annualNet / 12), biweeklyNet: Math.max(0, annualNet / 26) };
    },
    scenario: { fieldKey: "taxRate", values: (i) => shiftedValues(i.taxRate, [-5, 0, 5, 10], 0), tableOutputKeys: ["monthlyNet", "annualNet"], chartOutputKey: "monthlyNet", tableTitle: "Take-home by tax rate", chartTitle: "Monthly net pay sensitivity", note: "Effective tax rates vary widely by filing status and deductions." },
    content: { summaryLead: "The Take-Home Pay Calculator estimates your net paycheck after taxes and deductions so you can budget based on real income.", formulas: ["Annual Net = Gross × (1 − Tax Rate) − Deductions × 12"], assumptions: ["Flat effective tax rate.", "Deductions are consistent monthly."], tips: ["Use last year's effective tax rate as a starting point.", "Include insurance, retirement, and HSA in deductions."], references: ["Payroll calculation basics", "Federal and state tax withholding"], examples: [{ title: "Mid-range salary check", values: { grossSalary: 85000, taxRate: 28, deductions: 250 }, note: "Deductions like 401k contributions reduce taxable income and effective rate." }] },
  },
  {
    calculator: { slug: "cd", name: "CD Calculator", category: "financial", blurb: "Project returns on a certificate of deposit.", tags: ["savings", "cd", "interest"] },
    fields: [
      { key: "deposit", label: "Deposit", format: "currency", defaultValue: 10000, min: 0, step: 500, description: "Initial deposit into the CD." },
      { key: "apy", label: "APY", format: "percent", defaultValue: 5, min: 0, step: 0.1, description: "Annual percentage yield offered by the CD." },
      { key: "termMonths", label: "Term (months)", format: "number", defaultValue: 12, min: 1, step: 3, description: "CD maturity period in months." },
    ],
    outputs: [
      { key: "interestEarned", label: "Interest earned", format: "currency", description: "Total interest earned at maturity." },
      { key: "maturityValue", label: "Maturity value", format: "currency", description: "Total value at the end of the term." },
      { key: "monthlyInterest", label: "Monthly interest", format: "currency", description: "Average interest earned per month." },
    ],
    compute: (i) => {
      const dep = clampNonNegative(i.deposit), apy = clampNonNegative(i.apy) / 100, months = Math.max(1, Math.round(clampNonNegative(i.termMonths)));
      const years = months / 12;
      const maturityValue = dep * Math.pow(1 + apy, years);
      const interestEarned = maturityValue - dep;
      return { interestEarned, maturityValue, monthlyInterest: safeDivide(interestEarned, months) };
    },
    scenario: { fieldKey: "apy", values: (i) => shiftedValues(i.apy, [-2, -1, 0, 1, 2], 0.1), tableOutputKeys: ["interestEarned", "maturityValue"], chartOutputKey: "interestEarned", tableTitle: "Return by APY", chartTitle: "CD earnings comparison", note: "Shop around for the best APY, as rates vary significantly between institutions." },
    content: { summaryLead: "The CD Calculator projects how much interest a certificate of deposit will earn based on the deposit amount, APY, and term length.", formulas: ["Maturity Value = Deposit × (1 + APY)^(Months/12)"], assumptions: ["No early withdrawal.", "Interest compounds annually at the stated APY."], tips: ["Longer terms often offer higher APYs.", "Consider a CD ladder to balance access and yield."], references: ["Certificate of deposit interest calculations", "FDIC deposit product information"], examples: [{ title: "One-year high-yield CD", values: { deposit: 25000, apy: 5.25, termMonths: 12 }, note: "CDs are FDIC-insured up to $250,000, making them a low-risk savings option." }] },
  },
  {
    calculator: { slug: "future-value", name: "Future Value Calculator", category: "financial", blurb: "Project the future value of a lump sum with growth.", tags: ["future value", "growth", "compound"] },
    fields: [
      { key: "presentValue", label: "Present value", format: "currency", defaultValue: 10000, min: 0, step: 500, description: "Current amount of money." },
      { key: "rate", label: "Annual rate", format: "percent", defaultValue: 6, min: 0, step: 0.5, description: "Expected annual growth rate." },
      { key: "years", label: "Years", format: "number", defaultValue: 10, min: 1, step: 1, description: "Number of years to project." },
    ],
    outputs: [
      { key: "futureValue", label: "Future value", format: "currency", description: "Projected value at the end of the period." },
      { key: "totalGrowth", label: "Total growth", format: "currency", description: "Amount gained from compounding." },
      { key: "growthPercent", label: "Total growth %", format: "percent", description: "Percentage increase over the period." },
    ],
    compute: (i) => {
      const pv = clampNonNegative(i.presentValue), r = clampNonNegative(i.rate) / 100, n = Math.max(1, Math.round(clampNonNegative(i.years)));
      const fv = pv * Math.pow(1 + r, n);
      return { futureValue: fv, totalGrowth: fv - pv, growthPercent: safeDivide(fv - pv, pv) * 100 };
    },
    scenario: { fieldKey: "rate", values: (i) => shiftedValues(i.rate, [-3, -1, 0, 2, 4], 0), tableOutputKeys: ["futureValue", "totalGrowth"], chartOutputKey: "futureValue", tableTitle: "Future value by growth rate", chartTitle: "Growth sensitivity", note: "Small differences in rate compound into large differences over long periods." },
    content: { summaryLead: "The Future Value Calculator projects how much a current sum will grow over time at a given annual rate of return.", formulas: ["FV = PV × (1 + r)^n"], assumptions: ["Constant annual rate.", "No withdrawals or additions."], tips: ["Use this to compare investment options over the same time frame.", "Pair with inflation to get real future value."], references: ["Time value of money fundamentals", "Future value formula derivation"], examples: [{ title: "Long-term projection", values: { presentValue: 20000, rate: 7, years: 20 }, note: "At 7%, money roughly doubles every 10 years via the rule of 72." }] },
  },
  {
    calculator: { slug: "present-value", name: "Present Value Calculator", category: "financial", blurb: "Find today's value of a future sum.", tags: ["present value", "discount", "finance"] },
    fields: [
      { key: "futureValue", label: "Future value", format: "currency", defaultValue: 50000, min: 0, step: 1000, description: "Amount expected in the future." },
      { key: "rate", label: "Discount rate", format: "percent", defaultValue: 6, min: 0, step: 0.5, description: "Annual rate used to discount the future value." },
      { key: "years", label: "Years", format: "number", defaultValue: 10, min: 1, step: 1, description: "Number of years until the future value is received." },
    ],
    outputs: [
      { key: "presentValue", label: "Present value", format: "currency", description: "What the future amount is worth today." },
      { key: "discount", label: "Total discount", format: "currency", description: "Difference between future and present value." },
      { key: "discountPercent", label: "Discount %", format: "percent", description: "Percentage reduction from future to present value." },
    ],
    compute: (i) => {
      const fv = clampNonNegative(i.futureValue), r = clampNonNegative(i.rate) / 100, n = Math.max(1, Math.round(clampNonNegative(i.years)));
      const pv = fv / Math.pow(1 + r, n);
      return { presentValue: pv, discount: fv - pv, discountPercent: safeDivide(fv - pv, fv) * 100 };
    },
    scenario: { fieldKey: "rate", values: (i) => shiftedValues(i.rate, [-2, 0, 2, 4], 0.5), tableOutputKeys: ["presentValue", "discount"], chartOutputKey: "presentValue", tableTitle: "Present value by discount rate", chartTitle: "Discounting effect", note: "Higher discount rates dramatically reduce present value over long horizons." },
    content: { summaryLead: "The Present Value Calculator tells you what a future sum of money is worth today given a specific discount rate.", formulas: ["PV = FV ÷ (1 + r)^n"], assumptions: ["Constant annual discount rate.", "Single future cash flow."], tips: ["Use your opportunity cost as the discount rate.", "Present value is core to investment decisions and NPV analysis."], references: ["Time value of money and present value", "Discounted cash flow basics"], examples: [{ title: "Settlement valuation", values: { futureValue: 100000, rate: 5, years: 15 }, note: "A lump sum received in 15 years is worth significantly less than the same amount today." }] },
  },
  {
    calculator: { slug: "rent", name: "Rent Calculator", category: "financial", blurb: "Estimate affordable rent based on income.", tags: ["rent", "housing", "budget"] },
    fields: [
      { key: "monthlyIncome", label: "Monthly income", format: "currency", defaultValue: 5000, min: 0, step: 100, description: "Gross monthly income before taxes." },
      { key: "rentPercent", label: "Rent % of income", format: "percent", defaultValue: 30, min: 0, step: 1, description: "Percentage of income allocated to rent." },
      { key: "utilities", label: "Monthly utilities", format: "currency", defaultValue: 150, min: 0, step: 25, description: "Estimated monthly utility costs." },
    ],
    outputs: [
      { key: "maxRent", label: "Affordable rent", format: "currency", description: "Maximum monthly rent within your budget." },
      { key: "totalHousing", label: "Total housing cost", format: "currency", description: "Rent plus utilities per month." },
      { key: "annualRent", label: "Annual rent", format: "currency", description: "Yearly rent payments." },
    ],
    compute: (i) => {
      const income = clampNonNegative(i.monthlyIncome), pct = clampNonNegative(i.rentPercent) / 100, utils = clampNonNegative(i.utilities);
      const maxRent = income * pct;
      return { maxRent, totalHousing: maxRent + utils, annualRent: maxRent * 12 };
    },
    scenario: { fieldKey: "rentPercent", values: (i) => shiftedValues(i.rentPercent, [-10, -5, 0, 5], 5), tableOutputKeys: ["maxRent", "totalHousing"], chartOutputKey: "maxRent", tableTitle: "Rent by income percentage", chartTitle: "Affordable rent range", note: "Financial advisors recommend keeping rent at or below 30% of gross income." },
    content: { summaryLead: "The Rent Calculator helps you determine how much rent you can afford based on your income and the standard 30% guideline.", formulas: ["Max Rent = Monthly Income × Rent%", "Total Housing = Rent + Utilities"], assumptions: ["Income is gross monthly pay.", "Utilities are estimated separately."], tips: ["Include renters insurance in your housing budget.", "Consider commute costs as part of the total housing decision."], references: ["HUD housing cost guidelines", "Rent affordability benchmarks"], examples: [{ title: "City apartment budget", values: { monthlyIncome: 6500, rentPercent: 28, utilities: 175 }, note: "In expensive cities, keeping rent under 30% may require roommates or a longer commute." }] },
  },
  {
    calculator: { slug: "house-affordability", name: "House Affordability Calculator", category: "financial", blurb: "Estimate how much house you can afford.", tags: ["mortgage", "housing", "affordability"] },
    fields: [
      { key: "annualIncome", label: "Annual income", format: "currency", defaultValue: 85000, min: 0, step: 1000, description: "Gross annual household income." },
      { key: "monthlyDebts", label: "Monthly debts", format: "currency", defaultValue: 500, min: 0, step: 50, description: "Existing monthly debt payments." },
      { key: "downPayment", label: "Down payment", format: "currency", defaultValue: 40000, min: 0, step: 1000, description: "Cash available for down payment." },
      { key: "rate", label: "Mortgage rate", format: "percent", defaultValue: 6.5, min: 0, step: 0.1, description: "Expected mortgage interest rate." },
    ],
    outputs: [
      { key: "maxHome", label: "Max home price", format: "currency", description: "Estimated maximum affordable home price." },
      { key: "maxMortgage", label: "Max mortgage", format: "currency", description: "Maximum loan amount." },
      { key: "monthlyPayment", label: "Est. monthly payment", format: "currency", description: "Estimated monthly mortgage payment." },
    ],
    compute: (i) => {
      const income = clampNonNegative(i.annualIncome), debts = clampNonNegative(i.monthlyDebts), dp = clampNonNegative(i.downPayment), r = clampNonNegative(i.rate) / 100 / 12;
      const maxHousing = income / 12 * 0.28;
      const maxTotalDebt = income / 12 * 0.36 - debts;
      const maxPayment = Math.max(0, Math.min(maxHousing, maxTotalDebt));
      const n = 360;
      const maxMortgage = r > 0 ? maxPayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : maxPayment * n;
      return { maxHome: maxMortgage + dp, maxMortgage, monthlyPayment: maxPayment };
    },
    scenario: { fieldKey: "rate", values: (i) => shiftedValues(i.rate, [-1.5, -0.5, 0, 0.5, 1.5], 2), tableOutputKeys: ["maxHome", "monthlyPayment"], chartOutputKey: "maxHome", tableTitle: "Affordability by mortgage rate", chartTitle: "Buying power vs rate", note: "Every 1% rate increase reduces buying power by roughly 10%." },
    content: { summaryLead: "The House Affordability Calculator estimates the maximum home price you can afford based on income, debts, down payment, and mortgage rates.", formulas: ["Max Payment = min(28% of income, 36% of income − debts)", "Max Mortgage = PMT × ((1+r)^n−1) / (r(1+r)^n)"], assumptions: ["Uses 28/36 rule for qualifying.", "30-year fixed mortgage assumed."], tips: ["A larger down payment increases buying power.", "Keep total debt-to-income below 36%."], references: ["HUD 28/36 qualifying ratios", "Mortgage affordability guidelines"], examples: [{ title: "First-time buyer estimate", values: { annualIncome: 95000, monthlyDebts: 400, downPayment: 50000, rate: 6.5 }, note: "Pre-approval from a lender gives you a more precise affordability number." }] },
  },
  {
    calculator: { slug: "refinance", name: "Refinance Calculator", category: "financial", blurb: "Compare current vs refinanced loan to see savings.", tags: ["refinance", "mortgage", "savings"] },
    fields: [
      { key: "currentBalance", label: "Current balance", format: "currency", defaultValue: 200000, min: 0, step: 1000, description: "Remaining balance on current loan." },
      { key: "currentRate", label: "Current rate", format: "percent", defaultValue: 7, min: 0, step: 0.1, description: "Interest rate on your existing loan." },
      { key: "newRate", label: "New rate", format: "percent", defaultValue: 5.5, min: 0, step: 0.1, description: "Interest rate offered for refinancing." },
      { key: "newTermYears", label: "New term (years)", format: "number", defaultValue: 30, min: 1, step: 1, description: "Term of the new refinanced loan." },
    ],
    outputs: [
      { key: "currentPayment", label: "Current payment", format: "currency", description: "Monthly payment on the existing loan." },
      { key: "newPayment", label: "New payment", format: "currency", description: "Monthly payment after refinancing." },
      { key: "monthlySavings", label: "Monthly savings", format: "currency", description: "Reduction in monthly payment." },
    ],
    compute: (i) => {
      const B = clampNonNegative(i.currentBalance);
      const r1 = clampNonNegative(i.currentRate) / 100 / 12, r2 = clampNonNegative(i.newRate) / 100 / 12;
      const n = Math.max(1, Math.round(clampNonNegative(i.newTermYears))) * 12;
      const pmt = (r: number) => r > 0 ? B * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : safeDivide(B, n);
      const currentPayment = pmt(r1), newPayment = pmt(r2);
      return { currentPayment, newPayment, monthlySavings: currentPayment - newPayment };
    },
    scenario: { fieldKey: "newRate", values: (i) => shiftedValues(i.newRate, [-1, -0.5, 0, 0.5, 1], 1), tableOutputKeys: ["newPayment", "monthlySavings"], chartOutputKey: "monthlySavings", tableTitle: "Savings by new rate", chartTitle: "Monthly savings comparison", note: "Factor in closing costs to determine the true break-even point of refinancing." },
    content: { summaryLead: "The Refinance Calculator compares your current monthly payment with a new rate to show potential savings from refinancing.", formulas: ["Payment = Balance × r(1+r)^n / ((1+r)^n − 1)"], assumptions: ["Same remaining balance refinanced.", "Closing costs not included in the base comparison."], tips: ["Refinancing makes sense if you recoup closing costs within 2-3 years.", "Check if your current loan has prepayment penalties."], references: ["Mortgage refinancing break-even analysis", "Consumer Financial Protection Bureau guidelines"], examples: [{ title: "Rate drop refinance", values: { currentBalance: 250000, currentRate: 7.5, newRate: 5.75, newTermYears: 30 }, note: "A 1.75% rate reduction on $250k saves over $300/month before closing costs." }] },
  },
  {
    calculator: { slug: "currency-converter", name: "Currency Converter", category: "financial", blurb: "Convert between currencies with a custom rate.", tags: ["currency", "exchange", "conversion"] },
    fields: [
      { key: "amount", label: "Amount", format: "number", defaultValue: 1000, min: 0, step: 10, description: "Amount in the source currency." },
      { key: "exchangeRate", label: "Exchange rate", format: "number", defaultValue: 1.1, min: 0, step: 0.01, description: "How much 1 unit of source currency is worth in target currency." },
      { key: "fee", label: "Conversion fee", format: "percent", defaultValue: 1, min: 0, step: 0.1, description: "Fee or spread charged on the conversion." },
    ],
    outputs: [
      { key: "converted", label: "Converted amount", format: "number", description: "Amount in the target currency before fees." },
      { key: "feeAmount", label: "Fee amount", format: "number", description: "Total fee charged on the conversion." },
      { key: "netAmount", label: "Net amount", format: "number", description: "Final amount after the conversion fee." },
    ],
    compute: (i) => {
      const amount = clampNonNegative(i.amount), rate = clampNonNegative(i.exchangeRate), fee = clampNonNegative(i.fee) / 100;
      const converted = amount * rate;
      const feeAmount = converted * fee;
      return { converted, feeAmount, netAmount: converted - feeAmount };
    },
    scenario: { fieldKey: "exchangeRate", values: (i) => shiftedValues(i.exchangeRate, [-0.15, -0.05, 0, 0.05, 0.15], 0.01), tableOutputKeys: ["converted", "netAmount"], chartOutputKey: "netAmount", tableTitle: "Conversion by exchange rate", chartTitle: "Rate impact on converted amount", note: "Exchange rates fluctuate constantly; use the latest rate for accurate conversions." },
    content: { summaryLead: "The Currency Converter helps you estimate the converted amount, fees, and net value when exchanging one currency for another.", formulas: ["Converted = Amount × Exchange Rate", "Net = Converted − Fee"], assumptions: ["Fixed exchange rate at the time of conversion.", "Single flat fee percentage."], tips: ["Compare rates from banks, cards, and exchange services.", "Avoid airport exchange counters for large amounts."], references: ["Foreign exchange rate fundamentals", "Currency conversion fee structures"], examples: [{ title: "Travel money exchange", values: { amount: 2000, exchangeRate: 0.92, fee: 1.5 }, note: "A 1.5% fee on a large transfer can be $20-30; consider fee-free services for better value." }] },
  },
];

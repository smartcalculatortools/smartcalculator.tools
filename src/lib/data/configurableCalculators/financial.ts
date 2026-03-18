import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  safeDivide,
  scaledValues,
  shiftedValues,
} from "./base";

export const financialCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "simple-interest",
      name: "Simple Interest Calculator",
      category: "financial",
      blurb: "Estimate non-compounded interest and final balance.",
      tags: ["interest", "finance", "borrowing"],
    },
    fields: [
      {
        key: "principal",
        label: "Principal",
        format: "currency",
        defaultValue: 10000,
        min: 0,
        step: 100,
        description: "Starting amount of money before simple interest is applied.",
      },
      {
        key: "rate",
        label: "Annual rate",
        format: "percent",
        defaultValue: 6,
        min: 0,
        step: 0.1,
        description: "Annual simple interest rate used for the calculation.",
      },
      {
        key: "years",
        label: "Years",
        format: "number",
        defaultValue: 3,
        min: 0,
        step: 0.25,
        description: "Length of time that the principal stays invested or borrowed.",
      },
    ],
    outputs: [
      {
        key: "interest",
        label: "Interest earned",
        format: "currency",
        description: "Total simple interest generated over the full term.",
      },
      {
        key: "finalBalance",
        label: "Final balance",
        format: "currency",
        description: "Principal plus the simple interest earned over the term.",
      },
      {
        key: "annualInterest",
        label: "Interest per year",
        format: "currency",
        description: "Average yearly interest at the selected simple rate.",
      },
    ],
    compute: (inputs) => {
      const interest =
        clampNonNegative(inputs.principal) *
        (clampNonNegative(inputs.rate) / 100) *
        clampNonNegative(inputs.years);
      return {
        interest,
        finalBalance: clampNonNegative(inputs.principal) + interest,
        annualInterest: clampNonNegative(inputs.principal) * (clampNonNegative(inputs.rate) / 100),
      };
    },
    scenario: {
      fieldKey: "rate",
      values: (inputs) => shiftedValues(inputs.rate, [-2, 0, 2, 4], 0),
      tableOutputKeys: ["interest", "finalBalance"],
      chartOutputKey: "interest",
      tableTitle: "Interest by annual rate",
      chartTitle: "Interest sensitivity",
      note: "Use the scenario view to compare how rate changes total simple interest over the same time period.",
    },
    content: {
      summaryLead:
        "The Simple Interest Calculator helps you check short-term loans, invoice terms, and basic savings products that do not compound during the holding period.",
      formulas: [
        "Simple Interest = Principal × Rate × Time",
        "Final Balance = Principal + Simple Interest",
      ],
      assumptions: [
        "Interest does not compound during the term.",
        "The annual rate stays constant for the full period.",
      ],
      tips: [
        "Use simple interest for notes, trade credit, and short loans.",
        "If the product compounds monthly or daily, use a compound calculator instead.",
      ],
      references: [
        "Basic finance formulas for simple interest",
        "Consumer lending examples with non-compounded interest",
      ],
      examples: [
        {
          title: "Short loan estimate",
          values: { principal: 12000, rate: 7, years: 2 },
          note: "Simple interest is useful when the lender charges a flat annual rate without compounding inside the term.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "discount",
      name: "Discount Calculator",
      category: "financial",
      blurb: "Work out sale price, savings, and final checkout total.",
      tags: ["retail", "pricing", "savings"],
    },
    fields: [
      {
        key: "listPrice",
        label: "List price",
        format: "currency",
        defaultValue: 180,
        min: 0,
        step: 1,
        description: "Original price before any discount or sale promotion.",
      },
      {
        key: "discountRate",
        label: "Discount rate",
        format: "percent",
        defaultValue: 20,
        min: 0,
        step: 0.5,
        description: "Percentage discount taken off the original list price.",
      },
      {
        key: "salesTax",
        label: "Sales tax",
        format: "percent",
        defaultValue: 8,
        min: 0,
        step: 0.25,
        description: "Tax rate applied after the discount is taken.",
      },
    ],
    outputs: [
      {
        key: "savings",
        label: "Savings",
        format: "currency",
        description: "Amount saved from the original price before tax.",
      },
      {
        key: "discountedPrice",
        label: "Discounted price",
        format: "currency",
        description: "Price after discount but before sales tax is added.",
      },
      {
        key: "checkoutTotal",
        label: "Checkout total",
        format: "currency",
        description: "Final amount paid after discount and sales tax.",
      },
    ],
    compute: (inputs) => {
      const savings =
        clampNonNegative(inputs.listPrice) * (clampNonNegative(inputs.discountRate) / 100);
      const discountedPrice = clampNonNegative(inputs.listPrice) - savings;
      const checkoutTotal =
        discountedPrice * (1 + clampNonNegative(inputs.salesTax) / 100);
      return { savings, discountedPrice, checkoutTotal };
    },
    scenario: {
      fieldKey: "discountRate",
      values: (inputs) => shiftedValues(inputs.discountRate, [-10, -5, 0, 10, 20], 0),
      tableOutputKeys: ["discountedPrice", "checkoutTotal"],
      chartOutputKey: "checkoutTotal",
      tableTitle: "Checkout total by discount rate",
      chartTitle: "Sale price comparison",
      note: "Compare discount levels quickly, but keep tax treatment consistent when you use the result.",
    },
    content: {
      summaryLead:
        "The Discount Calculator helps you check a sale price, confirm your savings, and estimate the final checkout total after tax on retail purchases.",
      formulas: [
        "Savings = List Price × Discount Rate",
        "Checkout Total = (List Price - Savings) × (1 + Tax Rate)",
      ],
      assumptions: [
        "The discount is applied before sales tax.",
        "Tax is modeled as a flat percentage on the discounted price.",
      ],
      tips: [
        "Use the checkout total, not only the headline discount, when comparing offers.",
        "If a coupon stacks with another discount, calculate each step separately.",
      ],
      references: [
        "Retail pricing and markdown arithmetic",
        "Sales tax calculation basics for consumer purchases",
      ],
      examples: [
        {
          title: "Sale item with tax",
          values: { listPrice: 240, discountRate: 25, salesTax: 8.5 },
          note: "The effective savings can look smaller once tax is added back, so checkout total is the number that matters most.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "sales-tax",
      name: "Sales Tax Calculator",
      category: "financial",
      blurb: "Estimate tax amount, before-tax price, and final total.",
      tags: ["tax", "checkout", "pricing"],
    },
    fields: [
      {
        key: "subtotal",
        label: "Subtotal",
        format: "currency",
        defaultValue: 95,
        min: 0,
        step: 1,
        description: "Price before sales tax is added at checkout.",
      },
      {
        key: "taxRate",
        label: "Tax rate",
        format: "percent",
        defaultValue: 7.5,
        min: 0,
        step: 0.25,
        description: "Sales tax rate that applies to the purchase.",
      },
      {
        key: "tipRate",
        label: "Tip rate",
        format: "percent",
        defaultValue: 0,
        min: 0,
        step: 0.5,
        description: "Optional tip percentage applied to the subtotal.",
      },
    ],
    outputs: [
      {
        key: "taxAmount",
        label: "Tax amount",
        format: "currency",
        description: "Sales tax added on top of the subtotal.",
      },
      {
        key: "tipAmount",
        label: "Tip amount",
        format: "currency",
        description: "Optional tip calculated from the subtotal.",
      },
      {
        key: "grandTotal",
        label: "Grand total",
        format: "currency",
        description: "Combined checkout total including tax and any tip.",
      },
    ],
    compute: (inputs) => {
      const subtotal = clampNonNegative(inputs.subtotal);
      const taxAmount = (subtotal * clampNonNegative(inputs.taxRate)) / 100;
      const tipAmount = (subtotal * clampNonNegative(inputs.tipRate)) / 100;
      return {
        taxAmount,
        tipAmount,
        grandTotal: subtotal + taxAmount + tipAmount,
      };
    },
    scenario: {
      fieldKey: "taxRate",
      values: (inputs) => shiftedValues(inputs.taxRate, [-2, 0, 2, 4], 0),
      tableOutputKeys: ["taxAmount", "grandTotal"],
      chartOutputKey: "grandTotal",
      tableTitle: "Total by tax rate",
      chartTitle: "Tax impact on total",
      note: "Tax rates differ by location and product type, so use the correct local rate when you rely on the result.",
    },
    content: {
      summaryLead:
        "The Sales Tax Calculator gives you the tax amount, optional tip, and full checkout total so you can budget purchases or invoices more accurately.",
      formulas: [
        "Tax Amount = Subtotal × Tax Rate",
        "Grand Total = Subtotal + Tax Amount + Tip Amount",
      ],
      assumptions: [
        "Tax and tip are both modeled as flat percentages of the subtotal.",
        "The calculator does not handle item-level exemptions or tiered rates.",
      ],
      tips: [
        "Use tip only if it applies to your scenario.",
        "For invoices, confirm whether tax is applied before or after discounts.",
      ],
      references: [
        "Sales tax arithmetic for checkout calculations",
        "Basic invoice total calculations with tax and tip",
      ],
      examples: [
        {
          title: "Restaurant total",
          values: { subtotal: 68, taxRate: 8.25, tipRate: 18 },
          note: "Tip is often applied to the pre-tax subtotal, so keeping it separate from tax avoids double counting.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "break-even",
      name: "Break-Even Calculator",
      category: "financial",
      blurb: "Estimate units and revenue needed to cover fixed costs.",
      tags: ["business", "pricing", "profit"],
    },
    fields: [
      {
        key: "fixedCost",
        label: "Fixed cost",
        format: "currency",
        defaultValue: 25000,
        min: 0,
        step: 100,
        description: "Recurring or upfront fixed cost that must be covered first.",
      },
      {
        key: "pricePerUnit",
        label: "Price per unit",
        format: "currency",
        defaultValue: 45,
        min: 0,
        step: 0.5,
        description: "Average selling price collected for one unit sold.",
      },
      {
        key: "variableCost",
        label: "Variable cost",
        format: "currency",
        defaultValue: 18,
        min: 0,
        step: 0.5,
        description: "Direct variable cost required to produce or deliver one unit.",
      },
    ],
    outputs: [
      {
        key: "contributionMargin",
        label: "Contribution margin",
        format: "currency",
        description: "Amount left from each unit sale to cover fixed costs and profit.",
      },
      {
        key: "breakEvenUnits",
        label: "Break-even units",
        format: "number",
        description: "Number of units needed to cover the full fixed-cost base.",
      },
      {
        key: "breakEvenRevenue",
        label: "Break-even revenue",
        format: "currency",
        description: "Total revenue needed to reach break-even.",
      },
    ],
    compute: (inputs) => {
      const contributionMargin =
        clampNonNegative(inputs.pricePerUnit) - clampNonNegative(inputs.variableCost);
      const breakEvenUnits = safeDivide(
        clampNonNegative(inputs.fixedCost),
        contributionMargin
      );
      return {
        contributionMargin,
        breakEvenUnits,
        breakEvenRevenue: breakEvenUnits * clampNonNegative(inputs.pricePerUnit),
      };
    },
    scenario: {
      fieldKey: "pricePerUnit",
      values: (inputs) => shiftedValues(inputs.pricePerUnit, [-10, -5, 0, 5, 10], 0.01),
      tableOutputKeys: ["contributionMargin", "breakEvenUnits"],
      chartOutputKey: "breakEvenUnits",
      tableTitle: "Break-even units by price",
      chartTitle: "Units needed by selling price",
      note: "Small price changes can move break-even fast when variable cost stays fixed, so test realistic price points.",
    },
    content: {
      summaryLead:
        "The Break-Even Calculator helps founders, freelancers, and operators estimate how many units they must sell before a product or service stops losing money.",
      formulas: [
        "Contribution Margin = Price per Unit - Variable Cost per Unit",
        "Break-Even Units = Fixed Cost ÷ Contribution Margin",
      ],
      assumptions: [
        "Unit price and variable cost stay constant across the scenario.",
        "The model ignores taxes, financing, and step changes in overhead.",
      ],
      tips: [
        "If your margin is thin, test several prices and variable costs.",
        "Break-even is not a profit target; it only covers fixed costs.",
      ],
      references: [
        "Managerial accounting break-even formulas",
        "Contribution margin analysis in product pricing",
      ],
      examples: [
        {
          title: "Product launch check",
          values: { fixedCost: 40000, pricePerUnit: 60, variableCost: 22 },
          note: "Contribution margin is the key lever; if it drops, the required sales volume rises very quickly.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "roi",
      name: "ROI Calculator",
      category: "financial",
      blurb: "Measure return on investment, profit, and margin.",
      tags: ["investment", "return", "profit"],
    },
    fields: [
      {
        key: "initialCost",
        label: "Initial cost",
        format: "currency",
        defaultValue: 5000,
        min: 0,
        step: 50,
        description: "Total cash or capital committed at the start of the investment.",
      },
      {
        key: "finalValue",
        label: "Final value",
        format: "currency",
        defaultValue: 7000,
        min: 0,
        step: 50,
        description: "Value of the position or project at the end of the period.",
      },
      {
        key: "extraCosts",
        label: "Extra costs",
        format: "currency",
        defaultValue: 250,
        min: 0,
        step: 10,
        description: "Fees, maintenance, or other additional costs tied to the investment.",
      },
    ],
    outputs: [
      {
        key: "netProfit",
        label: "Net profit",
        format: "currency",
        description: "Gain left after subtracting original and extra costs.",
      },
      {
        key: "roiPercent",
        label: "ROI",
        format: "percent",
        description: "Return on investment as a percentage of the original cost.",
      },
      {
        key: "profitMargin",
        label: "Profit margin",
        format: "percent",
        description: "Profit expressed as a share of the final value.",
      },
    ],
    compute: (inputs) => {
      const totalCost =
        clampNonNegative(inputs.initialCost) + clampNonNegative(inputs.extraCosts);
      const netProfit = clampNonNegative(inputs.finalValue) - totalCost;
      return {
        netProfit,
        roiPercent: safeDivide(netProfit, clampNonNegative(inputs.initialCost)) * 100,
        profitMargin: safeDivide(netProfit, clampNonNegative(inputs.finalValue)) * 100,
      };
    },
    scenario: {
      fieldKey: "finalValue",
      values: (inputs) => scaledValues(inputs.finalValue, [0.75, 1, 1.25, 1.5], 0),
      tableOutputKeys: ["netProfit", "roiPercent"],
      chartOutputKey: "roiPercent",
      tableTitle: "ROI by exit value",
      chartTitle: "ROI sensitivity",
      note: "ROI depends heavily on the exit value, so test realistic best-case and base-case outcomes instead of a single number.",
    },
    content: {
      summaryLead:
        "The ROI Calculator helps you compare projects, trades, and small business decisions by showing net profit, ROI, and profit margin from the same input set.",
      formulas: [
        "Net Profit = Final Value - Initial Cost - Extra Costs",
        "ROI % = Net Profit ÷ Initial Cost × 100",
      ],
      assumptions: [
        "The model treats all extra costs as direct cash outflows.",
        "Time value of money is not included in the ROI percentage.",
      ],
      tips: [
        "Use the same time horizon when comparing different ROI scenarios.",
        "A high ROI may still be weak if the absolute profit is too small.",
      ],
      references: [
        "ROI formulas used in project and investment analysis",
        "Basic profitability and margin calculations",
      ],
      examples: [
        {
          title: "Small project review",
          values: { initialCost: 8000, finalValue: 11000, extraCosts: 500 },
          note: "ROI is best used as a comparison metric alongside time, risk, and the cash needed to earn that return.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "commission",
      name: "Commission Calculator",
      category: "financial",
      blurb: "Estimate commission, total pay, and effective rate.",
      tags: ["sales", "earnings", "pay"],
    },
    fields: [
      {
        key: "salesAmount",
        label: "Sales amount",
        format: "currency",
        defaultValue: 32000,
        min: 0,
        step: 100,
        description: "Gross sales volume used as the base for the commission.",
      },
      {
        key: "commissionRate",
        label: "Commission rate",
        format: "percent",
        defaultValue: 6,
        min: 0,
        step: 0.1,
        description: "Commission percentage paid on the sales amount.",
      },
      {
        key: "basePay",
        label: "Base pay",
        format: "currency",
        defaultValue: 2500,
        min: 0,
        step: 50,
        description: "Fixed base pay added on top of the commission payout.",
      },
    ],
    outputs: [
      {
        key: "commissionValue",
        label: "Commission",
        format: "currency",
        description: "Variable pay generated from the commission percentage.",
      },
      {
        key: "totalPay",
        label: "Total pay",
        format: "currency",
        description: "Base pay plus the earned commission payout.",
      },
      {
        key: "effectiveRate",
        label: "Effective rate",
        format: "percent",
        description: "Total pay shown as a percentage of the sales amount.",
      },
    ],
    compute: (inputs) => {
      const commissionValue =
        clampNonNegative(inputs.salesAmount) * clampNonNegative(inputs.commissionRate) / 100;
      const totalPay = commissionValue + clampNonNegative(inputs.basePay);
      return {
        commissionValue,
        totalPay,
        effectiveRate: safeDivide(totalPay, clampNonNegative(inputs.salesAmount)) * 100,
      };
    },
    scenario: {
      fieldKey: "salesAmount",
      values: (inputs) => scaledValues(inputs.salesAmount, [0.5, 0.75, 1, 1.25, 1.5], 0),
      tableOutputKeys: ["commissionValue", "totalPay"],
      chartOutputKey: "totalPay",
      tableTitle: "Total pay by sales volume",
      chartTitle: "Compensation by sales amount",
      note: "If your plan has tiers or accelerators, use this as a baseline and then adjust for your real comp structure.",
    },
    content: {
      summaryLead:
        "The Commission Calculator is useful for sales plans, affiliate deals, and freelance arrangements where payout combines a base amount and a percentage of revenue.",
      formulas: [
        "Commission = Sales Amount × Commission Rate",
        "Total Pay = Base Pay + Commission",
      ],
      assumptions: [
        "The commission rate is flat across the entire sales amount.",
        "No caps, quotas, or accelerators are applied in this baseline model.",
      ],
      tips: [
        "Add quotas separately if your plan only pays after a threshold.",
        "Use effective rate when comparing different compensation structures.",
      ],
      references: [
        "Sales compensation arithmetic",
        "Commission payout planning examples",
      ],
      examples: [
        {
          title: "Monthly sales target",
          values: { salesAmount: 45000, commissionRate: 7, basePay: 3000 },
          note: "Commission plans often look attractive in percentage terms, but total pay depends on realistic sales volume.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "hourly-to-salary",
      name: "Hourly to Salary Calculator",
      category: "financial",
      blurb: "Convert hourly pay into weekly, monthly, and annual income.",
      tags: ["salary", "hourly", "income"],
    },
    fields: [
      {
        key: "hourlyRate",
        label: "Hourly rate",
        format: "currency",
        defaultValue: 25,
        min: 0,
        step: 0.5,
        description: "Amount earned for each hour worked.",
      },
      {
        key: "hoursPerWeek",
        label: "Hours per week",
        format: "number",
        defaultValue: 40,
        min: 0,
        step: 1,
        description: "Average weekly working hours used for the conversion.",
      },
      {
        key: "weeksPerYear",
        label: "Weeks per year",
        format: "number",
        defaultValue: 52,
        min: 0,
        step: 1,
        description: "Number of paid working weeks included in the year.",
      },
    ],
    outputs: [
      {
        key: "weeklyPay",
        label: "Weekly pay",
        format: "currency",
        description: "Estimated pay for one average working week.",
      },
      {
        key: "monthlyPay",
        label: "Monthly pay",
        format: "currency",
        description: "Average monthly income based on annualized pay.",
      },
      {
        key: "annualPay",
        label: "Annual pay",
        format: "currency",
        description: "Estimated annual income from hourly pay and work schedule.",
      },
    ],
    compute: (inputs) => {
      const weeklyPay = clampNonNegative(inputs.hourlyRate) * clampNonNegative(inputs.hoursPerWeek);
      const annualPay = weeklyPay * clampNonNegative(inputs.weeksPerYear);
      return {
        weeklyPay,
        monthlyPay: safeDivide(annualPay, 12),
        annualPay,
      };
    },
    scenario: {
      fieldKey: "hourlyRate",
      values: (inputs) => shiftedValues(inputs.hourlyRate, [-5, 0, 5, 10], 0),
      tableOutputKeys: ["weeklyPay", "annualPay"],
      chartOutputKey: "annualPay",
      tableTitle: "Annual pay by hourly rate",
      chartTitle: "Income growth by hourly rate",
      note: "Use paid weeks instead of calendar weeks if unpaid leave or seasonal downtime affects your income.",
    },
    content: {
      summaryLead:
        "The Hourly to Salary Calculator turns an hourly wage into weekly, monthly, and annual income so you can compare job offers and budget more realistically.",
      formulas: [
        "Weekly Pay = Hourly Rate × Hours per Week",
        "Annual Pay = Weekly Pay × Weeks per Year",
      ],
      assumptions: [
        "Hours and weeks are averaged and stay steady through the year.",
        "Overtime, bonuses, and unpaid leave are not included unless you adjust the inputs.",
      ],
      tips: [
        "Use realistic paid weeks, not always 52, when comparing offers.",
        "If overtime is common, build a separate scenario instead of inflating the hourly rate.",
      ],
      references: [
        "Payroll conversion formulas for hourly wages",
        "Compensation planning with weekly and annualized pay",
      ],
      examples: [
        {
          title: "Full-time rate conversion",
          values: { hourlyRate: 32, hoursPerWeek: 40, weeksPerYear: 50 },
          note: "Annualizing hourly pay is useful for offer comparison, but the paid-week assumption can change the answer materially.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "salary-to-hourly",
      name: "Salary to Hourly Calculator",
      category: "financial",
      blurb: "Convert annual salary into hourly and weekly pay.",
      tags: ["salary", "hourly", "compensation"],
    },
    fields: [
      {
        key: "annualSalary",
        label: "Annual salary",
        format: "currency",
        defaultValue: 72000,
        min: 0,
        step: 100,
        description: "Total annual salary before overtime or bonuses.",
      },
      {
        key: "hoursPerWeek",
        label: "Hours per week",
        format: "number",
        defaultValue: 40,
        min: 0,
        step: 1,
        description: "Average weekly hours worked under the salary arrangement.",
      },
      {
        key: "weeksPerYear",
        label: "Weeks per year",
        format: "number",
        defaultValue: 52,
        min: 0,
        step: 1,
        description: "Number of working weeks that the salary covers.",
      },
    ],
    outputs: [
      {
        key: "hourlyRate",
        label: "Hourly rate",
        format: "currency",
        description: "Equivalent hourly pay after converting the annual salary.",
      },
      {
        key: "weeklyPay",
        label: "Weekly pay",
        format: "currency",
        description: "Average weekly pay implied by the annual salary.",
      },
      {
        key: "monthlyPay",
        label: "Monthly pay",
        format: "currency",
        description: "Average monthly pay based on the annual salary.",
      },
    ],
    compute: (inputs) => {
      const weeklyPay = safeDivide(
        clampNonNegative(inputs.annualSalary),
        clampNonNegative(inputs.weeksPerYear)
      );
      return {
        hourlyRate: safeDivide(weeklyPay, clampNonNegative(inputs.hoursPerWeek)),
        weeklyPay,
        monthlyPay: safeDivide(clampNonNegative(inputs.annualSalary), 12),
      };
    },
    scenario: {
      fieldKey: "hoursPerWeek",
      values: (inputs) => shiftedValues(inputs.hoursPerWeek, [-5, 0, 5, 10], 1),
      tableOutputKeys: ["hourlyRate", "weeklyPay"],
      chartOutputKey: "hourlyRate",
      tableTitle: "Hourly rate by weekly schedule",
      chartTitle: "Hourly equivalent by hours worked",
      note: "The same salary can feel very different once you translate it into effective hourly pay across different schedules.",
    },
    content: {
      summaryLead:
        "The Salary to Hourly Calculator helps you translate an annual salary into weekly and hourly pay so you can compare salaried and hourly roles on the same basis.",
      formulas: [
        "Weekly Pay = Annual Salary ÷ Weeks per Year",
        "Hourly Rate = Weekly Pay ÷ Hours per Week",
      ],
      assumptions: [
        "The salary is spread evenly across the working year.",
        "Hours per week are averaged and do not include unpaid overtime adjustments.",
      ],
      tips: [
        "Use the actual work schedule, not only the contract schedule, when comparing roles.",
        "Hourly equivalent is especially useful when comparing salary against freelance or contract work.",
      ],
      references: [
        "Salary-to-hourly conversion methods",
        "Compensation benchmarking on an hourly basis",
      ],
      examples: [
        {
          title: "Salary offer comparison",
          values: { annualSalary: 84000, hoursPerWeek: 45, weeksPerYear: 50 },
          note: "This conversion highlights whether a larger salary still pays well once the workload is translated into hours.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "payback-period",
      name: "Payback Period Calculator",
      category: "financial",
      blurb: "Estimate how long it takes an investment to recover itself.",
      tags: ["cash-flow", "investment", "recovery"],
    },
    fields: [
      {
        key: "initialInvestment",
        label: "Initial investment",
        format: "currency",
        defaultValue: 18000,
        min: 0,
        step: 100,
        description: "Upfront cash spent before the project begins returning money.",
      },
      {
        key: "monthlyCashIn",
        label: "Monthly cash in",
        format: "currency",
        defaultValue: 2200,
        min: 0,
        step: 10,
        description: "Average monthly cash inflow generated by the project or asset.",
      },
      {
        key: "monthlyCashOut",
        label: "Monthly cash out",
        format: "currency",
        defaultValue: 450,
        min: 0,
        step: 10,
        description: "Average monthly operating cost required to keep the project running.",
      },
    ],
    outputs: [
      {
        key: "netMonthlyCashflow",
        label: "Net monthly cashflow",
        format: "currency",
        description: "Cash left each month after subtracting operating costs.",
      },
      {
        key: "monthsToPayback",
        label: "Months to payback",
        format: "number",
        description: "Estimated number of months needed to recover the initial investment.",
      },
      {
        key: "yearsToPayback",
        label: "Years to payback",
        format: "number",
        description: "Months to payback translated into years for planning purposes.",
      },
    ],
    compute: (inputs) => {
      const netMonthlyCashflow =
        clampNonNegative(inputs.monthlyCashIn) - clampNonNegative(inputs.monthlyCashOut);
      const monthsToPayback = safeDivide(
        clampNonNegative(inputs.initialInvestment),
        netMonthlyCashflow
      );
      return {
        netMonthlyCashflow,
        monthsToPayback,
        yearsToPayback: safeDivide(monthsToPayback, 12),
      };
    },
    scenario: {
      fieldKey: "monthlyCashIn",
      values: (inputs) => scaledValues(inputs.monthlyCashIn, [0.6, 0.8, 1, 1.2, 1.4], 0),
      tableOutputKeys: ["netMonthlyCashflow", "monthsToPayback"],
      chartOutputKey: "monthsToPayback",
      tableTitle: "Payback by monthly inflow",
      chartTitle: "Payback period sensitivity",
      note: "Payback ignores the time value of money, so use it as a quick screen rather than a full capital budgeting method.",
    },
    content: {
      summaryLead:
        "The Payback Period Calculator estimates how long a project, machine, or campaign takes to recover its upfront cost from net monthly cashflow.",
      formulas: [
        "Net Monthly Cashflow = Monthly Cash In - Monthly Cash Out",
        "Payback Period = Initial Investment ÷ Net Monthly Cashflow",
      ],
      assumptions: [
        "Monthly inflows and outflows are treated as steady averages.",
        "The calculation ignores discounting and the time value of money.",
      ],
      tips: [
        "Use payback period to screen ideas quickly, not to rank them by total value.",
        "Projects with the same payback can still have very different profit profiles after breakeven.",
      ],
      references: [
        "Capital budgeting payback period method",
        "Project screening with cashflow recovery metrics",
      ],
      examples: [
        {
          title: "Equipment purchase review",
          values: { initialInvestment: 25000, monthlyCashIn: 3000, monthlyCashOut: 500 },
          note: "Payback period is easy to communicate, but it should be paired with ROI or NPV when the decision is material.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "debt-to-income",
      name: "Debt to Income Calculator",
      category: "financial",
      blurb: "Check front-end and back-end debt-to-income ratios.",
      tags: ["dti", "mortgage", "lending"],
    },
    fields: [
      {
        key: "monthlyDebt",
        label: "Monthly debt",
        format: "currency",
        defaultValue: 650,
        min: 0,
        step: 10,
        description: "Monthly debt payments excluding housing, such as loans and cards.",
      },
      {
        key: "housingCost",
        label: "Housing cost",
        format: "currency",
        defaultValue: 1500,
        min: 0,
        step: 10,
        description: "Monthly housing payment including rent or mortgage-related cost.",
      },
      {
        key: "grossIncome",
        label: "Gross income",
        format: "currency",
        defaultValue: 6200,
        min: 0,
        step: 10,
        description: "Gross monthly income used by lenders for DTI checks.",
      },
    ],
    outputs: [
      {
        key: "frontEndDti",
        label: "Front-end DTI",
        format: "percent",
        description: "Housing cost as a percentage of gross monthly income.",
      },
      {
        key: "backEndDti",
        label: "Back-end DTI",
        format: "percent",
        description: "Housing plus other debt as a percentage of gross monthly income.",
      },
      {
        key: "remainingIncome",
        label: "Income after debt",
        format: "currency",
        description: "Gross monthly income left after housing and debt payments.",
      },
    ],
    compute: (inputs) => {
      const totalDebt =
        clampNonNegative(inputs.monthlyDebt) + clampNonNegative(inputs.housingCost);
      return {
        frontEndDti:
          safeDivide(clampNonNegative(inputs.housingCost), clampNonNegative(inputs.grossIncome)) *
          100,
        backEndDti: safeDivide(totalDebt, clampNonNegative(inputs.grossIncome)) * 100,
        remainingIncome: clampNonNegative(inputs.grossIncome) - totalDebt,
      };
    },
    scenario: {
      fieldKey: "grossIncome",
      values: (inputs) => scaledValues(inputs.grossIncome, [0.8, 1, 1.2, 1.4], 1),
      tableOutputKeys: ["frontEndDti", "backEndDti"],
      chartOutputKey: "backEndDti",
      tableTitle: "DTI by income level",
      chartTitle: "Back-end DTI by income",
      note: "Lenders can use different rules, but DTI remains a useful first-pass affordability check before you apply.",
    },
    content: {
      summaryLead:
        "The Debt to Income Calculator helps you estimate front-end and back-end DTI ratios so you can gauge borrowing capacity and monthly affordability.",
      formulas: [
        "Front-End DTI = Housing Cost ÷ Gross Income × 100",
        "Back-End DTI = (Housing Cost + Monthly Debt) ÷ Gross Income × 100",
      ],
      assumptions: [
        "Income is treated as gross monthly income before taxes.",
        "Debt payments are modeled as fixed monthly obligations.",
      ],
      tips: [
        "Back-end DTI is often more relevant for lending decisions than front-end alone.",
        "Use stable income figures rather than unusually strong months.",
      ],
      references: [
        "Mortgage underwriting debt-to-income basics",
        "Personal finance affordability ratios",
      ],
      examples: [
        {
          title: "Home loan affordability check",
          values: { monthlyDebt: 900, housingCost: 1700, grossIncome: 6800 },
          note: "A manageable DTI does not guarantee approval, but it is one of the quickest ways to screen affordability before applying.",
        },
      ],
    },
  },
];

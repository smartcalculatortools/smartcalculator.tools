import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  safeDivide,
  scaledValues,
  shiftedValues,
} from "./base";

export const financialGrowthCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "gross-margin",
      name: "Gross Margin Calculator",
      category: "financial",
      blurb: "Estimate revenue, gross profit, and gross margin from unit economics.",
      tags: ["margin", "pricing", "business"],
    },
    fields: [
      {
        key: "salePricePerUnit",
        label: "Sale price per unit",
        format: "currency",
        defaultValue: 48,
        min: 0,
        step: 0.5,
        description: "Selling price collected for one unit before returns or discounts.",
      },
      {
        key: "unitCost",
        label: "Unit cost",
        format: "currency",
        defaultValue: 30,
        min: 0,
        step: 0.5,
        description: "Direct cost required to make or purchase one unit.",
      },
      {
        key: "units",
        label: "Units sold",
        format: "number",
        defaultValue: 120,
        min: 0,
        step: 1,
        description: "Number of units sold at the current price and cost assumptions.",
      },
    ],
    outputs: [
      {
        key: "revenue",
        label: "Revenue",
        format: "currency",
        description: "Top-line revenue generated from the selected price and volume.",
      },
      {
        key: "grossProfit",
        label: "Gross profit",
        format: "currency",
        description: "Revenue left after subtracting direct unit cost from each sale.",
      },
      {
        key: "grossMargin",
        label: "Gross margin",
        format: "percent",
        description: "Gross profit expressed as a percentage of total revenue.",
      },
    ],
    compute: (inputs) => {
      const revenue =
        clampNonNegative(inputs.salePricePerUnit) * clampNonNegative(inputs.units);
      const grossProfit =
        (clampNonNegative(inputs.salePricePerUnit) - clampNonNegative(inputs.unitCost)) *
        clampNonNegative(inputs.units);

      return {
        revenue,
        grossProfit,
        grossMargin: safeDivide(grossProfit, Math.max(revenue, 1)) * 100,
      };
    },
    scenario: {
      fieldKey: "salePricePerUnit",
      values: (inputs) => shiftedValues(inputs.salePricePerUnit, [-10, -5, 0, 5, 10], 0),
      tableOutputKeys: ["revenue", "grossMargin"],
      chartOutputKey: "grossProfit",
      tableTitle: "Gross margin by selling price",
      chartTitle: "Gross profit sensitivity",
      note: "A small price change can move margin quickly, so use the scenario view before discounting or repricing an offer.",
    },
    content: {
      summaryLead:
        "The Gross Margin Calculator helps operators and founders test how price, cost, and unit volume change gross profit and margin before a pricing decision.",
      formulas: [
        "Revenue = Sale Price per Unit * Units Sold",
        "Gross Margin = Gross Profit / Revenue",
      ],
      assumptions: [
        "Only direct unit cost is included in the gross profit calculation.",
        "Returns, discounts, and operating expenses are not modeled here.",
      ],
      tips: [
        "Run the calculator before approving discounts so you can see the margin tradeoff clearly.",
        "Margin looks stronger when costs stay flat, so update unit cost often if supplier pricing changes.",
      ],
      references: [
        "Unit economics and gross margin planning",
        "Pricing analysis for product and retail businesses",
      ],
      examples: [
        {
          title: "Product pricing check",
          values: { salePricePerUnit: 55, unitCost: 31, units: 180 },
          note: "Gross margin is most useful when you compare a few candidate prices instead of trusting a single price point.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "markup",
      name: "Markup Calculator",
      category: "financial",
      blurb: "Estimate selling price, gross profit, and margin from cost plus markup.",
      tags: ["markup", "pricing", "profit"],
    },
    fields: [
      {
        key: "unitCost",
        label: "Unit cost",
        format: "currency",
        defaultValue: 18,
        min: 0,
        step: 0.1,
        description: "Direct cost used as the base for the markup calculation.",
      },
      {
        key: "markupPercent",
        label: "Markup percent",
        format: "percent",
        defaultValue: 45,
        min: 0,
        step: 0.5,
        description: "Percentage markup added on top of cost to set the selling price.",
      },
      {
        key: "units",
        label: "Units sold",
        format: "number",
        defaultValue: 250,
        min: 0,
        step: 1,
        description: "Expected sales volume at the current cost and markup assumptions.",
      },
    ],
    outputs: [
      {
        key: "sellingPrice",
        label: "Selling price",
        format: "currency",
        description: "Selling price per unit after applying the selected markup percentage.",
      },
      {
        key: "grossProfit",
        label: "Gross profit",
        format: "currency",
        description: "Total gross profit generated across the selected unit volume.",
      },
      {
        key: "marginPercent",
        label: "Margin percent",
        format: "percent",
        description: "Gross margin implied by the selected markup and unit cost.",
      },
    ],
    compute: (inputs) => {
      const unitCost = clampNonNegative(inputs.unitCost);
      const sellingPrice = unitCost * (1 + clampNonNegative(inputs.markupPercent) / 100);
      const grossProfit =
        (sellingPrice - unitCost) * clampNonNegative(inputs.units);

      return {
        sellingPrice,
        grossProfit,
        marginPercent: safeDivide(sellingPrice - unitCost, Math.max(sellingPrice, 1)) * 100,
      };
    },
    scenario: {
      fieldKey: "markupPercent",
      values: (inputs) => shiftedValues(inputs.markupPercent, [-20, -10, 0, 10, 20], 0),
      tableOutputKeys: ["sellingPrice", "marginPercent"],
      chartOutputKey: "grossProfit",
      tableTitle: "Pricing outcome by markup percent",
      chartTitle: "Gross profit by markup",
      note: "Markup and margin are not the same, so test a few markup levels before you finalize a price list.",
    },
    content: {
      summaryLead:
        "The Markup Calculator helps retailers and operators turn unit cost into a selling price while also showing the resulting gross profit and margin.",
      formulas: [
        "Selling Price = Unit Cost * (1 + Markup Percent)",
        "Margin Percent = (Selling Price - Unit Cost) / Selling Price",
      ],
      assumptions: [
        "Markup is applied as one flat percentage on the direct unit cost.",
        "Only direct cost is included in the profitability view.",
      ],
      tips: [
        "Always inspect both markup and margin because they describe different views of the same price.",
        "If discounts are common, run a second scenario at the discounted selling price to protect margin.",
      ],
      references: [
        "Retail markup and margin planning",
        "Price-setting basics with cost-plus models",
      ],
      examples: [
        {
          title: "Store price setting",
          values: { unitCost: 22, markupPercent: 60, units: 180 },
          note: "Markup formulas are most useful when you compare several candidate price levels instead of approving the first price that feels acceptable.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "mortgage-points",
      name: "Mortgage Points Calculator",
      category: "financial",
      blurb: "Estimate upfront points cost, annual savings, and breakeven time.",
      tags: ["mortgage", "points", "interest"],
    },
    fields: [
      {
        key: "loanAmount",
        label: "Loan amount",
        format: "currency",
        defaultValue: 320000,
        min: 0,
        step: 1000,
        description: "Mortgage principal used to estimate points cost and rate savings.",
      },
      {
        key: "pointsPercent",
        label: "Points percent",
        format: "percent",
        defaultValue: 1,
        min: 0,
        step: 0.125,
        description: "Discount points purchased as a percentage of the mortgage amount.",
      },
      {
        key: "rateReduction",
        label: "Rate reduction",
        format: "percent",
        defaultValue: 0.25,
        min: 0,
        step: 0.01,
        description: "Estimated annual interest-rate reduction created by the purchased points.",
      },
      {
        key: "yearsInLoan",
        label: "Years in loan",
        format: "number",
        defaultValue: 5,
        min: 0,
        step: 0.5,
        description: "Planned time you expect to keep the mortgage before refinancing or selling.",
      },
    ],
    outputs: [
      {
        key: "upfrontCost",
        label: "Upfront cost",
        format: "currency",
        description: "Estimated cash paid upfront to buy the selected mortgage points.",
      },
      {
        key: "annualInterestSavings",
        label: "Annual savings",
        format: "currency",
        description: "Approximate yearly interest savings from the selected rate reduction.",
      },
      {
        key: "breakevenMonths",
        label: "Breakeven months",
        format: "number",
        description: "Months needed for yearly savings to recover the upfront points cost.",
      },
    ],
    compute: (inputs) => {
      const loanAmount = clampNonNegative(inputs.loanAmount);
      const upfrontCost = loanAmount * (clampNonNegative(inputs.pointsPercent) / 100);
      const annualInterestSavings =
        loanAmount * (clampNonNegative(inputs.rateReduction) / 100);

      return {
        upfrontCost,
        annualInterestSavings,
        breakevenMonths: safeDivide(upfrontCost, Math.max(annualInterestSavings / 12, 0.0001)),
      };
    },
    scenario: {
      fieldKey: "pointsPercent",
      values: (inputs) => scaledValues(inputs.pointsPercent, [0.5, 1, 1.5, 2], 0),
      tableOutputKeys: ["upfrontCost", "breakevenMonths"],
      chartOutputKey: "breakevenMonths",
      tableTitle: "Breakeven by points percent",
      chartTitle: "Mortgage points sensitivity",
      note: "Points only pay off if you keep the loan long enough, so compare breakeven time with your expected time in the mortgage.",
    },
    content: {
      summaryLead:
        "The Mortgage Points Calculator helps borrowers estimate the upfront cost of buying points, the annual savings from a lower rate, and the breakeven period.",
      formulas: [
        "Upfront Cost = Loan Amount * Points Percent",
        "Breakeven Months = Upfront Cost / Monthly Interest Savings",
      ],
      assumptions: [
        "Interest savings are modeled from a simple annual rate reduction on the current loan amount.",
        "The loan balance is treated as stable for a quick breakeven estimate.",
      ],
      tips: [
        "Compare breakeven months with how long you realistically expect to keep the mortgage.",
        "If you might refinance soon, a lower upfront-cost scenario is often worth testing first.",
      ],
      references: [
        "Mortgage discount points and breakeven analysis",
        "Interest-rate buy-down comparisons for home loans",
      ],
      examples: [
        {
          title: "Primary residence breakeven",
          values: { loanAmount: 400000, pointsPercent: 1.25, rateReduction: 0.3, yearsInLoan: 7 },
          note: "Points become easier to evaluate when you compare the upfront cash cost with the time you expect to keep the mortgage.",
        },
      ],
    },
  },
];

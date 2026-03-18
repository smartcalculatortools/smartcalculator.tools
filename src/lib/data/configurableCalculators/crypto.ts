import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  safeDivide,
  shiftedValues,
} from "./base";

export const cryptoCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "crypto-position-size",
      name: "Crypto Position Size Calculator",
      category: "crypto",
      blurb: "Estimate units and position value from account risk.",
      tags: ["risk", "trading", "position-size"],
    },
    fields: [
      {
        key: "accountSize",
        label: "Account size",
        format: "currency",
        defaultValue: 12000,
        min: 0,
        step: 50,
        description: "Trading account size or capital allocated to the strategy.",
      },
      {
        key: "riskPercent",
        label: "Risk per trade",
        format: "percent",
        defaultValue: 1,
        min: 0,
        step: 0.1,
        description: "Percentage of the account you are willing to risk on one trade.",
      },
      {
        key: "entryPrice",
        label: "Entry price",
        format: "currency",
        defaultValue: 28000,
        min: 0,
        step: 1,
        description: "Planned entry price for the trade.",
      },
      {
        key: "stopPrice",
        label: "Stop price",
        format: "currency",
        defaultValue: 26800,
        min: 0,
        step: 1,
        description: "Planned stop-loss price for the trade.",
      },
    ],
    outputs: [
      {
        key: "riskAmount",
        label: "Risk amount",
        format: "currency",
        description: "Maximum dollar loss allowed by the selected risk percentage.",
      },
      {
        key: "units",
        label: "Position units",
        format: "number",
        description: "Number of units that fit the risk limit between entry and stop.",
      },
      {
        key: "positionValue",
        label: "Position value",
        format: "currency",
        description: "Notional value of the position at the entry price.",
      },
    ],
    compute: (inputs) => {
      const riskAmount =
        (clampNonNegative(inputs.accountSize) * clampNonNegative(inputs.riskPercent)) / 100;
      const stopDistance = Math.abs(inputs.entryPrice - inputs.stopPrice);
      const units = safeDivide(riskAmount, stopDistance);
      return {
        riskAmount,
        units,
        positionValue: units * clampNonNegative(inputs.entryPrice),
      };
    },
    scenario: {
      fieldKey: "riskPercent",
      values: (inputs) => shiftedValues(inputs.riskPercent, [-0.5, 0, 0.5, 1], 0),
      tableOutputKeys: ["riskAmount", "positionValue"],
      chartOutputKey: "positionValue",
      tableTitle: "Position size by risk percentage",
      chartTitle: "Notional position by account risk",
      note: "Position sizing is a risk-control tool, so the account risk percentage should be chosen before the trade, not after the setup looks attractive.",
    },
    content: {
      summaryLead:
        "The Crypto Position Size Calculator turns account risk, entry, and stop price into a practical position size so you can keep trade risk consistent.",
      formulas: [
        "Risk Amount = Account Size × Risk %",
        "Units = Risk Amount ÷ |Entry Price - Stop Price|",
      ],
      assumptions: [
        "The stop executes near the planned stop price.",
        "Slippage, fees, and funding costs are not included in the baseline size.",
      ],
      tips: [
        "If the stop is too tight, size can become unrealistically large, so check the position value too.",
        "Reduce risk percentage if several positions are open at the same time.",
      ],
      references: [
        "Position sizing and per-trade risk methods",
        "Trading risk management with entry and stop levels",
      ],
      examples: [
        {
          title: "BTC swing trade sizing",
          values: { accountSize: 15000, riskPercent: 1, entryPrice: 30000, stopPrice: 28800 },
          note: "Risk-based position sizing matters because it keeps losses proportional even when price and volatility change from trade to trade.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "crypto-staking-yield",
      name: "Crypto Staking Yield Calculator",
      category: "crypto",
      blurb: "Estimate simple rewards and a compounded staking balance.",
      tags: ["staking", "yield", "rewards"],
    },
    fields: [
      {
        key: "principal",
        label: "Principal",
        format: "currency",
        defaultValue: 5000,
        min: 0,
        step: 10,
        description: "Capital committed to the staking position.",
      },
      {
        key: "apy",
        label: "APY",
        format: "percent",
        defaultValue: 8,
        min: 0,
        step: 0.1,
        description: "Annual percentage yield advertised by the staking program.",
      },
      {
        key: "months",
        label: "Months",
        format: "number",
        defaultValue: 12,
        min: 0,
        step: 1,
        description: "Length of the staking period in months.",
      },
    ],
    outputs: [
      {
        key: "simpleReward",
        label: "Simple reward",
        format: "currency",
        description: "Reward estimate using simple, non-compounded yield.",
      },
      {
        key: "compoundedBalance",
        label: "Compounded balance",
        format: "currency",
        description: "Ending balance if rewards compound monthly at the stated APY.",
      },
      {
        key: "averageMonthlyReward",
        label: "Avg monthly reward",
        format: "currency",
        description: "Average monthly reward implied by the compounded result.",
      },
    ],
    compute: (inputs) => {
      const principal = clampNonNegative(inputs.principal);
      const monthlyRate = clampNonNegative(inputs.apy) / 100 / 12;
      const months = clampNonNegative(inputs.months);
      const compoundedBalance = principal * Math.pow(1 + monthlyRate, months);
      return {
        simpleReward: (principal * clampNonNegative(inputs.apy) / 100 * months) / 12,
        compoundedBalance,
        averageMonthlyReward: safeDivide(compoundedBalance - principal, Math.max(months, 1)),
      };
    },
    scenario: {
      fieldKey: "apy",
      values: (inputs) => shiftedValues(inputs.apy, [-3, -1, 0, 2, 4], 0),
      tableOutputKeys: ["simpleReward", "compoundedBalance"],
      chartOutputKey: "compoundedBalance",
      tableTitle: "Staking outcome by APY",
      chartTitle: "Ending balance by yield",
      note: "Displayed APY can change with validator performance, market conditions, or protocol rules, so treat the yield input as an estimate.",
    },
    content: {
      summaryLead:
        "The Crypto Staking Yield Calculator estimates simple rewards and a monthly compounded ending balance so you can compare staking offers more clearly.",
      formulas: [
        "Simple Reward = Principal × APY × Months ÷ 12",
        "Compounded Balance = Principal × (1 + APY ÷ 12) ^ Months",
      ],
      assumptions: [
        "Monthly compounding is used for the compounded scenario.",
        "Yield is assumed to stay constant through the staking period.",
      ],
      tips: [
        "Real staking returns can change as validator and network conditions change.",
        "Check lock-up terms and slashing risk before focusing only on APY.",
      ],
      references: [
        "Staking APY and compounding basics",
        "Crypto yield estimation with simple and compounded returns",
      ],
      examples: [
        {
          title: "One-year staking estimate",
          values: { principal: 8000, apy: 9.5, months: 12 },
          note: "Yield formulas give a clean baseline, but real staking returns also depend on lock-up rules, downtime, and reward variability.",
        },
      ],
    },
  },
];

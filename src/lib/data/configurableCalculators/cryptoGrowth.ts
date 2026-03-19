import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  safeDivide,
  shiftedValues,
} from "./base";

export const cryptoGrowthCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "crypto-risk-reward",
      name: "Crypto Risk Reward Calculator",
      category: "crypto",
      blurb: "Estimate downside, upside, and risk-reward ratio from a trade plan.",
      tags: ["risk", "reward", "trading"],
    },
    fields: [
      {
        key: "entryPrice",
        label: "Entry price",
        format: "currency",
        defaultValue: 42000,
        min: 0,
        step: 1,
        description: "Planned entry price for the trade setup.",
      },
      {
        key: "stopPrice",
        label: "Stop price",
        format: "currency",
        defaultValue: 40200,
        min: 0,
        step: 1,
        description: "Planned stop-loss level where the trade thesis is invalidated.",
      },
      {
        key: "targetPrice",
        label: "Target price",
        format: "currency",
        defaultValue: 46800,
        min: 0,
        step: 1,
        description: "Planned take-profit level used to estimate upside.",
      },
      {
        key: "positionUnits",
        label: "Position units",
        format: "number",
        defaultValue: 0.8,
        min: 0,
        step: 0.01,
        description: "Number of coin units or contracts used to convert price movement into value at risk.",
      },
    ],
    outputs: [
      {
        key: "riskAmount",
        label: "Risk amount",
        format: "currency",
        description: "Total downside in currency terms if the stop is hit.",
      },
      {
        key: "rewardAmount",
        label: "Reward amount",
        format: "currency",
        description: "Total upside in currency terms if the target is reached.",
      },
      {
        key: "rewardRiskRatio",
        label: "Reward-risk ratio",
        format: "number",
        description: "Reward divided by risk for the selected trade plan.",
      },
    ],
    compute: (inputs) => {
      const riskPerUnit = Math.abs(inputs.entryPrice - inputs.stopPrice);
      const rewardPerUnit = Math.abs(inputs.targetPrice - inputs.entryPrice);
      const positionUnits = clampNonNegative(inputs.positionUnits);
      const riskAmount = riskPerUnit * positionUnits;
      const rewardAmount = rewardPerUnit * positionUnits;

      return {
        riskAmount,
        rewardAmount,
        rewardRiskRatio: safeDivide(rewardAmount, Math.max(riskAmount, 0.0001)),
      };
    },
    scenario: {
      fieldKey: "targetPrice",
      values: (inputs) => shiftedValues(inputs.targetPrice, [-3000, -1500, 0, 1500, 3000], 0),
      tableOutputKeys: ["rewardAmount", "rewardRiskRatio"],
      chartOutputKey: "rewardAmount",
      tableTitle: "Reward by target price",
      chartTitle: "Risk-reward sensitivity",
      note: "Target placement changes the trade profile directly, so compare a conservative target with an extended target before you commit.",
    },
    content: {
      summaryLead:
        "The Crypto Risk Reward Calculator helps traders convert entry, stop, target, and position size into a clean downside-versus-upside comparison.",
      formulas: [
        "Risk Amount = |Entry Price - Stop Price| * Position Units",
        "Reward-Risk Ratio = Reward Amount / Risk Amount",
      ],
      assumptions: [
        "The trade is modeled with one entry, one stop, and one target.",
        "Fees, slippage, and partial exits are not included in the baseline result.",
      ],
      tips: [
        "Check the reward-risk ratio before entry so the setup quality is clear while you are still objective.",
        "If volatility is high, test a wider stop and a more conservative target instead of forcing the same ratio.",
      ],
      references: [
        "Trade planning with reward-risk ratios",
        "Crypto setup evaluation using entry, stop, and target levels",
      ],
      examples: [
        {
          title: "Swing setup comparison",
          values: { entryPrice: 38000, stopPrice: 36400, targetPrice: 42500, positionUnits: 1.2 },
          note: "Risk-reward analysis is strongest when you convert a chart idea into numbers before a fast market move changes your discipline.",
        },
      ],
    },
  },
];

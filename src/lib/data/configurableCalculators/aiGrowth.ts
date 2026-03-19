import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  safeDivide,
  shiftedValues,
} from "./base";

export const aiGrowthCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "ai-chatbot-cost",
      name: "AI Chatbot Cost Calculator",
      category: "ai",
      blurb: "Estimate chatbot spend from conversations, messages, and unit cost.",
      tags: ["chatbot", "cost", "support"],
    },
    fields: [
      {
        key: "conversationsPerDay",
        label: "Conversations per day",
        format: "number",
        defaultValue: 240,
        min: 0,
        step: 1,
        description: "Average number of chatbot conversations handled in one day.",
      },
      {
        key: "messagesPerConversation",
        label: "Messages per conversation",
        format: "number",
        defaultValue: 14,
        min: 0,
        step: 1,
        description: "Average number of total messages exchanged in one conversation.",
      },
      {
        key: "costPerMessage",
        label: "Cost per message",
        format: "currency",
        defaultValue: 0.015,
        min: 0,
        step: 0.001,
        description: "Average provider cost for one chatbot message across the workload.",
      },
    ],
    outputs: [
      {
        key: "dailyCost",
        label: "Daily cost",
        format: "currency",
        description: "Estimated chatbot spend for one average day of usage.",
      },
      {
        key: "monthlyCost",
        label: "Monthly cost",
        format: "currency",
        description: "Estimated chatbot spend for a 30-day month at the same usage level.",
      },
      {
        key: "costPerConversation",
        label: "Cost per conversation",
        format: "currency",
        description: "Average cost of one complete chatbot conversation.",
      },
    ],
    compute: (inputs) => {
      const costPerConversation =
        clampNonNegative(inputs.messagesPerConversation) *
        clampNonNegative(inputs.costPerMessage);
      const dailyCost =
        clampNonNegative(inputs.conversationsPerDay) * costPerConversation;

      return {
        dailyCost,
        monthlyCost: dailyCost * 30,
        costPerConversation,
      };
    },
    scenario: {
      fieldKey: "conversationsPerDay",
      values: (inputs) =>
        shiftedValues(inputs.conversationsPerDay, [-40, -20, 0, 40, 80], 0),
      tableOutputKeys: ["dailyCost", "monthlyCost"],
      chartOutputKey: "monthlyCost",
      tableTitle: "Chatbot cost by daily conversation volume",
      chartTitle: "Monthly chatbot cost",
      note: "Conversation volume often drives the budget more than small model-price changes, so compare realistic traffic scenarios before launch.",
    },
    content: {
      summaryLead:
        "The AI Chatbot Cost Calculator helps teams estimate daily and monthly chatbot spend from conversation volume, message depth, and average unit cost.",
      formulas: [
        "Cost per Conversation = Messages per Conversation * Cost per Message",
        "Monthly Cost = Daily Cost * 30",
      ],
      assumptions: [
        "The calculator uses one average cost per message across the workload.",
        "Conversation volume is assumed to stay steady throughout the month.",
      ],
      tips: [
        "If messages vary a lot by user segment, calculate a support case and a sales case separately.",
        "Daily volume is usually the main budget driver, so monitor traffic assumptions closely after launch.",
      ],
      references: [
        "Chatbot budgeting with message-based usage models",
        "Support automation planning with conversation-volume estimates",
      ],
      examples: [
        {
          title: "Support bot budget",
          values: { conversationsPerDay: 400, messagesPerConversation: 10, costPerMessage: 0.012 },
          note: "Chatbot budgeting becomes easier when you convert message assumptions into both a per-conversation cost and a full monthly bill.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "ai-automation-roi",
      name: "AI Automation ROI Calculator",
      category: "ai",
      blurb: "Estimate monthly savings, net gain, and annual ROI from automation.",
      tags: ["roi", "automation", "operations"],
    },
    fields: [
      {
        key: "hoursSavedPerWeek",
        label: "Hours saved per week",
        format: "number",
        defaultValue: 18,
        min: 0,
        step: 0.5,
        description: "Weekly labor hours removed or reduced by the automation workflow.",
      },
      {
        key: "hourlyCost",
        label: "Hourly labor cost",
        format: "currency",
        defaultValue: 32,
        min: 0,
        step: 0.5,
        description: "Loaded hourly labor cost for the work that the automation reduces.",
      },
      {
        key: "toolCostPerMonth",
        label: "Tool cost per month",
        format: "currency",
        defaultValue: 450,
        min: 0,
        step: 10,
        description: "Total monthly software or provider spend required to run the automation.",
      },
    ],
    outputs: [
      {
        key: "monthlySavings",
        label: "Monthly savings",
        format: "currency",
        description: "Estimated monthly labor value recovered by the automation.",
      },
      {
        key: "netMonthlyGain",
        label: "Net monthly gain",
        format: "currency",
        description: "Monthly savings after subtracting the monthly automation cost.",
      },
      {
        key: "annualRoi",
        label: "Annual ROI",
        format: "percent",
        description: "Estimated annual return relative to the annual tool spend.",
      },
    ],
    compute: (inputs) => {
      const monthlySavings =
        clampNonNegative(inputs.hoursSavedPerWeek) *
        clampNonNegative(inputs.hourlyCost) *
        4.33;
      const netMonthlyGain = monthlySavings - clampNonNegative(inputs.toolCostPerMonth);
      const annualToolSpend = clampNonNegative(inputs.toolCostPerMonth) * 12;

      return {
        monthlySavings,
        netMonthlyGain,
        annualRoi: safeDivide(netMonthlyGain * 12, Math.max(annualToolSpend, 1)) * 100,
      };
    },
    scenario: {
      fieldKey: "hoursSavedPerWeek",
      values: (inputs) =>
        shiftedValues(inputs.hoursSavedPerWeek, [-5, -2, 0, 5, 10], 0),
      tableOutputKeys: ["monthlySavings", "netMonthlyGain"],
      chartOutputKey: "netMonthlyGain",
      tableTitle: "Automation gain by hours saved",
      chartTitle: "Automation ROI sensitivity",
      note: "Hours saved is usually the hardest assumption to trust, so compare a cautious case with the optimistic case before approving spend.",
    },
    content: {
      summaryLead:
        "The AI Automation ROI Calculator helps teams estimate monthly savings, net gain, and annual ROI from labor hours saved by an automation workflow.",
      formulas: [
        "Monthly Savings = Hours Saved per Week * Hourly Cost * 4.33",
        "Net Monthly Gain = Monthly Savings - Tool Cost per Month",
      ],
      assumptions: [
        "Saved hours are treated as consistent across the month.",
        "ROI is measured against annual tool spend and does not include one-time setup costs.",
      ],
      tips: [
        "Use a conservative hours-saved estimate first, then compare it with the optimistic case.",
        "If implementation costs are material, keep them separate so the monthly ROI stays easy to audit.",
      ],
      references: [
        "Automation ROI planning for operations teams",
        "Labor-savings models for AI workflow investments",
      ],
      examples: [
        {
          title: "Back-office automation case",
          values: { hoursSavedPerWeek: 26, hourlyCost: 28, toolCostPerMonth: 600 },
          note: "Automation ROI becomes easier to defend when you translate saved hours into monthly value and compare it directly with the tool spend.",
        },
      ],
    },
  },
];

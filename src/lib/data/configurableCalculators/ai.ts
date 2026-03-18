import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  safeDivide,
  shiftedValues,
} from "./base";

export const aiCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "ai-image-cost",
      name: "AI Image Cost Calculator",
      category: "ai",
      blurb: "Estimate monthly and annual image generation cost.",
      tags: ["images", "pricing", "generation"],
    },
    fields: [
      {
        key: "imagesPerDay",
        label: "Images per day",
        format: "number",
        defaultValue: 80,
        min: 0,
        step: 1,
        description: "Average number of generated images per day.",
      },
      {
        key: "daysPerMonth",
        label: "Days per month",
        format: "number",
        defaultValue: 30,
        min: 0,
        step: 1,
        description: "Active days per month when image generation occurs.",
      },
      {
        key: "costPerImage",
        label: "Cost per image",
        format: "currency",
        defaultValue: 0.04,
        min: 0,
        step: 0.001,
        description: "Average provider cost for one generated image.",
      },
    ],
    outputs: [
      {
        key: "monthlyImages",
        label: "Monthly images",
        format: "number",
        description: "Expected number of generated images in one month.",
      },
      {
        key: "monthlyCost",
        label: "Monthly cost",
        format: "currency",
        description: "Estimated cost for one average month of image generation.",
      },
      {
        key: "annualCost",
        label: "Annual cost",
        format: "currency",
        description: "Estimated cost if the same workload runs for a full year.",
      },
    ],
    compute: (inputs) => {
      const monthlyImages =
        clampNonNegative(inputs.imagesPerDay) * clampNonNegative(inputs.daysPerMonth);
      const monthlyCost = monthlyImages * clampNonNegative(inputs.costPerImage);
      return {
        monthlyImages,
        monthlyCost,
        annualCost: monthlyCost * 12,
      };
    },
    scenario: {
      fieldKey: "imagesPerDay",
      values: (inputs) => shiftedValues(inputs.imagesPerDay, [-40, -20, 0, 40, 80], 0),
      tableOutputKeys: ["monthlyImages", "monthlyCost"],
      chartOutputKey: "monthlyCost",
      tableTitle: "Image cost by daily volume",
      chartTitle: "Monthly image cost",
      note: "Volume changes usually dominate image budgets, so test several realistic daily workloads instead of a single optimistic estimate.",
    },
    content: {
      summaryLead:
        "The AI Image Cost Calculator estimates monthly and annual spend from image volume, active days, and a cost-per-image assumption.",
      formulas: [
        "Monthly Images = Images per Day × Days per Month",
        "Monthly Cost = Monthly Images × Cost per Image",
      ],
      assumptions: [
        "Cost per image is modeled as a flat average rate.",
        "The same daily image volume is assumed across the active month.",
      ],
      tips: [
        "If your provider charges different rates by size or quality, model separate scenarios.",
        "Daily volume usually matters more than small rate changes when usage is high.",
      ],
      references: [
        "Per-image AI generation pricing models",
        "Usage-based budgeting for image generation workloads",
      ],
      examples: [
        {
          title: "Creative team estimate",
          values: { imagesPerDay: 150, daysPerMonth: 22, costPerImage: 0.05 },
          note: "Image budgets can drift quietly, so turning daily output into monthly cost is a practical way to set guardrails early.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "ai-fine-tune-budget",
      name: "AI Fine-Tune Budget Calculator",
      category: "ai",
      blurb: "Estimate token volume and training budget for fine-tuning.",
      tags: ["fine-tuning", "training", "budget"],
    },
    fields: [
      {
        key: "trainingTokensMillions",
        label: "Tokens in millions",
        format: "number",
        defaultValue: 12,
        min: 0,
        step: 0.5,
        description: "Base training dataset size measured in millions of tokens.",
      },
      {
        key: "epochs",
        label: "Epochs",
        format: "number",
        defaultValue: 3,
        min: 0,
        step: 1,
        description: "Number of passes through the training dataset.",
      },
      {
        key: "costPerMillion",
        label: "Cost per million",
        format: "currency",
        defaultValue: 8,
        min: 0,
        step: 0.1,
        description: "Provider cost per million training tokens.",
      },
    ],
    outputs: [
      {
        key: "totalTrainingTokens",
        label: "Total training tokens",
        format: "number",
        description: "Total training token volume in millions after multiplying by epochs.",
      },
      {
        key: "budget",
        label: "Training budget",
        format: "currency",
        description: "Estimated cost to complete the fine-tuning job.",
      },
      {
        key: "costPerEpoch",
        label: "Cost per epoch",
        format: "currency",
        description: "Average cost for each training epoch.",
      },
    ],
    compute: (inputs) => {
      const totalTrainingTokens =
        clampNonNegative(inputs.trainingTokensMillions) * clampNonNegative(inputs.epochs);
      const budget = totalTrainingTokens * clampNonNegative(inputs.costPerMillion);
      return {
        totalTrainingTokens,
        budget,
        costPerEpoch: safeDivide(budget, Math.max(clampNonNegative(inputs.epochs), 1)),
      };
    },
    scenario: {
      fieldKey: "epochs",
      values: (inputs) => shiftedValues(inputs.epochs, [-1, 0, 1, 2], 1),
      tableOutputKeys: ["totalTrainingTokens", "budget"],
      chartOutputKey: "budget",
      tableTitle: "Fine-tune budget by epochs",
      chartTitle: "Training cost by epochs",
      note: "Epoch count scales cost directly, so use the scenario table to decide whether another pass is worth the extra spend.",
    },
    content: {
      summaryLead:
        "The AI Fine-Tune Budget Calculator estimates total token volume and project cost from dataset size, epoch count, and provider pricing per million tokens.",
      formulas: [
        "Total Training Tokens = Dataset Tokens × Epochs",
        "Budget = Total Training Tokens × Cost per Million Tokens",
      ],
      assumptions: [
        "Provider pricing is modeled with one flat cost per million training tokens.",
        "Validation, storage, and experiment overhead are not included.",
      ],
      tips: [
        "Token volume can multiply quickly once you raise epochs, so check the cost before increasing passes.",
        "If you train several variants, budget each run separately instead of multiplying a single guess.",
      ],
      references: [
        "Token-based pricing models for model customization",
        "Training budget planning with dataset size and epochs",
      ],
      examples: [
        {
          title: "Pilot fine-tune estimate",
          values: { trainingTokensMillions: 8, epochs: 4, costPerMillion: 7.5 },
          note: "Budgeting by dataset size and epochs helps teams avoid underestimating training spend when an experiment expands into several runs.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "ai-batch-savings",
      name: "AI Batch Savings Calculator",
      category: "ai",
      blurb: "Estimate labor and budget saved through AI automation.",
      tags: ["automation", "savings", "operations"],
    },
    fields: [
      {
        key: "baselineHours",
        label: "Baseline hours",
        format: "number",
        defaultValue: 160,
        min: 0,
        step: 1,
        description: "Manual hours currently spent on the process each month.",
      },
      {
        key: "hourlyRate",
        label: "Hourly rate",
        format: "currency",
        defaultValue: 22,
        min: 0,
        step: 0.1,
        description: "Loaded labor cost per hour for the process being automated.",
      },
      {
        key: "automationPercent",
        label: "Automation rate",
        format: "percent",
        defaultValue: 35,
        min: 0,
        step: 1,
        description: "Percentage of the baseline workload expected to be automated.",
      },
    ],
    outputs: [
      {
        key: "savedHours",
        label: "Saved hours",
        format: "number",
        description: "Estimated number of manual hours removed each month.",
      },
      {
        key: "savedBudget",
        label: "Saved budget",
        format: "currency",
        description: "Estimated monthly labor cost saved through automation.",
      },
      {
        key: "remainingHours",
        label: "Remaining hours",
        format: "number",
        description: "Manual hours still left after the automation gain.",
      },
    ],
    compute: (inputs) => {
      const savedHours =
        (clampNonNegative(inputs.baselineHours) * clampNonNegative(inputs.automationPercent)) /
        100;
      return {
        savedHours,
        savedBudget: savedHours * clampNonNegative(inputs.hourlyRate),
        remainingHours: clampNonNegative(inputs.baselineHours) - savedHours,
      };
    },
    scenario: {
      fieldKey: "automationPercent",
      values: (inputs) => shiftedValues(inputs.automationPercent, [-15, -5, 0, 10, 20], 0),
      tableOutputKeys: ["savedHours", "savedBudget"],
      chartOutputKey: "savedBudget",
      tableTitle: "Savings by automation rate",
      chartTitle: "Monthly labor savings",
      note: "Automation percentage is usually the least certain assumption, so compare several realistic adoption levels before committing to a budget target.",
    },
    content: {
      summaryLead:
        "The AI Batch Savings Calculator estimates hours and labor budget saved when an automation workflow removes part of a repetitive monthly process.",
      formulas: [
        "Saved Hours = Baseline Hours × Automation Rate",
        "Saved Budget = Saved Hours × Hourly Rate",
      ],
      assumptions: [
        "The automation rate is applied directly to the baseline hours.",
        "Labor cost is modeled with one average hourly rate.",
      ],
      tips: [
        "Start with a realistic automation percentage instead of an ideal future-state number.",
        "If AI requires review time, subtract that from the expected saved hours.",
      ],
      references: [
        "Operational savings models for automation",
        "Labor cost reduction estimates using time saved",
      ],
      examples: [
        {
          title: "Ops workflow estimate",
          values: { baselineHours: 220, hourlyRate: 28, automationPercent: 40 },
          note: "Labor savings are easiest to overstate, so scenario testing is more useful than building a plan around a single aggressive assumption.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "ai-inference-budget",
      name: "AI Inference Budget Calculator",
      category: "ai",
      blurb: "Estimate monthly and annual inference spend from token usage.",
      tags: ["tokens", "inference", "budget"],
    },
    fields: [
      {
        key: "requestsPerDay",
        label: "Requests per day",
        format: "number",
        defaultValue: 2500,
        min: 0,
        step: 10,
        description: "Average daily number of model requests.",
      },
      {
        key: "tokensPerRequest",
        label: "Tokens per request",
        format: "number",
        defaultValue: 1800,
        min: 0,
        step: 10,
        description: "Average total tokens consumed by one request.",
      },
      {
        key: "costPerMillionTokens",
        label: "Cost per million",
        format: "currency",
        defaultValue: 6,
        min: 0,
        step: 0.1,
        description: "Blended cost per million tokens across the workload.",
      },
    ],
    outputs: [
      {
        key: "monthlyTokens",
        label: "Monthly tokens (M)",
        format: "number",
        description: "Estimated monthly token volume in millions.",
      },
      {
        key: "monthlyCost",
        label: "Monthly cost",
        format: "currency",
        description: "Estimated monthly cost for the inference workload.",
      },
      {
        key: "annualCost",
        label: "Annual cost",
        format: "currency",
        description: "Projected annual cost if the same workload stays active.",
      },
    ],
    compute: (inputs) => {
      const monthlyTokens =
        (clampNonNegative(inputs.requestsPerDay) *
          clampNonNegative(inputs.tokensPerRequest) *
          30) /
        1_000_000;
      const monthlyCost = monthlyTokens * clampNonNegative(inputs.costPerMillionTokens);
      return {
        monthlyTokens,
        monthlyCost,
        annualCost: monthlyCost * 12,
      };
    },
    scenario: {
      fieldKey: "requestsPerDay",
      values: (inputs) => shiftedValues(inputs.requestsPerDay, [-1000, -500, 0, 1000, 2000], 0),
      tableOutputKeys: ["monthlyTokens", "monthlyCost"],
      chartOutputKey: "monthlyCost",
      tableTitle: "Inference budget by request volume",
      chartTitle: "Monthly inference cost",
      note: "Inference budgets usually grow with request volume first, so request volume is the best lever to stress-test in planning.",
    },
    content: {
      summaryLead:
        "The AI Inference Budget Calculator converts request volume and token usage into monthly and annual spend so product teams can size ongoing API costs.",
      formulas: [
        "Monthly Tokens = Requests per Day × Tokens per Request × 30 ÷ 1,000,000",
        "Monthly Cost = Monthly Tokens × Cost per Million Tokens",
      ],
      assumptions: [
        "A flat blended token cost is used across all requests.",
        "Daily request volume is assumed to stay stable through the month.",
      ],
      tips: [
        "Use a weighted average token cost if your workload mixes several models.",
        "Budget for peaks separately if traffic is highly uneven.",
      ],
      references: [
        "Token-based inference budgeting methods",
        "API cost planning from request and token volume",
      ],
      examples: [
        {
          title: "Support bot budget",
          values: { requestsPerDay: 4000, tokensPerRequest: 1500, costPerMillionTokens: 5.5 },
          note: "Inference spend often looks small per request, but volume compounds quickly once the product reaches steady usage.",
        },
      ],
    },
  },
];

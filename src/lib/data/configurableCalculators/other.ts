import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  round,
  safeDivide,
  shiftedValues,
} from "./base";

export const otherCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "fuel-cost",
      name: "Fuel Cost Calculator",
      category: "other",
      blurb: "Estimate fuel needed, trip cost, and cost per mile.",
      tags: ["fuel", "travel", "budget"],
    },
    fields: [
      {
        key: "tripDistanceMiles",
        label: "Trip distance",
        format: "number",
        defaultValue: 320,
        min: 0,
        step: 1,
        description: "Total driving distance in miles for the trip you want to price.",
      },
      {
        key: "milesPerGallon",
        label: "Miles per gallon",
        format: "number",
        defaultValue: 28,
        min: 0,
        step: 0.1,
        description: "Average fuel efficiency of the vehicle in miles per gallon.",
      },
      {
        key: "fuelPrice",
        label: "Fuel price",
        format: "currency",
        defaultValue: 3.7,
        min: 0,
        step: 0.01,
        description: "Current fuel price per gallon used for the cost estimate.",
      },
    ],
    outputs: [
      {
        key: "fuelNeeded",
        label: "Fuel needed",
        format: "number",
        description: "Estimated gallons of fuel required for the full trip distance.",
      },
      {
        key: "tripCost",
        label: "Trip cost",
        format: "currency",
        description: "Estimated total fuel spend for the current trip assumptions.",
      },
      {
        key: "costPerMile",
        label: "Cost per mile",
        format: "currency",
        description: "Average fuel cost for each mile driven on the trip.",
      },
    ],
    compute: (inputs) => {
      const tripDistanceMiles = clampNonNegative(inputs.tripDistanceMiles);
      const fuelNeeded = safeDivide(
        tripDistanceMiles,
        Math.max(clampNonNegative(inputs.milesPerGallon), 0.0001)
      );
      const tripCost = fuelNeeded * clampNonNegative(inputs.fuelPrice);

      return {
        fuelNeeded,
        tripCost,
        costPerMile: safeDivide(tripCost, Math.max(tripDistanceMiles, 1)),
      };
    },
    scenario: {
      fieldKey: "fuelPrice",
      values: (inputs) => shiftedValues(inputs.fuelPrice, [-1, -0.5, 0, 0.5, 1], 0),
      tableOutputKeys: ["tripCost", "costPerMile"],
      chartOutputKey: "tripCost",
      tableTitle: "Trip cost by fuel price",
      chartTitle: "Fuel cost sensitivity",
      note: "Fuel price can move trip cost more than route tweaks, so compare a few pump-price scenarios before budgeting the drive.",
    },
    content: {
      summaryLead:
        "The Fuel Cost Calculator helps drivers estimate gallons needed, total trip cost, and average fuel cost per mile from distance, efficiency, and fuel price.",
      formulas: [
        "Fuel Needed = Trip Distance / Miles per Gallon",
        "Trip Cost = Fuel Needed * Fuel Price",
      ],
      assumptions: [
        "Fuel efficiency is treated as one average miles-per-gallon value for the trip.",
        "Only direct fuel spend is included in the trip cost estimate.",
      ],
      tips: [
        "Use real highway or city efficiency instead of the sticker number when possible.",
        "If the route includes towing or steep grades, run a lower mpg scenario too.",
      ],
      references: [
        "Trip budgeting with distance, mpg, and fuel price",
        "Fuel cost planning for road trips and commuting",
      ],
      examples: [
        {
          title: "Weekend road trip",
          values: { tripDistanceMiles: 460, milesPerGallon: 25, fuelPrice: 3.95 },
          note: "Fuel budgeting improves when you turn distance and mpg into a full-trip cost before you commit to the route.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "work-hours",
      name: "Work Hours Calculator",
      category: "other",
      blurb: "Estimate paid hours, regular hours, and overtime from a shift.",
      tags: ["hours", "shift", "work"],
    },
    fields: [
      {
        key: "startHour",
        label: "Start hour",
        format: "number",
        defaultValue: 9,
        min: 0,
        max: 23.75,
        step: 0.25,
        description: "Shift start time in 24-hour decimal format such as 9 or 13.5.",
      },
      {
        key: "endHour",
        label: "End hour",
        format: "number",
        defaultValue: 17.5,
        min: 0,
        max: 23.75,
        step: 0.25,
        description: "Shift end time in 24-hour decimal format such as 17.5 for 5:30 PM.",
      },
      {
        key: "unpaidBreakMinutes",
        label: "Unpaid break",
        format: "number",
        defaultValue: 30,
        min: 0,
        step: 5,
        description: "Unpaid break minutes that should be removed from the shift length.",
      },
    ],
    outputs: [
      {
        key: "paidHours",
        label: "Paid hours",
        format: "number",
        description: "Total paid shift hours after subtracting the unpaid break.",
      },
      {
        key: "regularHours",
        label: "Regular hours",
        format: "number",
        description: "Paid hours counted up to the eight-hour regular threshold.",
      },
      {
        key: "overtimeHours",
        label: "Overtime hours",
        format: "number",
        description: "Paid hours above the eight-hour regular threshold.",
      },
    ],
    compute: (inputs) => {
      const startHour = clampNonNegative(inputs.startHour);
      const endHour = clampNonNegative(inputs.endHour);
      const rawHours = endHour >= startHour ? endHour - startHour : endHour + 24 - startHour;
      const paidHours = clampNonNegative(rawHours - clampNonNegative(inputs.unpaidBreakMinutes) / 60);

      return {
        paidHours,
        regularHours: Math.min(paidHours, 8),
        overtimeHours: clampNonNegative(paidHours - 8),
      };
    },
    scenario: {
      fieldKey: "endHour",
      values: (inputs) =>
        Array.from(
          new Set(
            [-2, 0, 2, 4].map((delta) =>
              round(Math.min(23.75, Math.max(0, inputs.endHour + delta)), 2)
            )
          )
        ).sort((left, right) => left - right),
      tableOutputKeys: ["paidHours", "overtimeHours"],
      chartOutputKey: "paidHours",
      tableTitle: "Paid hours by shift end time",
      chartTitle: "Shift-length sensitivity",
      note: "End time usually drives the biggest difference in a shift total, so compare a standard day with a longer day before you use the estimate.",
    },
    content: {
      summaryLead:
        "The Work Hours Calculator helps hourly workers and managers estimate paid hours, regular time, and overtime from a single shift.",
      formulas: [
        "Paid Hours = Shift Length - Unpaid Break Hours",
        "Overtime Hours = Paid Hours - Regular Hours",
      ],
      assumptions: [
        "Time is entered in 24-hour decimal format and the shift uses one unpaid break entry.",
        "Overtime is modeled after eight paid hours in a shift for quick planning.",
      ],
      tips: [
        "Convert minutes into decimal time carefully so the shift total stays accurate.",
        "If your overtime rule is weekly rather than daily, use this as a shift estimate first and then total the week.",
      ],
      references: [
        "Shift planning with paid hours and overtime checks",
        "Timecard math for decimal work-hour calculations",
      ],
      examples: [
        {
          title: "Long retail shift",
          values: { startHour: 10, endHour: 20, unpaidBreakMinutes: 45 },
          note: "A work-hours estimate is more useful when you separate paid time from overtime instead of looking at the raw shift length only.",
        },
      ],
    },
  },
];

import type { ConfigurableCalculatorDefinition } from "./base";
import {
  clampNonNegative,
  scaledValues,
  shiftedValues,
} from "./base";

export const mathGrowthCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "sphere",
      name: "Sphere Calculator",
      category: "math",
      blurb: "Estimate diameter, surface area, and volume from radius.",
      tags: ["sphere", "geometry", "volume"],
    },
    fields: [
      {
        key: "radius",
        label: "Radius",
        format: "number",
        defaultValue: 6,
        min: 0,
        step: 0.1,
        description: "Radius of the sphere used in the geometry formulas.",
      },
      {
        key: "coatingCostPerArea",
        label: "Coating cost",
        format: "currency",
        defaultValue: 2.4,
        min: 0,
        step: 0.1,
        description: "Optional coating or finishing cost per square unit of surface area.",
      },
      {
        key: "fillCostPerVolume",
        label: "Fill cost",
        format: "currency",
        defaultValue: 0.35,
        min: 0,
        step: 0.01,
        description: "Optional cost per cubic unit if the sphere is filled or packed.",
      },
    ],
    outputs: [
      {
        key: "diameter",
        label: "Diameter",
        format: "number",
        description: "Full width of the sphere from one side through the center to the other.",
      },
      {
        key: "surfaceArea",
        label: "Surface area",
        format: "number",
        description: "Outside area of the full sphere.",
      },
      {
        key: "projectCost",
        label: "Project cost",
        format: "currency",
        description: "Combined surface and fill cost estimate from the selected assumptions.",
      },
    ],
    compute: (inputs) => {
      const radius = clampNonNegative(inputs.radius);
      const surfaceArea = 4 * Math.PI * radius * radius;
      const volume = (4 / 3) * Math.PI * radius ** 3;

      return {
        diameter: radius * 2,
        surfaceArea,
        projectCost:
          surfaceArea * clampNonNegative(inputs.coatingCostPerArea) +
          volume * clampNonNegative(inputs.fillCostPerVolume),
      };
    },
    scenario: {
      fieldKey: "radius",
      values: (inputs) => scaledValues(inputs.radius, [0.5, 0.75, 1, 1.25, 1.5], 0),
      tableOutputKeys: ["surfaceArea", "projectCost"],
      chartOutputKey: "projectCost",
      tableTitle: "Sphere project cost by radius",
      chartTitle: "Sphere size sensitivity",
      note: "Spheres scale quickly as radius grows, so cost and material planning should compare at least two realistic sizes.",
    },
    content: {
      summaryLead:
        "The Sphere Calculator helps students and planners estimate diameter, surface area, and a rough project cost from one radius input.",
      formulas: [
        "Surface Area = 4 * pi * radius^2",
        "Volume = 4 / 3 * pi * radius^3",
      ],
      assumptions: [
        "Radius is assumed to use the same unit across every geometry output.",
        "Project cost is optional and combines area-based coating with volume-based fill cost.",
      ],
      tips: [
        "Radius changes can move surface area and volume much faster than intuition suggests, so compare sizes before ordering material.",
        "If you already know diameter, divide it by two before entering the radius.",
      ],
      references: [
        "Sphere geometry formulas for area and volume",
        "Project estimation using surface and volume measures",
      ],
      examples: [
        {
          title: "Decorative dome estimate",
          values: { radius: 9, coatingCostPerArea: 3.1, fillCostPerVolume: 0.22 },
          note: "Sphere sizing is more useful when you compare several radius options before you commit to material or fill cost assumptions.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "cone-volume",
      name: "Cone Volume Calculator",
      category: "math",
      blurb: "Estimate cone volume, filled volume, and slant height.",
      tags: ["cone", "geometry", "volume"],
    },
    fields: [
      {
        key: "radius",
        label: "Radius",
        format: "number",
        defaultValue: 4,
        min: 0,
        step: 0.1,
        description: "Radius of the circular base of the cone.",
      },
      {
        key: "height",
        label: "Height",
        format: "number",
        defaultValue: 10,
        min: 0,
        step: 0.1,
        description: "Vertical height of the cone from base center to the tip.",
      },
      {
        key: "fillPercent",
        label: "Fill percent",
        format: "percent",
        defaultValue: 60,
        min: 0,
        max: 100,
        step: 1,
        description: "Percentage of the cone volume considered filled or occupied.",
      },
    ],
    outputs: [
      {
        key: "volume",
        label: "Full volume",
        format: "number",
        description: "Total volume of the cone from the selected radius and height.",
      },
      {
        key: "filledVolume",
        label: "Filled volume",
        format: "number",
        description: "Volume occupied after applying the selected fill percentage.",
      },
      {
        key: "slantHeight",
        label: "Slant height",
        format: "number",
        description: "Slanted edge length from the cone tip to the base edge.",
      },
    ],
    compute: (inputs) => {
      const radius = clampNonNegative(inputs.radius);
      const height = clampNonNegative(inputs.height);
      const volume = (Math.PI * radius * radius * height) / 3;

      return {
        volume,
        filledVolume: volume * (clampNonNegative(inputs.fillPercent) / 100),
        slantHeight: Math.sqrt(radius ** 2 + height ** 2),
      };
    },
    scenario: {
      fieldKey: "height",
      values: (inputs) => shiftedValues(inputs.height, [-4, -2, 0, 2, 4], 0),
      tableOutputKeys: ["volume", "slantHeight"],
      chartOutputKey: "volume",
      tableTitle: "Cone volume by height",
      chartTitle: "Cone volume sensitivity",
      note: "Cone volume depends heavily on height, so compare a shorter case with a taller case before you translate the result into material or capacity planning.",
    },
    content: {
      summaryLead:
        "The Cone Volume Calculator helps you estimate full cone volume, partial fill volume, and slant height from a simple radius and height input.",
      formulas: [
        "Volume = pi * radius^2 * height / 3",
        "Slant Height = sqrt(radius^2 + height^2)",
      ],
      assumptions: [
        "The cone is treated as a right circular cone with one flat circular base.",
        "Fill percent is modeled as a direct share of total volume for quick planning.",
      ],
      tips: [
        "Keep radius and height in the same unit so the outputs stay coherent.",
        "Use the slant height when you need material length along the side of the cone, not only capacity.",
      ],
      references: [
        "Cone geometry formulas for volume and slant height",
        "Capacity planning with conical shapes",
      ],
      examples: [
        {
          title: "Conical hopper estimate",
          values: { radius: 5, height: 14, fillPercent: 70 },
          note: "Conical volume estimates are easier to use when you compare total capacity with the realistic fill level you expect in practice.",
        },
      ],
    },
  },
];

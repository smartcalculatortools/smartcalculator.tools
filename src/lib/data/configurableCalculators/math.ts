import type { ConfigurableCalculatorDefinition } from "./base";
import { clampNonNegative, safeDivide, shiftedValues } from "./base";

export const mathCalculatorDefinitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: {
      slug: "average",
      name: "Average Calculator",
      category: "math",
      blurb: "Find the mean and the score needed to hit a target average.",
      tags: ["mean", "statistics", "scores"],
    },
    fields: [
      {
        key: "count",
        label: "Current count",
        format: "number",
        defaultValue: 5,
        min: 1,
        step: 1,
        description: "Number of values currently included in the running average.",
      },
      {
        key: "sum",
        label: "Current sum",
        format: "number",
        defaultValue: 420,
        min: 0,
        step: 1,
        description: "Sum of the values already included in the average.",
      },
      {
        key: "targetAverage",
        label: "Target average",
        format: "number",
        defaultValue: 90,
        min: 0,
        step: 0.5,
        description: "Average you want to reach after adding one more value.",
      },
    ],
    outputs: [
      {
        key: "mean",
        label: "Current mean",
        format: "number",
        description: "Average of the current set based on count and sum.",
      },
      {
        key: "nextValueNeeded",
        label: "Next value needed",
        format: "number",
        description: "Single next value required to reach the target average.",
      },
      {
        key: "targetTotal",
        label: "Target total",
        format: "number",
        description: "Total sum needed after the next value is added.",
      },
    ],
    compute: (inputs) => {
      const mean = safeDivide(clampNonNegative(inputs.sum), clampNonNegative(inputs.count));
      const targetTotal =
        clampNonNegative(inputs.targetAverage) * (clampNonNegative(inputs.count) + 1);
      return {
        mean,
        nextValueNeeded: targetTotal - clampNonNegative(inputs.sum),
        targetTotal,
      };
    },
    scenario: {
      fieldKey: "targetAverage",
      values: (inputs) => shiftedValues(inputs.targetAverage, [-10, -5, 0, 5, 10], 0),
      tableOutputKeys: ["nextValueNeeded", "targetTotal"],
      chartOutputKey: "nextValueNeeded",
      tableTitle: "Required next value by target average",
      chartTitle: "Target pressure by average goal",
      note: "A target average can require an unrealistic next value if the current dataset is already too low, so use the comparison table as a sanity check.",
    },
    content: {
      summaryLead:
        "The Average Calculator helps you compute a current mean and shows what one additional value would need to be in order to hit a target average.",
      formulas: [
        "Mean = Current Sum ÷ Current Count",
        "Next Value Needed = Target Average × (Count + 1) - Current Sum",
      ],
      assumptions: [
        "The target is evaluated after adding exactly one more value.",
        "All values are weighted equally in the average.",
      ],
      tips: [
        "If the required next value looks extreme, your target average may not be realistic.",
        "Use this tool for grades, KPIs, and any simple equally weighted average.",
      ],
      references: [
        "Arithmetic mean and target average formulas",
        "Score planning with running averages",
      ],
      examples: [
        {
          title: "Grade planning example",
          values: { count: 4, sum: 334, targetAverage: 88 },
          note: "Target average math is useful because it shows whether the next score needed is achievable before the next assessment arrives.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "ratio-split",
      name: "Ratio Split Calculator",
      category: "math",
      blurb: "Split any total into two ratio-based parts.",
      tags: ["ratio", "share", "allocation"],
    },
    fields: [
      {
        key: "ratioA",
        label: "Ratio A",
        format: "number",
        defaultValue: 3,
        min: 0,
        step: 0.5,
        description: "First part of the ratio used in the allocation.",
      },
      {
        key: "ratioB",
        label: "Ratio B",
        format: "number",
        defaultValue: 2,
        min: 0,
        step: 0.5,
        description: "Second part of the ratio used in the allocation.",
      },
      {
        key: "totalAmount",
        label: "Total amount",
        format: "number",
        defaultValue: 500,
        min: 0,
        step: 1,
        description: "Total amount that will be divided by the selected ratio.",
      },
    ],
    outputs: [
      {
        key: "partA",
        label: "Part A",
        format: "number",
        description: "Amount allocated to the first side of the ratio.",
      },
      {
        key: "partB",
        label: "Part B",
        format: "number",
        description: "Amount allocated to the second side of the ratio.",
      },
      {
        key: "shareA",
        label: "A share",
        format: "percent",
        description: "Percentage share allocated to the first side of the ratio.",
      },
    ],
    compute: (inputs) => {
      const totalRatio = clampNonNegative(inputs.ratioA) + clampNonNegative(inputs.ratioB);
      const partA =
        clampNonNegative(inputs.totalAmount) *
        safeDivide(clampNonNegative(inputs.ratioA), totalRatio);
      const partB =
        clampNonNegative(inputs.totalAmount) *
        safeDivide(clampNonNegative(inputs.ratioB), totalRatio);
      return {
        partA,
        partB,
        shareA: safeDivide(partA, clampNonNegative(inputs.totalAmount)) * 100,
      };
    },
    scenario: {
      fieldKey: "totalAmount",
      values: (inputs) => shiftedValues(inputs.totalAmount, [-250, -100, 0, 250, 500], 0),
      tableOutputKeys: ["partA", "partB"],
      chartOutputKey: "partA",
      tableTitle: "Split by total amount",
      chartTitle: "Part A as total grows",
      note: "Ratio splits are linear, so the parts scale directly with the total amount while the ratio itself stays constant.",
    },
    content: {
      summaryLead:
        "The Ratio Split Calculator divides a total into two parts using any ratio, which is useful for budgets, profit sharing, and weighted allocations.",
      formulas: [
        "Part A = Total × Ratio A ÷ (Ratio A + Ratio B)",
        "Part B = Total × Ratio B ÷ (Ratio A + Ratio B)",
      ],
      assumptions: [
        "The ratio uses only two parts in this calculator.",
        "Both sides of the ratio are treated as non-negative shares.",
      ],
      tips: [
        "Simplify the ratio mentally if you want a quick sense check, but the result stays the same.",
        "Use this for budgets, inheritance planning, and any linear split problem.",
      ],
      references: [
        "Ratio and proportion allocation formulas",
        "Weighted split calculations in basic math",
      ],
      examples: [
        {
          title: "Profit share allocation",
          values: { ratioA: 5, ratioB: 3, totalAmount: 2400 },
          note: "Ratio splits are useful because they turn a percentage-style agreement into exact amounts once the final total is known.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "circle",
      name: "Circle Calculator",
      category: "math",
      blurb: "Calculate circumference, area, and a sector area.",
      tags: ["geometry", "area", "circumference"],
    },
    fields: [
      {
        key: "radius",
        label: "Radius",
        format: "number",
        defaultValue: 8,
        min: 0,
        step: 0.1,
        description: "Radius of the circle used for all geometry outputs.",
      },
      {
        key: "sectorPercent",
        label: "Sector percent",
        format: "percent",
        defaultValue: 25,
        min: 0,
        step: 1,
        description: "Percentage of the full circle used for the sector area.",
      },
    ],
    outputs: [
      {
        key: "diameter",
        label: "Diameter",
        format: "number",
        description: "Full width of the circle from edge to edge through the center.",
      },
      {
        key: "circumference",
        label: "Circumference",
        format: "number",
        description: "Distance around the full circle.",
      },
      {
        key: "area",
        label: "Area",
        format: "number",
        description: "Area covered by the full circle.",
      },
      {
        key: "sectorArea",
        label: "Sector area",
        format: "number",
        description: "Area covered by the selected sector percentage.",
      },
    ],
    compute: (inputs) => {
      const radius = clampNonNegative(inputs.radius);
      const area = Math.PI * radius * radius;
      return {
        diameter: radius * 2,
        circumference: 2 * Math.PI * radius,
        area,
        sectorArea: (area * clampNonNegative(inputs.sectorPercent)) / 100,
      };
    },
    scenario: {
      fieldKey: "radius",
      values: (inputs) => shiftedValues(inputs.radius, [-3, -1, 0, 2, 4], 0),
      tableOutputKeys: ["circumference", "area"],
      chartOutputKey: "area",
      tableTitle: "Circle measures by radius",
      chartTitle: "Area growth by radius",
      note: "Area grows with the square of the radius, so even small radius changes can create large area differences.",
    },
    content: {
      summaryLead:
        "The Circle Calculator gives you diameter, circumference, full area, and sector area from a radius so you can solve everyday geometry tasks quickly.",
      formulas: [
        "Circumference = 2 × π × Radius",
        "Area = π × Radius²",
      ],
      assumptions: [
        "The shape is a perfect circle.",
        "Sector area uses the selected percentage of the full circle.",
      ],
      tips: [
        "Radius changes affect area much faster than circumference.",
        "Use sector area when you only need part of the full circle.",
      ],
      references: [
        "Basic circle geometry formulas",
        "Sector area calculations in elementary geometry",
      ],
      examples: [
        {
          title: "Round table sizing",
          values: { radius: 6, sectorPercent: 50 },
          note: "Circle formulas are simple but easy to misread if diameter and radius get mixed up, so keep the unit and input type clear.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "rectangle",
      name: "Rectangle Calculator",
      category: "math",
      blurb: "Calculate area, perimeter, and material cost for a rectangle.",
      tags: ["geometry", "area", "perimeter"],
    },
    fields: [
      {
        key: "length",
        label: "Length",
        format: "number",
        defaultValue: 12,
        min: 0,
        step: 0.1,
        description: "Long side of the rectangle.",
      },
      {
        key: "width",
        label: "Width",
        format: "number",
        defaultValue: 8,
        min: 0,
        step: 0.1,
        description: "Short side of the rectangle.",
      },
      {
        key: "costPerUnit",
        label: "Cost per sq unit",
        format: "currency",
        defaultValue: 4.5,
        min: 0,
        step: 0.1,
        description: "Cost applied to each square unit of area.",
      },
    ],
    outputs: [
      {
        key: "area",
        label: "Area",
        format: "number",
        description: "Total area of the rectangle.",
      },
      {
        key: "perimeter",
        label: "Perimeter",
        format: "number",
        description: "Total distance around the rectangle.",
      },
      {
        key: "projectCost",
        label: "Project cost",
        format: "currency",
        description: "Area multiplied by the cost per square unit.",
      },
    ],
    compute: (inputs) => {
      const area = clampNonNegative(inputs.length) * clampNonNegative(inputs.width);
      return {
        area,
        perimeter: 2 * (clampNonNegative(inputs.length) + clampNonNegative(inputs.width)),
        projectCost: area * clampNonNegative(inputs.costPerUnit),
      };
    },
    scenario: {
      fieldKey: "length",
      values: (inputs) => shiftedValues(inputs.length, [-4, -2, 0, 2, 4], 0),
      tableOutputKeys: ["area", "projectCost"],
      chartOutputKey: "projectCost",
      tableTitle: "Rectangle cost by length",
      chartTitle: "Project cost by length",
      note: "When width and unit cost stay fixed, area and total project cost move linearly with length.",
    },
    content: {
      summaryLead:
        "The Rectangle Calculator gives you area, perimeter, and a rough material cost so you can size rooms, surfaces, or fabrication jobs quickly.",
      formulas: [
        "Area = Length × Width",
        "Perimeter = 2 × (Length + Width)",
      ],
      assumptions: [
        "The shape is a rectangle with straight sides and right angles.",
        "Cost per square unit is constant across the full area.",
      ],
      tips: [
        "Use the same unit for both length and width.",
        "Add waste separately if the material installation will require cuts.",
      ],
      references: [
        "Basic rectangle geometry formulas",
        "Area-based material cost estimation",
      ],
      examples: [
        {
          title: "Flooring estimate",
          values: { length: 14, width: 9, costPerUnit: 5.2 },
          note: "Area calculators are useful for planning, but many real projects still need a waste allowance before ordering material.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "cylinder-volume",
      name: "Cylinder Volume Calculator",
      category: "math",
      blurb: "Calculate cylinder volume, lateral area, and filled volume.",
      tags: ["geometry", "volume", "surface"],
    },
    fields: [
      {
        key: "radius",
        label: "Radius",
        format: "number",
        defaultValue: 4,
        min: 0,
        step: 0.1,
        description: "Radius of the circular base of the cylinder.",
      },
      {
        key: "height",
        label: "Height",
        format: "number",
        defaultValue: 10,
        min: 0,
        step: 0.1,
        description: "Height of the cylinder from base to top.",
      },
      {
        key: "fillPercent",
        label: "Fill percent",
        format: "percent",
        defaultValue: 75,
        min: 0,
        step: 1,
        description: "Percentage of the cylinder volume that is filled.",
      },
    ],
    outputs: [
      {
        key: "volume",
        label: "Full volume",
        format: "number",
        description: "Total internal volume of the cylinder.",
      },
      {
        key: "lateralArea",
        label: "Lateral area",
        format: "number",
        description: "Curved outer surface area of the cylinder.",
      },
      {
        key: "filledVolume",
        label: "Filled volume",
        format: "number",
        description: "Amount of volume occupied at the selected fill percentage.",
      },
    ],
    compute: (inputs) => {
      const radius = clampNonNegative(inputs.radius);
      const height = clampNonNegative(inputs.height);
      const volume = Math.PI * radius * radius * height;
      return {
        volume,
        lateralArea: 2 * Math.PI * radius * height,
        filledVolume: (volume * clampNonNegative(inputs.fillPercent)) / 100,
      };
    },
    scenario: {
      fieldKey: "height",
      values: (inputs) => shiftedValues(inputs.height, [-4, -2, 0, 2, 4], 0),
      tableOutputKeys: ["volume", "filledVolume"],
      chartOutputKey: "volume",
      tableTitle: "Cylinder volume by height",
      chartTitle: "Volume growth by height",
      note: "With radius fixed, volume grows linearly with height, which makes height sensitivity easy to inspect in the scenario view.",
    },
    content: {
      summaryLead:
        "The Cylinder Volume Calculator helps you estimate full volume, curved surface area, and filled volume for tanks, pipes, and packaging geometry.",
      formulas: [
        "Volume = π × Radius² × Height",
        "Lateral Area = 2 × π × Radius × Height",
      ],
      assumptions: [
        "The cylinder has a perfect circular base and uniform height.",
        "Fill percent is modeled as a direct share of the total volume.",
      ],
      tips: [
        "Keep all dimensions in the same unit before multiplying.",
        "If you need total surface area, add the two circular ends separately.",
      ],
      references: [
        "Cylinder geometry formulas",
        "Volume calculations for tanks and containers",
      ],
      examples: [
        {
          title: "Tank fill estimate",
          values: { radius: 3.5, height: 12, fillPercent: 60 },
          note: "Volume formulas are straightforward, but practical tank planning still needs the right unit conversions and fill limits.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "slope",
      name: "Slope Calculator",
      category: "math",
      blurb: "Calculate slope percent, angle, and line length.",
      tags: ["geometry", "slope", "angle"],
    },
    fields: [
      {
        key: "rise",
        label: "Rise",
        format: "number",
        defaultValue: 4,
        step: 0.1,
        description: "Vertical change between two points.",
      },
      {
        key: "run",
        label: "Run",
        format: "number",
        defaultValue: 12,
        step: 0.1,
        description: "Horizontal change between two points.",
      },
    ],
    outputs: [
      {
        key: "slopeRatio",
        label: "Slope ratio",
        format: "number",
        description: "Rise divided by run as a simple numeric slope ratio.",
      },
      {
        key: "slopePercent",
        label: "Slope percent",
        format: "percent",
        description: "Slope shown as a percentage grade.",
      },
      {
        key: "angleDegrees",
        label: "Angle degrees",
        format: "number",
        description: "Angle of the line above the horizontal in degrees.",
      },
      {
        key: "lineLength",
        label: "Line length",
        format: "number",
        description: "Straight-line distance between the two points.",
      },
    ],
    compute: (inputs) => {
      const rise = inputs.rise;
      const run = inputs.run;
      return {
        slopeRatio: safeDivide(rise, run),
        slopePercent: safeDivide(rise, run) * 100,
        angleDegrees: (Math.atan2(rise, run) * 180) / Math.PI,
        lineLength: Math.sqrt(rise * rise + run * run),
      };
    },
    scenario: {
      fieldKey: "rise",
      values: (inputs) => shiftedValues(inputs.rise, [-2, -1, 0, 1, 2]),
      tableOutputKeys: ["slopePercent", "angleDegrees"],
      chartOutputKey: "slopePercent",
      tableTitle: "Slope by rise",
      chartTitle: "Grade change by rise",
      note: "Slope percent and angle can move quickly when run is short, so keep the same run value when comparing scenarios.",
    },
    content: {
      summaryLead:
        "The Slope Calculator converts rise and run into a slope ratio, grade percentage, angle, and line length for geometry, drafting, and practical layout work.",
      formulas: [
        "Slope Ratio = Rise ÷ Run",
        "Angle = arctangent(Rise ÷ Run)",
      ],
      assumptions: [
        "Rise and run are measured in the same unit system.",
        "The line is straight between the two points.",
      ],
      tips: [
        "Use grade percent when comparing ramps or roads and angle when comparing geometry layouts.",
        "A very small run can make percent grade explode, so double-check that input first.",
      ],
      references: [
        "Slope, grade, and angle formulas",
        "Right-triangle relations for layout geometry",
      ],
      examples: [
        {
          title: "Ramp layout check",
          values: { rise: 1.2, run: 12 },
          note: "Slope is easy to calculate, but choosing the right representation—ratio, percent, or degrees—makes the result much more useful in practice.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "distance-between-points",
      name: "Distance Between Points Calculator",
      category: "math",
      blurb: "Find delta x, delta y, and straight-line distance.",
      tags: ["coordinate", "distance", "geometry"],
    },
    fields: [
      {
        key: "x1",
        label: "X1",
        format: "number",
        defaultValue: 2,
        step: 0.1,
        description: "X-coordinate of the first point.",
      },
      {
        key: "y1",
        label: "Y1",
        format: "number",
        defaultValue: 3,
        step: 0.1,
        description: "Y-coordinate of the first point.",
      },
      {
        key: "x2",
        label: "X2",
        format: "number",
        defaultValue: 11,
        step: 0.1,
        description: "X-coordinate of the second point.",
      },
      {
        key: "y2",
        label: "Y2",
        format: "number",
        defaultValue: 9,
        step: 0.1,
        description: "Y-coordinate of the second point.",
      },
    ],
    outputs: [
      {
        key: "deltaX",
        label: "Delta X",
        format: "number",
        description: "Horizontal difference between the two points.",
      },
      {
        key: "deltaY",
        label: "Delta Y",
        format: "number",
        description: "Vertical difference between the two points.",
      },
      {
        key: "distance",
        label: "Distance",
        format: "number",
        description: "Straight-line distance between the two coordinates.",
      },
    ],
    compute: (inputs) => {
      const deltaX = inputs.x2 - inputs.x1;
      const deltaY = inputs.y2 - inputs.y1;
      return {
        deltaX,
        deltaY,
        distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
      };
    },
    scenario: {
      fieldKey: "x2",
      values: (inputs) => shiftedValues(inputs.x2, [-4, -2, 0, 2, 4]),
      tableOutputKeys: ["deltaX", "distance"],
      chartOutputKey: "distance",
      tableTitle: "Distance by second X coordinate",
      chartTitle: "Distance sensitivity",
      note: "Holding the other coordinates fixed makes it easy to see how a moving endpoint changes the straight-line distance.",
    },
    content: {
      summaryLead:
        "The Distance Between Points Calculator finds the horizontal change, vertical change, and straight-line distance between two coordinate points on a plane.",
      formulas: [
        "Delta X = X2 - X1 and Delta Y = Y2 - Y1",
        "Distance = square root of (Delta X² + Delta Y²)",
      ],
      assumptions: [
        "The points are placed on a flat two-dimensional coordinate plane.",
        "Distance is measured as straight-line Euclidean distance.",
      ],
      tips: [
        "Check the coordinate signs carefully before interpreting the distance.",
        "Delta values can be negative even when the final distance is positive.",
      ],
      references: [
        "Coordinate geometry distance formula",
        "Euclidean distance on a two-dimensional plane",
      ],
      examples: [
        {
          title: "Coordinate grid example",
          values: { x1: -1, y1: 4, x2: 7, y2: -2 },
          note: "The straight-line formula is standard in geometry, but keeping the signed deltas visible helps when you also need direction or slope.",
        },
      ],
    },
  },
  {
    calculator: {
      slug: "proportion",
      name: "Proportion Calculator",
      category: "math",
      blurb: "Solve a missing value in a simple proportion.",
      tags: ["ratio", "algebra", "scale"],
    },
    fields: [
      {
        key: "a",
        label: "A",
        format: "number",
        defaultValue: 4,
        step: 0.1,
        description: "First known value on the left side of the proportion.",
      },
      {
        key: "b",
        label: "B",
        format: "number",
        defaultValue: 10,
        step: 0.1,
        description: "Second known value paired with A in the proportion.",
      },
      {
        key: "c",
        label: "C",
        format: "number",
        defaultValue: 6,
        step: 0.1,
        description: "Third known value used to solve the missing fourth term.",
      },
    ],
    outputs: [
      {
        key: "x",
        label: "Solved X",
        format: "number",
        description: "Missing fourth value that keeps the proportion balanced.",
      },
      {
        key: "scaleFactor",
        label: "Scale factor",
        format: "number",
        description: "Multiplier from A to B within the proportion.",
      },
      {
        key: "crossProduct",
        label: "Cross product",
        format: "number",
        description: "Shared cross-product value after solving the proportion.",
      },
    ],
    compute: (inputs) => {
      const scaleFactor = safeDivide(inputs.b, inputs.a);
      return {
        x: inputs.c * scaleFactor,
        scaleFactor,
        crossProduct: inputs.b * inputs.c,
      };
    },
    scenario: {
      fieldKey: "c",
      values: (inputs) => shiftedValues(inputs.c, [-3, -1, 0, 2, 4]),
      tableOutputKeys: ["x", "scaleFactor"],
      chartOutputKey: "x",
      tableTitle: "Solved value by C",
      chartTitle: "Proportion result sensitivity",
      note: "Proportions scale linearly, so if A and B stay fixed the solved value moves directly with C.",
    },
    content: {
      summaryLead:
        "The Proportion Calculator solves a missing value in a four-term proportion and also shows the scale factor connecting the known terms.",
      formulas: [
        "A : B = C : X, so X = B × C ÷ A",
        "Cross Products match when the proportion is balanced",
      ],
      assumptions: [
        "A cannot be zero when solving the proportion this way.",
        "All four terms belong to the same proportional relationship.",
      ],
      tips: [
        "Use proportions for scale drawings, recipes, and unit-rate style problems.",
        "If the answer looks off, check whether the terms were placed in the right order.",
      ],
      references: [
        "Proportion solving by cross multiplication",
        "Scale-factor reasoning in elementary algebra",
      ],
      examples: [
        {
          title: "Recipe scaling example",
          values: { a: 2, b: 5, c: 8 },
          note: "Proportion solving is quick, but getting the term order right is what usually determines whether the answer makes sense.",
        },
      ],
    },
  },
];

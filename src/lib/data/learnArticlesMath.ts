import type { LearnArticle } from "./learnArticlesShared";

export const mathLearnArticles: LearnArticle[] = [
  {
    categoryId: "math",
    slug: "choose-the-right-geometry-calculator",
    targetQuery: "which geometry calculator do i need",
    title: "How to Choose the Right Geometry Calculator for Area, Volume, or Sides",
    summary:
      "Use circle, rectangle, triangle, cylinder volume, and sphere calculators based on the exact shape and measurement you already know.",
    intro:
      "Geometry questions get slower when the wrong formula is chosen first. The faster approach is to identify the shape, decide whether the unknown is a side, area, or volume, and then open the calculator that matches that structure. This guide helps you choose the right geometry tool on the site before you start entering numbers.",
    calculatorSlugs: ["circle", "rectangle", "triangle", "cylinder-volume", "sphere"],
    sections: [
      {
        title: "Start by naming the shape and the missing value",
        body:
          "Most geometry mistakes happen before the arithmetic starts. If the problem mixes up shape type or uses the wrong dimension, even a correct calculation will produce the wrong answer.",
        bullets: [
          "Use Circle Calculator when the question revolves around radius, diameter, circumference, or area.",
          "Use Rectangle or Triangle tools when the task is a flat two-dimensional measurement.",
          "Use Cylinder Volume or Sphere when the question asks for space inside a solid shape.",
        ],
      },
      {
        title: "Separate area questions from volume questions",
        body:
          "Area and volume look similar in word problems, but they answer different physical questions. Area measures surface coverage while volume measures interior capacity.",
        bullets: [
          "Use area-oriented calculators for flooring, paint coverage, or land-measurement style problems.",
          "Use volume calculators for tanks, containers, pipes, or storage capacity estimates.",
          "Check the unit style before solving so square units and cubic units do not get mixed together.",
        ],
      },
      {
        title: "Use the simplest measurement set that fits the problem",
        body:
          "A geometry problem becomes easier when you enter only the dimensions that directly belong to the shape. Translating every question into a more complex form usually adds avoidable errors.",
        bullets: [
          "Keep all dimensions in the same unit before entering them.",
          "Sketch the shape quickly if the wording feels ambiguous.",
          "Re-run the problem with rounded values only after you confirm the exact setup works.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I know whether to use area or volume?",
        answer:
          "Use area when the problem asks how much surface is covered, and use volume when it asks how much space a solid can hold.",
      },
      {
        question: "Why do geometry answers often come out obviously wrong?",
        answer:
          "The usual reason is a setup error such as choosing the wrong shape, mixing units, or solving for area when the question was really about volume.",
      },
    ],
  },
  {
    categoryId: "math",
    slug: "use-exponents-logs-and-quadratics-correctly",
    targetQuery: "when to use exponent log quadratic calculator",
    title: "When to Use Exponents, Logs, and Quadratics in the Same Problem",
    summary:
      "Use exponent, log, quadratic, scientific, and Pythagorean calculators when algebra problems change form across growth, powers, and unknown-variable steps.",
    intro:
      "Students and everyday users often know the formulas but still choose the wrong calculator because the problem changes shape midway through. Growth problems can turn into logarithms, equation solving can turn quadratic, and mixed calculations often need a scientific input step first. This guide shows when each math tool becomes the right one.",
    calculatorSlugs: ["exponent", "log", "quadratic", "scientific", "pythagorean"],
    sections: [
      {
        title: "Use exponents when growth is applied directly",
        body:
          "Exponent tools are best when the question already gives the base, power, or repeated growth structure. They are less useful once the exponent itself becomes the unknown.",
        bullets: [
          "Use Exponent Calculator for direct powers, compound growth, or repeated multiplication structure.",
          "Move to Log when the missing value is the exponent rather than the final result.",
          "Use Scientific Calculator first if the problem mixes several operations before the power step.",
        ],
      },
      {
        title: "Use logarithms when you need to solve backward",
        body:
          "Logs are the backward version of exponent logic. They help when the result is known and the question is how many periods, powers, or orders of magnitude are required.",
        bullets: [
          "Use Log Calculator when the unknown is the exponent or the scale step.",
          "Treat logs as a solving tool, not just a special formula for homework.",
          "Check whether the problem is really inverse growth before opening the log tool.",
        ],
      },
      {
        title: "Use quadratics when the equation forms a curve",
        body:
          "Quadratic tools matter when the unknown sits inside a squared term and the equation produces two possible roots or a curved relationship. That is a different problem from simple exponent evaluation.",
        bullets: [
          "Use Quadratic Calculator when the equation is in the form of a squared-variable expression.",
          "Use Pythagorean Calculator for right-triangle cases instead of manually rebuilding the square relationship every time.",
          "Interpret both roots before accepting one answer as valid for the context.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between an exponent problem and a quadratic problem?",
        answer:
          "An exponent problem usually applies a power directly, while a quadratic problem solves an equation that includes a squared variable and often produces two roots.",
      },
      {
        question: "When should I switch from exponent to log?",
        answer:
          "Switch when the exponent is the unknown. Logs help solve backward from the known result to the missing power or number of periods.",
      },
    ],
  },
  {
    categoryId: "math",
    slug: "understand-averages-and-variation",
    targetQuery: "average mean median mode standard deviation guide",
    title: "How to Read Averages and Variation Without Hiding the Real Pattern",
    summary:
      "Use average, mean median mode, standard deviation, probability, and proportion calculators to describe both the center and the spread of a data set.",
    intro:
      "A single average can make messy data look more certain than it really is. Good analysis usually needs two questions answered together: what is typical, and how widely do the results vary around that center? This guide shows how to combine the statistics tools on the site so you can describe a data set with more than one convenient number.",
    calculatorSlugs: ["average", "mean-median-mode", "standard-deviation", "probability", "proportion"],
    sections: [
      {
        title: "Choose the center measure that matches the data shape",
        body:
          "Average is useful, but it is not always the most honest center. Skewed data, repeated values, and outliers can make mean, median, and mode tell different stories.",
        bullets: [
          "Use Average for a quick center when the data is fairly balanced.",
          "Use Mean Median Mode when you need to compare several center measures side by side.",
          "Treat a large gap between mean and median as a sign that the distribution may be skewed.",
        ],
      },
      {
        title: "Add variation so the average is not misleading",
        body:
          "Two groups can share the same mean while behaving very differently. Standard deviation helps show whether the values cluster tightly or spread out widely around the center.",
        bullets: [
          "Use Standard Deviation when consistency or volatility matters as much as the average.",
          "Compare spread before claiming that one group is more predictable than another.",
          "Keep units consistent so the variation number stays interpretable.",
        ],
      },
      {
        title: "Use probability and proportion for decision context",
        body:
          "Descriptive statistics explain the data you already have, while probability and proportion help frame how likely or how large a share certain outcomes are.",
        bullets: [
          "Use Probability when the question is about chance or outcome likelihood.",
          "Use Proportion when you want the share of one category inside a larger total.",
          "Do not treat proportion or probability as replacements for variation in numeric data.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is the average alone not enough?",
        answer:
          "Because it can hide whether the data points are tightly grouped or widely spread out. A typical value without variation can be misleading.",
      },
      {
        question: "When should I use median instead of mean?",
        answer:
          "Use median when the data has outliers or a skewed shape that would pull the mean away from what feels typical in the middle of the set.",
      },
    ],
  },
];

import type { LearnArticle } from "./learnArticlesShared";

export const otherLearnArticles: LearnArticle[] = [
  {
    categoryId: "other",
    slug: "calculate-shift-lengths-and-timesheets",
    targetQuery: "how to calculate work hours and shifts",
    title: "How to Calculate Shift Lengths, Breaks, and Weekly Timesheets Correctly",
    summary:
      "Use hours, work hours, time duration, and time calculators to handle shifts, unpaid breaks, and weekly payroll totals without manual counting errors.",
    intro:
      "Time tracking gets messy when start times, breaks, overnight shifts, and weekly totals are all calculated separately by hand. A cleaner approach is to decide whether the question is about one shift, total work hours, or clock duration first, then use the matching calculator. This guide shows how to structure that workflow so the totals stay consistent.",
    calculatorSlugs: ["hours", "work-hours", "time-duration", "time"],
    sections: [
      {
        title: "Separate one-shift math from weekly payroll math",
        body:
          "A single shift calculation is not the same as a weekly timesheet calculation. The first focuses on start, end, and breaks, while the second needs totals across multiple days and sometimes multiple pay rules.",
        bullets: [
          "Use Hours or Time Duration for a single start-and-end shift question.",
          "Use Work Hours when the goal is a broader weekly or payroll-style total.",
          "Keep shift-level corrections separate before you roll them into the full week.",
        ],
      },
      {
        title: "Handle breaks and overnight shifts explicitly",
        body:
          "Most time-entry mistakes come from forgetting unpaid breaks or assuming that every shift starts and ends on the same date. Overnight work needs a calculator that respects the clock crossing midnight.",
        bullets: [
          "Subtract unpaid breaks as their own step instead of estimating them mentally.",
          "Check overnight shifts with exact start and end times rather than rounded blocks.",
          "Use the same time format throughout the calculation to avoid AM and PM confusion.",
        ],
      },
      {
        title: "Save a repeatable structure for future weeks",
        body:
          "The value of a timesheet workflow is not only this week's total. It is reducing the same manual error from every future schedule, invoice, or payroll review.",
        bullets: [
          "Keep a consistent rounding rule if your workplace or client requires one.",
          "Verify one day's total before copying the method across the whole week.",
          "Store the final daily totals so later edits do not force a full recount.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which calculator is best for an overnight shift?",
        answer:
          "Use a time or duration calculator that can handle a start time before midnight and an end time after midnight, then subtract any unpaid breaks separately.",
      },
      {
        question: "Why do weekly timesheets often end up wrong?",
        answer:
          "Because small errors in break handling, AM and PM entry, or daily rounding get repeated across several shifts and compound in the final total.",
      },
    ],
  },
  {
    categoryId: "other",
    slug: "estimate-trip-time-speed-and-fuel-cost",
    targetQuery: "trip time and fuel cost calculator",
    title: "How to Estimate Trip Time, Average Speed, and Fuel Cost Together",
    summary:
      "Use speed, fuel cost, time, and hours calculators to compare route timing and travel expense with the same assumptions.",
    intro:
      "Trip planning usually gets split into separate guesses: how long the drive will take, how fast the route is likely to be, and how much the fuel bill will cost. That separation causes planning drift. This guide shows how to connect the travel calculators on the site so timing and cost are built from the same route assumptions.",
    calculatorSlugs: ["speed", "fuel-cost", "time", "hours"],
    sections: [
      {
        title: "Start with distance and realistic average speed",
        body:
          "Trip estimates improve when the speed assumption matches the actual route instead of the best-case number from an empty road. That average speed becomes the foundation for the rest of the calculation.",
        bullets: [
          "Use Speed Calculator when the missing value is travel time, pace, or average speed over distance.",
          "Choose a realistic average instead of the posted maximum if traffic or stops are likely.",
          "Keep route distance fixed while you compare different speed assumptions.",
        ],
      },
      {
        title: "Convert time into a schedule, not just a number",
        body:
          "A useful travel estimate should answer arrival and departure questions, not only show a raw duration. Time and hours tools help translate the route math into a practical plan.",
        bullets: [
          "Use Time or Hours tools when you need to anchor the trip to a departure or arrival clock time.",
          "Add buffer time for rest stops, loading, or traffic if the schedule matters.",
          "Test a slower scenario so the schedule survives normal delays.",
        ],
      },
      {
        title: "Attach fuel cost to the same route assumptions",
        body:
          "Cost planning becomes more accurate when fuel is calculated from the same distance and driving assumptions used in the timing estimate. Separate guesses usually create false confidence.",
        bullets: [
          "Use Fuel Cost Calculator after distance and route assumptions are already set.",
          "Check a higher fuel-price scenario if the trip budget is tight.",
          "Compare round-trip cost, not only the outbound leg, when planning total travel spend.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I estimate travel time from the speed limit?",
        answer:
          "No. Average speed is usually lower than the posted limit once traffic, stops, and route conditions are included.",
      },
      {
        question: "Why should fuel cost and trip time use the same assumptions?",
        answer:
          "Because both depend on the same route distance and driving pattern. If they are estimated separately, the final plan often mixes incompatible numbers.",
      },
    ],
  },
  {
    categoryId: "other",
    slug: "plan-grades-and-gpa-without-guessing",
    targetQuery: "how to calculate grades and gpa",
    title: "How to Plan Grades and GPA Targets Without Guessing the Outcome",
    summary:
      "Use grade and GPA calculators to convert assignment scores and course weights into a realistic target before the term ends.",
    intro:
      "Students often wait until the end of a course to see what grade they earned, even though the better use of a calculator is earlier. Grade and GPA tools are most useful when they help you identify what scores are still needed and where the biggest improvement leverage sits. This guide shows how to use them as planning tools rather than postmortem tools.",
    calculatorSlugs: ["grade", "gpa"],
    sections: [
      {
        title: "Use the grade calculator to solve the current course",
        body:
          "Course-level grade questions are usually about weighted assignments, current averages, and what is needed on the remaining work. That is a narrower problem than GPA planning.",
        bullets: [
          "Use Grade Calculator when you need the current average or the required score on a remaining exam.",
          "Enter assignment weights carefully because a small input error changes the target fast.",
          "Check whether dropped assignments or extra credit affect the course rule before relying on the result.",
        ],
      },
      {
        title: "Use GPA for the bigger academic trajectory",
        body:
          "GPA planning matters when the question is semester performance, cumulative standing, or scholarship and admissions thresholds. It combines several course results into one broader academic measure.",
        bullets: [
          "Use GPA Calculator after course-level estimates are already defined.",
          "Model several grade outcomes to see how much one class can really change the cumulative result.",
          "Focus on credit-weighted classes because they usually move the GPA more.",
        ],
      },
      {
        title: "Turn the output into a study priority list",
        body:
          "A calculator is only useful if it changes action. Once the required scores are clear, you can decide where extra study time or assignment effort creates the biggest return.",
        bullets: [
          "Prioritize the assessments with the highest remaining weight.",
          "Update the numbers after each major assignment instead of waiting until the last week.",
          "Use realistic target ranges so the plan remains actionable under time limits.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the difference between grade and GPA calculators?",
        answer:
          "A grade calculator focuses on one course and its assignments, while a GPA calculator combines multiple courses into a broader academic average.",
      },
      {
        question: "Why is my required exam score sometimes unexpectedly high?",
        answer:
          "The final exam may carry a large weight, or earlier assignments may have reduced the remaining margin more than you realized.",
      },
    ],
  },
];

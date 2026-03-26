import type { ConfigurableCalculatorDefinition } from "./base";
import { clampNonNegative, safeDivide, shiftedValues, scaledValues } from "./base";

export const otherBatch2Definitions: ConfigurableCalculatorDefinition[] = [
  {
    calculator: { slug: "time", name: "Time Calculator", category: "other", blurb: "Add or subtract hours, minutes, and seconds.", tags: ["time", "duration", "clock"] },
    fields: [
      { key: "hours", label: "Hours", format: "number", defaultValue: 2, min: 0, step: 1, description: "Number of hours." },
      { key: "minutes", label: "Minutes", format: "number", defaultValue: 45, min: 0, step: 1, description: "Number of minutes." },
      { key: "seconds", label: "Seconds", format: "number", defaultValue: 30, min: 0, step: 1, description: "Number of seconds." },
    ],
    outputs: [
      { key: "totalSeconds", label: "Total seconds", format: "number", description: "Total converted to seconds." },
      { key: "totalMinutes", label: "Total minutes", format: "number", description: "Total converted to minutes." },
      { key: "totalHours", label: "Total hours", format: "number", description: "Total converted to decimal hours." },
    ],
    compute: (i) => {
      const total = clampNonNegative(i.hours) * 3600 + clampNonNegative(i.minutes) * 60 + clampNonNegative(i.seconds);
      return { totalSeconds: total, totalMinutes: total / 60, totalHours: total / 3600 };
    },
    scenario: { fieldKey: "minutes", values: (i) => shiftedValues(i.minutes, [-15, 0, 15, 30, 60], 0), tableOutputKeys: ["totalMinutes", "totalHours"], chartOutputKey: "totalMinutes", tableTitle: "Duration by minutes", chartTitle: "Time conversion", note: "Use decimal hours for timesheet calculations." },
    content: { summaryLead: "The Time Calculator converts between hours, minutes, and seconds and shows the total in each unit.", formulas: ["Total Seconds = Hours×3600 + Minutes×60 + Seconds"], assumptions: ["All inputs are non-negative.", "Simple addition of time units."], tips: ["Use decimal hours for payroll: 2h 30m = 2.5 hours.", "For time differences, subtract the smaller from the larger."], references: ["Time unit conversion factors", "Decimal time for payroll"], examples: [{ title: "Meeting duration", values: { hours: 1, minutes: 45, seconds: 0 }, note: "1h 45m equals 1.75 decimal hours for billing purposes." }] },
  },
  {
    calculator: { slug: "hours", name: "Hours Calculator", category: "other", blurb: "Calculate the difference between start and end times.", tags: ["time", "hours", "work"] },
    fields: [
      { key: "startHour", label: "Start hour (0-23)", format: "number", defaultValue: 9, min: 0, max: 23, step: 1, description: "Start time hour in 24-hour format." },
      { key: "startMinute", label: "Start minute", format: "number", defaultValue: 0, min: 0, max: 59, step: 15, description: "Start time minutes." },
      { key: "endHour", label: "End hour (0-23)", format: "number", defaultValue: 17, min: 0, max: 23, step: 1, description: "End time hour in 24-hour format." },
      { key: "endMinute", label: "End minute", format: "number", defaultValue: 30, min: 0, max: 59, step: 15, description: "End time minutes." },
    ],
    outputs: [
      { key: "totalHours", label: "Total hours", format: "number", description: "Total elapsed time in decimal hours." },
      { key: "totalMinutes", label: "Total minutes", format: "number", description: "Total elapsed time in minutes." },
      { key: "hourlyPay", label: "Pay at $15/hr", format: "currency", description: "Estimated pay at $15 per hour." },
    ],
    compute: (i) => {
      const start = clampNonNegative(i.startHour) * 60 + clampNonNegative(i.startMinute);
      const end = clampNonNegative(i.endHour) * 60 + clampNonNegative(i.endMinute);
      let diff = end - start;
      if (diff < 0) diff += 1440;
      return { totalHours: diff / 60, totalMinutes: diff, hourlyPay: diff / 60 * 15 };
    },
    scenario: { fieldKey: "endHour", values: (i) => shiftedValues(i.endHour, [-2, -1, 0, 1, 2], 0), tableOutputKeys: ["totalHours", "hourlyPay"], chartOutputKey: "totalHours", tableTitle: "Hours by end time", chartTitle: "Work hours comparison", note: "Overnight shifts are handled by wrapping around midnight." },
    content: { summaryLead: "The Hours Calculator finds the time difference between a start and end time, useful for work hours and timesheet calculations.", formulas: ["Difference = End Time − Start Time (in minutes)"], assumptions: ["24-hour format.", "If end is before start, assumes overnight."], tips: ["Subtract lunch breaks manually.", "Use for quick payroll estimates."], references: ["Time difference calculations", "Payroll time tracking methods"], examples: [{ title: "Standard workday", values: { startHour: 8, startMinute: 30, endHour: 17, endMinute: 0 }, note: "8:30 AM to 5:00 PM is 8.5 hours before lunch break deduction." }] },
  },
  {
    calculator: { slug: "gpa", name: "GPA Calculator", category: "other", blurb: "Calculate grade point average from course grades.", tags: ["education", "grades", "school"] },
    fields: [
      { key: "grade1", label: "Course 1 grade (0-4)", format: "number", defaultValue: 3.7, min: 0, max: 4, step: 0.1, description: "Grade points for course 1 (A=4, B=3, C=2, D=1, F=0)." },
      { key: "credits1", label: "Course 1 credits", format: "number", defaultValue: 3, min: 1, step: 1, description: "Credit hours for course 1." },
      { key: "grade2", label: "Course 2 grade (0-4)", format: "number", defaultValue: 3.3, min: 0, max: 4, step: 0.1, description: "Grade points for course 2." },
      { key: "credits2", label: "Course 2 credits", format: "number", defaultValue: 4, min: 1, step: 1, description: "Credit hours for course 2." },
      { key: "grade3", label: "Course 3 grade (0-4)", format: "number", defaultValue: 3.0, min: 0, max: 4, step: 0.1, description: "Grade points for course 3." },
      { key: "credits3", label: "Course 3 credits", format: "number", defaultValue: 3, min: 1, step: 1, description: "Credit hours for course 3." },
    ],
    outputs: [
      { key: "gpa", label: "GPA", format: "number", description: "Weighted grade point average." },
      { key: "totalCredits", label: "Total credits", format: "number", description: "Sum of all credit hours." },
      { key: "totalPoints", label: "Total quality points", format: "number", description: "Sum of grade × credits for all courses." },
    ],
    compute: (i) => {
      const tp = i.grade1 * i.credits1 + i.grade2 * i.credits2 + i.grade3 * i.credits3;
      const tc = i.credits1 + i.credits2 + i.credits3;
      return { gpa: safeDivide(tp, tc), totalCredits: tc, totalPoints: tp };
    },
    scenario: { fieldKey: "grade1", values: (i) => shiftedValues(i.grade1, [-1, -0.5, 0, 0.3], 0), tableOutputKeys: ["gpa", "totalPoints"], chartOutputKey: "gpa", tableTitle: "GPA by Course 1 grade", chartTitle: "GPA impact", note: "Higher-credit courses have more impact on overall GPA." },
    content: { summaryLead: "The GPA Calculator computes your weighted grade point average from course grades and credit hours.", formulas: ["GPA = Σ(Grade × Credits) ÷ Σ Credits"], assumptions: ["4.0 scale (A=4.0, B=3.0, etc.).", "Three courses modeled."], tips: ["Higher-credit courses weigh more in GPA.", "Check if your school uses +/- grading."], references: ["Standard 4.0 GPA scale", "Weighted GPA calculation methods"], examples: [{ title: "Semester GPA check", values: { grade1: 4.0, credits1: 4, grade2: 3.3, credits2: 3, grade3: 2.7, credits3: 3 }, note: "A 4-credit A has more GPA impact than a 3-credit B+." }] },
  },
  {
    calculator: { slug: "grade", name: "Grade Calculator", category: "other", blurb: "Calculate weighted average grade from assignments.", tags: ["education", "grades", "score"] },
    fields: [
      { key: "score1", label: "Score 1 (%)", format: "number", defaultValue: 85, min: 0, max: 100, step: 1, description: "Percentage score for assignment/exam 1." },
      { key: "weight1", label: "Weight 1 (%)", format: "number", defaultValue: 30, min: 0, step: 5, description: "Weight of assignment 1 in the final grade." },
      { key: "score2", label: "Score 2 (%)", format: "number", defaultValue: 92, min: 0, max: 100, step: 1, description: "Percentage score for assignment/exam 2." },
      { key: "weight2", label: "Weight 2 (%)", format: "number", defaultValue: 40, min: 0, step: 5, description: "Weight of assignment 2." },
      { key: "score3", label: "Score 3 (%)", format: "number", defaultValue: 78, min: 0, max: 100, step: 1, description: "Percentage score for assignment/exam 3." },
      { key: "weight3", label: "Weight 3 (%)", format: "number", defaultValue: 30, min: 0, step: 5, description: "Weight of assignment 3." },
    ],
    outputs: [
      { key: "finalGrade", label: "Final grade (%)", format: "number", description: "Weighted average grade." },
      { key: "totalWeight", label: "Total weight (%)", format: "number", description: "Sum of all weights (should be 100%)." },
      { key: "letterGrade", label: "Letter grade (numeric)", format: "number", description: "Approximate GPA equivalent (A=4, B=3, etc.)." },
    ],
    compute: (i) => {
      const tw = i.weight1 + i.weight2 + i.weight3;
      const grade = tw > 0 ? (i.score1 * i.weight1 + i.score2 * i.weight2 + i.score3 * i.weight3) / tw : 0;
      const letter = grade >= 90 ? 4.0 : grade >= 80 ? 3.0 : grade >= 70 ? 2.0 : grade >= 60 ? 1.0 : 0;
      return { finalGrade: grade, totalWeight: tw, letterGrade: letter };
    },
    scenario: { fieldKey: "score2", values: (i) => shiftedValues(i.score2, [-15, -5, 0, 5], 0), tableOutputKeys: ["finalGrade", "letterGrade"], chartOutputKey: "finalGrade", tableTitle: "Final grade by Score 2", chartTitle: "Grade impact", note: "The highest-weighted assignment has the most impact on the final grade." },
    content: { summaryLead: "The Grade Calculator computes a weighted average grade from multiple assignments, exams, or categories with different weights.", formulas: ["Final Grade = Σ(Score × Weight) ÷ Σ Weights"], assumptions: ["Weights should sum to 100%.", "Standard percentage grading."], tips: ["Prioritize studying for high-weight exams.", "Check the total weight adds up to 100%."], references: ["Weighted average grade calculations", "Academic grading systems"], examples: [{ title: "Final exam impact", values: { score1: 90, weight1: 25, score2: 75, weight2: 50, score3: 95, weight3: 25 }, note: "When the midterm is 50% of the grade, it dominates the final outcome." }] },
  },
  {
    calculator: { slug: "tip", name: "Tip Calculator", category: "other", blurb: "Calculate tip amount and split the bill among friends.", tags: ["dining", "tip", "bill"] },
    fields: [
      { key: "billAmount", label: "Bill amount", format: "currency", defaultValue: 75, min: 0, step: 5, description: "Total bill before tip." },
      { key: "tipPercent", label: "Tip percentage", format: "percent", defaultValue: 18, min: 0, step: 1, description: "Tip percentage you want to leave." },
      { key: "splitCount", label: "Split between", format: "number", defaultValue: 2, min: 1, step: 1, description: "Number of people splitting the bill." },
    ],
    outputs: [
      { key: "tipAmount", label: "Tip amount", format: "currency", description: "Total tip to leave." },
      { key: "totalBill", label: "Total with tip", format: "currency", description: "Bill plus tip." },
      { key: "perPerson", label: "Per person", format: "currency", description: "Amount each person pays." },
    ],
    compute: (i) => {
      const bill = clampNonNegative(i.billAmount), tip = clampNonNegative(i.tipPercent) / 100, split = Math.max(1, Math.round(clampNonNegative(i.splitCount)));
      const tipAmount = bill * tip;
      const total = bill + tipAmount;
      return { tipAmount, totalBill: total, perPerson: total / split };
    },
    scenario: { fieldKey: "tipPercent", values: (i) => shiftedValues(i.tipPercent, [-3, 0, 2, 5, 7], 0), tableOutputKeys: ["tipAmount", "perPerson"], chartOutputKey: "perPerson", tableTitle: "Cost by tip percentage", chartTitle: "Per person by tip", note: "Standard Tips: 15% (acceptable), 18% (good), 20%+ (great service)." },
    content: { summaryLead: "The Tip Calculator computes your tip amount, total bill, and per-person share when splitting with friends.", formulas: ["Tip = Bill × Tip%", "Per Person = (Bill + Tip) ÷ Split Count"], assumptions: ["Tip is applied to the pre-tax bill.", "Even split among all participants."], tips: ["Tip on the pre-tax amount for accuracy.", "Round up for simplicity when splitting."], references: ["US tipping customs and guidelines", "Restaurant bill splitting etiquette"], examples: [{ title: "Dinner for four", values: { billAmount: 120, tipPercent: 20, splitCount: 4 }, note: "20% tip on $120 split four ways is $36 per person — easy to calculate mentally." }] },
  },
  {
    calculator: { slug: "speed", name: "Speed Calculator", category: "other", blurb: "Calculate speed, distance, or time from two known values.", tags: ["speed", "distance", "physics"] },
    fields: [
      { key: "distance", label: "Distance (km)", format: "number", defaultValue: 100, min: 0, step: 10, description: "Distance traveled in kilometers." },
      { key: "timeHours", label: "Time (hours)", format: "number", defaultValue: 1.5, min: 0.01, step: 0.25, description: "Time taken in hours." },
    ],
    outputs: [
      { key: "speed", label: "Speed (km/h)", format: "number", description: "Average speed in kilometers per hour." },
      { key: "speedMph", label: "Speed (mph)", format: "number", description: "Average speed in miles per hour." },
      { key: "speedMs", label: "Speed (m/s)", format: "number", description: "Average speed in meters per second." },
    ],
    compute: (i) => {
      const d = clampNonNegative(i.distance), t = Math.max(0.01, clampNonNegative(i.timeHours));
      const speed = d / t;
      return { speed, speedMph: speed * 0.621371, speedMs: speed / 3.6 };
    },
    scenario: { fieldKey: "timeHours", values: (i) => shiftedValues(i.timeHours, [-0.5, 0, 0.5, 1, 2], 0.25), tableOutputKeys: ["speed", "speedMph"], chartOutputKey: "speed", tableTitle: "Speed by travel time", chartTitle: "Speed for the trip", note: "Speed = Distance ÷ Time, the most fundamental motion equation." },
    content: { summaryLead: "The Speed Calculator computes average speed in km/h, mph, and m/s from the distance traveled and time taken.", formulas: ["Speed = Distance ÷ Time", "mph = km/h × 0.621371"], assumptions: ["Constant average speed.", "No stops or acceleration changes."], tips: ["For running, use minutes per km or mile instead.", "Highway driving averages 90-120 km/h."], references: ["Speed, distance, time relationships", "Unit conversion factors for speed"], examples: [{ title: "Road trip check", values: { distance: 250, timeHours: 3 }, note: "250 km in 3 hours means an average of ~83 km/h including stops." }] },
  },
  {
    calculator: { slug: "time-duration", name: "Time Duration Calculator", category: "other", blurb: "Calculate the duration between two dates in various units.", tags: ["time", "duration", "days"] },
    fields: [
      { key: "days", label: "Number of days", format: "number", defaultValue: 90, min: 0, step: 1, description: "Duration in days to convert." },
      { key: "hoursPerDay", label: "Hours per day", format: "number", defaultValue: 24, min: 1, max: 24, step: 1, description: "Working or active hours per day for hour conversion." },
    ],
    outputs: [
      { key: "weeks", label: "Weeks", format: "number", description: "Duration converted to weeks." },
      { key: "months", label: "Months (approx)", format: "number", description: "Approximate duration in months." },
      { key: "hours", label: "Hours", format: "number", description: "Duration converted to hours." },
    ],
    compute: (i) => {
      const d = clampNonNegative(i.days), hpd = clampNonNegative(i.hoursPerDay) || 24;
      return { weeks: d / 7, months: d / 30.44, hours: d * hpd };
    },
    scenario: { fieldKey: "days", values: (i) => shiftedValues(i.days, [-30, 0, 30, 60, 90], 0), tableOutputKeys: ["weeks", "months"], chartOutputKey: "weeks", tableTitle: "Duration by days", chartTitle: "Time conversion", note: "Months are approximated at 30.44 days (average month length)." },
    content: { summaryLead: "The Time Duration Calculator converts a number of days into weeks, months, and hours for quick reference.", formulas: ["Weeks = Days ÷ 7", "Months ≈ Days ÷ 30.44"], assumptions: ["Average month length of 30.44 days.", "No leap year adjustment."], tips: ["For exact date differences, use a date calculator.", "Project timelines benefit from week-based planning."], references: ["Calendar time unit conversions", "Average month length calculation"], examples: [{ title: "Project timeline", values: { days: 120 }, note: "120 days is about 17 weeks or roughly 4 months — useful for sprint planning." }] },
  },
  {
    calculator: { slug: "density", name: "Density Calculator", category: "other", blurb: "Calculate density, mass, or volume from two known values.", tags: ["physics", "density", "science"] },
    fields: [
      { key: "mass", label: "Mass (kg)", format: "number", defaultValue: 5, min: 0, step: 0.5, description: "Mass of the object in kilograms." },
      { key: "volume", label: "Volume (L)", format: "number", defaultValue: 2, min: 0.001, step: 0.5, description: "Volume of the object in liters." },
    ],
    outputs: [
      { key: "density", label: "Density (kg/L)", format: "number", description: "Mass per unit volume." },
      { key: "densityGCm3", label: "Density (g/cm³)", format: "number", description: "Density in grams per cubic centimeter." },
      { key: "floats", label: "Floats in water (1=yes)", format: "number", description: "1 if density < 1 kg/L (floats), 0 if sinks." },
    ],
    compute: (i) => {
      const m = clampNonNegative(i.mass), v = Math.max(0.001, clampNonNegative(i.volume));
      const density = m / v;
      return { density, densityGCm3: density, floats: density < 1 ? 1 : 0 };
    },
    scenario: { fieldKey: "volume", values: (i) => shiftedValues(i.volume, [-1, -0.5, 0, 0.5, 1], 0.1), tableOutputKeys: ["density", "densityGCm3"], chartOutputKey: "density", tableTitle: "Density by volume", chartTitle: "Density curve", note: "Water has a density of 1 kg/L; objects denser than water sink." },
    content: { summaryLead: "The Density Calculator computes the density of a material from its mass and volume, and checks whether it would float in water.", formulas: ["Density = Mass ÷ Volume"], assumptions: ["Uniform material.", "1 kg/L = 1 g/cm³ for this conversion."], tips: ["Water = 1 g/cm³, steel ≈ 7.8, aluminum ≈ 2.7, wood ≈ 0.5.", "Density determines buoyancy: less than water = floats."], references: ["Density calculation in physics", "Common material density reference table"], examples: [{ title: "Unknown material check", values: { mass: 7.8, volume: 1 }, note: "A density of 7.8 kg/L closely matches steel." }] },
  },
];

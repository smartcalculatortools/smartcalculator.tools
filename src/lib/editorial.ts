import { siteName } from "@/lib/site";

export const editorialTeamName = `${siteName} Editorial Team`;
export const learnContentReviewedAt = "2026-04-04";
export const calculatorContentReviewedAt = "2026-04-04";

export function formatEditorialDate(value: string) {
  const [year, month, day] = value.split("-").map((part) => Number(part));
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

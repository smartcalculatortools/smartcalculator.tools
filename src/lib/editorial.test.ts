import { describe, expect, it } from "vitest";
import {
  editorialTeamName,
  formatEditorialDate,
  learnContentReviewedAt,
} from "./editorial";

describe("editorial helpers", () => {
  it("formats the public review date predictably", () => {
    expect(formatEditorialDate(learnContentReviewedAt)).toBe("April 4, 2026");
  });

  it("exposes a stable editorial team label", () => {
    expect(editorialTeamName).toContain("Editorial Team");
  });
});

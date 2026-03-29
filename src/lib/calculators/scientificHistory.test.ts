import { describe, expect, it } from "vitest";
import {
  appendScientificHistory,
  maxScientificHistoryEntries,
  parseStoredScientificHistory,
} from "./scientificHistory";

describe("scientific history", () => {
  it("returns an empty list for invalid stored data", () => {
    expect(parseStoredScientificHistory("oops")).toEqual([]);
    expect(parseStoredScientificHistory('{"bad":true}')).toEqual([]);
  });

  it("adds newest entries first and limits the history length", () => {
    let entries = Array.from({ length: maxScientificHistoryEntries }, (_, index) => ({
      expression: `${index}+1`,
      result: index + 1,
      recordedAt: new Date(index).toISOString(),
    }));

    entries = appendScientificHistory(entries, {
      expression: "9*9",
      result: 81,
      recordedAt: new Date(999).toISOString(),
    });

    expect(entries).toHaveLength(maxScientificHistoryEntries);
    expect(entries[0]).toMatchObject({ expression: "9*9", result: 81 });
  });

  it("skips consecutive duplicate calculations", () => {
    const entries = appendScientificHistory(
      [
        {
          expression: "2+2",
          result: 4,
          recordedAt: new Date(1).toISOString(),
        },
      ],
      {
        expression: "2+2",
        result: 4,
        recordedAt: new Date(2).toISOString(),
      }
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ expression: "2+2", result: 4 });
  });
});

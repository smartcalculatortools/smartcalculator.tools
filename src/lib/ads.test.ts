import { describe, expect, it } from "vitest";
import { getAdsTxtContent } from "@/lib/ads";

describe("ads.txt generation", () => {
  it("returns null when the AdSense client is missing", () => {
    expect(getAdsTxtContent("")).toBeNull();
  });

  it("builds a valid Google seller line from the AdSense client", () => {
    expect(getAdsTxtContent("ca-pub-1234567890123456")).toBe(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n"
    );
  });
});

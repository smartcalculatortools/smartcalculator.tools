import { describe, expect, it } from "vitest";
import { buildMetadata } from "./seo";

describe("buildMetadata", () => {
  it("builds a canonical URL from the provided path", () => {
    const metadata = buildMetadata({
      title: "Example",
      description: "Example description",
      path: "/example",
    });

    expect(metadata.alternates?.canonical).toBe(
      "https://smartcalculatortools.net/example"
    );
  });

  it("supports optional robots directives", () => {
    const metadata = buildMetadata({
      title: "Private page",
      description: "Should not be indexed",
      path: "/private",
      robots: {
        index: false,
        follow: true,
      },
    });

    expect(metadata.robots).toEqual({
      index: false,
      follow: true,
    });
  });
});

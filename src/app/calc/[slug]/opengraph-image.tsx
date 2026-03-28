import { ImageResponse } from "next/og";
import {
  getCalculator,
  categoryMap,
  getCalculatorStaticParams,
} from "@/lib/data/calculators";
import { calculatorContent } from "@/lib/data/calculatorContent";
import { getSiteUrl, siteName } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return getCalculatorStaticParams();
}

const categoryColors: Record<string, { from: string; to: string }> = {
  financial: { from: "#d1fae5", to: "#f0fdf4" },
  fitness: { from: "#fef3c7", to: "#fffbeb" },
  math: { from: "#dbeafe", to: "#eff6ff" },
  other: { from: "#e7e5e4", to: "#fafaf9" },
  crypto: { from: "#ccfbf1", to: "#f0fdfa" },
  ai: { from: "#e0e7ff", to: "#eef2ff" },
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f4efe6",
            fontSize: 48,
            fontFamily: "Arial, sans-serif",
          }}
        >
          Calculator not found
        </div>
      ),
      size
    );
  }

  const category = categoryMap.get(calculator.category);
  const content = calculatorContent[calculator.slug];
  const colors = categoryColors[calculator.category] ?? {
    from: "#f4efe6",
    to: "#faf8f4",
  };
  const description = content?.summary ?? calculator.blurb;
  const siteUrl = getSiteUrl().replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(145deg, ${colors.from} 0%, ${colors.to} 50%, #fff6e6 100%)`,
          color: "#1c1a17",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#0b7a6a",
              fontWeight: 600,
            }}
          >
            {category?.name ?? "Calculator"}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            {calculator.name}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 24,
              lineHeight: 1.5,
              maxWidth: 850,
              color: "#5b544c",
            }}
          >
            {description.length > 140
              ? description.slice(0, 137) + "..."
              : description}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 20,
              color: "#0b7a6a",
              fontWeight: 600,
            }}
          >
            {siteName}
          </div>
          <div style={{ fontSize: 18, color: "#78716c" }}>{siteUrl}</div>
        </div>
      </div>
    ),
    { width: size.width, height: size.height }
  );
}

import { ImageResponse } from "next/og";
import { getSiteUrl, siteDescription, siteName } from "@/lib/site";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  const siteUrl = getSiteUrl().replace(/^https?:\/\//, "");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background:
            "linear-gradient(135deg, #fff6e6 0%, #f2fbf8 45%, #eef3ff 100%)",
          color: "#1c1a17",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            lineHeight: 1.4,
            maxWidth: 900,
            color: "#5b544c",
          }}
        >
          {siteDescription}
        </div>
        <div
          style={{
            marginTop: 40,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            fontSize: 20,
            color: "#0b7a6a",
          }}
        >
          {siteUrl}
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}

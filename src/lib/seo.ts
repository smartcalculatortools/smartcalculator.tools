import type { Metadata } from "next";
import { getSiteUrl, siteLocale, siteName } from "@/lib/site";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  robots?: Metadata["robots"];
};

export function buildMetadata({
  title,
  description,
  path,
  robots,
}: BuildMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale: siteLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

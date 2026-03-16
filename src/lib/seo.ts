import type { Metadata } from "next";
import { getSiteUrl, siteLocale, siteName } from "@/lib/site";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({
  title,
  description,
  path,
}: BuildMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path}`;
  const fullTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
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

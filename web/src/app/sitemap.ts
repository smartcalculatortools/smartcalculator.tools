import type { MetadataRoute } from "next";
import { calculators, categories } from "@/lib/data/calculators";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smartcalculatortools.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/privacy",
    "/terms",
    "/cookies",
    "/widgets",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
    })),
    ...categories.map((category) => ({
      url: `${siteUrl}/category/${category.id}`,
      lastModified,
    })),
    ...calculators.map((calculator) => ({
      url: `${siteUrl}/calc/${calculator.slug}`,
      lastModified,
    })),
  ];
}

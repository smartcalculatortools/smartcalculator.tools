import type { MetadataRoute } from "next";
import { calculators, categories } from "@/lib/data/calculators";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
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

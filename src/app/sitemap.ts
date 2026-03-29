import type { MetadataRoute } from "next";
import { calculators, categories } from "@/lib/data/calculators";
import { learnArticles } from "@/lib/data/learnArticles";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    "/cookies",
    "/widgets",
    "/learn",
  ];

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...staticRoutes
      .filter((p) => p !== "")
      .map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      })),
    ...categories.map((category) => ({
      url: `${siteUrl}/category/${category.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${siteUrl}/learn/${category.id}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...learnArticles.map((article) => ({
      url: `${siteUrl}/learn/${article.categoryId}/${article.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...calculators.map((calculator) => ({
      url: `${siteUrl}/calc/${calculator.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}

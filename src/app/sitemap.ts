import type { MetadataRoute } from "next";
import { calculators, categories } from "@/lib/data/calculators";
import { learnArticles } from "@/lib/data/learnArticles";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticRoutes = [
    "",
    "/calculators",
    "/about",
    "/learn",
  ];

  return [
    {
      url: siteUrl,
    },
    ...staticRoutes
      .filter((p) => p !== "")
      .map((path) => ({
        url: `${siteUrl}${path}`,
      })),
    ...categories.map((category) => ({
      url: `${siteUrl}/category/${category.id}`,
    })),
    ...categories.map((category) => ({
      url: `${siteUrl}/learn/${category.id}`,
    })),
    ...learnArticles.map((article) => ({
      url: `${siteUrl}/learn/${article.categoryId}/${article.slug}`,
    })),
    ...calculators.map((calculator) => ({
      url: `${siteUrl}/calc/${calculator.slug}`,
    })),
  ];
}

const defaultSiteUrl = "https://smartcalculator-tools.vercel.app";

export const siteName = "Smart Calculator Tools";
export const siteDescription =
  "Fast, clear, and modern calculators with fresh UX for finance, health, math, crypto, and AI.";
export const siteLocale = "en_US";

function normalizeSiteUrl(rawUrl: string): string {
  const withProtocol = rawUrl.startsWith("http")
    ? rawUrl
    : `https://${rawUrl}`;
  return withProtocol.replace(/\/$/, "");
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL;
  if (!envUrl) return defaultSiteUrl;
  return normalizeSiteUrl(envUrl);
}

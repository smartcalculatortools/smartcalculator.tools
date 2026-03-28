const defaultSiteUrl = "https://smartcalculatortools.net";
const defaultContactEmail = "";

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
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    defaultSiteUrl;

  return normalizeSiteUrl(envUrl);
}

export function getSiteContactEmail(): string {
  return (
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
    process.env.CONTACT_EMAIL ??
    defaultContactEmail
  ).trim();
}

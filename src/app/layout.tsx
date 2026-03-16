import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DM_Serif_Display, Space_Grotesk } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Analytics from "@/components/Analytics";
import { getSiteUrl, siteDescription, siteLocale, siteName } from "@/lib/site";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
    locale: siteLocale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4efe6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${dmSerif.variable} antialiased`}
      >
        {children}
        <Suspense fallback={null}>
          <Analytics />
          <VercelAnalytics />
          <SpeedInsights />
        </Suspense>
      </body>
    </html>
  );
}

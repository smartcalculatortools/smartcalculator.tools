import type { Metadata } from "next";
import { Suspense } from "react";
import { Space_Grotesk, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

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

export const metadata: Metadata = {
  title: "Smart Calculator Tools",
  description:
    "Fast, clear, and modern calculators with fresh UX for finance, health, math, crypto, and AI.",
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
        </Suspense>
      </body>
    </html>
  );
}

"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const gaId = process.env.NEXT_PUBLIC_GA_ID;

function buildPagePath(pathname: string, search: string | null) {
  if (!search) return pathname;
  return `${pathname}?${search}`;
}

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? null;

  useEffect(() => {
    if (!gaId) return;
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (!gtag) return;
    gtag("event", "page_view", {
      page_path: buildPagePath(pathname, search),
      page_title: document.title,
    });
  }, [pathname, search]);

  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: false });`}
      </Script>
    </>
  );
}

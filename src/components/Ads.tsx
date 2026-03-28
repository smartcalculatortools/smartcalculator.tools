"use client";

import { useEffect, useSyncExternalStore } from "react";
import Script from "next/script";
import { adClient } from "@/lib/ads";
import { createDefaultConsentState } from "@/lib/consent";
import {
  readStoredConsentState,
  subscribeToConsentState,
} from "@/lib/consentStorage";

type AdSlotProps = {
  slot?: string;
  label?: string;
  minHeight?: number;
  className?: string;
};

type AdsWindow = Window & { adsbygoogle?: unknown[] };

export function AdProvider() {
  if (!adClient) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
    />
  );
}

export function AdSlot({
  slot,
  label = "Sponsored",
  minHeight = 240,
  className = "",
}: AdSlotProps) {
  const consentState = useSyncExternalStore(
    subscribeToConsentState,
    readStoredConsentState,
    createDefaultConsentState
  );
  const isConfigured = Boolean(adClient && slot && consentState.ads);

  useEffect(() => {
    if (!isConfigured) return;
    try {
      const adsWindow = window as AdsWindow;
      adsWindow.adsbygoogle = adsWindow.adsbygoogle ?? [];
      adsWindow.adsbygoogle.push({});
    } catch {
      // Ignore ad load errors to avoid breaking the page.
    }
  }, [isConfigured]);

  if (!isConfigured) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-stroke bg-surface-2/60 p-4 text-center ${className}`}
        style={{ minHeight }}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
          {label}
        </p>
        <p className="mt-2 text-xs text-muted">
          {adClient && slot
            ? "Ad placement reserved until advertising consent is granted."
            : "Ad placement reserved."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-stroke bg-surface-2/40 p-4 ${className}`}
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

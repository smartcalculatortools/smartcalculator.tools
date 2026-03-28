"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Analytics from "@/components/Analytics";
import { AdProvider } from "@/components/Ads";
import ConsentBanner from "@/components/ConsentBanner";
import { createDefaultConsentState } from "@/lib/consent";
import {
  readStoredConsentState,
  subscribeToConsentState,
} from "@/lib/consentStorage";
import { clearStoredUsageState } from "@/lib/usageStorage";

export default function SiteServices() {
  const consentState = useSyncExternalStore(
    subscribeToConsentState,
    readStoredConsentState,
    createDefaultConsentState
  );

  useEffect(() => {
    if (consentState.analytics) {
      return;
    }

    clearStoredUsageState();
  }, [consentState.analytics]);

  return (
    <>
      {consentState.analytics && (
        <>
          <Analytics />
          <VercelAnalytics />
          <SpeedInsights />
        </>
      )}
      {consentState.ads && <AdProvider />}
      <ConsentBanner />
    </>
  );
}

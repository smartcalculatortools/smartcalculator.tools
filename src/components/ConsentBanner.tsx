"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  buildConsentState,
  buildGtagConsentState,
  createAcceptedConsentState,
  createEssentialConsentState,
  openConsentSettingsEvent,
  type ConsentState,
} from "@/lib/consent";
import {
  readStoredConsentState,
  subscribeToConsentState,
  writeStoredConsentState,
} from "@/lib/consentStorage";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function applyConsent(nextState: ConsentState) {
  writeStoredConsentState(nextState);
  window.gtag?.("consent", "update", buildGtagConsentState(nextState));
}

function getPreferenceDraft(state: ConsentState) {
  return {
    analytics: state.analytics,
    ads: state.ads,
  };
}

export default function ConsentBanner() {
  const consentState = useSyncExternalStore(
    subscribeToConsentState,
    readStoredConsentState,
    readStoredConsentState
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState(() => getPreferenceDraft(consentState));

  useEffect(() => {
    const openSettings = () => {
      setPreferences(getPreferenceDraft(consentState));
      setIsOpen(true);
      setShowPreferences(true);
    };

    window.addEventListener(openConsentSettingsEvent, openSettings);

    return () => {
      window.removeEventListener(openConsentSettingsEvent, openSettings);
    };
  }, [consentState]);

  const isVisible = !consentState.hasInteracted || isOpen;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl rounded-[28px] border border-stroke bg-surface p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">
              Privacy choices
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink">
              Choose how this site uses analytics and ads
            </h2>
            <p className="mt-3 text-sm text-muted">
              Essential storage keeps the site stable. Optional analytics help us
              measure performance, and optional ads enable AdSense placements. You can
              change this any time from the footer or policy pages.
            </p>
            <p className="mt-3 text-xs text-muted">
              Read more in our{" "}
              <Link href="/privacy" className="underline">
                privacy policy
              </Link>{" "}
              and{" "}
              <Link href="/cookies" className="underline">
                cookie notice
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                applyConsent(createEssentialConsentState());
                setIsOpen(false);
                setShowPreferences(false);
              }}
              className="rounded-full border border-stroke px-4 py-2 text-sm text-ink"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => {
                if (showPreferences) {
                  setShowPreferences(false);
                  return;
                }

                setPreferences(getPreferenceDraft(consentState));
                setShowPreferences(true);
                setIsOpen(true);
              }}
              className="rounded-full border border-stroke px-4 py-2 text-sm text-ink"
            >
              {showPreferences ? "Hide options" : "Customize"}
            </button>
            <button
              type="button"
              onClick={() => {
                applyConsent(createAcceptedConsentState());
                setIsOpen(false);
                setShowPreferences(false);
              }}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
            >
              Accept all
            </button>
          </div>
        </div>

        {showPreferences && (
          <div className="mt-5 grid gap-4 border-t border-stroke pt-5 md:grid-cols-2">
            <label className="rounded-2xl border border-stroke bg-white/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Analytics</p>
                  <p className="mt-2 text-xs text-muted">
                    Loads Google Analytics, Vercel Analytics, and Speed Insights to
                    measure traffic and performance trends.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      analytics: event.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 accent-accent"
                />
              </div>
            </label>
            <label className="rounded-2xl border border-stroke bg-white/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">Advertising</p>
                  <p className="mt-2 text-xs text-muted">
                    Allows Google AdSense to load ad placements. Ads may use cookies or
                    local storage where permitted by law and your choices.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.ads}
                  onChange={(event) =>
                    setPreferences((current) => ({
                      ...current,
                      ads: event.target.checked,
                    }))
                  }
                  className="mt-1 h-4 w-4 accent-accent"
                />
              </div>
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  applyConsent(
                    buildConsentState({
                      analytics: preferences.analytics,
                      ads: preferences.ads,
                    })
                  );
                  setIsOpen(false);
                }}
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white"
              >
                Save preferences
              </button>
              {consentState.hasInteracted && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-stroke px-4 py-2 text-sm text-ink"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

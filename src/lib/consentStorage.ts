"use client";

import {
  consentStorageKey,
  createDefaultConsentState,
  normalizeConsentState,
  type ConsentState,
} from "@/lib/consent";

const consentEventName = "smart-calculator-tools:consent-updated";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifySubscribers() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(consentEventName));
}

let cachedSnapshot: ConsentState | null = null;
let cachedRawValue: string | null = null;

function resetConsentSnapshot() {
  if (!cachedSnapshot || cachedRawValue !== null) {
    cachedSnapshot = createDefaultConsentState();
    cachedRawValue = null;
  }

  return cachedSnapshot;
}

export function readStoredConsentState() {
  if (!canUseBrowserStorage()) {
    return resetConsentSnapshot();
  }

  try {
    const rawValue = window.localStorage.getItem(consentStorageKey);
    if (!rawValue) {
      return resetConsentSnapshot();
    }

    if (rawValue === cachedRawValue && cachedSnapshot) {
      return cachedSnapshot;
    }

    cachedSnapshot = normalizeConsentState(JSON.parse(rawValue));
    cachedRawValue = rawValue;
    return cachedSnapshot;
  } catch {
    return resetConsentSnapshot();
  }
}

export function writeStoredConsentState(state: ConsentState) {
  if (!canUseBrowserStorage()) {
    return;
  }

  const normalizedState = normalizeConsentState(state);
  const rawValue = JSON.stringify(normalizedState);

  cachedSnapshot = normalizedState;
  cachedRawValue = rawValue;
  window.localStorage.setItem(consentStorageKey, rawValue);
  notifySubscribers();
}

export function subscribeToConsentState(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onConsentUpdated = () => {
    listener();
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== consentStorageKey) {
      return;
    }

    listener();
  };

  window.addEventListener(consentEventName, onConsentUpdated);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(consentEventName, onConsentUpdated);
    window.removeEventListener("storage", onStorage);
  };
}

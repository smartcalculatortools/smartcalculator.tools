"use client";

import {
  consentStorageKey,
  normalizeConsentState,
} from "@/lib/consent";
import { subscribeToConsentState } from "@/lib/consentStorage";
import { createEmptyUsageState, normalizeUsageState, type UsageState } from "@/lib/usage";

const storageKey = "smart-calculator-tools:usage";
const usageEventName = "smart-calculator-tools:usage-updated";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyUsageSubscribers(state: UsageState) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent<UsageState>(usageEventName, { detail: state }));
}

function resetUsageSnapshot() {
  if (!cachedSnapshot || cachedRawValue !== null) {
    cachedSnapshot = createEmptyUsageState();
    cachedRawValue = null;
  }

  return cachedSnapshot;
}

function hasUsageConsent() {
  if (!canUseBrowserStorage()) {
    return false;
  }

  try {
    const rawConsent = window.localStorage.getItem(consentStorageKey);
    return normalizeConsentState(rawConsent ? JSON.parse(rawConsent) : null).analytics;
  } catch {
    return false;
  }
}

let cachedSnapshot: UsageState | null = null;
let cachedRawValue: string | null = null;

export function readStoredUsageState() {
  if (!canUseBrowserStorage() || !hasUsageConsent()) {
    return resetUsageSnapshot();
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return resetUsageSnapshot();
    }

    if (rawValue === cachedRawValue && cachedSnapshot) {
      return cachedSnapshot;
    }

    cachedSnapshot = normalizeUsageState(JSON.parse(rawValue));
    cachedRawValue = rawValue;
    return cachedSnapshot;
  } catch {
    return resetUsageSnapshot();
  }
}

export function clearStoredUsageState() {
  const emptyState = resetUsageSnapshot();

  if (!canUseBrowserStorage()) {
    return emptyState;
  }

  window.localStorage.removeItem(storageKey);
  notifyUsageSubscribers(emptyState);
  return emptyState;
}

export function writeStoredUsageState(state: UsageState) {
  if (!canUseBrowserStorage()) {
    return;
  }

  if (!hasUsageConsent()) {
    clearStoredUsageState();
    return;
  }

  const normalizedState = normalizeUsageState(state);
  window.localStorage.setItem(storageKey, JSON.stringify(normalizedState));
  notifyUsageSubscribers(normalizedState);
}

export function updateStoredUsageState(
  updater: (state: UsageState) => UsageState
) {
  if (!hasUsageConsent()) {
    return clearStoredUsageState();
  }

  const nextState = normalizeUsageState(updater(readStoredUsageState()));
  writeStoredUsageState(nextState);
  return nextState;
}

export function subscribeToUsageState(listener: (state: UsageState) => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onUsageUpdated = (event: Event) => {
    const detail =
      event instanceof CustomEvent ? event.detail : readStoredUsageState();
    listener(normalizeUsageState(detail));
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== storageKey) {
      return;
    }

    listener(readStoredUsageState());
  };

  const unsubscribeConsent = subscribeToConsentState(() => {
    if (!hasUsageConsent()) {
      clearStoredUsageState();
      return;
    }

    listener(readStoredUsageState());
  });

  window.addEventListener(usageEventName, onUsageUpdated);
  window.addEventListener("storage", onStorage);

  return () => {
    unsubscribeConsent();
    window.removeEventListener(usageEventName, onUsageUpdated);
    window.removeEventListener("storage", onStorage);
  };
}

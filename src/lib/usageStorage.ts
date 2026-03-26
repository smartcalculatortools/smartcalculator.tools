"use client";

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

let cachedSnapshot: UsageState | null = null;
let cachedRawValue: string | null = null;

export function readStoredUsageState() {
  if (!canUseBrowserStorage()) {
    if (!cachedSnapshot) cachedSnapshot = createEmptyUsageState();
    return cachedSnapshot;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      if (!cachedSnapshot || cachedRawValue !== null) {
        cachedSnapshot = createEmptyUsageState();
        cachedRawValue = null;
      }
      return cachedSnapshot;
    }

    if (rawValue === cachedRawValue && cachedSnapshot) {
      return cachedSnapshot;
    }

    cachedSnapshot = normalizeUsageState(JSON.parse(rawValue));
    cachedRawValue = rawValue;
    return cachedSnapshot;
  } catch {
    if (!cachedSnapshot || cachedRawValue !== null) {
      cachedSnapshot = createEmptyUsageState();
      cachedRawValue = null;
    }
    return cachedSnapshot;
  }
}

export function writeStoredUsageState(state: UsageState) {
  if (!canUseBrowserStorage()) {
    return;
  }

  const normalizedState = normalizeUsageState(state);
  window.localStorage.setItem(storageKey, JSON.stringify(normalizedState));
  notifyUsageSubscribers(normalizedState);
}

export function updateStoredUsageState(
  updater: (state: UsageState) => UsageState
) {
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

  window.addEventListener(usageEventName, onUsageUpdated);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(usageEventName, onUsageUpdated);
    window.removeEventListener("storage", onStorage);
  };
}

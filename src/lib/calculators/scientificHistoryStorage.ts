"use client";

import {
  parseStoredScientificHistory,
  scientificHistoryStorageKey,
  type ScientificHistoryEntry,
} from "./scientificHistory";

const scientificHistoryEventName =
  "smart-calculator-tools:scientific-history-updated";
const emptyScientificHistory: ScientificHistoryEntry[] = [];

let cachedSnapshot: ScientificHistoryEntry[] = emptyScientificHistory;
let cachedRawValue: string | null = null;

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function resetScientificHistorySnapshot() {
  cachedSnapshot = emptyScientificHistory;
  cachedRawValue = null;
  return cachedSnapshot;
}

export function readStoredScientificHistorySnapshot() {
  if (!canUseBrowserStorage()) {
    return cachedSnapshot;
  }

  const rawValue = window.localStorage.getItem(scientificHistoryStorageKey);

  if (!rawValue) {
    return resetScientificHistorySnapshot();
  }

  if (rawValue === cachedRawValue) {
    return cachedSnapshot;
  }

  cachedSnapshot = parseStoredScientificHistory(rawValue);
  cachedRawValue = rawValue;
  return cachedSnapshot;
}

export function writeStoredScientificHistory(entries: ScientificHistoryEntry[]) {
  if (!canUseBrowserStorage()) {
    return;
  }

  const normalizedEntries = parseStoredScientificHistory(JSON.stringify(entries));
  const serializedEntries = JSON.stringify(normalizedEntries);

  cachedSnapshot = normalizedEntries;
  cachedRawValue = serializedEntries;
  window.localStorage.setItem(
    scientificHistoryStorageKey,
    serializedEntries
  );
  window.dispatchEvent(
    new CustomEvent<ScientificHistoryEntry[]>(scientificHistoryEventName, {
      detail: normalizedEntries,
    })
  );
}

export function clearStoredScientificHistory() {
  if (!canUseBrowserStorage()) {
    return;
  }

  resetScientificHistorySnapshot();
  window.localStorage.removeItem(scientificHistoryStorageKey);
  window.dispatchEvent(
    new CustomEvent<ScientificHistoryEntry[]>(scientificHistoryEventName, {
      detail: emptyScientificHistory,
    })
  );
}

export function subscribeToScientificHistory(
  listener: (entries: ScientificHistoryEntry[]) => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onHistoryUpdated = () => {
    listener(readStoredScientificHistorySnapshot());
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== scientificHistoryStorageKey) {
      return;
    }

    listener(readStoredScientificHistorySnapshot());
  };

  window.addEventListener(scientificHistoryEventName, onHistoryUpdated);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(scientificHistoryEventName, onHistoryUpdated);
    window.removeEventListener("storage", onStorage);
  };
}

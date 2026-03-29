"use client";

import {
  parseStoredScientificHistory,
  scientificHistoryStorageKey,
  type ScientificHistoryEntry,
} from "./scientificHistory";

const scientificHistoryEventName =
  "smart-calculator-tools:scientific-history-updated";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readStoredScientificHistorySnapshot() {
  if (!canUseBrowserStorage()) {
    return [];
  }

  return parseStoredScientificHistory(
    window.localStorage.getItem(scientificHistoryStorageKey)
  );
}

export function writeStoredScientificHistory(entries: ScientificHistoryEntry[]) {
  if (!canUseBrowserStorage()) {
    return;
  }

  const normalizedEntries = parseStoredScientificHistory(JSON.stringify(entries));
  window.localStorage.setItem(
    scientificHistoryStorageKey,
    JSON.stringify(normalizedEntries)
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

  window.localStorage.removeItem(scientificHistoryStorageKey);
  window.dispatchEvent(
    new CustomEvent<ScientificHistoryEntry[]>(scientificHistoryEventName, {
      detail: [],
    })
  );
}

export function subscribeToScientificHistory(
  listener: (entries: ScientificHistoryEntry[]) => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onHistoryUpdated = (event: Event) => {
    const detail =
      event instanceof CustomEvent
        ? event.detail
        : readStoredScientificHistorySnapshot();
    listener(parseStoredScientificHistory(JSON.stringify(detail)));
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

import { afterEach, describe, expect, it } from "vitest";
import {
  buildConsentState,
  buildGtagConsentState,
  createAcceptedConsentState,
  createDefaultConsentState,
  normalizeConsentState,
} from "@/lib/consent";
import {
  readStoredConsentState,
  writeStoredConsentState,
} from "@/lib/consentStorage";

const originalWindow = globalThis.window;

function createMockWindow() {
  const eventTarget = new EventTarget();
  const storage = new Map<string, string>();

  return Object.assign(eventTarget, {
    localStorage: {
      getItem(key: string) {
        return storage.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        storage.set(key, value);
      },
      removeItem(key: string) {
        storage.delete(key);
      },
    },
  });
}

afterEach(() => {
  if (originalWindow) {
    globalThis.window = originalWindow;
    return;
  }

  delete (globalThis as typeof globalThis & { window?: Window }).window;
});

describe("consent helpers", () => {
  it("creates a denied-by-default consent state", () => {
    expect(createDefaultConsentState()).toEqual({
      hasInteracted: false,
      analytics: false,
      ads: false,
      updatedAt: null,
    });
  });

  it("normalizes invalid values safely", () => {
    expect(normalizeConsentState({ analytics: 1, ads: "yes" })).toEqual({
      hasInteracted: false,
      analytics: false,
      ads: false,
      updatedAt: null,
    });
  });

  it("maps consent preferences to Google consent mode values", () => {
    const consentState = buildConsentState({ analytics: true, ads: false });

    expect(buildGtagConsentState(consentState)).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("writes and reads consent state from browser storage", () => {
    globalThis.window = createMockWindow() as Window & typeof globalThis;

    writeStoredConsentState(createAcceptedConsentState());

    expect(readStoredConsentState()).toMatchObject({
      hasInteracted: true,
      analytics: true,
      ads: true,
    });
  });
});

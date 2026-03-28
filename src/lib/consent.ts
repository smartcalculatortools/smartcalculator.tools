export const consentStorageKey = "smart-calculator-tools:consent";
export const openConsentSettingsEvent =
  "smart-calculator-tools:open-consent-settings";

export type ConsentState = {
  hasInteracted: boolean;
  analytics: boolean;
  ads: boolean;
  updatedAt: string | null;
};

type GtagConsentValue = "granted" | "denied";

export type GtagConsentState = {
  analytics_storage: GtagConsentValue;
  ad_storage: GtagConsentValue;
  ad_user_data: GtagConsentValue;
  ad_personalization: GtagConsentValue;
};

export function createDefaultConsentState(): ConsentState {
  return {
    hasInteracted: false,
    analytics: false,
    ads: false,
    updatedAt: null,
  };
}

function normalizeBoolean(value: unknown) {
  return value === true;
}

export function normalizeConsentState(value: unknown): ConsentState {
  const base = createDefaultConsentState();

  if (!value || typeof value !== "object") {
    return base;
  }

  const record = value as Record<string, unknown>;

  return {
    hasInteracted: normalizeBoolean(record.hasInteracted),
    analytics: normalizeBoolean(record.analytics),
    ads: normalizeBoolean(record.ads),
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : null,
  };
}

export function createAcceptedConsentState(): ConsentState {
  return {
    hasInteracted: true,
    analytics: true,
    ads: true,
    updatedAt: new Date().toISOString(),
  };
}

export function createEssentialConsentState(): ConsentState {
  return {
    hasInteracted: true,
    analytics: false,
    ads: false,
    updatedAt: new Date().toISOString(),
  };
}

export function buildConsentState(
  next: Pick<ConsentState, "analytics" | "ads">
): ConsentState {
  return {
    hasInteracted: true,
    analytics: next.analytics,
    ads: next.ads,
    updatedAt: new Date().toISOString(),
  };
}

export function buildGtagConsentState(state: ConsentState): GtagConsentState {
  return {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.ads ? "granted" : "denied",
    ad_user_data: state.ads ? "granted" : "denied",
    ad_personalization: state.ads ? "granted" : "denied",
  };
}

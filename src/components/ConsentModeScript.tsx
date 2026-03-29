import {
  buildGtagConsentState,
  consentStorageKey,
  createDefaultConsentState,
} from "@/lib/consent";

const defaultConsent = buildGtagConsentState(createDefaultConsentState());

export default function ConsentModeScript() {
  return (
    <script
      id="google-consent-mode"
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){dataLayer.push(arguments);};
(function() {
  var consent = ${JSON.stringify(defaultConsent)};
  try {
    var raw = window.localStorage.getItem(${JSON.stringify(consentStorageKey)});
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.hasInteracted) {
        document.documentElement.setAttribute("data-consent-interacted", "true");
      } else {
        document.documentElement.removeAttribute("data-consent-interacted");
      }
      consent = {
        analytics_storage: parsed && parsed.analytics ? "granted" : "denied",
        ad_storage: parsed && parsed.ads ? "granted" : "denied",
        ad_user_data: parsed && parsed.ads ? "granted" : "denied",
        ad_personalization: parsed && parsed.ads ? "granted" : "denied"
      };
    } else {
      document.documentElement.removeAttribute("data-consent-interacted");
    }
  } catch (error) {
    document.documentElement.removeAttribute("data-consent-interacted");
    consent = ${JSON.stringify(defaultConsent)};
  }
  window.gtag("consent", "default", consent);
})();`,
      }}
    />
  );
}

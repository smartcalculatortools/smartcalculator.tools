"use client";

import { openConsentSettingsEvent } from "@/lib/consent";

type PrivacySettingsButtonProps = {
  className?: string;
  label?: string;
};

export default function PrivacySettingsButton({
  className = "",
  label = "Privacy settings",
}: PrivacySettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(openConsentSettingsEvent))}
      className={className}
    >
      {label}
    </button>
  );
}

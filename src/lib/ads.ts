export const adClient = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "").trim();

export const adSlots = {
  home: (process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? "").trim(),
  calculator: (process.env.NEXT_PUBLIC_ADSENSE_SLOT_CALC ?? "").trim(),
};

export const adsEnabled = Boolean(adClient);

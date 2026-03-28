export const adClient = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "").trim();

export const adSlots = {
  home: (process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? "").trim(),
  calculator: (process.env.NEXT_PUBLIC_ADSENSE_SLOT_CALC ?? "").trim(),
};

export const adsEnabled = Boolean(adClient);

export function getAdsTxtContent(client = adClient) {
  if (!client.startsWith("ca-pub-")) {
    return null;
  }

  const publisherId = client.replace(/^ca-/, "");
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
}

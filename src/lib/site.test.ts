import { afterEach, describe, expect, it } from "vitest";
import { getSiteContactEmail, getSiteUrl } from "@/lib/site";

const originalEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  SITE_URL: process.env.SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
};

afterEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = originalEnv.NEXT_PUBLIC_SITE_URL;
  process.env.SITE_URL = originalEnv.SITE_URL;
  process.env.VERCEL_PROJECT_PRODUCTION_URL = originalEnv.VERCEL_PROJECT_PRODUCTION_URL;
  process.env.NEXT_PUBLIC_CONTACT_EMAIL = originalEnv.NEXT_PUBLIC_CONTACT_EMAIL;
  process.env.CONTACT_EMAIL = originalEnv.CONTACT_EMAIL;
});

describe("getSiteUrl", () => {
  it("uses the public site URL when provided", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
    process.env.SITE_URL = "";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "";

    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("falls back to the production domain when no env is set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;

    expect(getSiteUrl()).toBe("https://smartcalculatortools.net");
  });

  it("reads the contact email from the public env var", () => {
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "support@example.com";
    process.env.CONTACT_EMAIL = "";

    expect(getSiteContactEmail()).toBe("support@example.com");
  });
});

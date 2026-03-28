import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import PrivacySettingsButton from "@/components/PrivacySettingsButton";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cookie Notice",
  description:
    "We use minimal cookies for stability and analytics, and we never store calculator inputs.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-pad">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">
            Cookies
          </p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            Cookie notice
          </h1>
          <p className="mt-4 text-sm text-muted">
            We use a small set of essential browser storage items to remember consent
            and site preferences. Optional analytics and advertising technologies only
            load after consent.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">
                Essential storage
              </h2>
              <p className="mt-2 text-sm text-muted">
                Used to remember privacy settings and keep the site stable.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">
                Analytics technologies
              </h2>
              <p className="mt-2 text-sm text-muted">
                If enabled, Google Analytics and Vercel services help us understand
                usage and performance. The site may also keep lightweight recent-use
                signals in your browser to personalize calculator suggestions.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">
                Advertising technologies
              </h2>
              <p className="mt-2 text-sm text-muted">
                If enabled, Google AdSense may use cookies or local storage for ad
                delivery, fraud prevention, and reporting.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">
                Manage your choice
              </h2>
              <p className="mt-2 text-sm text-muted">
                You can update your consent decision at any time.
              </p>
              <div className="mt-4">
                <PrivacySettingsButton className="rounded-full border border-stroke px-4 py-2 text-sm text-ink" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

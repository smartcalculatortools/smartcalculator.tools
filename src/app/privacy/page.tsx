import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "We keep data collection minimal and do not store calculator inputs on our servers.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-pad">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Privacy</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Privacy policy</h1>
          <p className="mt-4 text-sm text-muted">
            We keep data collection minimal. We do not require user accounts.
            Analytics may be used to improve the calculators and understand
            usage patterns.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">No sensitive storage</h2>
              <p className="mt-2 text-sm text-muted">
                Inputs you enter into calculators are not stored on our servers.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Cookies</h2>
              <p className="mt-2 text-sm text-muted">
                We may use limited cookies for analytics and performance.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

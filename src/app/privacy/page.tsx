import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import PrivacySettingsButton from "@/components/PrivacySettingsButton";
import { buildMetadata } from "@/lib/seo";
import { getSiteContactEmail } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Read how Smart Calculator Tools handles calculator inputs, consent preferences, analytics, advertising, support emails, and browser storage.",
  path: "/privacy",
});

const contactEmail = getSiteContactEmail();

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-pad">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Privacy</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Privacy policy</h1>
          <p className="mt-4 text-sm text-muted">
            We keep data collection minimal and do not require accounts. Calculator
            inputs run in the browser. Optional analytics and advertising only load
            after the user makes a consent choice.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Calculator inputs</h2>
              <p className="mt-2 text-sm text-muted">
                Inputs entered into calculators are processed locally in the browser and
                are not stored on our servers.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Browser storage</h2>
              <p className="mt-2 text-sm text-muted">
                We use browser-local storage for essential preferences such as consent
                settings. Recent-calculator and personalization signals are only kept
                after analytics consent is granted.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">If you contact us</h2>
              <p className="mt-2 text-sm text-muted">
                If you email us, we receive the information you choose to send,
                which may include your email address, the message itself, and any
                screenshots or example values you provide. We use that information
                only to review the issue, reply, and keep a basic support record
                when needed.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Analytics</h2>
              <p className="mt-2 text-sm text-muted">
                If you allow analytics, this site may load Google Analytics, Vercel
                Analytics, and Vercel Speed Insights to measure traffic, diagnose
                performance, and improve navigation and calculator quality.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Advertising and third parties</h2>
              <p className="mt-2 text-sm text-muted">
                If you allow advertising, this site may load Google AdSense. AdSense
                can use cookies or similar local storage for ad delivery, measurement,
                fraud prevention, and frequency controls where permitted by law and your
                consent choices. Infrastructure and analytics providers may also process
                limited technical data such as IP address, browser type, referrer, and
                page-performance signals to keep the site available and measurable.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Retention and deletion</h2>
              <p className="mt-2 text-sm text-muted">
                Consent preferences remain in your browser until you clear storage
                or change them. Support emails may be retained for as long as
                reasonably necessary to handle the request, resolve abuse, or keep
                basic business records.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Sensitive information</h2>
              <p className="mt-2 text-sm text-muted">
                Avoid sending bank details, tax IDs, medical records, passwords,
                or other sensitive personal data through calculator inputs or support
                emails. Use sample values whenever possible when reporting a bug.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Your choices</h2>
              <p className="mt-2 text-sm text-muted">
                You can update analytics and ad consent at any time.
              </p>
              <div className="mt-4">
                <PrivacySettingsButton className="rounded-full border border-stroke px-4 py-2 text-sm text-ink" />
              </div>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Contact</h2>
              <p className="mt-2 text-sm text-muted">
                {contactEmail
                  ? `Privacy and policy requests can be sent to ${contactEmail}.`
                  : "Publish a direct contact email before submitting the site for external monetization review."}
              </p>
              <p className="mt-3 text-sm text-muted">
                You can also review the{" "}
                <Link href="/cookies" className="underline">
                  cookie notice
                </Link>{" "}
                or use the{" "}
                <Link href="/contact" className="underline">
                  contact page
                </Link>{" "}
                for general support questions.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

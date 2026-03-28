import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import PrivacySettingsButton from "@/components/PrivacySettingsButton";
import { buildMetadata } from "@/lib/seo";
import { getSiteContactEmail } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Smart Calculator Tools about privacy, policy, embedding, or calculator issues.",
  path: "/contact",
});

const contactEmail = getSiteContactEmail();

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-pad">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Contact</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Policy and support contact</h1>
          <p className="mt-4 text-sm text-muted">
            Use this page for policy questions, privacy requests, embed support, or
            reports about calculator issues.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Direct contact</h2>
              {contactEmail ? (
                <p className="mt-3 text-sm text-muted">
                  Email{" "}
                  <a className="underline" href={`mailto:${contactEmail}`}>
                    {contactEmail}
                  </a>{" "}
                  for privacy, policy, or publishing questions.
                </p>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  A direct publisher inbox has not been published in this deployment yet.
                  Before monetization review, add a public contact email so reviewers and
                  users have a clear support channel.
                </p>
              )}
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Privacy controls</h2>
              <p className="mt-3 text-sm text-muted">
                You can update analytics and ad consent at any time without contacting us.
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

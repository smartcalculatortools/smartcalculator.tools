import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import PrivacySettingsButton from "@/components/PrivacySettingsButton";
import { buildMetadata } from "@/lib/seo";
import { getSiteContactEmail } from "@/lib/site";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn how Smart Calculator Tools builds, reviews, and explains calculators for practical financial, health, math, and everyday decisions.",
  path: "/about",
});

const contactEmail = getSiteContactEmail();

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-pad">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">About</p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            Smart Calculator Tools
          </h1>
          <p className="mt-4 text-sm text-muted">
            We build fast, clear calculators with modern UX. Every calculator is
            tested with known reference cases and designed to show inputs,
            outputs, and helpful context without clutter.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">What we publish</h2>
              <p className="mt-2 text-sm text-muted">
                Smart Calculator Tools focuses on calculators people actually use:
                mortgages, loans, savings, taxes, body metrics, scientific math,
                and practical time or date tools. We prefer fewer useful pages
                over thin pages published only to chase rankings.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">How calculators are built</h2>
              <p className="mt-2 text-sm text-muted">
                Each calculator starts with a documented formula or reference
                method, then we add transparent inputs, assumptions, examples,
                and FAQs so the result is easier to verify. When a calculator is
                region-specific, we call that out directly on the page.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">What this site is not</h2>
              <p className="mt-2 text-sm text-muted">
                The site is a decision-support and planning tool. It does not
                replace advice from a licensed financial adviser, accountant,
                doctor, lawyer, lender, or insurer. Use the calculators to frame
                a question, not to bypass professional judgment.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Trust and transparency</h2>
              <p className="mt-2 text-sm text-muted">
                Calculator logic is separate from monetization. Advertising, when
                shown, never changes the formulas, rankings, or outputs. Consent
                controls stay available from policy pages and the footer so users
                can revisit analytics and advertising choices at any time.
              </p>
              <div className="mt-4">
                <PrivacySettingsButton className="rounded-full border border-stroke px-4 py-2 text-sm text-ink" />
              </div>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Free access and support</h2>
              <p className="mt-2 text-sm text-muted">
                The platform is free to use and does not require registration.
                If something looks wrong, you can report it through the{" "}
                <Link href="/contact" className="underline">
                  contact page
                </Link>
                {contactEmail ? (
                  <>
                    {" "}or by emailing{" "}
                    <a className="underline" href={`mailto:${contactEmail}`}>
                      {contactEmail}
                    </a>
                    .
                  </>
                ) : (
                  "."
                )}
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Policies</h2>
              <p className="mt-2 text-sm text-muted">
                For more detail on data handling and permitted use, review the{" "}
                <Link href="/privacy" className="underline">
                  privacy policy
                </Link>
                ,{" "}
                <Link href="/cookies" className="underline">
                  cookie notice
                </Link>
                , and{" "}
                <Link href="/terms" className="underline">
                  terms of use
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

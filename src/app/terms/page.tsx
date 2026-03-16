import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "Calculators are provided for informational purposes only and do not replace professional advice.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-pad">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Terms</p>
          <h1 className="mt-2 font-display text-4xl text-ink">Terms of use</h1>
          <p className="mt-4 text-sm text-muted">
            The calculators are provided for informational purposes only. They do
            not replace professional financial, medical, or legal advice.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Accuracy</h2>
              <p className="mt-2 text-sm text-muted">
                We test calculators against standard formulas but cannot guarantee
                that every use case is correct.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Embeds</h2>
              <p className="mt-2 text-sm text-muted">
                Embedding calculators is allowed with attribution and without
                modifying the calculator logic.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

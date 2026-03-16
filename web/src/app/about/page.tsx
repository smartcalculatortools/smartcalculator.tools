import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

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
              <h2 className="font-display text-2xl text-ink">Free & no sign-up</h2>
              <p className="mt-2 text-sm text-muted">
                The platform is free to use and does not require registration.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Accuracy focus</h2>
              <p className="mt-2 text-sm text-muted">
                We validate calculations against known formulas and provide
                transparent inputs and outputs.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">Regional scope</h2>
              <p className="mt-2 text-sm text-muted">
                Some calculators are region-specific. For example, the income tax
                calculator currently targets US-only assumptions.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

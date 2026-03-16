import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
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
            We use minimal cookies to keep the experience reliable and to
            understand usage trends. We do not store calculator inputs on our
            servers.
          </p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">
                Essential cookies
              </h2>
              <p className="mt-2 text-sm text-muted">
                Required to keep the site stable and secure.
              </p>
            </div>
            <div className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">
                Analytics cookies
              </h2>
              <p className="mt-2 text-sm text-muted">
                Help us measure performance and improve calculator experiences.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

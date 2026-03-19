import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="section-pad">
        <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-stroke bg-surface p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">404</p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            Page not found
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            The page you requested does not exist or the URL is no longer valid.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              Go home
            </Link>
            <Link
              href="/category/financial"
              className="rounded-full border border-stroke px-5 py-2.5 text-sm text-ink"
            >
              Browse calculators
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

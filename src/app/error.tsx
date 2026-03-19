"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-stroke/60 bg-bg/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-white shadow-soft">
              SC
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted">Smart</p>
              <p className="font-display text-lg text-ink">Calculator Tools</p>
            </div>
          </Link>
        </div>
      </header>
      <main className="section-pad">
        <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-stroke bg-surface p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">Error</p>
          <h1 className="mt-2 font-display text-4xl text-ink">
            Something went wrong
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted">
            An unexpected error interrupted this page. Retry once, then return to the
            calculator library if the issue continues.
          </p>
          {error.digest ? (
            <p className="mt-3 text-xs text-muted">Reference: {error.digest}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-full border border-stroke px-5 py-2.5 text-sm text-ink"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
      <footer className="border-t border-stroke/70 bg-surface/70">
        <div className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-muted">
          Smart Calculator Tools
        </div>
      </footer>
    </div>
  );
}

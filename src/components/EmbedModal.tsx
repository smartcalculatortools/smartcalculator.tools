"use client";

import { useState, useCallback } from "react";
import type { Calculator } from "@/lib/data/calculators";
import { getSiteUrl } from "@/lib/site";

type EmbedModalProps = {
  calculator: Calculator;
  isOpen: boolean;
  onClose: () => void;
};

export default function EmbedModal({
  calculator,
  isOpen,
  onClose,
}: EmbedModalProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  const embedCode = `<iframe src="${getSiteUrl()}/embed/${calculator.slug}" width="100%" height="800" frameborder="0" style="border: 0; border-radius: 28px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);" allowtransparency="true"></iframe><div style="text-align:center; font-family:sans-serif; font-size:12px; margin-top:8px;"><a href="${getSiteUrl()}/calc/${calculator.slug}" target="_blank" rel="noopener noreferrer" style="color:#666; text-decoration:none;">Powered by Smart Calculator Tools</a></div>`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }, [embedCode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-2xl rounded-[32px] border border-stroke bg-surface p-6 shadow-soft sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="embed-modal-title"
      >
        <button
          className="absolute right-6 top-6 rounded-full border border-stroke bg-white/70 p-2 text-ink transition hover:bg-stroke/40"
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <p className="text-xs uppercase tracking-[0.4em] text-muted">Share</p>
        <h2 id="embed-modal-title" className="mt-2 font-display text-3xl text-ink">
          Embed on your site
        </h2>
        <p className="mt-3 text-sm text-muted">
          Provide value to your visitors by putting this interactive {calculator.name.toLowerCase()} directly on your website or blog. Waiters, clients, and readers will love it.
        </p>

        <div className="mt-6 rounded-2xl border border-stroke/80 bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink">HTML Code</p>
          <textarea
            readOnly
            className="mt-2 h-32 w-full resize-none rounded-xl border border-stroke bg-surface-2 p-3 text-sm text-ink outline-none focus:border-accent"
            value={embedCode}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
          >
            {copyState === "copied" ? "Code copied!" : "Copy embed code"}
          </button>
          {copyState === "failed" && (
            <span className="text-sm text-negative">Failed to copy. Try selecting the text manually.</span>
          )}
        </div>
      </div>
    </div>
  );
}

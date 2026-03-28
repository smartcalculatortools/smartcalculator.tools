import Link from "next/link";
import PrivacySettingsButton from "@/components/PrivacySettingsButton";

export default function SiteFooter() {
  return (
    <footer className="border-t border-stroke/70 bg-surface/70 cv-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg text-ink">Smart Calculator Tools</p>
          <p className="mt-2 text-sm text-muted">
            Clear calculators for finance, health, math, crypto, and AI.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-muted">
          <Link href="/category/financial" className="hover:text-ink">
            Financial
          </Link>
          <Link href="/category/fitness" className="hover:text-ink">
            Fitness
          </Link>
          <Link href="/category/math" className="hover:text-ink">
            Math
          </Link>
          <Link href="/category/crypto" className="hover:text-ink">
            Crypto
          </Link>
          <Link href="/category/ai" className="hover:text-ink">
            AI
          </Link>
          <Link href="/widgets" className="hover:text-ink">
            Widgets
          </Link>
          <Link href="/learn" className="hover:text-ink">
            Learn
          </Link>
          <Link href="/contact" className="hover:text-ink">
            Contact
          </Link>
          <Link href="/cookies" className="hover:text-ink">
            Cookies
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <PrivacySettingsButton
            label="Privacy settings"
            className="hover:text-ink"
          />
        </div>
      </div>
    </footer>
  );
}

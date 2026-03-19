import Link from "next/link";
import { categories } from "@/lib/data/calculators";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stroke/60 bg-bg/80 backdrop-blur">
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
        <nav className="hidden items-center gap-4 text-sm text-muted lg:flex">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="transition-colors hover:text-ink"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/widgets" className="transition-colors hover:text-ink">
            Widgets
          </Link>
          <Link href="/learn" className="transition-colors hover:text-ink">
            Learn
          </Link>
          <Link href="/about" className="transition-colors hover:text-ink">
            About
          </Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/category/financial"
            className="rounded-full border border-stroke px-4 py-2 text-sm text-ink transition hover:border-ink"
          >
            Explore
          </Link>
        </div>
      </div>
    </header>
  );
}

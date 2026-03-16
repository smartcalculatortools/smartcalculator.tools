import Link from "next/link";
import type { Category } from "@/lib/data/calculators";

export default function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count: number;
}) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="group relative overflow-hidden rounded-3xl border border-stroke bg-surface p-6 shadow-soft transition hover:-translate-y-1"
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.tone}`}
      />
      <div className="relative z-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Category</p>
        <h3 className="font-display text-2xl text-ink">{category.name}</h3>
        <p className="mt-3 text-sm text-muted">{category.blurb}</p>
        <p className="mt-6 text-sm font-semibold text-ink">
          {count} calculators
        </p>
      </div>
    </Link>
  );
}

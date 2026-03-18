import Link from "next/link";
import { categoryMap, type Calculator } from "@/lib/data/calculators";

export default function CalculatorCard({
  calculator,
}: {
  calculator: Calculator;
}) {
  return (
    <Link
      href={`/calc/${calculator.slug}`}
      className="group flex h-full flex-col justify-between rounded-3xl border border-stroke bg-surface p-5 shadow-soft transition hover:-translate-y-1"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted">
          {categoryMap.get(calculator.category)?.name ?? calculator.category}
        </p>
        <h4 className="mt-2 text-lg font-semibold text-ink">
          {calculator.name}
        </h4>
        <p className="mt-3 text-sm text-muted">{calculator.blurb}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {calculator.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-stroke/80 px-3 py-1 text-xs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

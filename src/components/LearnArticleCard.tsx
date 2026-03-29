import Link from "next/link";
import { categoryMap } from "@/lib/data/calculators";
import type { LearnArticle } from "@/lib/data/learnArticles";

export default function LearnArticleCard({
  article,
}: {
  article: LearnArticle;
}) {
  const category = categoryMap.get(article.categoryId);

  return (
    <article className="rounded-3xl border border-stroke bg-surface p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">
        {category?.name ?? article.categoryId}
      </p>
      <h3 className="mt-2 font-display text-2xl text-ink">{article.title}</h3>
      <p className="mt-3 text-sm text-muted">{article.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-full border border-stroke px-3 py-1">
          {article.calculatorSlugs.length} linked calculators
        </span>
        <span className="rounded-full border border-stroke px-3 py-1">
          {article.targetQuery}
        </span>
      </div>
      <div className="mt-6 flex gap-3">
        <Link
          href={`/learn/${article.categoryId}/${article.slug}`}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Read article
        </Link>
        <Link
          href={`/category/${article.categoryId}`}
          className="rounded-full border border-stroke px-4 py-2 text-sm text-ink"
        >
          Open category
        </Link>
      </div>
    </article>
  );
}

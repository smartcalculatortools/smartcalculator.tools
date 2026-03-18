"use client";

import { useCallback, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/calculators/format";
import { AdSlot } from "@/components/Ads";
import CalculatorCard from "@/components/CalculatorCard";
import { adSlots } from "@/lib/ads";
import { calculators } from "@/lib/data/calculators";
import type { Calculator, Category } from "@/lib/data/calculators";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import CompoundInterestCalculator from "@/components/calculators/CompoundInterestCalculator";
import SavingsCalculator from "@/components/calculators/SavingsCalculator";
import IncomeTaxCalculator from "@/components/calculators/IncomeTaxCalculator";
import BMICalculator from "@/components/calculators/BMICalculator";
import BMRCalculator from "@/components/calculators/BMRCalculator";
import CalorieCalculator from "@/components/calculators/CalorieCalculator";
import BodyFatCalculator from "@/components/calculators/BodyFatCalculator";
import ScientificCalculator from "@/components/calculators/ScientificCalculator";
import PercentageCalculator from "@/components/calculators/PercentageCalculator";
import FractionCalculator from "@/components/calculators/FractionCalculator";
import TriangleCalculator from "@/components/calculators/TriangleCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import DateCalculator from "@/components/calculators/DateCalculator";
import CryptoProfitLossCalculator from "@/components/calculators/CryptoProfitLossCalculator";
import CryptoDcaCalculator from "@/components/calculators/CryptoDcaCalculator";
import CryptoFeeImpactCalculator from "@/components/calculators/CryptoFeeImpactCalculator";
import AiTokenCostCalculator from "@/components/calculators/AiTokenCostCalculator";
import AiModelComparatorCalculator from "@/components/calculators/AiModelComparatorCalculator";
import type {
  CalculatorContent,
  ExampleCase,
  InsightChart,
  ReferenceTable,
} from "@/lib/data/calculatorContent";
import { buildFaqItems } from "@/lib/faq";
import type { CalculatorInsights } from "@/lib/insights";

type CalculatorInteractiveProps = {
  calculator: Calculator;
  category?: Category;
  content?: CalculatorContent;
};

type CalculatorComponentProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

type CsvRow = Array<string | number>;
type ChartSortMode = "original" | "desc" | "asc";

function CalculatorPlaceholder() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Inputs</h2>
        <p className="mt-2 text-sm text-muted">
          This calculator is being wired with full inputs and validation.
        </p>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`input-${index}`}
              className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-3"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Input {index + 1}
              </p>
              <p className="mt-2 text-sm text-ink">Placeholder field</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[28px] border border-stroke bg-surface-2 p-6 shadow-soft">
        <h2 className="font-display text-2xl text-ink">Results</h2>
        <p className="mt-2 text-sm text-muted">
          Output cards and charts will appear here.
        </p>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`result-${index}`}
              className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-muted">
                Result {index + 1}
              </p>
              <p className="mt-2 text-2xl font-semibold text-ink">--</p>
              <p className="text-xs text-muted">Details coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const calculatorComponents: Record<string, ComponentType<CalculatorComponentProps>> = {
  mortgage: MortgageCalculator,
  loan: LoanCalculator,
  "compound-interest": CompoundInterestCalculator,
  savings: SavingsCalculator,
  "income-tax": IncomeTaxCalculator,
  bmi: BMICalculator,
  bmr: BMRCalculator,
  calorie: CalorieCalculator,
  "body-fat": BodyFatCalculator,
  scientific: ScientificCalculator,
  percentage: PercentageCalculator,
  fraction: FractionCalculator,
  triangle: TriangleCalculator,
  age: AgeCalculator,
  date: DateCalculator,
  "crypto-profit-loss": CryptoProfitLossCalculator,
  "crypto-dca": CryptoDcaCalculator,
  "crypto-fee-impact": CryptoFeeImpactCalculator,
  "ai-token-cost": AiTokenCostCalculator,
  "ai-model-comparator": AiModelComparatorCalculator,
};

function getCalculatorComponent(
  slug: string,
  onInsightsChange: (insights: CalculatorInsights) => void
) {
  const Component = calculatorComponents[slug];
  return Component ? <Component onInsightsChange={onInsightsChange} /> : null;
}

export default function CalculatorInteractive({
  calculator,
  category,
  content,
}: CalculatorInteractiveProps) {
  const [insights, setInsights] = useState<CalculatorInsights>({});
  const [resetKey, setResetKey] = useState(0);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [copiedExampleTitle, setCopiedExampleTitle] = useState<string | null>(null);

  const handleInsightsChange = useCallback((next: CalculatorInsights) => {
    setInsights(next);
  }, []);

  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1);
    setInsights({});
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  const handleCopyLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    window.setTimeout(() => setCopyState("idle"), 2000);
  }, []);

  const handleCopyExample = useCallback(async (example: ExampleCase) => {
    if (typeof window === "undefined") return;

    const text = [
      example.title,
      "",
      "Inputs:",
      ...example.inputs.map((item) => `- ${item}`),
      "",
      "Outputs:",
      ...example.outputs.map((item) => `- ${item}`),
      ...(example.note ? ["", `Note: ${example.note}`] : []),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopiedExampleTitle(example.title);
      window.setTimeout(() => setCopiedExampleTitle((current) => {
        if (current === example.title) return null;
        return current;
      }), 2000);
    } catch {
      setCopiedExampleTitle(null);
    }
  }, []);

  const calculatorComponent = useMemo(
    () => getCalculatorComponent(calculator.slug, handleInsightsChange),
    [calculator.slug, handleInsightsChange]
  );

  const table = insights.table ?? content?.table;
  const chart = insights.chart ?? content?.chart;
  const contentSections = useMemo(() => {
    if (!content) return [];

    const sections = [
      content.inputs?.length ? { id: "inputs", label: "Inputs" } : null,
      content.outputs?.length ? { id: "outputs", label: "Outputs" } : null,
      content.assumptions?.length
        ? { id: "assumptions", label: "Assumptions" }
        : null,
      content.tips?.length ? { id: "tips", label: "Tips" } : null,
      content.formulas?.length ? { id: "formulas", label: "Formulas" } : null,
      content.examples?.length ? { id: "examples", label: "Examples" } : null,
      table ? { id: "table", label: "Reference table" } : null,
      chart ? { id: "chart", label: "Visual breakdown" } : null,
      content.references?.length
        ? { id: "references", label: "References" }
        : null,
    ];

    return sections.filter((section) => section !== null);
  }, [chart, content, table]);

  const relatedCalculators = useMemo(() => {
    const sameCategory = calculators.filter(
      (item) =>
        item.category === calculator.category && item.slug !== calculator.slug
    );
    const otherCategory = calculators.filter(
      (item) =>
        item.category !== calculator.category && item.slug !== calculator.slug
    );
    return [...sameCategory, ...otherCategory].slice(0, 4);
  }, [calculator.category, calculator.slug]);

  const faqItems = useMemo(
    () => buildFaqItems({ calculator, category, content }),
    [calculator, category, content]
  );

  return (
    <main>
      <section className="pt-4 pb-3 sm:pt-8 sm:pb-5">
        <div className="mx-auto w-full max-w-5xl">
          <p className="text-xs uppercase tracking-[0.4em] text-muted">
            {category?.name}
          </p>
          <h1 className="mt-1 font-display text-4xl text-ink">
            {calculator.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {calculator.blurb}
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href={`/category/${calculator.category}`}
              className="rounded-full border border-stroke px-4 py-2 text-xs text-ink"
            >
              Back to {category?.name}
            </Link>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-stroke px-4 py-2 text-xs text-ink"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-full border border-stroke px-4 py-2 text-xs text-ink"
            >
              Print
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-full border border-stroke px-4 py-2 text-xs text-ink"
            >
              Copy link
            </button>
            {copyState === "copied" && (
              <span className="rounded-full bg-accent/10 px-4 py-2 text-xs text-ink">
                Link copied
              </span>
            )}
            {copyState === "failed" && (
              <span className="rounded-full bg-negative/10 px-4 py-2 text-xs text-ink">
                Copy failed
              </span>
            )}
            {!calculatorComponent && (
              <span className="rounded-full bg-accent/10 px-4 py-2 text-xs text-ink">
                Calculator under construction
              </span>
            )}
          </div>
        </div>
      </section>
      <section className="pt-1 pb-4 sm:pt-3 sm:pb-8">
        <div className="mx-auto w-full max-w-5xl">
          {calculatorComponent ? (
            <div key={resetKey}>{calculatorComponent}</div>
          ) : (
            <CalculatorPlaceholder />
          )}
        </div>
      </section>

      <section className="section-pad-compact pt-0 cv-auto">
        <div className="mx-auto w-full max-w-5xl">
          <AdSlot slot={adSlots.calculator} minHeight={250} />
        </div>
      </section>

      {content && (
        <section className="section-pad-compact pt-0 cv-auto-large">
          <div className="mx-auto w-full max-w-5xl">
            <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
              <h2 className="font-display text-2xl text-ink">
                How this calculator works
              </h2>
              <p className="mt-3 text-sm text-muted">{content.summary}</p>
              {contentSections.length > 0 && (
                <div className="mt-4 rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-muted">
                        Quick guide
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        Jump straight to the section you need, then return to the calculator.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {contentSections.map((section) => (
                        <a
                          key={section.id}
                          href={`#calculator-${section.id}`}
                          className="rounded-full border border-stroke px-3 py-1.5 text-xs text-ink transition hover:border-ink"
                        >
                          {section.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {content.inputs && (
                  <div id="calculator-inputs">
                    <ContentCard title="Inputs" items={content.inputs} />
                  </div>
                )}
                {content.outputs && (
                  <div id="calculator-outputs">
                    <ContentCard title="Outputs" items={content.outputs} />
                  </div>
                )}
                {content.assumptions && (
                  <div id="calculator-assumptions">
                    <ContentCard title="Assumptions" items={content.assumptions} />
                  </div>
                )}
                {content.tips && (
                  <div id="calculator-tips">
                    <ContentCard title="Tips" items={content.tips} />
                  </div>
                )}
              </div>
              {content.formulas && content.formulas.length > 0 && (
                <div id="calculator-formulas" className="mt-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h3 className="font-display text-2xl text-ink">Formula guide</h3>
                      <p className="mt-2 text-sm text-muted">
                        Use these formulas to audit the output or explain it to someone else.
                      </p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">
                      {content.formulas.length} formulas
                    </p>
                  </div>
                  <div className="mt-3 grid gap-3">
                    {content.formulas.map((formula) => (
                      <div
                        key={formula}
                        className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-3 text-sm text-ink"
                      >
                        {formula}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {content.examples && content.examples.length > 0 && (
                <div id="calculator-examples" className="mt-5">
                  <h3 className="font-display text-2xl text-ink">
                    Usage examples
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    Review a ready-made scenario, copy it, then tweak inputs to match your case.
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {content.examples.map((example) => (
                      <ExampleCard
                        key={example.title}
                        example={example}
                        copied={copiedExampleTitle === example.title}
                        onCopy={() => handleCopyExample(example)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {table && (
                <div id="calculator-table" className="mt-5">
                  <h3 className="font-display text-2xl text-ink">{table.title}</h3>
                  <TableBlock table={table} />
                </div>
              )}
              {chart && (
                <div id="calculator-chart" className="mt-5">
                  <h3 className="font-display text-2xl text-ink">{chart.title}</h3>
                  <ChartBlock chart={chart} />
                </div>
              )}
              {content.disclaimer && (
                <div className="mt-4 rounded-2xl border border-stroke/80 bg-surface-2 px-4 py-3 text-xs text-muted">
                  {content.disclaimer}
                </div>
              )}
              {content.references && content.references.length > 0 && (
                <div id="calculator-references" className="mt-4 text-xs text-muted">
                  <p className="uppercase tracking-[0.3em]">References</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {content.references.map((ref) => (
                      <li key={ref}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad-compact pt-0 cv-auto">
        <div className="mx-auto w-full max-w-5xl">
          <div className="rounded-[28px] border border-stroke bg-surface p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.4em] text-muted">FAQ</p>
            <h2 className="mt-2 font-display text-2xl text-ink">
              Common questions
            </h2>
            <div className="mt-4 grid gap-3">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4"
                >
                  <h3 className="text-sm font-semibold text-ink">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-sm text-muted">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {relatedCalculators.length > 0 && (
        <section className="section-pad-compact pt-0 cv-auto">
          <div className="mx-auto w-full max-w-5xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-muted">
                  Related
                </p>
                <h3 className="font-display text-2xl text-ink">
                  More calculators in your flow
                </h3>
              </div>
              <Link
                href={`/category/${calculator.category}`}
                className="text-sm text-ink underline"
              >
                View {category?.name ?? "category"} list
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-6">
              {relatedCalculators.map((item) => (
                <CalculatorCard key={item.slug} calculator={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function ContentCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{title}</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ExampleCard({
  example,
  copied,
  onCopy,
}: {
  example: ExampleCase;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-2xl border border-stroke/80 bg-white/70 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Example</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-muted">
            <span>{example.inputs.length} inputs</span>
            <span>{example.outputs.length} outputs</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-full border border-stroke px-3 py-1.5 text-[11px] font-semibold text-ink"
        >
          {copied ? "Copied" : "Copy example"}
        </button>
      </div>
      <h4 className="mt-2 text-lg font-semibold text-ink">{example.title}</h4>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Inputs</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            {example.inputs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Outputs
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink">
            {example.outputs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      {example.note && <p className="mt-3 text-xs text-muted">{example.note}</p>}
    </div>
  );
}

function TableBlock({ table }: { table: ReferenceTable }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredRows = useMemo(() => {
    if (!normalizedQuery) return table.rows;

    return table.rows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(normalizedQuery))
    );
  }, [normalizedQuery, table.rows]);

  const filename = `${buildCsvFileName(
    table.title,
    normalizedQuery ? "filtered-table-data" : "table-data"
  )}.csv`;

  const handleDownload = useCallback(() => {
    downloadCsvFile(filename, [table.columns, ...filteredRows]);
  }, [filename, filteredRows, table.columns]);

  return (
    <div className="mt-3">
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted">
          <span>
            {filteredRows.length} of {table.rows.length} rows
          </span>
          {normalizedQuery ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full border border-stroke px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-ink"
            >
              Clear filter
            </button>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter rows"
            aria-label="Filter table rows"
            className="min-w-[220px] rounded-full border border-stroke bg-white px-4 py-2 text-sm text-ink outline-none transition focus:border-accent"
          />
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-full border border-stroke px-3 py-2 text-xs text-ink"
          >
            {normalizedQuery ? "Download filtered CSV" : "Download CSV"}
          </button>
        </div>
      </div>
      {filteredRows.length > 0 ? (
        <div className="overflow-auto rounded-2xl border border-stroke bg-white/70">
          <table className="min-w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                {table.columns.map((column) => (
                  <th key={column} className="px-4 py-3 text-left">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="border-t border-stroke/60">
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stroke bg-surface px-4 py-6 text-sm text-muted">
          No rows match this filter. Try a different keyword.
        </div>
      )}
      {table.note && <p className="mt-2 text-xs text-muted">{table.note}</p>}
    </div>
  );
}

function ChartBlock({ chart }: { chart: InsightChart }) {
  const [sortMode, setSortMode] = useState<ChartSortMode>("original");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(
    chart.points[0]?.label ?? null
  );

  const points = useMemo(() => {
    if (sortMode === "original") return chart.points;

    return [...chart.points].sort((left, right) =>
      sortMode === "asc" ? left.value - right.value : right.value - left.value
    );
  }, [chart.points, sortMode]);

  const selectedIndex = points.findIndex((point) => point.label === selectedLabel);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const activePoint = points[activeIndex] ?? null;
  const previousPoint = activeIndex > 0 ? points[activeIndex - 1] : null;
  const totalValue = points.reduce((sum, point) => sum + point.value, 0);
  const canShowShare = totalValue > 0 && points.every((point) => point.value >= 0);
  const highestPoint = points.reduce<InsightChart["points"][number] | null>(
    (current, point) => {
      if (!current || point.value > current.value) return point;
      return current;
    },
    null
  );
  const lowestPoint = points.reduce<InsightChart["points"][number] | null>(
    (current, point) => {
      if (!current || point.value < current.value) return point;
      return current;
    },
    null
  );
  const filename = `${buildCsvFileName(
    chart.title,
    sortMode === "original" ? "chart-data" : `${sortMode}-chart-data`
  )}.csv`;

  const handleDownload = useCallback(() => {
    downloadCsvFile(filename, [
      ["Label", "Value"],
      ...points.map((point) => [point.label, `${point.value}`]),
    ]);
  }, [filename, points]);

  const values = points.map((point) => point.value);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const range = Math.max(1, maxValue - minValue);
  const zeroOffset = (maxValue / range) * 100;
  const zeroLabelTop = Math.min(92, Math.max(8, zeroOffset));

  return (
    <div className="mt-3">
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-2 text-xs">
          {highestPoint ? (
            <span className="rounded-full border border-stroke bg-white px-3 py-1.5 text-ink">
              Highest: {highestPoint.label} ({formatChartValue(highestPoint.value, chart.format)})
            </span>
          ) : null}
          {lowestPoint ? (
            <span className="rounded-full border border-stroke bg-white px-3 py-1.5 text-ink">
              Lowest: {lowestPoint.label} ({formatChartValue(lowestPoint.value, chart.format)})
            </span>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex items-center gap-2 rounded-full border border-stroke bg-white px-3 py-2 text-xs text-ink">
            <span>Sort</span>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as ChartSortMode)}
              className="bg-transparent text-xs outline-none"
              aria-label="Sort chart points"
            >
              <option value="original">Original</option>
              <option value="desc">Highest first</option>
              <option value="asc">Lowest first</option>
            </select>
          </label>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-full border border-stroke px-3 py-2 text-xs text-ink"
          >
            Download CSV
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-stroke bg-white/70 px-4 py-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
          <span>{chart.xLabel}</span>
          <span>{chart.yLabel}</span>
        </div>
        {activePoint ? (
          <div className="mt-4 grid gap-3 rounded-2xl border border-stroke/70 bg-surface px-4 py-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
                Focus point
              </p>
              <p className="mt-2 text-base font-semibold text-ink">{activePoint.label}</p>
              <p className="text-sm text-muted">
                {formatChartValue(activePoint.value, chart.format)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
                Position
              </p>
              <p className="mt-2 text-base font-semibold text-ink">
                #{activeIndex + 1} of {points.length}
              </p>
              <p className="text-sm text-muted">
                {sortMode === "original" ? "Original order" : "Sorted view"}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
                {canShowShare ? "Share of total" : "Change vs previous"}
              </p>
              <p className="mt-2 text-base font-semibold text-ink">
                {canShowShare
                  ? `${formatNumber((activePoint.value / totalValue) * 100)}%`
                  : previousPoint
                    ? formatChartValue(
                        activePoint.value - previousPoint.value,
                        chart.format
                      )
                    : "—"}
              </p>
              <p className="text-sm text-muted">
                {canShowShare
                  ? `Total: ${formatChartValue(totalValue, chart.format)}`
                  : previousPoint
                    ? `${previousPoint.label} -> ${activePoint.label}`
                    : "Select another point to compare"}
              </p>
            </div>
          </div>
        ) : null}
        <div className="mt-2 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Positive
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-negative" />
            Negative
          </span>
        </div>
        <div
          className="mt-4 grid items-end gap-2"
          style={{
            gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))`,
          }}
        >
          {points.map((point) => {
            const barHeight = (Math.abs(point.value) / range) * 100;
            const barTop = point.value >= 0 ? zeroOffset - barHeight : zeroOffset;
            const isActive = activePoint?.label === point.label;
            return (
              <button
                key={point.label}
                type="button"
                onClick={() => setSelectedLabel(point.label)}
                onMouseEnter={() => setSelectedLabel(point.label)}
                onFocus={() => setSelectedLabel(point.label)}
                aria-pressed={isActive}
                title={`${point.label}: ${formatChartValue(point.value, chart.format)}`}
                className={`flex flex-col items-center gap-2 rounded-2xl px-1 py-1 text-center transition ${
                  isActive ? "bg-surface" : "hover:bg-surface/70"
                }`}
              >
                <div
                  className={`relative h-24 w-full overflow-hidden rounded-xl bg-surface-2 ${
                    isActive ? "ring-2 ring-accent/40" : ""
                  }`}
                >
                  <div
                    className="absolute left-0 right-0 border-t border-ink/30"
                    style={{ top: `${zeroOffset}%` }}
                  />
                  <span
                    className="absolute right-2 text-[10px] font-semibold text-ink/60"
                    style={{ top: `${zeroLabelTop}%`, transform: "translateY(-50%)" }}
                  >
                    0
                  </span>
                  <div
                    className={`absolute left-0 right-0 rounded-xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] ${
                      point.value >= 0
                        ? "bg-accent"
                        : "bg-negative bg-[linear-gradient(135deg,rgba(255,255,255,0.35)_0,rgba(255,255,255,0.35)_25%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.35)_50%,rgba(255,255,255,0.35)_75%,rgba(255,255,255,0)_75%,rgba(255,255,255,0)_100%)] bg-[length:10px_10px]"
                    }`}
                    style={{ top: `${barTop}%`, height: `${barHeight}%` }}
                  />
                </div>
                <p className={`text-xs ${isActive ? "font-semibold text-ink" : "text-muted"}`}>
                  {point.label}
                </p>
                <p className="text-xs font-semibold text-ink">
                  {formatChartValue(point.value, chart.format)}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      {chart.note && <p className="mt-2 text-xs text-muted">{chart.note}</p>}
    </div>
  );
}

function buildCsvFileName(title: string | undefined, fallback: string) {
  return (
    title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || fallback
  );
}

function downloadCsvFile(filename: string, rows: CsvRow[]) {
  if (typeof window === "undefined") return;

  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function formatChartValue(value: number, format: InsightChart["format"]) {
  if (format === "currency") {
    return formatCurrency(value);
  }
  if (format === "percent") {
    return `${formatNumber(value)}%`;
  }
  return formatNumber(value);
}

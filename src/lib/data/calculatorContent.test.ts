import { describe, expect, it } from "vitest";
import { calculators } from "./calculators";
import { calculatorContent } from "./calculatorContent";
import { calculatorSeoPriorities } from "../seoPriorities";

const minSummaryLength = 120;
const minItemLength = 12;
const minExampleTitleLength = 8;
const minExampleNoteLength = 20;
const minExampleInputs = 2;
const minExampleOutputs = 1;
const minTableRows = 3;
const minTableColumns = 2;
const minTableCellLength = 1;
const minChartPoints = 3;
const minPrioritySectionItems = 2;

const minimums = {
  inputs: 2,
  outputs: 1,
  assumptions: 2,
  tips: 2,
  formulas: 1,
  references: 1,
} as const;

const prioritySlugs = new Set(
  calculatorSeoPriorities.slice(0, 10).map(({ slug }) => slug)
);

describe("calculator content standards", () => {
  calculators.forEach((calc) => {
    it(`${calc.slug} has enriched content`, () => {
      const content = calculatorContent[calc.slug];
      expect(content, `Missing content for ${calc.slug}`).toBeTruthy();
      expect(content.summary.length).toBeGreaterThanOrEqual(minSummaryLength);

      (Object.keys(minimums) as Array<keyof typeof minimums>).forEach((key) => {
        const items = content[key];
        expect(items && items.length >= minimums[key], `${calc.slug} ${key}`).toBe(true);
        items?.forEach((item) => {
          expect(item.length).toBeGreaterThanOrEqual(minItemLength);
        });
      });

      expect(
        content.examples && content.examples.length >= 1,
        `${calc.slug} examples`
      ).toBe(true);
      content.examples?.forEach((example) => {
        expect(example.title.length).toBeGreaterThanOrEqual(minExampleTitleLength);
        expect(example.inputs.length).toBeGreaterThanOrEqual(minExampleInputs);
        example.inputs.forEach((item) => {
          expect(item.length).toBeGreaterThanOrEqual(minItemLength);
        });
        expect(example.outputs.length).toBeGreaterThanOrEqual(minExampleOutputs);
        example.outputs.forEach((item) => {
          expect(item.length).toBeGreaterThanOrEqual(minItemLength);
        });
        expect(example.note && example.note.length).toBeGreaterThanOrEqual(minExampleNoteLength);
      });

      expect(content.table, `${calc.slug} table`).toBeTruthy();
      if (content.table) {
        const table = content.table;
        expect(table.columns.length).toBeGreaterThanOrEqual(minTableColumns);
        expect(table.rows.length).toBeGreaterThanOrEqual(minTableRows);
        table.rows.forEach((row) => {
          expect(row.length).toBe(table.columns.length);
          row.forEach((cell) => {
            expect(cell.length).toBeGreaterThanOrEqual(minTableCellLength);
          });
        });
        expect(table.note && table.note.length).toBeGreaterThanOrEqual(minExampleNoteLength);
      }

      expect(content.chart, `${calc.slug} chart`).toBeTruthy();
      if (content.chart) {
        const chart = content.chart;
        expect(chart.points.length).toBeGreaterThanOrEqual(minChartPoints);
        chart.points.forEach((point) => {
          expect(point.label.length).toBeGreaterThanOrEqual(1);
          expect(Number.isFinite(point.value)).toBe(true);
        });
        expect(chart.note && chart.note.length).toBeGreaterThanOrEqual(minExampleNoteLength);
      }

      if (prioritySlugs.has(calc.slug)) {
        expect(
          content.whenToUse && content.whenToUse.length >= minPrioritySectionItems,
          `${calc.slug} whenToUse`
        ).toBe(true);
        content.whenToUse?.forEach((item) => {
          expect(item.length).toBeGreaterThanOrEqual(minItemLength);
        });

        expect(
          content.commonMistakes &&
            content.commonMistakes.length >= minPrioritySectionItems,
          `${calc.slug} commonMistakes`
        ).toBe(true);
        content.commonMistakes?.forEach((item) => {
          expect(item.length).toBeGreaterThanOrEqual(minItemLength);
        });
      }
    });
  });
});

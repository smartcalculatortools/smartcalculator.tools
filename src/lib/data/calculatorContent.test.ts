import { describe, expect, it } from "vitest";
import { calculators } from "./calculators";
import { calculatorContent } from "./calculatorContent";

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

const minimums = {
  inputs: 2,
  outputs: 1,
  assumptions: 2,
  tips: 2,
  formulas: 1,
  references: 1,
} as const;

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
        expect(content.table.columns.length).toBeGreaterThanOrEqual(minTableColumns);
        expect(content.table.rows.length).toBeGreaterThanOrEqual(minTableRows);
        content.table.rows.forEach((row) => {
          expect(row.length).toBe(content.table.columns.length);
          row.forEach((cell) => {
            expect(cell.length).toBeGreaterThanOrEqual(minTableCellLength);
          });
        });
        expect(content.table.note && content.table.note.length).toBeGreaterThanOrEqual(minExampleNoteLength);
      }

      expect(content.chart, `${calc.slug} chart`).toBeTruthy();
      if (content.chart) {
        expect(content.chart.points.length).toBeGreaterThanOrEqual(minChartPoints);
        content.chart.points.forEach((point) => {
          expect(point.label.length).toBeGreaterThanOrEqual(1);
          expect(Number.isFinite(point.value)).toBe(true);
        });
        expect(content.chart.note && content.chart.note.length).toBeGreaterThanOrEqual(minExampleNoteLength);
      }
    });
  });
});

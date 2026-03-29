export const scientificHistoryStorageKey =
  "smart-calculator-tools:scientific-history";
export const maxScientificHistoryEntries = 12;

export type ScientificHistoryEntry = {
  expression: string;
  result: number;
  recordedAt: string;
};

function normalizeScientificHistoryEntry(
  value: unknown
): ScientificHistoryEntry | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (
    typeof record.expression !== "string" ||
    record.expression.trim().length === 0 ||
    typeof record.result !== "number" ||
    !Number.isFinite(record.result)
  ) {
    return null;
  }

  return {
    expression: record.expression,
    result: record.result,
    recordedAt:
      typeof record.recordedAt === "string"
        ? record.recordedAt
        : new Date(0).toISOString(),
  };
}

export function parseStoredScientificHistory(
  rawValue: string | null
): ScientificHistoryEntry[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeScientificHistoryEntry)
      .filter((entry): entry is ScientificHistoryEntry => entry !== null)
      .slice(0, maxScientificHistoryEntries);
  } catch {
    return [];
  }
}

export function appendScientificHistory(
  entries: ScientificHistoryEntry[],
  next: Pick<ScientificHistoryEntry, "expression" | "result"> & {
    recordedAt?: string;
  }
) {
  const normalizedExpression = next.expression.trim();
  if (!normalizedExpression || !Number.isFinite(next.result)) {
    return entries.slice(0, maxScientificHistoryEntries);
  }

  const previous = entries[0];
  if (
    previous &&
    previous.expression === normalizedExpression &&
    previous.result === next.result
  ) {
    return entries.slice(0, maxScientificHistoryEntries);
  }

  return [
    {
      expression: normalizedExpression,
      result: next.result,
      recordedAt: next.recordedAt ?? new Date().toISOString(),
    },
    ...entries,
  ].slice(0, maxScientificHistoryEntries);
}

export function formatScientificHistoryForExport(
  entries: ScientificHistoryEntry[]
) {
  if (entries.length === 0) {
    return "No completed operations yet.";
  }

  return entries
    .map(
      (entry, index) =>
        `${index + 1}. ${entry.expression} = ${entry.result} [${entry.recordedAt}]`
    )
    .join("\n");
}

export function buildScientificHistoryFilename(date = new Date()) {
  const isoDate = date.toISOString().slice(0, 10);
  return `scientific-history-${isoDate}.txt`;
}

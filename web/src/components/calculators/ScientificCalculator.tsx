"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNumber } from "@/lib/calculators/format";
import { evaluateExpression, type AngleMode } from "@/lib/calculators/scientific";
import type { CalculatorInsights } from "@/lib/insights";

type Key = {
  label: string;
  value?: string;
  action?:
    | "clear"
    | "back"
    | "equals"
    | "negate"
    | "memoryClear"
    | "memoryRecall"
    | "memoryAdd"
    | "memorySub"
    | "deg"
    | "rad";
  variant?: "accent" | "ghost" | "mode";
};

const rows: Key[][] = [
  [
    { label: "DEG", action: "deg", variant: "mode" },
    { label: "RAD", action: "rad", variant: "mode" },
    { label: "MC", action: "memoryClear", variant: "ghost" },
    { label: "MR", action: "memoryRecall", variant: "ghost" },
    { label: "M+", action: "memoryAdd", variant: "ghost" },
    { label: "M-", action: "memorySub", variant: "ghost" },
  ],
  [
    { label: "AC", action: "clear", variant: "ghost" },
    { label: "DEL", action: "back", variant: "ghost" },
    { label: "(", value: "(" },
    { label: ")", value: ")" },
    { label: "%", value: "%" },
    { label: "±", action: "negate" },
  ],
  [
    { label: "sin", value: "sin(" },
    { label: "cos", value: "cos(" },
    { label: "tan", value: "tan(" },
    { label: "x²", value: "^2" },
    { label: "x³", value: "^3" },
    { label: "^", value: "^" },
  ],
  [
    { label: "asin", value: "asin(" },
    { label: "acos", value: "acos(" },
    { label: "atan", value: "atan(" },
    { label: "sqrt", value: "sqrt(" },
    { label: "1/x", value: "1/(" },
    { label: "x!", value: "fact(" },
  ],
  [
    { label: "log", value: "log(" },
    { label: "ln", value: "ln(" },
    { label: "10^x", value: "10^" },
    { label: "e^x", value: "exp(" },
    { label: "π", value: "pi" },
    { label: "e", value: "e" },
  ],
  [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "/", value: "/" },
    { label: "ANS", value: "ans" },
    { label: "RND", value: "rand()" },
  ],
  [
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "*", value: "*" },
    { label: "EXP", value: "*10^" },
    { label: "+", value: "+" },
  ],
  [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "-", value: "-" },
    { label: "0", value: "0" },
    { label: ".", value: "." },
  ],
  [{ label: "=", action: "equals", variant: "accent" }],
];

type CalculatorProps = {
  onInsightsChange?: (insights: CalculatorInsights) => void;
};

export default function ScientificCalculator({ onInsightsChange }: CalculatorProps) {
  const [expression, setExpression] = useState("0");
  const [angleMode, setAngleMode] = useState<AngleMode>("rad");
  const [memory, setMemory] = useState(0);
  const [ans, setAns] = useState(0);

  const result = useMemo(
    () => evaluateExpression(expression, { angleMode, ans }),
    [expression, angleMode, ans]
  );

  const insights = useMemo<CalculatorInsights>(() => {
    const angleLabels =
      angleMode === "deg" ? ["0", "30", "60", "90"] : ["0", "π/6", "π/3", "π/2"];
    const angleValues =
      angleMode === "deg"
        ? [0, 30, 60, 90].map((value) => Math.sin((value * Math.PI) / 180))
        : [0, Math.PI / 6, Math.PI / 3, Math.PI / 2].map((value) =>
            Math.sin(value)
          );

    return {
      table: {
        title: "Current calculator state",
        columns: ["Field", "Value"],
        rows: [
          ["Expression", expression || "0"],
          ["Result", result === null ? "--" : formatNumber(result)],
          ["Angle mode", angleMode.toUpperCase()],
          ["Memory", formatNumber(memory)],
          ["ANS", formatNumber(ans)],
        ],
        note: "Use ANS to continue calculations from the last result.",
      },
      chart: {
        title: "Sine reference points",
        xLabel: "Angle",
        yLabel: "sin(x)",
        format: "number",
        points: angleLabels.map((label, index) => ({
          label,
          value: angleValues[index] ?? 0,
        })),
        note: angleMode === "deg" ? "Angles shown in degrees." : "Angles shown in radians.",
      },
    };
  }, [angleMode, ans, expression, memory, result]);

  useEffect(() => {
    onInsightsChange?.(insights);
  }, [insights, onInsightsChange]);

  const appendValue = (value: string) => {
    setExpression((prev) => {
      if (prev === "0") {
        if (value === ".") return "0.";
        if (/^[0-9]$/.test(value)) return value;
        if (value.startsWith("^")) return `0${value}`;
        return value;
      }
      return `${prev}${value}`;
    });
  };

  const applyNegate = () => {
    setExpression((prev) => {
      if (prev === "0") return "0";
      if (/^-?\d+(\.\d+)?$/.test(prev)) {
        return prev.startsWith("-") ? prev.slice(1) : `-${prev}`;
      }
      return `-(${prev})`;
    });
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (target?.isContentEditable) return;

      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === "Enter") {
        event.preventDefault();
        if (result === null) return;
        setAns(result);
        setExpression(String(result));
        return;
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        setExpression((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setExpression("0");
        return;
      }

      if (event.key === "!") {
        event.preventDefault();
        appendValue("fact(");
        return;
      }

      if (/^[0-9+\-*/().%^]$/.test(event.key)) {
        event.preventDefault();
        appendValue(event.key);
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        appendValue(event.key.toLowerCase());
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [result]);

  const handleKey = (key: Key) => {
    switch (key.action) {
      case "clear":
        setExpression("0");
        return;
      case "back":
        setExpression((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));
        return;
      case "equals":
        if (result === null) return;
        setAns(result);
        setExpression(String(result));
        return;
      case "negate":
        applyNegate();
        return;
      case "deg":
        setAngleMode("deg");
        return;
      case "rad":
        setAngleMode("rad");
        return;
      case "memoryClear":
        setMemory(0);
        return;
      case "memoryRecall":
        appendValue(String(memory));
        return;
      case "memoryAdd":
        setMemory((prev) => prev + (result ?? 0));
        return;
      case "memorySub":
        setMemory((prev) => prev - (result ?? 0));
        return;
      default:
        break;
    }

    if (!key.value) return;
    appendValue(key.value);
  };

  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border border-stroke bg-white/70 px-4 py-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted">
          <span>Display</span>
          <span>{angleMode.toUpperCase()}</span>
        </div>
        <div className="mt-2 text-2xl font-semibold text-ink break-all">
          {expression}
        </div>
        <div className="mt-2 text-sm text-muted">
          Result: {result === null ? "--" : formatNumber(result)}
        </div>
        <div className="mt-2 text-xs text-muted">Memory: {formatNumber(memory)}</div>
      </div>

      <div className="grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-6 gap-2">
            {row.map((key, index) => (
              <button
                key={`${key.label}-${index}`}
                type="button"
                onClick={() => handleKey(key)}
                className={`rounded-xl border border-stroke px-3 py-2 text-sm text-ink transition hover:-translate-y-0.5 ${
                  key.variant === "accent"
                    ? "bg-accent text-white col-span-6"
                    : key.variant === "ghost"
                      ? "bg-surface"
                      : key.variant === "mode"
                        ? angleMode.toUpperCase() === key.label
                          ? "bg-ink text-white"
                          : "bg-white/70"
                        : "bg-white/70"
                }`}
              >
                {key.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

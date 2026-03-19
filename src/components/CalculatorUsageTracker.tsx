"use client";

import { useEffect, useRef } from "react";
import type { Calculator } from "@/lib/data/calculators";
import { recordCalculatorVisit } from "@/lib/usage";
import { updateStoredUsageState } from "@/lib/usageStorage";

export default function CalculatorUsageTracker({
  calculator,
}: {
  calculator: Calculator;
}) {
  const trackedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (trackedSlugRef.current === calculator.slug) {
      return;
    }

    trackedSlugRef.current = calculator.slug;
    updateStoredUsageState((state) => recordCalculatorVisit(state, calculator));
  }, [calculator]);

  return null;
}

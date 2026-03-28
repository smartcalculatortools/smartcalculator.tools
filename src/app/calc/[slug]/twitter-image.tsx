export { default, size, contentType } from "./opengraph-image";

import { getCalculatorStaticParams } from "@/lib/data/calculators";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCalculatorStaticParams();
}

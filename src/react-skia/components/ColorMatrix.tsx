import { createElement } from "react";

import type { ColorMatrixProps } from "../types";

export function ColorMatrix({ matrix, children }: ColorMatrixProps) {
  return createElement("skia-colormatrix", { matrix }, children);
}

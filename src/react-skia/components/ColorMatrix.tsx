import React from "react";

import type { ColorMatrixProps } from "../types";

export function ColorMatrix({ matrix, children }: ColorMatrixProps) {
  return React.createElement("skia-colormatrix", { matrix }, children);
}

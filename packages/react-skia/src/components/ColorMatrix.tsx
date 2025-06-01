import { createElement } from "react";

import type { ColorMatrixProps } from "../types";

export const ColorMatrix = ({ matrix, children }: ColorMatrixProps) =>
  createElement("skia-colormatrix", { matrix }, children);

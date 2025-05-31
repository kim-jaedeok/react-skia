import { createElement } from "react";

import type { BlurProps } from "../types";

export function Blur({ blur, children }: BlurProps) {
  return createElement("skia-blur", { blur }, children);
}

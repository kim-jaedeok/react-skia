import React from "react";

import type { BlurProps } from "../types";

export function Blur({ blur, children }: BlurProps) {
  return React.createElement("skia-blur", { blur }, children);
}

import { createElement } from "react";

import type { BlurProps } from "../types";

export const Blur = ({ blur, children }: BlurProps) =>
  createElement("skia-blur", { blur }, children);
